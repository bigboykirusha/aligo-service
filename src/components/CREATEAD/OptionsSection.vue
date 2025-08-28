<template>
   <div class="characteristics">
      <div class="characteristics__content">
         <SelectSkeleton v-if="loading" />
         <SelectOptionsTemplate v-else label="Усилитель руля" :initialSelectedOption="createStore.power_steering_id"
            :options="PowerSteeringOptions" @updateSort="(value) => handleFieldUpdate('power_steering_id', value)"
            placeholder="Нажмите для выбора" />
         <div class="checkbox-section">
            <div class="checkbox-section__title">Управление климатом</div>
            <div class="checkbox-section__items">
               <SelectSkeleton v-if="loading" />
               <SelectOptionsTemplate v-else :initialSelectedOption="createStore.climate_management_id"
                  :options="ClimateOptions" @updateSort="(value) => handleFieldUpdate('climate_management_id', value)"
                  placeholder="Нажмите для выбора" />
               <SimpleCheckboxTemplate label="Управление на руле" :checked="createStore.is_wheel_control"
                  @updateChecked="(value) => handleFieldUpdate('is_wheel_control', value)" />
               <SimpleCheckboxTemplate label="Атермальное остекление" :checked="createStore.is_athermal_glazing"
                  @updateChecked="(value) => handleFieldUpdate('is_athermal_glazing', value)" />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Салон</div>
            <div class="checkbox-section__items">
               <SelectSkeleton v-if="loading" />
               <SelectOptionsTemplate v-else :activeIndexes="createStore.salon_id" :options="SalonOptions"
                  @updateSort="(value) => handleFieldUpdate('salon_id', value)" placeholder="Нажмите для выбора" />
               <SimpleCheckboxTemplate label="Кожаный руль" :checked="createStore.is_leather_wheel"
                  @updateChecked="(value) => handleFieldUpdate('is_leather_wheel', value)" />
               <SimpleCheckboxTemplate label="Люк" :checked="createStore.is_hatch"
                  @updateChecked="(value) => handleFieldUpdate('is_hatch', value)" />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Обогрев</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate label="Передних сидений" :checked="createStore.is_front_seats"
                  @updateChecked="(value) => handleFieldUpdate('is_front_seats', value)" />
               <SimpleCheckboxTemplate label="Задних сидений" :checked="createStore.is_rear_seats"
                  @updateChecked="(value) => handleFieldUpdate('is_rear_seats', value)" />
               <SimpleCheckboxTemplate label="Зеркал" :checked="createStore.is_mirrors"
                  @updateChecked="(value) => handleFieldUpdate('is_mirrors', value)" />
               <SimpleCheckboxTemplate label="Заднего стекла" :checked="createStore.is_rear_window"
                  @updateChecked="(value) => handleFieldUpdate('is_rear_window', value)" />
               <SimpleCheckboxTemplate label="Руля" :checked="createStore.is_steering_wheel"
                  @updateChecked="(value) => handleFieldUpdate('is_steering_wheel', value)" />
            </div>
         </div>
         <SelectSkeleton v-if="loading" />
         <SelectOptionsTemplate v-else label="Электростеклоподъемники"
            :initialSelectedOption="createStore.electric_windows_id" :options="ElectricWindowOptions"
            @updateSort="(value) => handleFieldUpdate('electric_windows_id', value)" placeholder="Нажмите для выбора" />
         <div class="checkbox-section">
            <div class="checkbox-section__title">Электропривод</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate label="Передних сидений" :checked="createStore.is_front_seats_drives"
                  @updateChecked="(value) => handleFieldUpdate('is_front_seats_drives', value)" />
               <SimpleCheckboxTemplate label="Задних сидений" :checked="createStore.is_rear_seats_drives"
                  @updateChecked="(value) => handleFieldUpdate('is_rear_seats_drives', value)" />
               <SimpleCheckboxTemplate label="Зеркал" :checked="createStore.is_mirrors_drives"
                  @updateChecked="(value) => handleFieldUpdate('is_mirrors_drives', value)" />
               <SimpleCheckboxTemplate label="Рулевой колонки" :checked="createStore.is_steering_column_drives"
                  @updateChecked="(value) => handleFieldUpdate('is_steering_column_drives', value)" />
               <SimpleCheckboxTemplate label="Складывающихся зеркал" :checked="createStore.is_folding_mirrors_drives"
                  @updateChecked="(value) => handleFieldUpdate('is_folding_mirrors_drives', value)" />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Память настроек</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate label="Передних сидений" :checked="createStore.is_front_seats_setting"
                  @updateChecked="(value) => handleFieldUpdate('is_front_seats_setting', value)" />
               <SimpleCheckboxTemplate label="Задних сидений" :checked="createStore.is_rear_seats_setting"
                  @updateChecked="(value) => handleFieldUpdate('is_rear_seats_setting', value)" />
               <SimpleCheckboxTemplate label="Зеркал" :checked="createStore.is_mirrors_setting"
                  @updateChecked="(value) => handleFieldUpdate('is_mirrors_setting', value)" />
               <SimpleCheckboxTemplate label="Рулевой колонки" :checked="createStore.is_steering_column_setting"
                  @updateChecked="(value) => handleFieldUpdate('is_steering_column_setting', value)" />
            </div>
         </div>
      </div>
      <div class="characteristics__content">
         <div class="checkbox-section">
            <div class="checkbox-section__title">Помощь при вождении</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate label="Система контроля слепых зон"
                  :checked="createStore.is_blind_spot_monitoring"
                  @updateChecked="(value) => handleFieldUpdate('is_blind_spot_monitoring', value)" />
               <SimpleCheckboxTemplate label="Автоматический парковщик" :checked="createStore.is_automatic_parking"
                  @updateChecked="(value) => handleFieldUpdate('is_automatic_parking', value)" />
               <SimpleCheckboxTemplate label="Датчик дождя" :checked="createStore.is_rain_sensor"
                  @updateChecked="(value) => handleFieldUpdate('is_rain_sensor', value)" />
               <SimpleCheckboxTemplate label="Датчик света" :checked="createStore.is_light_sensor"
                  @updateChecked="(value) => handleFieldUpdate('is_light_sensor', value)" />
               <SimpleCheckboxTemplate label="Задний парктроник" :checked="createStore.is_rear_parking_sensor"
                  @updateChecked="(value) => handleFieldUpdate('is_rear_parking_sensor', value)" />
               <SimpleCheckboxTemplate label="Передний парктроник" :checked="createStore.is_front_parking_sensor"
                  @updateChecked="(value) => handleFieldUpdate('is_front_parking_sensor', value)" />
               <SimpleCheckboxTemplate label="Камера заднего вида" :checked="createStore.is_rear_view_camera"
                  @updateChecked="(value) => handleFieldUpdate('is_rear_view_camera', value)" />
               <SimpleCheckboxTemplate label="Круиз-контроль" :checked="createStore.is_cruise_control"
                  @updateChecked="(value) => handleFieldUpdate('is_cruise_control', value)" />
               <SimpleCheckboxTemplate label="Бортовой компьютер" :checked="createStore.is_onboard_computer"
                  @updateChecked="(value) => handleFieldUpdate('is_onboard_computer', value)" />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Противоугонная система</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate label="Сигнализация" :checked="createStore.is_alarm_system"
                  @updateChecked="(value) => handleFieldUpdate('is_alarm_system', value)" />
               <SimpleCheckboxTemplate label="Центральный замок" :checked="createStore.is_central_lock"
                  @updateChecked="(value) => handleFieldUpdate('is_central_lock', value)" />
               <SimpleCheckboxTemplate label="Иммобилайзер" :checked="createStore.is_immobilizer"
                  @updateChecked="(value) => handleFieldUpdate('is_immobilizer', value)" />
               <SimpleCheckboxTemplate label="Спутник" :checked="createStore.is_satellite"
                  @updateChecked="(value) => handleFieldUpdate('is_satellite', value)" />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Подушки безопасности</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate label="Фронтальные" :checked="createStore.is_frontal_airbags"
                  @updateChecked="(value) => handleFieldUpdate('is_frontal_airbags', value)" />
               <SimpleCheckboxTemplate label="Коленные" :checked="createStore.is_knee_high_airbags"
                  @updateChecked="(value) => handleFieldUpdate('is_knee_high_airbags', value)" />
               <SimpleCheckboxTemplate label="Шторки" :checked="createStore.is_curtains_airbags"
                  @updateChecked="(value) => handleFieldUpdate('is_curtains_airbags', value)" />
               <SimpleCheckboxTemplate label="Боковые (перед)" :checked="createStore.is_side_front_airbags"
                  @updateChecked="(value) => handleFieldUpdate('is_side_front_airbags', value)" />
               <SimpleCheckboxTemplate label="Боковые (зад)" :checked="createStore.is_side_rear_airbags"
                  @updateChecked="(value) => handleFieldUpdate('is_side_rear_airbags', value)" />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Активная безопасность</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate label="Антиблокировка тормозов" :checked="createStore.is_anti_lock_brakes"
                  @updateChecked="(value) => handleFieldUpdate('is_anti_lock_brakes', value)" />
               <SimpleCheckboxTemplate label="Антипробуксовка" :checked="createStore.is_anti_slip"
                  @updateChecked="(value) => handleFieldUpdate('is_anti_slip', value)" />
               <SimpleCheckboxTemplate label="Курсовая устойчивость" :checked="createStore.is_exchange_rate_stability"
                  @updateChecked="(value) => handleFieldUpdate('is_exchange_rate_stability', value)" />
               <SimpleCheckboxTemplate label="Распред. тормозных усилий"
                  :checked="createStore.is_distrib_braking_forces"
                  @updateChecked="(value) => handleFieldUpdate('is_distrib_braking_forces', value)" />
               <SimpleCheckboxTemplate label="Экстренное торможение" :checked="createStore.is_emergency_braking"
                  @updateChecked="(value) => handleFieldUpdate('is_emergency_braking', value)" />
               <SimpleCheckboxTemplate label="Блок. дифференциала" :checked="createStore.is_differential_block"
                  @updateChecked="(value) => handleFieldUpdate('is_differential_block', value)" />
               <SimpleCheckboxTemplate label="Обнаружение пешеходов" :checked="createStore.is_pedestrian_detection"
                  @updateChecked="(value) => handleFieldUpdate('is_pedestrian_detection', value)" />
            </div>
         </div>
      </div>
      <div class="characteristics__content">
         <div class="checkbox-section">
            <div class="checkbox-section__title">Шины и диски</div>
            <div class="checkbox-section__items">
               <SelectSkeleton v-if="loading" />
               <SelectOptionsTemplate v-else :initialSelectedOption="createStore.tires_wheels_id" :isRevers="true"
                  :options="WheelsOptions" @updateSort="(value) => handleFieldUpdate('tires_wheels_id', value)"
                  placeholder="Нажмите для выбора" />
               <SimpleCheckboxTemplate label="Зимний комплект" :checked="createStore.is_winter_included"
                  @updateChecked="(value) => handleFieldUpdate('is_winter_included', value)" />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Аудиосистема</div>
            <div class="checkbox-section__items">
               <SelectSkeleton v-if="loading" />
               <SelectOptionsTemplate v-else :initialSelectedOption="createStore.audio_systems_id"
                  :options="AudioSystemOptions" @updateSort="(value) => handleFieldUpdate('audio_systems_id', value)"
                  placeholder="Нажмите для выбора" />
               <SimpleCheckboxTemplate label="Сабвуфер" :checked="createStore.is_subwoofer"
                  @updateChecked="(value) => handleFieldUpdate('is_subwoofer', value)" />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Фары</div>
            <div class="checkbox-section__items">
               <SelectSkeleton v-if="loading" />
               <SelectOptionsTemplate v-else :initialSelectedOption="createStore.headlight_id"
                  :options="HeadlightOptions" @updateSort="(value) => handleFieldUpdate('headlight_id', value)"
                  placeholder="Нажмите для выбора" />
               <SimpleCheckboxTemplate label="Омыватели фар" :checked="createStore.is_washers"
                  @updateChecked="(value) => handleFieldUpdate('is_washers', value)" />
               <SimpleCheckboxTemplate label="Адаптивное освещение" :checked="createStore.is_adaptive_lighting"
                  @updateChecked="(value) => handleFieldUpdate('is_adaptive_lighting', value)" />
               <SimpleCheckboxTemplate label="Противотуманные фары" :checked="createStore.is_antifog"
                  @updateChecked="(value) => handleFieldUpdate('is_antifog', value)" />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Мультимедиа и навигация</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate label="CD/DVD/Bluray" :checked="createStore.is_CD_DVD_Bluray"
                  @updateChecked="(value) => handleFieldUpdate('is_CD_DVD_Bluray', value)" />
               <SimpleCheckboxTemplate label="AUX" :checked="createStore.is_AUX"
                  @updateChecked="(value) => handleFieldUpdate('is_AUX', value)" />
               <SimpleCheckboxTemplate label="MP3" :checked="createStore.is_MP3"
                  @updateChecked="(value) => handleFieldUpdate('is_MP3', value)" />
               <SimpleCheckboxTemplate label="Управление на руле" :checked="createStore.is_steering_wheel_control"
                  @updateChecked="(value) => handleFieldUpdate('is_steering_wheel_control', value)" />
               <SimpleCheckboxTemplate label="Bluetooth" :checked="createStore.is_Bluetooth"
                  @updateChecked="(value) => handleFieldUpdate('is_Bluetooth', value)" />
               <SimpleCheckboxTemplate label="Радио" :checked="createStore.is_Radio"
                  @updateChecked="(value) => handleFieldUpdate('is_Radio', value)" />
               <SimpleCheckboxTemplate label="TV" :checked="createStore.is_TV"
                  @updateChecked="(value) => handleFieldUpdate('is_TV', value)" />
               <SimpleCheckboxTemplate label="Видео" :checked="createStore.is_Video"
                  @updateChecked="(value) => handleFieldUpdate('is_Video', value)" />
               <SimpleCheckboxTemplate label="USB" :checked="createStore.is_USB"
                  @updateChecked="(value) => handleFieldUpdate('is_USB', value)" />
               <SimpleCheckboxTemplate label="GPS навигатор" :checked="createStore.is_GPS_navigator"
                  @updateChecked="(value) => handleFieldUpdate('is_GPS_navigator', value)" />
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCreateStore } from '@/store/create';
import { getCarsPts, getCarsPowerSteering, getCarsSalon, getCarsElectricWindow, getCarsWheels, getCarsAudioSystem, getCarsClimate, getCarsHeadlight } from '@/services/apiClient';
import { fetchDataWithCache } from '@/services/createUtils';
import SimpleCheckboxTemplate from './SimpleCheckboxTemplate.vue';
import SelectSkeleton from './SelectSkeleton.vue';
import SelectOptionsTemplate from './SelectOptionsTemplate.vue';

