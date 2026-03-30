<template>
   <section class="admin-page">
      <header class="admin-page__hero">
         <div>
            <h1 class="admin-page__title">Пользователи</h1>
            <p class="admin-page__description">
               Здесь создаём пользователей, смотрим их объявления и запускаем
               создание объявления от их имени.
            </p>
         </div>

         <UIButton :block="false" variant="primary" @click="toggleCreatePanel">
            <span class="button-inline">
               <img
                  :src="createPanelToggleIcon"
                  alt=""
                  class="button-inline__icon"
               />
               {{ createPanelToggleText }}
            </span>
         </UIButton>
      </header>

      <section v-if="isCreateOpen" class="create-panel">
         <div class="create-panel__head">
            <div>
               <h2 class="create-panel__title">{{ createPanelTitle }}</h2>
               <p class="create-panel__text">{{ createPanelText }}</p>
            </div>
         </div>

         <form class="create-form" @submit.prevent="submitUser">
            <div class="form-field form-field--full create-form__avatar-field">
               <span>Аватар</span>

               <div class="create-form__avatar">
                  <div class="create-form__avatar-preview">
                     <img :src="avatarPreviewSrc" alt="Аватар пользователя" />
                  </div>

                  <div class="create-form__avatar-copy">
                     <p class="create-form__avatar-title">Фото профиля</p>
                     <p class="create-form__avatar-text">
                        JPG, JPEG, PNG, WEBP, AVIF, HEIC, HEIF до 5 МБ.
                     </p>

                     <UIButton
                        type="button"
                        :block="false"
                        variant="secondary"
                        @click="triggerPhotoInput"
                     >
                        Загрузить фото
                     </UIButton>
                  </div>
               </div>

               <input
                  ref="photoInputRef"
                  class="create-form__hidden"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.avif,.heic,.heif"
                  @change="handlePhotoChange"
               />
            </div>

            <label class="form-field">
               <span>Псевдоним</span>
               <input v-model.trim="createForm.username" type="text" required />
            </label>

            <div class="form-field">
               <span>Город</span>
               <button
                  type="button"
                  class="form-field__city-button"
                  @click="openCityModal"
               >
                  {{ selectedCityLabel }}
               </button>
            </div>

            <label class="form-field form-field--full">
               <span>Адрес</span>
               <AutosAddressInput
                  label=""
                  layout="column"
                  input-width="100%"
                  :option="createForm.address"
                  :latitude="createForm.latitude"
                  :longitude="createForm.longitude"
                  :sync-store-coordinates="false"
                  class="create-form__address"
                  @update:address="handleAddressChange"
                  @update:latitude="handleLatitudeChange"
                  @update:longitude="handleLongitudeChange"
               />
            </label>

            <label class="form-field">
               <span>Телефон</span>
               <input
                  :value="formattedPhone"
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  maxlength="18"
                  required
                  @input="onPhoneInput"
                  @paste="onPhonePaste"
                  @keydown="onPhoneKeydown"
                  @focus="onPhoneFocus"
                  @keydown.backspace="handlePhoneBackspace"
               />
            </label>

            <label class="form-field">
               <span>Email</span>
               <input
                  :value="createForm.email"
                  type="email"
                  inputmode="email"
                  placeholder="name@example.com"
                  @input="handleEmailInput"
               />
            </label>

            <input
               v-model="createForm.city_id"
               class="create-form__hidden"
               type="hidden"
            />
            <input
               v-model="createForm.latitude"
               class="create-form__hidden"
               type="hidden"
            />
            <input
               v-model="createForm.longitude"
               class="create-form__hidden"
               type="hidden"
            />

            <div class="create-form__footer">
               <div class="create-form__messages">
                  <p
                     v-if="createError"
                     class="form-message form-message--error"
                  >
                     {{ createError }}
                  </p>
               </div>

               <UIButton
                  type="submit"
                  :block="false"
                  variant="primary"
                  :loading="isSubmitting"
               >
                  {{ submitButtonText }}
               </UIButton>
            </div>
         </form>
      </section>

      <form class="filters-panel" @submit.prevent="applyUserFilters">
         <label class="filters-panel__field filters-panel__field--wide">
            <span>Поиск</span>
            <input
               v-model.trim="searchQuery"
               type="text"
               placeholder="Имя, телефон, email, логин"
            />
         </label>

         <div class="filters-panel__field">
            <SelectUI
               label="Сортировка"
               :options="userSortOptions"
               :initial-selected-option="sortOrder"
               @updateSort="sortOrder = String($event)"
            />
         </div>

         <div class="filters-panel__actions">
            <UIButton
               type="submit"
               :block="false"
               variant="primary"
               class="filters-panel__action-button"
            >
               <span class="button-inline">
                  <img :src="searchIcon" alt="" class="button-inline__icon" />
                  Показать
               </span>
            </UIButton>

            <UIButton
               type="button"
               :block="false"
               variant="secondary"
               class="filters-panel__action-button"
               @click="resetUserFilters"
            >
               <span class="button-inline">
                  <img :src="refreshIcon" alt="" class="button-inline__icon" />
                  Сбросить
               </span>
            </UIButton>
         </div>
      </form>

      <section v-if="successPromptMessage" class="notice notice--success">
         <div class="notice__content">
            <div>
               <strong>{{ successPromptMessage }}</strong>
               <p v-if="successPromptUserId">
                  Хотите сразу создать объявление от имени этого пользователя?
               </p>
            </div>

            <UIButton
               v-if="successPromptUserId"
               :block="false"
               variant="secondary"
               @click="openCreateForUser(successPromptUserId)"
            >
               Опубликовать от имени
            </UIButton>
         </div>
      </section>

      <section v-if="errorMessage" class="notice notice--error">
         {{ errorMessage }}
      </section>

      <CustomTable
         :columns="tableColumns"
         :rows="users"
         :loading="isLoading"
         :total="totalUsers"
         :per-page="perPage"
         :current-page="currentPage"
         row-key="id"
         empty-title="Пользователи не найдены"
         empty-text="Попробуй изменить поиск или обновить список."
         @row-action="handleRowAction"
         @update:current-page="loadUsers"
         @update:per-page="handlePerPageChange"
      />
   </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from '#app'
