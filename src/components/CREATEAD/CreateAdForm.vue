<template>
   <div class="create-ad-form">
      <TabsCreateAd />
      <div class="create-ad-form__content">
         <div v-if="activeTab === 1">
            <CategorySection />
         </div>
         <div v-if="activeTab === 2">
            <CharacteristicsSection />
         </div>
         <div v-if="activeTab === 3">
            <OptionsSection />
         </div>
         <div v-if="activeTab === 4">
            <AdSection />
         </div>
      </div>

      <div v-if="tabsStore.activeTab !== 1" class="create-ad-form__actions">
         <div class="create-ad-form__overlay">
            <button :disabled="!isSaveandExitEnabled" class="create-ad-form__button create-ad-form__button--save"
               :class="{ 'disabled': props.isPublishing }" @click="saveAndExit">
               <span v-if="props.isSaving" class="spinner"></span>
               <span v-else>Сохранить и выйти</span>
            </button>

            <button v-if="activeTab === 4" class="create-ad-form__button create-ad-form__button--continue"
               :class="{ 'disabled': props.isSaving }" @click="publishAndExit" :disabled="!isPublishEnabled">
               <span v-if="props.isPublishing" class="spinner"></span>
               <span v-else>Опубликовать</span>
            </button>
            <button v-else class="create-ad-form__button create-ad-form__button--continue" @click="continueToNextTab">
               Продолжить
            </button>
            <div v-if="activeTab === 4" class="create-ad-form__text">
               Вы также соглашаетесь с <a :href="rulesLink" :download="rulesTitle">{{ rulesTitle }}</a> и публикуете
               информацию,
               которую увидят другие люди
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed, onMounted, defineEmits, defineProps } from 'vue';
import { useCreateStore } from '@/store/create';
import { useTabsStore } from '@/store/tabsStore';
import { useUserStore } from '@/store/user';
import { getSiteDocumentById } from '@/services/apiClient';
import { usePopupErrorStore } from '@/store/popupErrorStore';
import AdSection from './AdSection.vue';
import OptionsSection from './OptionsSection.vue';
import CharacteristicsSection from './CharacteristicsSection.vue';
import TabsCreateAd from './TabsCreateAd.vue';
import CategorySection from './CategorySection.vue';

const createStore = useCreateStore();
const tabsStore = useTabsStore();
const userStore = useUserStore();
const popupErrorStore = usePopupErrorStore();

const showCodeModal = ref(false);
const rulesLink = ref('');
const rulesTitle = ref('');

const props = defineProps({
   isPublishing: {
      type: Boolean,
      default: false
   },
   isSaving: {
      type: Boolean,
      default: false
   }
});

const emit = defineEmits(['sendAd', 'saveAd']);

const isConfirmed = computed(() => {
   return !userStore.unconfirmed_email && !!userStore.email;
});

const activeTab = computed(() => tabsStore.activeTab);

const loadRulesDocument = async () => {
   try {
      const { data } = await getSiteDocumentById(2);
      if (data) {
         rulesLink.value = `https://api.aligo.ru/${data.path}`;
         rulesTitle.value = data.title;
      }
   } catch (error) {
      console.error('Ошибка при загрузке документа с правилами:', error);
   }
};

const saveAndExit = () => {
   if (!props.isPublishing && !props.isSaving) {
      emit('saveAd');
   }
};

const publishAndExit = async () => {
   if (!props.isPublishing && !props.isSaving) {

      if (!userStore.username && createStore.username) {
         await userStore.updateProfile({ username: createStore.username });
      }

      if (!userStore.address && createStore.place_inspection) {
         await userStore.updateProfile({ address: createStore.place_inspection });
      }

      if (createStore.email) {
         if (!isConfirmed.value) {
            await userStore.updateProfile({ email: createStore.email });
            showCodeModal.value = true;
         } else {
            emit('sendAd');
         }
      } else {
         emit('sendAd');
      }
   }
};

const continueToNextTab = () => {
   if (isNextEnabled.value) {
      if (activeTab.value < 4 && activeTab.value !== 1) {
         tabsStore.setActiveTab(activeTab.value + 1);
      }
   } else {
      popupErrorStore.showError('Пожалуйста, заполните обязательные поля!');
   }
};

const isNextEnabled = computed(() => {
   if (activeTab.value === 2) {
      return createStore.isCharacteristicFieldsFilled;
   }
   if (activeTab.value === 1) {
      return false;
   }
   return true;
});

const isPublishEnabled = computed(() => {
   if (activeTab.value === 4) {
      return createStore.isAdFieldsFilled;
   }
   return true;
});

const isSaveandExitEnabled = computed(() => {
   return createStore.isAnyFieldFilled;
});

onMounted(() => {
   loadRulesDocument();
});
</script>


<style lang="scss" scoped>
.create-ad-form {
   display: flex;
   min-height: calc(100vh - 32px);
   flex-direction: column;
   border-radius: 6px;
   box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
   width: 100%;

   @media (max-width: 768px) {
      border-radius: 0;
      box-shadow: none;
      border: none;
   }

   &__content {
      margin: 16px 24px;
      height: 100%;
      margin-right: 0;

      @media (max-width: 768px) {
         margin: 0;
      }
   }

   &__overlay {
      margin: 0 16px;
      width: 100%;
      display: flex;
      gap: 24px;

      @media (max-width: 768px) {
         gap: 16px;
         margin: 0;
         flex-wrap: wrap;
         justify-content: center;
      }
   }

   &__actions {
      padding: 16px 0;
      display: flex;
      align-items: center;
      border-top: 1px solid #D6D6D6;
      justify-content: center;
      background-color: white;

      @media (max-width: 768px) {
         flex-direction: row;
         padding: 24px 16px 40px;
         box-shadow: none;
         padding: 16px;
         border: none;
         background-color: rgba(#EEF9FF, 0.3);
         border-radius: 24px 24px 0 0;
      }
   }

   &__text {
      color: #787878;
      font-size: 12px;
      line-height: 16px;
      max-width: 400px;

      @media (max-width: 768px) {
         max-width: 100%;
         text-align: center;
      }

      a {
         color: #3366FF;
         cursor: pointer;
         text-decoration: underline;
      }
   }

   &__button {
      padding: 9px 16px;
      height: 36px;
      width: calc(50% - 8px);
      white-space: nowrap;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;
      max-width: 200px;

      &--continue {
         background-color: #3366FF;
         color: #ffffff;
         transition: background-color 0.2s ease;

         &:hover {
            background-color: #144DF8;
         }

         &:disabled {
            background-color: #EEEEEE;
            color: #787878;
            cursor: not-allowed;
            box-shadow: none;
         }
      }

      &--save {
         background-color: #D6EFFF;
         color: #3366FF;
         transition: background-color 0.2s ease;

         &:hover {
            background-color: #A4DCFF;
         }

         &:disabled {
            background-color: #EEEEEE;
            color: #787878;
            cursor: not-allowed;
            box-shadow: none;
         }
      }

      &.disabled {
         background-color: #EEEEEE !important;
         color: #787878 !important;
         cursor: not-allowed;
         box-shadow: none;
      }
   }
}

.spinner {
   display: inline-block;
   width: 16px;
   height: 16px;
   border: 2px solid #fff;
   border-top: 2px solid #3366FF;
   border-radius: 50%;
   animation: spin 0.6s linear infinite;
}

@keyframes spin {
   from {
      transform: rotate(0deg);
   }

   to {
      transform: rotate(360deg);
   }
}
</style>