const loading = ref(true);
const createStore = useCreateStore();
const PtsOptions = ref([]);
const PowerSteeringOptions = ref([]);
const SalonOptions = ref([]);
const ElectricWindowOptions = ref([]);
const AudioSystemOptions = ref([]);
const WheelsOptions = ref([]);
const HeadlightOptions = ref([]);
const ClimateOptions = ref([]);

const fetchOptions = async () => {
   try {
      await Promise.all([
         fetchPtsOptions(),
         fetchSalonOptions(),
         fetchPowerSteeringOptions(),
         fetchElectricWindowOptions(),
         fetchAudioSystemOptions(),
         fetchWheelsOptions(),
         fetchClimateOptions(),
         fetchHeadlightOptions(),
      ]);
      loading.value = false;
   } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
   }
};

const handleFieldUpdate = (field, value) => {
   createStore.setField(field, value);
};

const fetchPtsOptions = async () => {
   PtsOptions.value = await fetchDataWithCache('PtsOptions', getCarsPts);
};

const fetchPowerSteeringOptions = async () => {
   PowerSteeringOptions.value = await fetchDataWithCache('PowerSteeringOptions', getCarsPowerSteering);
};

const fetchSalonOptions = async () => {
   SalonOptions.value = await fetchDataWithCache('SalonOptions', getCarsSalon);
};

