<template>
   <div class="block-toggle">
      <button v-if="loading" class="block-toggle__btn block-toggle__btn--loading">
         <span class="spinner"></span>
      </button>

      <template v-else>
         <!-- Если заблокировано -->
         <template v-if="isBlocked">
            <!-- Заблокировано мной -->
            <button v-if="blockInfo?.userId === props.userId" @click="toggleBlock" class="block-toggle__btn">
               Разблокировать изменения
            </button>

            <!-- Заблокировано другим -->
            <span v-else class="block-toggle__text">
               Редактирование заблокировано {{ blockInfo.date }} {{ blockInfo.time }} пользователем ID:
               {{ blockInfo.userId }} {{ blockInfo.user }}
            </span>
         </template>

         <!-- Если не заблокировано -->
         <button v-else @click="toggleBlock" class="block-toggle__btn">
            Заблокировать изменения
         </button>
      </template>
   </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue'
import { checkSeoBlocking, addSeoBlocking, offSeoBlocking } from '@/services/apiClient.js'

const props = defineProps({
   userId: { type: Number, required: true },
   resourceId: { type: Number, required: true }
})

const emit = defineEmits(['update:isBlocked'])

const isBlocked = ref(false)
const blockInfo = ref(null)
const loading = ref(true)

const updateStatus = (status) => {
   console.log('[updateStatus] Новый статус:', status)
   isBlocked.value = status
   emit('update:isBlocked', status)
}

const checkBlocking = async () => {
   loading.value = true
   console.log('[checkBlocking] Проверка блокировки...', {
      userId: props.userId,
      resourceId: props.resourceId
   })

   try {
      const data = await checkSeoBlocking(props.userId, props.resourceId)
      console.log('[checkBlocking] Ответ API:', data)

      if (data?.success) {
         if (data.message.includes('установлена для текущего пользователя')) {
            console.log('[checkBlocking] Блокировка установлена текущим пользователем')
            updateStatus(true)
            blockInfo.value = { userId: props.userId, date: '', time: '', user: '' }
         } else if (data.message.includes('заблокировано')) {
            console.log('[checkBlocking] Блокировка установлена другим пользователем')
            const match = data.message.match(/ID:\s*(\d+)/)
            const userId = match ? Number(match[1]) : null
            updateStatus(true)
            blockInfo.value = {
               userId,
               date: data.message.match(/\d{4}-\d{2}-\d{2}/)?.[0] || '',
               time: data.message.match(/\d{2}:\d{2}:\d{2}/)?.[0] || '',
               user: data.message.split(' ').slice(-1)[0] || ''
            }
         } else {
            console.log('[checkBlocking] Блокировка отсутствует')
            updateStatus(false)
            blockInfo.value = null
         }
      } else {
         console.log('[checkBlocking] Ошибка или пустой ответ')
         updateStatus(false)
         blockInfo.value = null
      }
   } catch (err) {
      console.error('Ошибка проверки блокировки:', err)
      updateStatus(false)
      blockInfo.value = null
   }

   console.log('[checkBlocking] Итоговое состояние:', {
      isBlocked: isBlocked.value,
      blockInfo: blockInfo.value
   })

   loading.value = false
}

const toggleBlock = async () => {
   loading.value = true
   console.log('[toggleBlock] Текущий статус перед действием:', {
      isBlocked: isBlocked.value,
      blockInfo: blockInfo.value
   })

   try {
      if (isBlocked.value && blockInfo.value?.userId === props.userId) {
         console.log('[toggleBlock] Разблокировка текущим пользователем')
         await offSeoBlocking(props.userId, props.resourceId, window.location.href)
         updateStatus(false)
         blockInfo.value = null
      } else {
         console.log('[toggleBlock] Установка блокировки текущим пользователем')
         await addSeoBlocking(props.userId, props.resourceId, window.location.href)
         await checkBlocking()
      }
   } catch (err) {
      console.error('Ошибка переключения блокировки:', err)
   }

   console.log('[toggleBlock] Итоговое состояние:', {
      isBlocked: isBlocked.value,
      blockInfo: blockInfo.value
   })

   loading.value = false
}

onMounted(() => {
   console.log('[onMounted] Компонент смонтирован, запускаю проверку блокировки')
   checkBlocking()
})
</script>


<style scoped>
.block-toggle {
   display: flex;
   margin-left: auto;
   margin-right: 16px;
   font-size: 14px;
   align-items: center;
   gap: 10px;
}

.block-toggle__btn {
   background-color: #3366FF;
   color: #fff;
   padding: 6px 12px;
   border-radius: 6px;
   cursor: pointer;
   border: none;
   display: flex;
   align-items: center;
   justify-content: center;
   transition: background-color 0.2s ease;
}

.block-toggle__btn:hover {
   background-color: #254edb;
}

.block-toggle__btn--loading {
   cursor: default;
}

.spinner {
   border: 2px solid rgba(255, 255, 255, 0.3);
   border-top: 2px solid #fff;
   border-radius: 50%;
   width: 16px;
   height: 16px;
   animation: spin 0.7s linear infinite;
}

.block-toggle__text {
   font-size: 14px;
   color: #323232;
}

@keyframes spin {
   to {
      transform: rotate(360deg);
   }
}
</style>