import addIcon from '@/assets/icons/add.svg'
import addPublicationIcon from '@/assets/icons/new/ad-icon.svg'
import avatarFallbackIcon from '@/assets/icons/avatar-revers.svg'
import closeIcon from '@/assets/icons/close-white.svg'
import editIcon from '@/assets/icons/new/ads-icon.svg'
import refreshIcon from '@/assets/icons/clear.svg'
import searchIcon from '@/assets/icons/search.svg'
import edit2Icon from '@/assets/icons/edit.svg'
import AutosAddressInput from '@/components/AutosAddressInput.vue'
import CustomTable from '@/components/table/CustomTable.vue'
import UIButton from '@/components/ui/UIButton.vue'
import SelectUI from '@/components/ui/SelectUI.vue'
import { usePhoneMask } from '@/composables/usePhoneMask'
import { getUserAvatarUrl } from '@/services/imageUtils'
import {
   createModerationUser,
   getModerationUserById,
   getModerationUsers,
   updateModerationUser
} from '@/services/api/moderationApi'
import { validateEmail, validatePhoneNumber } from '@/services/validation'
import { useModalStore } from '@/store/modalStore'

definePageMeta({
   requiresAuth: true
})

const router = useRouter()
const modalStore = useModalStore()
const users = ref([])
const totalUsers = ref(0)
const isLoading = ref(false)
const isSubmitting = ref(false)
const isCreateOpen = ref(false)
const isEditMode = ref(false)
const editingUserId = ref(null)
const errorMessage = ref('')
const createError = ref('')
const successPromptMessage = ref('')
const successPromptUserId = ref(null)
const searchQuery = ref('')
const sortOrder = ref('desc')
const currentPage = ref(1)
const perPage = ref(20)
const photoFile = ref(null)
const photoInputRef = ref(null)
const photoPreviewUrl = ref('')
const shouldRemovePhoto = ref(false)