const fetchElectricWindowOptions = async () => {
   ElectricWindowOptions.value = await fetchDataWithCache('ElectricWindowOptions', getCarsElectricWindow);
};

const fetchWheelsOptions = async () => {
   WheelsOptions.value = await fetchDataWithCache('WheelsOptions', getCarsWheels);
};

const fetchAudioSystemOptions = async () => {
   AudioSystemOptions.value = await fetchDataWithCache('AudioSystemOptions', getCarsAudioSystem);
};

const fetchClimateOptions = async () => {
   ClimateOptions.value = await fetchDataWithCache('ClimateOptions', getCarsClimate);
};

const fetchHeadlightOptions = async () => {
   HeadlightOptions.value = await fetchDataWithCache('HeadlightOptions', getCarsHeadlight);
};

onMounted(() => {
   fetchOptions();
});
</script>

<style lang="scss" scoped>
.characteristics {
   display: flex;
   flex-direction: row;
   gap: 40px;

   @media (max-width: 1200px) {
      flex-wrap: wrap;
   }

   @media (max-width: 768px) {
      flex-direction: column;
      gap: 24px;
   }

   &__content {
      display: flex;
      flex-direction: column;
      gap: 24px;
      flex: 1;
   }
}

.checkbox-section {
   display: flex;
   flex-direction: column;
   align-items: flex-start;
   gap: 8px;

   &__items {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      gap: 16px;

      @media screen and (max-width: 768px) {
         width: 100%;
      }
   }

   &__title {
      font-size: 12px;
      color: #323232;
   }
}
</style>