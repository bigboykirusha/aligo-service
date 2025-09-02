<template>
   <div class="report-search">
      <input v-model="searchValue" type="text" class="report-search__input" placeholder="Введите VIN или госномер"
         @blur="touched = true" />

      <button class="report-search__btn" :disabled="!isValid || isLoading" @click="handleSearch">
         {{ isLoading ? "Загрузка..." : "Проверить" }}
      </button>

      <div v-if="showPopup" class="report-search__popup">
         <div class="report-search__popup-content">
            <button class="report-search__close" @click="showPopup = false">
               <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#323232"
                     d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 0 0-1.41 1.41L10.59 12l-4.89 4.88a1 1 0 1 0 1.41 1.41L12 13.41l4.88 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.88a1 1 0 0 0 0-1.41z" />
               </svg>
            </button>

            <h4>Результат проверки</h4>

            <div v-if="formattedResult" class="report-search__fields">
               <div class="report-search__field">
                  {{ formattedResult.message }}
               </div>
               <div class="report-search__field">
                  <span class="report-search__label">VIN:</span>
                  <span class="report-search__value">{{ formattedResult.vin }}</span>
               </div>
               <div class="report-search__field">
                  <span class="report-search__label">Госномер:</span>
                  <span class="report-search__value">{{ formattedResult.plate }}</span>
               </div>
               <div class="report-search__field">
                  <span class="report-search__label">Марка:</span>
                  <span class="report-search__value">{{ formattedResult.brand }}</span>
               </div>
               <div class="report-search__field">
                  <span class="report-search__label">Модель:</span>
                  <span class="report-search__value">{{ formattedResult.model }}</span>
               </div>
               <div class="report-search__field">
                  <span class="report-search__label">Год выпуска:</span>
                  <span class="report-search__value">{{ formattedResult.year }}</span>
               </div>
               <div class="report-search__field">
                  <span class="report-search__label">Состояние:</span>
                  <span class="report-search__value">{{ formattedResult.state }}</span>
               </div>
               <div class="report-search__field">
                  <span class="report-search__label">Владельцев:</span>
                  <span class="report-search__value">{{ formattedResult.owners }}</span>
               </div>
               <div class="report-search__field">
                  <span class="report-search__label">Цена:</span>
                  <span class="report-search__value">{{ formattedResult.price }}</span>
               </div>
               <div class="report-search__field">
                  <span class="report-search__label">Цвет:</span>
                  <span class="report-search__value">{{ formattedResult.color }}</span>
               </div>
               <div class="report-search__field">
                  <span class="report-search__label">Пробег:</span>
                  <span class="report-search__value">{{ formattedResult.mileage }} км</span>
               </div>
               <div class="report-search__field">
                  <span class="report-search__label">Ссылка:</span>
                  <a :href="formattedResult.url" target="_blank" class="report-search__link">Перейти</a>
               </div>
            </div>

            <div v-else>
               <p>Нет данных по данному VIN/госномеру</p>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { getReportForAdmin } from "@/services/apiClient";

const searchValue = ref("");
const touched = ref(false);
const isLoading = ref(false);
const result = ref(null);
const showPopup = ref(false);

watch(searchValue, (val) => {
   if (val !== val.toUpperCase()) searchValue.value = val.toUpperCase();
});

const validateVIN = (vin) => {
   const upperVin = vin.toUpperCase();
   const vinRegex = /^[A-HJ-NPR-Z\d]{17}$/;
   if (!vinRegex.test(upperVin)) return false;
   if (/^([A-HJ-NPR-Z\d])\1*$/.test(upperVin)) return false;
   return true;
};

const validRegions = new Set([/* список регионов */]);

const isValidLicensePlate = (value) => {
   const regex =
      /^[АВЕКМНОРСТУХABEKMHOPCTYX](?!000)\d{3}[АВЕКМНОРСТУХABEKMHOPCTYX]{2}(\d{2,3})$/u;
   const match = value.match(regex);
   if (!match) return false;
   const region = match[1];
   return validRegions.has(region);
};

const isValid = computed(() => {
   if (!searchValue.value) return false;
   return validateVIN(searchValue.value) || isValidLicensePlate(searchValue.value);
});

