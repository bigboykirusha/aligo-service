<template>
  <div class="create-profile">
    <div class="create-profile__title large-title">Новый профиль</div>
    <hr class="create-profile__divider" />
    <div class="create-profile__subtitle medium-text">
      Введите данные для создания нового профиля и опубликуйте объявление от его имени
    </div>
    <ul class="create-profile__block">
      <li class="create-profile__item">
        <span class="create-profile__text">Фото</span>
        <PhotoUploader v-model="form.photo" />
      </li>
      <li class="create-profile__item">
        <span class="create-profile__text">Имя</span>
        <CustomInput v-model="form.username" placeholder="Нажмите для ввода" />
      </li>
      <li class="create-profile__item" :class="{ 'has-error': errors.phone }">
        <span class="create-profile__text">Телефон</span>
        <input type="tel" v-model="form.phone" class="phone-input" ref="phoneInput" v-mask="'+7 (###) ###-##-##'"
          placeholder="+7 (___) ___-__-__" />
      </li>
      <li class="create-profile__item">
        <span class="create-profile__text">E-mail</span>
        <CustomInput v-model="form.email" placeholder="Нажмите для ввода" />
      </li>
      <li class="create-profile__item">
        <span class="create-profile__text">Город</span>
        <CityAutosCreate :modelValue="form.city_name" :showLabel="false" @updateCity="handleCitySelection" />
      </li>
      <li class="create-profile__item">
        <span class="create-profile__text">Адрес</span>
        <AutosAddressInput @update:address="(value) => handleFieldUpdate('address', value)" :option="form.address" />
      </li>
    </ul>
    <hr class="create-profile__divider" />
    <div class="create-profile__buttons">
      <ButtonUI text="Создать и выйти" :disabled="!isFormValid" @click="handleCreate(false)" />
      <ButtonUI text="Опубликовать объявление" buttonClass="btn--second" :disabled="!isFormValid"
        @click="handleCreate(true)" />
      <ButtonUI text="Отменить" buttonClass="btn--second" @click="handleCancel" />
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import ButtonUI from '@/components/UI/ButtonUI.vue';
import CustomInput from '@/components/UI/CustomInput.vue';
import PhotoUploader from '@/components/USER/PhotoUploader.vue';
import { createUser } from '@/services/apiClient';
import { mask as vMask } from 'vue-the-mask';
import CityAutosCreate from '@/components/CREATEAD/CityAutosCreate.vue';
import AutosAddressInput from '@/components/CREATEAD/AutosAddressInput.vue';

const router = useRouter();

const form = reactive({
  username: '',
  phone: '',
  email: '',
  city_id: '',
  city_name: '',
  address: '',
  photo: '',
});

const errors = reactive({
  phone: null,
});

const isPhoneValid = () => {
  const digits = form.phone.replace(/\D/g, '');
  return digits.length === 11;
};

const isFormValid = computed(() => {
  return (
    form.username !== '' &&
    form.address !== '' &&
    form.city_id !== '' &&
    isPhoneValid()
  );
});

const handleCitySelection = (value) => {
  form.city_id = value.id;
  form.city_name = value.title;
};

const handleFieldUpdate = (field, value) => {
  form[field] = value;
};

const handleCreate = async (publish) => {
  const payload = { ...form };

  if (payload.phone) {
    const digits = payload.phone.replace(/\D/g, '');
    payload.phone = '+' + digits;
  }

  const { success, data } = await createUser(payload);

  if (success) {
    console.log('Профиль создан:', data);

    if (publish) {
      console.log('Опубликовать объявление от нового пользователя');
      router.push(`/createad/${data.data.id}/`);
    } else {
      router.push('/users/');
    }
  }
};

const handleCancel = () => {
  router.push('/users/');
};
</script>

<style lang="scss">
.create-profile {
  padding: 16px;
  margin: 16px;
  box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
  display: flex;
  flex-direction: column;
  width: calc(100% - 32px);
  min-height: calc(100% - 32px);
  border-radius: 6px;

  @media (max-width: 768px) {
    margin: 0;
    width: 100%;
    height: 100%;
    margin-top: 85px;
  }

  &__title {
    font-size: 24px;
    padding: 16px;
    color: var(--primary);
    font-weight: 700;
  }

  &__divider {
    border: none;
    height: 1px;
    background-color: #ddd;
  }

  &__subtitle {
    font-size: 14px;
    max-width: 500px;
    padding: 24px 16px;
    line-height: 18px;
    font-weight: 700;
    color: var(--text-main);
  }

  &__block {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 24px;
    margin: 24px 16px;
    margin-top: 0;
  }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    max-width: 500px;

    &.has-error input {
      border: 1px solid red;
      border-radius: 4px;
    }
  }

  &__text {
    color: var(--color-text-select);
    font-weight: 400;
    font-size: 14px;
    min-width: 150px;
    margin-bottom: 4px;
  }

  &__buttons {
    display: flex;
    padding-top: 16px;
    padding-left: 16px;
    gap: 24px;

    @media (max-width: 768px) {
      flex-wrap: wrap;
      align-items: flex-start;
    }
  }
}

input {
  border: 1px solid var(--color-stroke);
  border-radius: 4px;
  height: 34px;
  line-height: 18px;
  width: 100%;
  font-size: 14px;
  padding: 0 12px;
  box-sizing: border-box;
}

.error {
  color: red;
  font-size: 12px;
  margin-top: 4px;
}
</style>
