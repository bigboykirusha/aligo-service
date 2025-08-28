export function updateFormFieldsWithErrors(formFields, errors) {
  // Сначала сбросим все ошибки
  Object.keys(formFields).forEach((key) => {
    formFields[key].error = false;
    formFields[key].errorText = '';
  });

  // Обновим поля на основе массива ошибок
  errors.forEach(([key, errorText]) => {
    const fieldKey = Object.keys(formFields).find(
      (field) => formFields[field].backendKey === key
    );

    if (fieldKey) {
      formFields[fieldKey].error = true;
      formFields[fieldKey].errorText = errorText;
    }
  });
}
