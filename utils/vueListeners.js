export const omitListenerKeys = (listeners, keys = []) => {
   const nextListeners = { ...(listeners || {}) }
   for (const key of keys) {
      delete nextListeners[key]
   }
   return nextListeners
}

export const pickFirstFunctionListener = (listeners, keys = []) => {
   for (const key of keys) {
      const candidate = listeners?.[key]
      if (typeof candidate === 'function') {
         return candidate
      }
   }
   return null
}

export const buildEmitForwardListeners = (emit, eventNames = []) =>
   eventNames.reduce((acc, eventName) => {
      acc[eventName] = (...args) => emit(eventName, ...args)
      return acc
   }, {})

export const pickListenersByKeys = (source, keys = []) =>
   keys.reduce((acc, key) => {
      if (typeof source?.[key] === 'function') {
         acc[key] = source[key]
      }
      return acc
   }, {})
