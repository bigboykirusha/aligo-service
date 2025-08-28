export const useValidate = (formValues) => {
  // mail
  function validate(form) {
    let validateStatus = false;
    form.forEach((object) => {
      if (object.validateType) {
        switch (object.validateType) {
          case 'pass':
            validatePass(object);
            break;
          case 'email':
            validateEmail(object);
            break;
          case 'empty':
            validateEmpty(object);
            break;
          case 'phone':
            validatePhone(object);
            break;
          case 'select':
            validateSelect(object);
            break;
          case 'url':
            validateURL(object);
            break;
          case 'checkbox':
            validateCheckbox(object);
            break;
          case 'fileImg':
            if (object.value.length) imgFileValidate(object);
            break;
          case 'reternPass':
            validateReternPass(object);
            break;
          case 'newPass':
            validateNewPass(object);
            break;
          case 'emptyTime':
            timeEmpty(object);
            break;
          default:
            break;
        }
      }
      validateStatus = form.every((object) => !object.error);
    });
    return validateStatus;
  }

  //
  const statusDuration = 7000;
  // email
  function validateEmail(object) {
    const validateEmail = /^\S+@\S+\.\S+$/;

    if (!validateEmail.test(object.value)) {
      object.error = true;
      object.success = false;
    } else {
      object.error = false;
      object.success = true;
    }
    if (!object.status) resetStatusAfterDelay(object, statusDuration);
  }
  // password
  function validatePass(object) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!"№;%:?*()@#$*^])(?=.*\d).{8,}$/;
    resetStatusAfterDelay(object, statusDuration);
    if (!passwordRegex.test(object.value)) {
      object.error = true;
      object.success = false;
      return false;
    } else {
      object.error = false;
      object.success = true;
      return true;
    }
  }
  // returnPass
  function validateReternPass(object) {
    const isValidPass = validatePass(object);

    if (!isValidPass) {
      object.error = true;
      object.success = false;
      return;
    }
    if (object.oldPass === object.value) {
      object.error = false;
      object.success = true;
    } else {
      object.error = true;
      object.success = false;
      object.erroreText = 'пароли не совпадают';
    }
    resetStatusAfterDelay(object, statusDuration);
  }
  // newPass
  function validateNewPass(object) {
    const isValidPass = validatePass(object);
    if (!isValidPass) {
      object.error = true;
      object.success = false;
      return;
    }
    if (object.oldPass != object.value) {
      object.error = false;
      object.success = true;
    } else {
      object.error = true;
      object.success = false;
      object.erroreText = 'придумайте новый пароль';
    }
    resetStatusAfterDelay(object, statusDuration);
  }
  // phone
  function validatePhone(object) {
    if (object.value.length === 23) {
      object.error = false;
      object.success = true;
    } else {
      object.error = true;
      object.success = false;
    }
    if (!object.status) resetStatusAfterDelay(object, statusDuration);
  }
  //

  function timeEmpty(object) {
    if (!object.startTime) {
      object.error = true;
      object.success = false;
    } else {
      object.error = false;
      object.success = true;
    }
    resetStatusAfterDelay(object, statusDuration);
  }

  //

  function validateURL(object) {
    const regex =
      /^(?!.*[/]{2,})(?!^https?:\/\/)(?!^\/)([a-zA-Z0-9.]+([/]?[a-zA-Z0-9.-]+)*)\/$/;
    if (!regex.test(object.value)) {
      object.error = true;
      object.success = false;
    } else {
      object.error = false;
      object.success = true;
    }
    resetStatusAfterDelay(object, statusDuration);
  }
  // note empty
  function validateEmpty(object) {
    if (!object.value) {
      object.error = true;
      object.success = false;
    } else {
      object.error = false;
      object.success = true;
    }
    resetStatusAfterDelay(object, statusDuration);
  }
  // select
  function validateSelect(object) {
    if (object.name === '' || object.code === '') {
      object.error = true;
      object.success = false;
    } else {
      object.error = false;
      object.success = true;
    }
    resetStatusAfterDelay(object, statusDuration);
  }
  // checkbox
  function validateCheckbox(object) {
    object.error = object.value ? false : true;
  }

  // Проверка типа файла
  function imgFileValidate(file) {
    const validTypes = ['image/jpeg', 'image/png'];
    const maxSize = 2 * 1024 * 1024;
    if (file.value.length) {
      const img = new Image();
      img.src = URL.createObjectURL(file.value[0].file);
      if (!validTypes.includes(file.value[0].file.type)) {
        file.error = true;
        return;
      }
      if (file.value[0].file.size > maxSize) {
        file.error = true;
        return;
      }
      img.onload = function () {
        const maxWidth = 2000;
        const maxHeight = 2000;
        if (img.width > maxWidth || img.height > maxHeight) {
          file.error = true;
          return;
        }
      };
    } else {
      file.error = true;
    }
  }
  function resetStatusAfterDelay(object, statusDuration) {
    setTimeout(() => {
      object.error = false;
      object.success = false;
    }, statusDuration);
  }

  return validate(formValues);
};
