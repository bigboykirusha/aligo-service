export const appendCreateFieldToFormData = (formData, field, value) => {
   if (Array.isArray(value)) {
      value.forEach((item) => formData.append(`${field}[]`, item))
      return
   }

   formData.append(field, value ?? '')
}

export const isCreateFieldEmpty = (value) => {
   if (value === null || value === undefined) return true
   if (typeof value === 'string') return value.trim() === ''
   if (Array.isArray(value)) return value.length === 0
   return false
}

export const toCreateApiError = (response, fallbackMessage) => {
   if (response === null || response === undefined) {
      return new Error(fallbackMessage || 'Create request failed.')
   }

   if (response?.success === false) {
      const error = new Error(response.message || fallbackMessage)
      error.response = response
      return error
   }

   return null
}
