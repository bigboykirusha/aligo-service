<template>
   <BaseModal :model-value="isLocationModalOpen" size="xl" :show-close="true" :body-scrollable="false"
      :footer-align="'end'" :footer-direction="'row'" :footer-minimized="true" :full-screen="isMobileViewport"
      :full-height-body="true" :teleport-to-body="true" @update:model-value="closeModal">
      <template #header>
         <div class="location-header">
            <button v-if="selectedRegion" class="back-button" @click="onBackClick">
               <img :src="backIcon" alt="back arrow">
            </button>
            <h2 class="location-title">
               {{
                  selectedRegion
                     ? `${selectedRegion.title}, РФ`
                     : modalTitle
               }}
            </h2>
         </div>
      </template>
      <form class="modal-location" @submit.prevent="saveCity">
         <div class="modal-body">
            <div class="input-wrapper">
               <div class="input-text">
                  <img class="input-text__icon" src="~/assets/icons/ru.svg" alt="flag">
                  <input ref="searchInput" v-model="searchQuery" type="text" placeholder="Поиск города"
                     class="input-text__input">
                  <button v-if="searchQuery" type="button" class="input-text__clear" @click="clearSearch">
                     <img :src="closeIcon" alt="clear search">
                  </button>
               </div>
            </div>

            <div class="list-wrapper">
               <!-- Loader -->
               <div v-if="showLoader" class="loader-container">
                  <Loader />
               </div>

               <!-- Regions or Cities List -->
               <template v-else>
                  <!-- Regions -->
                  <ul v-if="!selectedRegion && !searchQuery" class="list">
                     <template v-for="group in groupedRegions" :key="group.letter">
                        <li class="list__letter">{{ group.letter }}</li>
                        <li v-for="region in group.items" :key="region.id" class="list__item list__item--region"
                           @click="fetchCitiesForRegion(region)">
                           {{ region.title }}
                        </li>
                     </template>
                  </ul>
                  <!-- Cities -->
                  <TransitionGroup v-else name="list" tag="ul" class="list">
                     <li v-for="city in displayedCities" :key="city.id" :class="[
                        'list__item',
                        { selected: city.id === selectedCity.id }
                     ]" :title="`${city.title}, РФ`" @click="selectCity(city)">
                        {{ `${city.title}` }}
                     </li>
                     <li v-if="displayedCities.length === 0 && !showLoader" key="no-results" class="list__empty">
                        Ничего не найдено
                     </li>
                  </TransitionGroup>
               </template>
            </div>
         </div>


      </form>
      <template #footer>
         <UIButton type="button" variant="primary" :disabled="!selectedCity?.id" @click="saveCity">
            {{ confirmButtonText }}
         </UIButton>
      </template>
   </BaseModal>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useModalStore } from '~/store/modalStore';
import { useCityStore } from '~/store/city';
import { updateUserInfo } from '~/services/apiClient';
import { useLocation } from '~/composables/useLocation';
import closeIcon from '~/assets/icons/close.svg';
import backIcon from '~/assets/icons/back-wide.svg';
import BaseModal from './BaseModal.vue'
import UIButton from '~/components/ui/UIButton.vue'
import Loader from '~/components/ui/LoaderUI.vue'

const cityStore = useCityStore();
const modalStore = useModalStore();
const searchInput = ref(null);
const isSearching = ref(false);

const {
   regions,
   selectedRegion,
   isLoading,
   searchQuery,
   fetchRegions,
   fetchCitiesForRegion,
   debouncedSearch,
   clearRegionSelection,
   displayedCities,
} = useLocation();

const selectedCity = ref({ name: '', id: null, translit: null });
const isLocationModalOpen = computed(() => modalStore.isVisible('location'));
const modalPayload = computed(() => modalStore.payload('location'));
const showLoader = computed(() => isLoading.value || isSearching.value);
const isMobileViewport = ref(false)
const modalTitle = computed(
   () => modalPayload.value?.title || 'Выберите город'
)
const confirmButtonText = computed(
   () => modalPayload.value?.confirmText || 'Сохранить'
)
const groupedRegions = computed(() => {
   const items = Array.isArray(regions.value) ? regions.value : [];
   const groups = new Map();

   items.forEach((region) => {
      const title = typeof region?.title === 'string' ? region.title.trim() : '';
      if (!title) return;
      const letter = title.slice(0, 1).toLocaleUpperCase('ru-RU');
      if (!groups.has(letter)) {
         groups.set(letter, []);
      }
      groups.get(letter).push(region);
   });

   return Array.from(groups.entries()).map(([letter, items]) => ({
      letter,
      items,
   }));
});

const updateIsMobileViewport = () => {
   if (!import.meta.client) return
   isMobileViewport.value = window.innerWidth <= 768
}

const resetSelectedCity = () => {
   selectedCity.value = { name: '', id: null, translit: null };
}

onMounted(() => {
   updateIsMobileViewport()
   window.addEventListener('resize', updateIsMobileViewport, { passive: true })
   fetchRegions();
});

onUnmounted(() => {
   window.removeEventListener('resize', updateIsMobileViewport)
})

watch(isLocationModalOpen, (isOpen) => {
   if (isOpen) {
      nextTick(() => {
         searchInput.value?.focus();
      });
   }
});

watch(searchQuery, (newQuery) => {
   resetSelectedCity();

   if (newQuery && newQuery.trim() !== '') {
      isSearching.value = true;
      debouncedSearch(newQuery);
   } else {
      isSearching.value = false;
      debouncedSearch('');
   }
});

// Синхронизация статуса загрузки
watch(isLoading, (loading) => {
   if (!loading) {
      isSearching.value = false;
   }
});

const selectCity = (city) => {
   selectedCity.value = {
      name: city.title,
      id: city.id,
      translit: city.translit,
   };
};

