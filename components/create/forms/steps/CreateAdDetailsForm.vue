<template>
   <div class="characteristics">
      <BlockTitle text="Параметры объявления" />
      <div class="characteristics__content">
         <PhotoUploader
            v-if="props.showPhotos"
            label="Фотографии"
            helper-text="до 10 шт., формат jpg, jpeg, png, gif, webp, avif, heif, heic"
            :photos="createStore.photos"
            @update-photos="(photos) => updateField('photos', photos)"
         />

         <AutosTextAreaTemplate
            label="Описание"
            placeholder="Нажмите для ввода"
            :option="createStore.ads_description"
            class="draft-required-field"
            :class="{
               'draft-required-field--active': shouldHighlightRequiredField(
                  'ads_description',
                  createStore.ads_description
               )
            }"
            @click="dismissRequiredField('ads_description')"
            @update:option="(value) => updateField('ads_description', value)"
         />

         <AutosTextTemplate
            :label="priceLabel"
            placeholder="Нажмите для ввода"
            :option="createStore.amount"
            validation-type="number"
            class="draft-required-field"
            :class="{
               'draft-required-field--active': shouldHighlightRequiredField(
                  'amount',
                  createStore.amount
               )
            }"
            @click="dismissRequiredField('amount')"
            @update:option="(value) => updateField('amount', value)"
         />
      </div>

      <BlockTitle text="Местоположение" />
      <div class="characteristics__content">
         <div class="city-field">
            <div class="city-field__label">Город</div>
            <button
               type="button"
               class="city-field__button"
               @click="openCityModal"
            >
               {{ selectedCityLabel }}
            </button>
         </div>

         <AutosAddressInput
            :key="`address-${createStore.id || 'new'}-${createStore.city_id || ''}`"
            label="Адрес"
            placeholder="Введите адрес"
            :option="createStore.place_inspection"
            :latitude="createStore.latitude"
            :longitude="createStore.longitude"
            class="draft-required-field"
            :class="{
               'draft-required-field--active': shouldHighlightRequiredField(
                  'place_inspection',
                  createStore.place_inspection
               )
            }"
            @click="dismissRequiredField('place_inspection')"
            @update:address="(value) => updateField('place_inspection', value)"
            @update:latitude="(value) => updateField('latitude', value)"
            @update:longitude="(value) => updateField('longitude', value)"
         />
      </div>

      <BlockTitle text="Контакты" />
      <div class="characteristics__content">
         <CreatePhoneDisplayField
            label="Телефон"
            placeholder="Нажмите для ввода"
            :option="createStore.phone"
            :disabled="moderationCreateStore.isFieldLocked('phone')"
            class="draft-required-field"
            :class="{
               'draft-required-field--active': shouldHighlightRequiredField(
                  'phone',
                  createStore.phone
               )
            }"
            @click="dismissRequiredField('phone')"
            @update:option="(value) => updateField('phone', value)"
         />

         <AutosEmailInput
            label="Email"
            placeholder="Нажмите для ввода"
            :option="createStore.email"
            :disabled="moderationCreateStore.isFieldLocked('email')"
            validation-type="email"
            class="draft-required-field"
            :class="{
               'draft-required-field--active': shouldHighlightRequiredField(
                  'email',
                  createStore.email
               )
            }"
            @click="dismissRequiredField('email')"
            @update:option="(value) => updateField('email', value)"
         />

         <AutosTextTemplate
            v-show="
               !userStore.username ||
               moderationCreateStore.isFieldLocked('username')
            "
            label="Имя пользователя"
            placeholder="Нажмите для ввода"
            validation-type="name"
            :option="createStore.username"
            :disabled="moderationCreateStore.isFieldLocked('username')"
            class="draft-required-field"
            :class="{
               'draft-required-field--active': shouldHighlightRequiredField(
                  'username',
                  createStore.username,
                  !userStore.username
               )
            }"
            @click="dismissRequiredField('username')"
            @update:option="(value) => updateField('username', value)"
         />

         <SelectSkeleton v-if="loading" layout="row" />
         <SelectUI
            v-else
            label="Способ связи"
            :initial-selected-option="createStore.communication_method_id"
            :options="communicationMethodOptions"
            layout="row"
            input-width="310px"
            searchable
            search-mode="startsWith"
            class="draft-required-field"
            :class="{
               'draft-required-field--active': shouldHighlightRequiredField(
                  'communication_method_id',
                  createStore.communication_method_id
               )
            }"
            @click="dismissRequiredField('communication_method_id')"
            @update-sort="
               (value) => updateField('communication_method_id', value)
            "
         />
      </div>
   </div>
</template>

<script setup>
import SelectUI from '~/components/ui/SelectUI.vue'
import SelectSkeleton from '~/components/SelectSkeleton.vue'
import CreatePhoneDisplayField from '@/components/create/forms/fields/CreatePhoneDisplayField.vue'
import { useCreateAdDetailsModel } from '@/composables/create/useCreateAdDetailsModel'

defineOptions({
   name: 'CreateAdDetailsForm'
})

const props = defineProps({
   showPhotos: {
      type: Boolean,
      default: false
   }
})

const {
   loading,
   createStore,
   moderationCreateStore,
   userStore,
   communicationMethodOptions,
   priceLabel,
   selectedCityLabel,
   shouldHighlightRequiredField,
   dismissRequiredField,
   updateField,
   openCityModal
} = useCreateAdDetailsModel()
</script>

<style lang="scss" scoped>
@use '@/assets/styles/create/draftRequiredField' as draftRequiredField;

.characteristics {
   display: flex;
   flex-direction: column;
   gap: 40px;

   @media (max-width: 768px) {
      padding-bottom: 57px;
      gap: 24px;
   }

   &__content {
      display: flex;
      flex-direction: column;
      gap: 24px;

      @media (max-width: 768px) {
         gap: 16px;
      }
   }
}

.city-field {
   display: flex;
   align-items: center;
   gap: 8px;

   @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
   }

   &__label {
      min-width: 270px;
      font-size: 14px;
      line-height: 18px;
      color: #323232;
   }

   &__button {
      width: 310px;
      min-height: 34px;
      padding: 8px 12px;
      border: 1px solid #d6d6d6;
      border-radius: 6px;
      background: #fff;
      font-size: 14px;
      line-height: 18px;
      color: #323232;
      text-align: left;
      cursor: pointer;

      @media (max-width: 768px) {
         width: 100%;
      }
   }
}

@include draftRequiredField.draft-required-field-highlight;
</style>
