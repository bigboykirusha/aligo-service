const createEmptyQueueState = () => ({
   pendingByField: new Map(),
   isDraining: false,
   isDrainScheduled: false
})

const createAutosaveQueueByStore = new WeakMap()

const getCreateAutosaveQueueState = (store) => {
   if (!createAutosaveQueueByStore.has(store)) {
      createAutosaveQueueByStore.set(store, createEmptyQueueState())
   }

   return createAutosaveQueueByStore.get(store)
}

const resolveQueuedTask = (task, response) => {
   task.resolvers.forEach((resolve) => resolve(response))
}

const rejectQueuedTask = (task, error) => {
   task.rejecters.forEach((reject) => reject(error))
}

const resolveBatchResponse = (batch, response) => {
   batch.forEach(([, task]) => {
      resolveQueuedTask(task, response)
   })
}

const rejectBatchResponse = (batch, error) => {
   batch.forEach(([, task]) => {
      rejectQueuedTask(task, error)
   })
}

const canProcessBatch = (batch) =>
   batch.length > 1 &&
   batch.every(([, task]) => typeof task.persistBatch === 'function')

const persistAutosaveBatch = async (batch) => {
   if (!canProcessBatch(batch)) return null

   const persistBatch = batch[0]?.[1]?.persistBatch
   const entries = batch.map(([field, task]) => [field, task.value])
   const response = await persistBatch(entries)
   resolveBatchResponse(batch, response)
   return response
}

const persistAutosaveSequentially = async (batch) => {
   for (const [field, task] of batch) {
      try {
         const response = await task.persist(field, task.value)
         resolveQueuedTask(task, response)
      } catch (error) {
         rejectQueuedTask(task, error)
      }
   }
}

const drainCreateAutosaveQueue = async (queueState) => {
   if (queueState.isDraining) return
   queueState.isDraining = true

   try {
      while (queueState.pendingByField.size > 0) {
         const batch = Array.from(queueState.pendingByField.entries())
         queueState.pendingByField.clear()

         try {
            const batchResponse = await persistAutosaveBatch(batch)
            if (batchResponse === null) {
               await persistAutosaveSequentially(batch)
            }
         } catch (error) {
            rejectBatchResponse(batch, error)
         }
      }
   } finally {
      queueState.isDraining = false

      if (queueState.pendingByField.size > 0) {
         await drainCreateAutosaveQueue(queueState)
      }
   }
}

const scheduleCreateAutosaveDrain = (queueState) => {
   if (queueState.isDrainScheduled) return
   queueState.isDrainScheduled = true

   Promise.resolve().then(() => {
      queueState.isDrainScheduled = false
      drainCreateAutosaveQueue(queueState).catch((error) => {
         console.error('Create autosave queue drain failed:', error)
      })
   })
}

export const enqueueCreateFieldAutosave = ({
   store,
   field,
   value,
   persist,
   persistBatch = null
}) =>
   new Promise((resolve, reject) => {
      const queueState = getCreateAutosaveQueueState(store)
      const queuedTask = queueState.pendingByField.get(field)

      if (queuedTask) {
         queuedTask.value = value
         queuedTask.persistBatch = persistBatch
         queuedTask.resolvers.push(resolve)
         queuedTask.rejecters.push(reject)
      } else {
         queueState.pendingByField.set(field, {
            value,
            persist,
            persistBatch,
            resolvers: [resolve],
            rejecters: [reject]
         })
      }

      scheduleCreateAutosaveDrain(queueState)
   })
