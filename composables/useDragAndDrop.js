/**
 * Composable для drag & drop файлов
 */

import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useDragAndDrop(onFilesDropped) {
   const isDragging = ref(false)
   const dragCounter = ref(0) // Счетчик для правильной обработки вложенных элементов

   /**
    * Обработка начала перетаскивания
    */
   const handleDragEnter = (event) => {
      event.preventDefault()
      event.stopPropagation()
      dragCounter.value++

      if (event.dataTransfer.types.includes('Files')) {
         isDragging.value = true
      }
   }

   /**
    * Обработка перетаскивания над элементом
    */
   const handleDragOver = (event) => {
      event.preventDefault()
      event.stopPropagation()

      if (event.dataTransfer.types.includes('Files')) {
         event.dataTransfer.dropEffect = 'copy'
      }
   }

   /**
    * Обработка выхода из зоны перетаскивания
    */
   const handleDragLeave = (event) => {
      event.preventDefault()
      event.stopPropagation()
      dragCounter.value--

      if (dragCounter.value === 0) {
         isDragging.value = false
      }
   }

   /**
    * Обработка сброса файлов
    */
   const handleDrop = (event) => {
      event.preventDefault()
      event.stopPropagation()

      isDragging.value = false
      dragCounter.value = 0

      const droppedFiles = event.dataTransfer.files
      if (droppedFiles && droppedFiles.length > 0 && onFilesDropped) {
         onFilesDropped(droppedFiles)
      }
   }

   /**
    * Обработка сброса вне зоны (для глобальных слушателей)
    */
   const handleGlobalDrop = (event) => {
      event.preventDefault()
      event.stopPropagation()
      isDragging.value = false
      dragCounter.value = 0
   }

   /**
    * Инициализация глобальных слушателей (опционально)
    */
   const setupGlobalListeners = () => {
      if (typeof document !== 'undefined') {
         document.addEventListener('dragenter', handleDragEnter)
         document.addEventListener('dragover', handleDragOver)
         document.addEventListener('drop', handleGlobalDrop)
      }
   }

   /**
    * Удаление глобальных слушателей
    */
   const removeGlobalListeners = () => {
      if (typeof document !== 'undefined') {
         document.removeEventListener('dragenter', handleDragEnter)
         document.removeEventListener('dragover', handleDragOver)
         document.removeEventListener('drop', handleGlobalDrop)
      }
   }

   onMounted(() => {
      setupGlobalListeners()
   })

   onBeforeUnmount(() => {
      removeGlobalListeners()
   })

   return {
      isDragging,
      handleDragEnter,
      handleDragOver,
      handleDragLeave,
      handleDrop
   }
}
