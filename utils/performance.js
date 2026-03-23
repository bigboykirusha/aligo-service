// Утилиты для оптимизации производительности

/**
 * Debounce функция - задерживает выполнение функции до тех пор,
 * пока не пройдет определенное время с момента последнего вызова
 * @param {Function} func - функция для debounce
 * @param {number} wait - время задержки в миллисекундах
 * @returns {Function} - debounced функция
 */
export function debounce(func, wait) {
   let timeout
   return function executedFunction(...args) {
      const later = () => {
         clearTimeout(timeout)
         func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
   }
}

/**
 * Throttle функция - ограничивает частоту вызовов функции
 * @param {Function} func - функция для throttle
 * @param {number} limit - минимальный интервал между вызовами в миллисекундах
 * @returns {Function} - throttled функция
 */
export function throttle(func, limit) {
   let inThrottle
   return function executedFunction(...args) {
      if (!inThrottle) {
         func.apply(this, args)
         inThrottle = true
         setTimeout(() => inThrottle = false, limit)
      }
   }
}

/**
 * Memoization - кэширование результатов функций
 * @param {Function} fn - функция для memoization
 * @returns {Function} - memoized функция
 */
export function memoize(fn) {
   const cache = new Map()
   return function (...args) {
      const key = JSON.stringify(args)
      if (cache.has(key)) {
         return cache.get(key)
      }
      const result = fn.apply(this, args)
      cache.set(key, result)
      return result
   }
}

/**
 * Lazy loading для изображений
 * @param {string} src - путь к изображению
 * @param {string} placeholder - плейсхолдер
 * @returns {Promise<string>} - Promise с загруженным изображением
 */
export function lazyLoadImage(src, placeholder = '') {
   return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(src)
      img.onerror = () => resolve(placeholder)
      img.src = src
   })
}