const clearSearch = () => {
   searchQuery.value = '';
   resetSelectedCity();
}

const saveCity = async () => {
   if (!selectedCity.value?.id) return;

   const normalizedCity = {
      name: selectedCity.value.name,
      title: selectedCity.value.name,
      id: selectedCity.value.id,
      translit: selectedCity.value.translit,
   };
   const shouldPersistCity = modalPayload.value?.persistSelection !== false;

   if (typeof modalPayload.value?.onSelect === 'function') {
      modalPayload.value.onSelect(normalizedCity);
   }

   try {
      if (shouldPersistCity) {
         cityStore.setSelectedCity(normalizedCity);
         const formData = new FormData();
         formData.append('city_id', normalizedCity.id);
         await updateUserInfo(formData);
      }
   } finally {
      closeModal();
   }
};

const closeModal = () => {
   clearSearch();
   if (selectedRegion.value) {
      clearRegionSelection();
   }
   modalStore.close('location');
   modalStore.setPayload('location', {});
};

const onBackClick = () => {
   clearRegionSelection();
   resetSelectedCity();
};
</script>

<style scoped lang="scss">
.modal-location {
   padding: 24px 0px;
   display: flex;
   flex-direction: column;
   min-height: 0;
   height: min(72vh, 620px);

   @media (max-width: 768px) {
      height: 100%;
      min-height: 0;
      padding: 16px 0 0;
   }

   .modal-body {
      display: flex;
      flex-direction: column;
      min-height: 0;
      height: 100%;
      overflow: hidden;

      .input-wrapper {
         margin-bottom: 16px;

         .input-text {
            position: relative;
            display: flex;
            align-items: center;
            background: var(--popup-color-surface, #fff);
            border-radius: var(--popup-radius, 6px);
            border: 1px solid var(--popup-color-border, #D6D6D6);
            padding: 0 16px;
            padding-right: 8px;
            height: 34px;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;

            &:focus-within {
               border-color: var(--popup-color-primary, #3366FF);
            }

            &__icon {
               width: 14px;
               height: 14px;
               margin-right: 12px;
            }

            &__input {
               flex: 1;
               background: none;
               border: none !important;
               box-shadow: none !important;
               font-size: 14px;
               line-height: 18px;
               color: var(--popup-color-text, #323232);
               outline: none;
               padding: 0;

               &::placeholder {
                  color: var(--popup-color-text-muted, #787878);
               }

               &:focus {
                  border: none !important;
                  box-shadow: none !important;
               }
            }

            &__clear {
               background: none;
               border: none;
               cursor: pointer;
               padding: 0;
               display: flex;
               align-items: center;

               img {
                  width: 12px;
                  height: 12px;
                  opacity: 1;
                  filter: grayscale(100%);
                  transition: filter 0.2s ease;
               }

               &:hover img {
                  filter: none;
               }
            }
         }
      }

      .list-wrapper {
         flex: 1 1 auto;
         min-height: min(220px, 40dvh);
         max-height: none;
         overflow-y: auto;
         -webkit-overflow-scrolling: touch;
         position: relative; // Для позиционирования лоудера

         @media (max-width: 768px) {
            min-height: 0;
         }

         .loader-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            min-height: 200px;
         }

         .list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: grid;
            grid-template-columns: 1fr;
            gap: 0;

            @media (min-width: 1024px) {
               grid-template-columns: 1fr 1fr;
               gap: 8px 16px;
            }

            &__item {
               padding: 8px;
               border-radius: var(--popup-radius, 6px);
               cursor: pointer;
               transition: background-color 0.2s;
               font-size: 14px;
               line-height: 18px;
               color: var(--popup-color-text, #323232);
               break-inside: avoid;

               &:hover {
                  background-color: var(--popup-color-surface-soft, #d6efff);

                  @media (max-width: 768px) {
                     background-color: transparent;
                  }
               }

               &.selected {
                  background-color: #d6efff;
                  color: var(--popup-color-primary, #3366ff);
                  font-weight: 700;

                  @media (max-width: 768px) {
                     background-color: transparent;
                  }
               }

               @media (max-width: 768px) {
                  padding: 12px 0;
               }
            }

            &__letter {
               grid-column: 1 / -1;
               padding: 12px 8px 4px;
               font-size: 14px;
               line-height: 18px;
               font-weight: 700;
               color: var(--popup-color-text, #323232);

               @media (max-width: 768px) {
                  padding: 12px 0 4px;
               }
            }

            &__empty {
               padding: 12px;
               text-align: center;
               color: var(--popup-color-text-muted, #787878);
            }
         }
      }
   }
}

.location-header {
   display: flex;
   align-items: center;
   gap: 16px;
}

.location-title {
   font-size: 20px;
   line-height: 24px;
   font-weight: 700;
   margin: 0;
   color: var(--popup-color-primary, #3366FF);
   text-align: left;

   @media (max-width: 768px) {
      font-size: 16px;
      line-height: 20px;
   }
}

.back-button {
   background: none;
   width: 32px;
   height: 32px;
   border: none;
   border-radius: 50%;
   cursor: pointer;
   padding: 0;
   display: flex;
   align-items: center;
   justify-content: center;

   @media (max-width: 768px) {
      width: 14px;
      height: 14px;
      border-radius: 0;
   }

   img {
      height: 16px;

      @media (max-width: 768px) {
         height: 14px;
      }
   }

   &:hover {
      background-color: #d6efff;

      @media (max-width: 768px) {
         background-color: #fff;
      }
   }
}

.list-move,
.list-enter-active,
.list-leave-active {
   transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
   opacity: 0;
   transform: translateY(15px);
}

.list-leave-active {
   position: absolute;
}
</style>
