import {
   getMissingAdFieldLabels,
   getMissingCharacteristicFieldLabels
} from './validation'

export const CREATE_REQUIRED_FIELDS_ERROR_MESSAGE =
   'Пожалуйста, заполните обязательные поля.'
export const CREATE_PUBLISH_SAVE_ERROR_MESSAGE =
   'Не удалось сохранить изменения. Попробуйте еще раз.'
export const CREATE_PUBLISH_PREPARE_ERROR_MESSAGE =
   'Не удалось подготовить объявление к публикации.'
export const CREATE_PUBLISH_SUCCESS_MESSAGE =
   'Ваше объявление отправлено на модерацию.'
export const CREATE_PUBLISH_COMPLETION_QUERY_KEY = 'create_complete'
export const CREATE_PUBLISH_UNAVAILABLE_MESSAGE =
   'Публикация пока недоступна без серверного автосохранения.'
export const CREATE_SAVE_DRAFT_UNAVAILABLE_MESSAGE =
   'Сохранение в черновик пока недоступно без серверного автосохранения.'
export const CREATE_PUBLISH_LOG_PREFIX = 'Create publish failed:'
export const CREATE_SAVE_DRAFT_LOG_PREFIX = 'Create save draft failed:'
export const CREATE_PROFILE_UPDATE_ERROR_MESSAGE =
   'Не удалось обновить данные профиля.'

const CREATE_REQUIRED_FIELDS_LIST_TITLE = 'Заполните обязательные поля:'

const normalizeComparableText = (value) =>
   typeof value === 'string' ? value.trim() : ''

const normalizeComparableEmail = (value) =>
   normalizeComparableText(value).toLowerCase()

const shouldUpdateProfileTextField = ({ nextValue, currentValue }) => {
   const normalizedNext = normalizeComparableText(nextValue)
   if (!normalizedNext) return false
   return normalizedNext !== normalizeComparableText(currentValue)
}

const formatCreateRequiredFieldsMessage = (labels = []) => {
   const uniqueLabels = [...new Set(labels.filter(Boolean))]
   if (!uniqueLabels.length) {
      return CREATE_REQUIRED_FIELDS_ERROR_MESSAGE
   }

   return `${CREATE_REQUIRED_FIELDS_LIST_TITLE}\n${uniqueLabels
      .map((label) => `- ${label}`)
      .join('\n')}`
}

export const buildCreatePrePublishUserProfileUpdates = ({
   createStore,
   userStore
}) => {
   const updates = []

   if (
      shouldUpdateProfileTextField({
         nextValue: createStore?.username,
         currentValue: userStore?.username
      })
   ) {
      updates.push({ username: createStore.username })
   }

   if (
      shouldUpdateProfileTextField({
         nextValue: createStore?.place_inspection,
         currentValue: userStore?.address
      })
   ) {
      updates.push({ address: createStore.place_inspection })
   }

   return updates
}

export const shouldRequestCreateEmailConfirmation = ({
   createStore,
   userStore,
   isEmailConfirmed
}) => {
   const nextEmail = normalizeComparableEmail(createStore?.email)
   if (!nextEmail) return false

   const confirmedEmail = normalizeComparableEmail(userStore?.email)
   const unconfirmedEmail = normalizeComparableEmail(userStore?.unconfirmed_email)

   if (unconfirmedEmail && nextEmail === unconfirmedEmail) {
      return true
   }

   if (confirmedEmail && nextEmail === confirmedEmail) {
      return false
   }

   if (isEmailConfirmed && !confirmedEmail) {
      return false
   }

   return true
}

export const isCreateEmailPendingConfirmation = ({
   createStore,
   userStore
}) => {
   const nextEmail = normalizeComparableEmail(createStore?.email)
   const unconfirmedEmail = normalizeComparableEmail(userStore?.unconfirmed_email)

   return (
      Boolean(nextEmail) &&
      Boolean(unconfirmedEmail) &&
      nextEmail === unconfirmedEmail
   )
}

export const isCreateUserProfileUpdateSuccessful = (response) => {
   if (!response || typeof response !== 'object') return true
   return response.success !== false
}

export const buildCreateCharacteristicsRequiredFieldsMessage = (createStore) =>
   formatCreateRequiredFieldsMessage(
      getMissingCharacteristicFieldLabels(createStore)
   )

export const buildCreateAdRequiredFieldsMessage = (createStore) =>
   formatCreateRequiredFieldsMessage(getMissingAdFieldLabels(createStore))