const createForm = reactive({
   username: '',
   address: '',
   email: '',
   phone: '',
   city_id: '',
   city_name: '',
   latitude: '',
   longitude: ''
})

const userSortOptions = [
   { id: 'desc', title: 'Сначала свежие' },
   { id: 'asc', title: 'Сначала старые' }
]

const {
   phoneRaw,
   formattedPhone,
   onInput: onPhoneInput,
   onPaste: onPhonePaste,
   onKeydown: onPhoneKeydown,
   onFocus: onPhoneFocus
} = usePhoneMask('')

const avatarPreviewSrc = computed(
   () => photoPreviewUrl.value || avatarFallbackIcon
)

const selectedCityLabel = computed(
   () => createForm.city_name || 'Выберите город'
)

const createPanelTitle = computed(() =>
   isEditMode.value ? 'Редактирование пользователя' : 'Новый пользователь'
)

const createPanelText = computed(() =>
   isEditMode.value
      ? 'Измените имя, город, адрес, телефон, email и фото профиля.'
      : 'Обязательные поля: имя, город, адрес и телефон.'
)

const submitButtonText = computed(() =>
   isEditMode.value ? 'Сохранить изменения' : 'Создать пользователя'
)

const createPanelToggleText = computed(() =>
   isCreateOpen.value ? 'Скрыть форму' : 'Создать пользователя'
)

const createPanelToggleIcon = computed(() =>
   isCreateOpen.value ? closeIcon : addIcon
)
const formatDate = (value) => {
   if (!value) return '-'
   const date = new Date(value)
   if (Number.isNaN(date.getTime())) return String(value)
   return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
   }).format(date)
}

const columns = computed(() => [
   {
      key: 'statusLabel',
      label: 'Статус',
      width: '104px',
      type: 'status',
      align: 'center',
      nowrap: true,
      columnClass: 'status',
      getTone: (row) => row.statusTone || 'muted'
   },
   {
      key: 'id',
      label: 'ID',
      width: '72px',
      align: 'center',
      nowrap: true,
      columnClass: 'id'
   },
   {
      key: 'profile',
      label: 'Пользователь',
      width: '320px',
      columnClass: 'profile',
      format: (row) => ({
         title: row.username || `Пользователь #${row.id}`,
         subtitle:
            [row.phone, row.email].filter(Boolean).join(' · ') ||
            'Контакты не заполнены'
      })
   },
   {
      key: 'metrics',
      label: 'Объявления',
      width: '188px',
      columnClass: 'metrics',
      format: (row) => [
         `Опубликовано: ${row.adsCountPublished ?? 0}`,
         `Снято: ${row.adsCountOffPublished ?? 0}`,
         `Архив: ${row.adsCountInArchive ?? 0}`
      ]
   },
   {
      key: 'createdAt',
      label: 'Создан',
      width: '132px',
      align: 'center',
      nowrap: true,
      columnClass: 'date',
      format: (row) => formatDate(row.createdAt)
   },
   {
      key: 'actions',
      label: 'Действия',
      width: '64px',
      type: 'menu',
      align: 'center',
      nowrap: true,
      columnClass: 'menu',
      menuItems: () => [
         { key: 'edit_user', text: 'Редактировать', icon: edit2Icon },
         { key: 'open_ads', text: 'Объявления', icon: editIcon },
         {
            key: 'create_for_user',
            text: 'Опубликовать от имени',
            icon: addPublicationIcon
         }
      ]
   }
])

const tableColumns = computed(() => columns.value)

const revokePhotoPreview = () => {
   if (!photoPreviewUrl.value) return
   if (photoPreviewUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreviewUrl.value)
   }
   photoPreviewUrl.value = ''
}

