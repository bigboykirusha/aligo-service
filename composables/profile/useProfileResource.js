import { computed, ref } from 'vue'

const profileResourceCache = new Map()

const wait = (ms) =>
   ms > 0
      ? new Promise((resolve) => {
           setTimeout(resolve, ms)
        })
      : Promise.resolve()

const canUseStructuredClone = typeof structuredClone === 'function'

const cloneValue = (value) => {
   if (value == null) return value

   try {
      if (canUseStructuredClone) return structuredClone(value)
      return JSON.parse(JSON.stringify(value))
   } catch {
      return value
   }
}

const getCacheSnapshot = (cacheKey) => {
   if (!cacheKey) return null
   const cached = profileResourceCache.get(cacheKey)
   if (!cached) return null
   return {
      payload: cloneValue(cached.payload),
      loadedAt: cached.loadedAt
   }
}

const setCacheSnapshot = (cacheKey, payload) => {
   if (!cacheKey) return
   profileResourceCache.set(cacheKey, {
      payload: cloneValue(payload),
      loadedAt: Date.now()
   })
}

export const clearProfileResourceCache = (cacheKey = null) => {
   if (!cacheKey) {
      profileResourceCache.clear()
      return
   }
   profileResourceCache.delete(cacheKey)
}

export const useProfileResource = ({
   cacheKey = '',
   loader,
   transform = (value) => value,
   initialData = [],
   useCache = true,
   cacheTtlMs = 0,
   minLoadingMs = 0
} = {}) => {
   const data = ref(cloneValue(initialData))
   const loading = ref(false)
   const loaded = ref(false)
   const error = ref(null)
   const lastLoadedAt = ref(null)
   const inFlightRequest = ref(null)

   const getNormalizedPayload = (raw) => transform(raw)

   const applyPayload = (payload, { markAsLoaded = true } = {}) => {
      data.value = cloneValue(payload)
      if (markAsLoaded) {
         loaded.value = true
      }
   }

   const load = async ({ force = false, silent = false } = {}) => {
      if (typeof loader !== 'function') {
         throw new Error('useProfileResource: loader must be a function')
      }

      if (inFlightRequest.value) {
         return inFlightRequest.value
      }

      const currentTimestamp = Date.now()
      if (useCache && !force) {
         const cached = getCacheSnapshot(cacheKey)
         if (cached) {
            const isTtlValid =
               cacheTtlMs <= 0 || currentTimestamp - cached.loadedAt <= cacheTtlMs

            if (isTtlValid) {
               applyPayload(cached.payload)
               lastLoadedAt.value = cached.loadedAt
               error.value = null
               return data.value
            }
         }
      }

      const startTime = Date.now()

      if (!silent) {
         loading.value = true
      }
      error.value = null

      const request = (async () => {
         try {
            const raw = await loader()
            const payload = getNormalizedPayload(raw)
            applyPayload(payload)
            lastLoadedAt.value = Date.now()

            if (useCache) {
               setCacheSnapshot(cacheKey, payload)
            }

            return data.value
         } catch (loadError) {
            error.value = loadError
            throw loadError
         } finally {
            const elapsed = Date.now() - startTime
            await wait(Math.max(0, minLoadingMs - elapsed))
            if (!silent) {
               loading.value = false
            }
            inFlightRequest.value = null
         }
      })()

      inFlightRequest.value = request
      return request
   }

   const reload = async () => load({ force: true })

   const setData = (nextData) => {
      applyPayload(nextData, { markAsLoaded: true })
      lastLoadedAt.value = Date.now()
      if (useCache) {
         setCacheSnapshot(cacheKey, nextData)
      }
   }

   const mutateData = (mutator) => {
      if (typeof mutator !== 'function') return
      const draft = cloneValue(data.value)
      const nextValue = mutator(draft)
      const resolved =
         nextValue === undefined ? (draft === undefined ? data.value : draft) : nextValue
      setData(resolved)
   }

   const clearError = () => {
      error.value = null
   }

   const status = computed(() => {
      if (loading.value) return 'loading'
      if (error.value) return 'error'
      if (loaded.value) return 'success'
      return 'idle'
   })

   const isEmpty = computed(() => {
      const value = data.value
      if (Array.isArray(value)) return value.length === 0
      if (value && typeof value === 'object') return Object.keys(value).length === 0
      return !value
   })

   const hasError = computed(() => Boolean(error.value))
   const isInitialLoading = computed(
      () => loading.value && !loaded.value && isEmpty.value
   )

   return {
      data,
      loading,
      loaded,
      error,
      lastLoadedAt,
      status,
      isEmpty,
      hasError,
      isInitialLoading,
      load,
      reload,
      setData,
      mutateData,
      clearError
   }
}

