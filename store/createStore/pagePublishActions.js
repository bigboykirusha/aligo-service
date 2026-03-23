const defaultIsClientEnvironment = () => typeof window !== 'undefined'
const isCreateDraftMutationSuccessful = (response) =>
   Boolean(response) && response.success !== false

export const createCreateNavigationController = ({
   router,
   delayMs = 500,
   isClient = defaultIsClientEnvironment(),
   setTimeoutFn = setTimeout,
   clearTimeoutFn = clearTimeout,
   onNavigationError = (error) => {
      console.error('Create navigation failed:', error)
   }
} = {}) => {
   let navigationTimerId = null

   const clearCreateNavigationTimer = () => {
      if (!isClient) return
      if (navigationTimerId !== null) {
         clearTimeoutFn(navigationTimerId)
         navigationTimerId = null
      }
   }

   const scheduleCreateNavigation = (
      path,
      onAfterNavigate,
      { delayMs: delayOverrideMs } = {}
   ) => {
      if (!isClient) return

      clearCreateNavigationTimer()
      const scheduleDelayMs =
         typeof delayOverrideMs === 'number' ? delayOverrideMs : delayMs
      navigationTimerId = setTimeoutFn(() => {
         navigationTimerId = null
         Promise.resolve(router.push(path))
            .catch((error) => {
               onNavigationError(error)
            })
            .finally(() => {
               if (typeof onAfterNavigate === 'function') {
                  onAfterNavigate()
               }
            })
      }, scheduleDelayMs)
   }

   return {
      clearCreateNavigationTimer,
      scheduleCreateNavigation
   }
}

export const runCreateDraftMutationAction = async ({
   draftValue,
   pendingRef,
   redirectPath,
   errorLogPrefix,
   createStore,
   popupErrorStore,
   publishSaveErrorMessage,
   scheduleCreateNavigation,
   navigationDelayMs,
   scheduleNavigationOnSuccess = true,
   isApiRequestSuccessfulFn = isCreateDraftMutationSuccessful,
   onMutationError = (...args) => console.error(...args)
}) => {
   if (pendingRef.value) {
      return { success: false, skipped: true }
   }

   pendingRef.value = true
   let isSuccess = false

   try {
      const response = await createStore.setField('is_draft', draftValue)
      if (!isApiRequestSuccessfulFn(response)) {
         throw response?.error || response
      }

      isSuccess = true
      return { success: true, response }
   } catch (error) {
      onMutationError(errorLogPrefix, error)
      popupErrorStore.showError(publishSaveErrorMessage)
      return { success: false, error }
   } finally {
      if (isSuccess && scheduleNavigationOnSuccess) {
         scheduleCreateNavigation(
            redirectPath,
            () => {
               pendingRef.value = false
            },
            { delayMs: navigationDelayMs }
         )
      } else {
         pendingRef.value = false
      }
   }
}