const resetForm = () => {
   createForm.username = ''
   createForm.address = ''
   createForm.email = ''
   createForm.phone = ''
   createForm.city_id = ''
   createForm.city_name = ''
   createForm.latitude = ''
   createForm.longitude = ''
   photoFile.value = null
   shouldRemovePhoto.value = false
   isEditMode.value = false
   editingUserId.value = null
   phoneRaw.value = ''
   createError.value = ''

   if (photoInputRef.value) {
      photoInputRef.value.value = ''
   }

   revokePhotoPreview()
}

const openCreateForUser = async (userId) => {
   if (!userId) return

   successPromptMessage.value = ''
   successPromptUserId.value = null

   await router.push({
      path: '/create',
      query: { create_by_user_id: String(userId) }
   })
}

const loadUsers = async (page = currentPage.value) => {
   currentPage.value = Number(page) || 1
   isLoading.value = true
   errorMessage.value = ''
   const result = await getModerationUsers({
      page: currentPage.value,
      count: perPage.value,
      search: searchQuery.value,
      order_by: sortOrder.value
   })

   if (result?.success === false) {
      users.value = []
      totalUsers.value = 0
      errorMessage.value =
         result.message || 'Ошибка при загрузке списка пользователей.'
      isLoading.value = false
      return
   }

   users.value = Array.isArray(result?.items) ? result.items : []
   totalUsers.value = Number(result?.total) || users.value.length
   currentPage.value = Number(result?.currentPage) || currentPage.value
   perPage.value = Number(result?.perPage) || perPage.value
   isLoading.value = false
}

const applyUserFilters = async () => {
   await loadUsers(1)
}

const toggleCreatePanel = () => {
   isCreateOpen.value = !isCreateOpen.value
   createError.value = ''
   successPromptMessage.value = ''
   successPromptUserId.value = null

   if (isCreateOpen.value) {
      resetForm()
      return
   }

   resetForm()
}

const triggerPhotoInput = () => {
   photoInputRef.value?.click?.()
}

const handlePhotoChange = (event) => {
   const file = event.target.files?.[0] || null
   if (!file) return

   const validFormats = [
      'image/heic',
      'image/heif',
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/jpg',
      'image/avif'
   ]
   const maxSizeBytes = 5 * 1024 * 1024

   if (!validFormats.includes(file.type)) {
      createError.value =
         'Допустимые форматы: HEIC, HEIF, JPG, JPEG, PNG, WEBP, AVIF.'
      event.target.value = ''
      return
   }

   if (file.size > maxSizeBytes) {
      createError.value = 'Размер файла не должен превышать 5 МБ.'
      event.target.value = ''
      return
   }

   createError.value = ''
   photoFile.value = file
   shouldRemovePhoto.value = false
   revokePhotoPreview()
   photoPreviewUrl.value = URL.createObjectURL(file)
}

const handleEmailInput = (event) => {
   createForm.email = String(event?.target?.value || '')
      .replace(/\s+/g, '')
      .toLowerCase()
}

const normalizePhoneForApi = (value) => {
   const digits = String(value || '').replace(/\D/g, '')
   if (!digits) return ''

   const normalizedDigits =
      digits.length === 11 && digits.startsWith('8')
         ? `7${digits.slice(1)}`
         : digits

   return `+${normalizedDigits}`
}

const normalizePhoneForMask = (value) => {
   let digits = String(value || '').replace(/\D/g, '')

   if (digits.startsWith('8') || digits.startsWith('7')) {
      digits = digits.slice(1)
   }

   return digits.slice(0, 10)
}

const resolveCreatedModerationUserId = (payload) => {
   const candidates = [
      payload?.id,
      payload?.user_id,
      payload?.userId,
      payload?.data?.id,
      payload?.data?.user_id,
      payload?.data?.userId,
      payload?.user?.id
   ]

   for (const candidate of candidates) {
      const normalizedId = Number(candidate)
      if (Number.isFinite(normalizedId) && normalizedId > 0) {
         return normalizedId
      }
   }

   return null
}