const formattedResult = computed(() => {
   if (!result.value) return null;

   // --- формат №1: data = []
   if (Array.isArray(result.value.data) && result.value.data[0]) {
      const ad = result.value.data[0];
      return {
         message: result.value.message,
         vin: ad.auto_registration_data?.[0]?.vin || "—",
         plate: ad.auto_registration_data?.[0]?.state_number || "—",
         brand: ad.auto_technical_specifications?.[0]?.brand?.title || "—",
         model: ad.auto_technical_specifications?.[0]?.model?.title || "—",
         year: ad.auto_technical_specifications?.[0]?.year_release?.title || "—",
         state: ad.auto_history_conditions?.[0]?.state?.title || "—",
         owners: ad.auto_history_conditions?.[0]?.count_owners?.title || "—",
         mileage: ad.auto_history_conditions?.[0]?.mileage || "—",
         price: ad.ads_parameter?.amount ? `${ad.ads_parameter.amount} ₽` : "—",
         color: ad.auto_appearances?.[0]?.color?.[0]?.title || "—",
         url: ad.url,
      };
   }

   // --- формат №2: data = { ... }
   if (result.value.success && result.value.data && !Array.isArray(result.value.data)) {
      const d = result.value.data;
      return {
         message: "Данные найдены",
         vin: d.vin || d.body || "—",
         plate: d.regNumber || "—",
         brand: d.brand || "—",
         model: d.model || d.brand_model || "—",
         year: d.year || "—",
         state: "—",
         owners: "—",
         mileage: "—",
         price: "—",
         color: "—",
         url: "—",
      };
   }

   // --- формат №3: ошибка
   if (result.value.success === false) {
      let msg = "Нет данных";

      if (Array.isArray(result.value.message)) {
         msg = result.value.message.join(", ");
      } else if (typeof result.value.message === "string") {
         msg = result.value.message;
      }

      return {
         message: msg,
         vin: "—",
         plate: "—",
         brand: "—",
         model: "—",
         year: "—",
         state: "—",
         owners: "—",
         mileage: "—",
         price: "—",
         color: "—",
         url: "—",
      };
   }

   return null;
});

const handleSearch = async () => {
   if (!isValid.value) return;
   try {
      isLoading.value = true;
      const res = await getReportForAdmin(searchValue.value);
      result.value = res;
      showPopup.value = true;
   } finally {
      isLoading.value = false;
   }
};
</script>

<style scoped lang="scss">
.report-search {
   display: flex;
   height: 34px;

   &__input {
      font-size: 14px;
      padding: 10px 12px;
      border: 1px solid #d6d6d6;
      border-radius: 6px 0 0 6px;
      width: 100%;
      min-width: 210px;

      &:focus {
         outline: none;
         border-color: #3366ff;
         box-shadow: 0 0 4px rgba(51, 102, 255, 0.5);
      }
   }

   &__fields {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 14px;
   }

   &__field {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f9f9f9;
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
   }

   &__label {
      font-weight: 600;
      color: #555;
   }

   &__value {
      color: #222;
      font-weight: 400;
      text-align: right;
      max-width: 60%;
      word-break: break-word;
   }

   &__link {
      color: #3366ff;
      font-weight: 500;
      text-decoration: none;

      &:hover {
         text-decoration: underline;
      }
   }


   &__btn {
      padding: 10px 18px;
      border-radius: 0 6px 6px 0;
      border: none;
      background-color: #3366ff;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:disabled {
         background-color: #a8a8a8;
         cursor: not-allowed;
      }

      &:hover:not(:disabled) {
         background-color: #254eda;
      }
   }

   &__popup {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
   }

   &__popup-content {
      position: relative;
      background: #fff;
      padding: 16px;
      border-radius: 10px;
      max-width: 600px;
      width: 90%;
      max-height: 70vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
      gap: 12px;

      h4 {
         margin: 0;
         margin-bottom: 16px;
      }
   }

   &__result {
      font-size: 12px;
      background: #f5f5f5;
      color: #323232;
      padding: 10px;
      border-radius: 6px;
      overflow-y: auto;
      max-height: 50vh;
      white-space: pre-wrap;
      word-wrap: break-word;


   }

   &__close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: transparent;
      border: none;
      cursor: pointer;
      color: #333;
      transition: color 0.2s;

      svg {
         width: 24px;
         height: 24px;
      }

      &:hover {
         color: #3366ff;
      }
   }
}
</style>