const resolveUserPhotoUrl = (user) => {
   return getUserAvatarUrl(user?.photo, avatarFallbackIcon)
}

const handleAddressChange = (value) => {
   createForm.address = String(value || '').trim()
}

const handleLatitudeChange = (value) => {
   createForm.latitude = value || ''
}

const handleLongitudeChange = (value) => {
   createForm.longitude = value || ''
}

const handlePhoneBackspace = () => {
   const value = formattedPhone.value
   const lengthBefore = value.length

   if (['-', '('].includes(value[lengthBefore - 2])) {
      phoneRaw.value = phoneRaw.value.slice(0, -1)
   }
}

const openCityModal = () => {
   modalStore.open('location', {
      title: 'Выберите город',
      confirmText: 'Выбрать',
      persistSelection: false,
      onSelect: (city) => {
         createForm.city_id = String(city?.id || '')
         createForm.city_name = String(city?.name || city?.title || '')
      }
   })
}

const startEditUser = async (userId) => {
   const normalizedUserId = Number(userId)
   if (!Number.isFinite(normalizedUserId) || normalizedUserId <= 0) return

   isSubmitting.value = true
   createError.value = ''
   successPromptMessage.value = ''
   successPromptUserId.value = null

   const result = await getModerationUserById(normalizedUserId)
   isSubmitting.value = false

   if (result?.success === false) {
      createError.value =
         result.message ||
         `Не удалось загрузить пользователя #${normalizedUserId}.`
      isCreateOpen.value = true
      return
   }

   const user = result || {}

   resetForm()
   createForm.username = String(user.username || '')
   createForm.address = String(user.address || '')
   createForm.email = String(user.email || '')
   createForm.phone = String(user.phone || '')
   createForm.city_id = String(user.cityId || user.city?.id || '')
   createForm.city_name = String(user.cityLabel || user.city?.title || '')
   createForm.latitude = String(user.latitude || '')
   createForm.longitude = String(user.longitude || '')
   phoneRaw.value = normalizePhoneForMask(user.phone)
   isEditMode.value = true
   editingUserId.value = normalizedUserId
   shouldRemovePhoto.value = false
   isCreateOpen.value = true

   const existingPhotoUrl = resolveUserPhotoUrl(user)
   if (existingPhotoUrl) {
      photoPreviewUrl.value = existingPhotoUrl
   }
}

const submitUser = async () => {
   createError.value = ''
   successPromptMessage.value = ''
   successPromptUserId.value = null

   const normalizedPhone = normalizePhoneForApi(createForm.phone)

   if (
      !createForm.username.trim() ||
      !createForm.address.trim() ||
      !normalizedPhone ||
      !createForm.city_id.trim()
   ) {
      createError.value =
         'Заполни обязательные поля: имя, город, адрес и телефон.'
      return
   }

   if (!validatePhoneNumber(normalizedPhone)) {
      createError.value = 'Введи корректный номер телефона.'
      return
   }

   if (createForm.email && !validateEmail(createForm.email)) {
      createError.value = 'Введи корректный email.'
      return
   }

   isSubmitting.value = true
   const payload = {
      username: createForm.username.trim(),
      address: createForm.address.trim(),
      email: createForm.email.trim(),
      phone: normalizedPhone,
      city_id: createForm.city_id,
      latitude: createForm.latitude,
      longitude: createForm.longitude,
      photo:
         shouldRemovePhoto.value && !photoFile.value ? null : photoFile.value
   }
   const result =
      isEditMode.value && editingUserId.value
         ? await updateModerationUser(editingUserId.value, payload)
         : await createModerationUser(payload)
   isSubmitting.value = false

   if (result?.success === false) {
      createError.value =
         result.message ||
         (isEditMode.value
            ? 'Не удалось обновить пользователя.'
            : 'Не удалось создать пользователя.')
      return
   }

   const nextUserId = resolveCreatedModerationUserId(result)
   successPromptMessage.value =
      result?.message ||
      (isEditMode.value
         ? 'Пользователь успешно обновлен.'
         : 'Пользователь успешно создан.')
   successPromptUserId.value = isEditMode.value ? null : nextUserId
   resetForm()
   isCreateOpen.value = false
   await loadUsers(currentPage.value)
}

const handlePerPageChange = async (value) => {
   perPage.value = value
   await loadUsers(1)
}

const resetUserFilters = async () => {
   searchQuery.value = ''
   sortOrder.value = 'desc'
   await loadUsers(1)
}

const handleRowAction = async (actionKey, row) => {
   if (actionKey === 'edit_user') {
      await startEditUser(row.userId || row.id)
      return
   }

   if (actionKey === 'open_ads') {
      await router.push({
         path: '/ads',
         query: { user_id: String(row.userId) }
      })
      return
   }

   if (actionKey === 'create_for_user') {
      await openCreateForUser(row.userId)
   }
}

watch(formattedPhone, (value) => {
   createForm.phone = value
})

onBeforeUnmount(() => {
   revokePhotoPreview()
})

onMounted(loadUsers)
</script>

<style scoped lang="scss">
.admin-page {
   display: flex;
   flex-direction: column;
   gap: 24px;
   max-width: 1320px;
   margin: 0 auto;
   padding: 0 16px;
}

.admin-page__hero {
   display: flex;
   align-items: flex-end;
   justify-content: space-between;
   gap: 16px;
}

.admin-page__title {
   max-width: 860px;
   margin: 0 0 8px;
   color: var(--color-text-primary);
   font-size: var(--font-size-20);
   line-height: var(--line-height-20);
}

.admin-page__description {
   max-width: 720px;
   margin: 0;
   color: var(--color-text-secondary);
   font-size: var(--font-size-14);
   line-height: var(--line-height-14);
}

.filters-panel,
.create-panel,
.notice {
   border: 1px solid var(--color-border);
   border-radius: 12px;
   background: var(--color-surface);
   box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.08);
}

.filters-panel {
   display: flex;
   flex-wrap: nowrap;
   align-items: flex-end;
   gap: 12px;
   padding: 16px;
}

.filters-panel__field {
   display: flex;
   flex-direction: column;
   gap: 8px;
   min-width: 0;
   flex: 1 1 0;
}

.filters-panel__field--wide {
   min-width: 0;
   flex: 1.2 1 0;
}

.filters-panel__field span {
   color: var(--color-text-primary);
   font-size: var(--font-size-12);
   line-height: var(--line-height-12);
}

.filters-panel__field input {
   min-height: 34px;
   padding: 0 12px;
   border: 1px solid var(--color-border);
   border-radius: 6px;
   background: var(--color-surface);
   color: var(--color-text-primary);
}

.filters-panel__field input:focus {
   outline: none;
   border-color: var(--color-text-accent);
}

.filters-panel__actions {
   display: flex;
   gap: 10px;
   flex-wrap: nowrap;
   align-items: center;
   flex: 0 0 auto;
   margin-left: auto;
}

.filters-panel__action-button {
   flex: 0 0 auto;
   white-space: nowrap;
}

.button-inline {
   display: inline-flex;
   align-items: center;
   gap: 8px;
}

.button-inline__icon {
   width: 16px;
   height: 16px;
   flex-shrink: 0;
}

.filters-panel__field :deep(.select-field) {
   width: 100%;
}

.create-panel {
   padding: 20px;
}

.create-panel__title {
   margin: 0 0 8px;
   color: var(--color-text-primary);
   font-size: var(--font-size-20);
   line-height: var(--line-height-20);
}

.create-panel__text {
   margin: 0;
   color: var(--color-text-secondary);
   font-size: var(--font-size-14);
   line-height: var(--line-height-14);
}

.create-form {
   display: grid;
   grid-template-columns: repeat(2, minmax(0, 1fr));
   gap: 12px;
   margin-top: 18px;
}

.create-form__hidden {
   display: none;
}

.form-field {
   display: flex;
   flex-direction: column;
   gap: 8px;
}

.form-field--full,
.create-form__footer {
   grid-column: 1 / -1;
}

.form-field span {
   color: var(--color-text-primary);
   font-size: var(--font-size-12);
   line-height: var(--line-height-12);
   font-weight: 400;
}

.form-field input {
   min-height: 34px;
   padding: 0 12px;
   border: 1px solid var(--color-border);
   border-radius: 6px;
   background: var(--color-surface);
   color: var(--color-text-primary);
}

.form-field input:focus {
   outline: none;
   border-color: var(--color-text-accent);
}

.form-field__city-button {
   display: inline-flex;
   align-items: center;
   justify-content: flex-start;
   width: 100%;
   min-height: 34px;
   padding: 0 12px;
   border: 1px solid var(--color-border);
   border-radius: 6px;
   background: var(--color-surface);
   color: var(--color-text-primary);
   cursor: pointer;
}

.form-field__city-button:hover {
   border-color: #bfdcff;
}

.create-form__avatar-field {
   gap: 12px;
}

.create-form__avatar {
   display: flex;
   align-items: center;
   gap: 16px;
}

.create-form__avatar-preview {
   position: relative;
   width: 72px;
   height: 72px;
   border-radius: 50%;
   flex-shrink: 0;
}

.create-form__avatar-preview img:first-child {
   width: 100%;
   height: 100%;
   border-radius: 50%;
   object-fit: cover;
   border: 1px solid #d6d6d6;
   background: #fff;
}

.create-form__avatar-copy {
   display: flex;
   flex-direction: column;
   gap: 6px;
}

.create-form__avatar-title,
.create-form__avatar-text {
   margin: 0;
}

.create-form__avatar-title {
   color: var(--color-text-primary);
   font-size: var(--font-size-14);
   line-height: var(--line-height-14);
   font-weight: 700;
}

.create-form__avatar-text {
   color: var(--color-text-secondary);
   font-size: var(--font-size-12);
   line-height: var(--line-height-12);
}

.create-form__address {
   width: 100%;
}

.create-form__footer {
   display: flex;
   align-items: center;
   justify-content: space-between;
   gap: 16px;
   margin-top: 4px;
}

.create-form__messages {
   display: flex;
   flex-direction: column;
   gap: 6px;
}

.form-message {
   margin: 0;
   font-size: var(--font-size-14);
   line-height: var(--line-height-14);
}

.form-message--error {
   color: #ff5959;
}

.notice {
   padding: 16px;
}

.notice__content {
   display: flex;
   align-items: center;
   justify-content: space-between;
   gap: 16px;
}

.notice--success {
   border-color: rgba(59, 188, 113, 0.3);
   background: #f5fff9;
   color: #257847;
}

.notice--success p,
.notice--success strong {
   margin: 0;
}

.notice--error {
   color: #ff5959;
   background: #fff8f8;
}

@media (max-width: 960px) {
   .filters-panel {
      flex-wrap: wrap;
   }

   .admin-page__hero {
      align-items: stretch;
      flex-direction: column;
   }

   .create-form {
      grid-template-columns: 1fr;
   }

   .create-form__avatar {
      align-items: flex-start;
      flex-direction: column;
   }

   .create-form__footer,
   .notice__content {
      align-items: stretch;
      flex-direction: column;
   }

   .filters-panel__field {
      width: 100%;
      flex-basis: 100%;
   }

   .filters-panel__actions {
      width: 100%;
      flex-basis: 100%;
      margin-top: 2px;
      margin-left: 0;
      flex-wrap: wrap;
   }

   .filters-panel__action-button {
      width: calc(50% - 5px);
   }
}
</style>
