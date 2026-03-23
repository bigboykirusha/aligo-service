<template>
   <div class="characteristics__title">Дополнительные опции</div>
   <div class="characteristics">
      <div class="characteristics__content">
         <SelectSkeleton v-if="loading" layout="column" />
         <SelectUI
v-else layout="column" input-width="310px" label="Усилитель руля" :initial-selected-option="createStore.power_steering_id"
            :options="PowerSteeringOptions" placeholder="Нажмите для выбора" @update-sort="
               (value) => handleFieldUpdate('power_steering_id', value)
            " />
         <div class="checkbox-section">
            <div class="checkbox-section__title">Управление климатом</div>
            <div class="checkbox-section__items">
               <SelectSkeleton v-if="loading" layout="column" />
               <SelectUI
v-else layout="column" input-width="310px" :initial-selected-option="createStore.climate_management_id" :options="ClimateOptions"
                  placeholder="Нажмите для выбора" @update-sort="
                     (value) =>
                        handleFieldUpdate('climate_management_id', value)
                  " />
               <SimpleCheckboxTemplate
label="Управление на руле" :checked="createStore.is_wheel_control"
                  @update-checked="
                     (value) => handleFieldUpdate('is_wheel_control', value)
                  " />
               <SimpleCheckboxTemplate
label="Атермальное остекление" :checked="createStore.is_athermal_glazing"
                  @update-checked="
                     (value) => handleFieldUpdate('is_athermal_glazing', value)
                  " />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Салон</div>
            <div class="checkbox-section__items">
               <SelectSkeleton v-if="loading" layout="column" />
               <SelectUI
v-else layout="column" input-width="310px" :initial-selected-option="createStore.salon_id" :options="SalonOptions"
                  placeholder="Нажмите для выбора" @update-sort="(value) => handleFieldUpdate('salon_id', value)" />
               <SimpleCheckboxTemplate
label="Кожаный руль" :checked="createStore.is_leather_wheel" @update-checked="
                  (value) => handleFieldUpdate('is_leather_wheel', value)
               " />
               <SimpleCheckboxTemplate
label="Люк" :checked="createStore.is_hatch" @update-checked="
                  (value) => handleFieldUpdate('is_hatch', value)
               " />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Обогрев</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate
label="Передних сидений" :checked="createStore.is_front_seats" @update-checked="
                  (value) => handleFieldUpdate('is_front_seats', value)
               " />
               <SimpleCheckboxTemplate
label="Задних сидений" :checked="createStore.is_rear_seats" @update-checked="
                  (value) => handleFieldUpdate('is_rear_seats', value)
               " />
               <SimpleCheckboxTemplate
label="Зеркал" :checked="createStore.is_mirrors" @update-checked="
                  (value) => handleFieldUpdate('is_mirrors', value)
               " />
               <SimpleCheckboxTemplate
label="Заднего стекла" :checked="createStore.is_rear_window" @update-checked="
                  (value) => handleFieldUpdate('is_rear_window', value)
               " />
               <SimpleCheckboxTemplate
label="Руля" :checked="createStore.is_steering_wheel" @update-checked="
                  (value) => handleFieldUpdate('is_steering_wheel', value)
               " />
            </div>
         </div>
         <SelectSkeleton v-if="loading" layout="column" />
         <SelectUI
v-else layout="column" input-width="310px" label="Электростеклоподъемники" :initial-selected-option="createStore.electric_windows_id"
            :options="ElectricWindowOptions" placeholder="Нажмите для выбора"
            @update-sort="(value) => handleFieldUpdate('electric_windows_id', value)" />
         <div class="checkbox-section">
            <div class="checkbox-section__title">Электропривод</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate
label="Передних сидений" :checked="createStore.is_front_seats_drives"
                  @update-checked="
                     (value) =>
                        handleFieldUpdate('is_front_seats_drives', value)
                  " />
               <SimpleCheckboxTemplate
label="Задних сидений" :checked="createStore.is_rear_seats_drives"
                  @update-checked="
                     (value) => handleFieldUpdate('is_rear_seats_drives', value)
                  " />
               <SimpleCheckboxTemplate
label="Зеркал" :checked="createStore.is_mirrors_drives" @update-checked="
                  (value) => handleFieldUpdate('is_mirrors_drives', value)
               " />
               <SimpleCheckboxTemplate
label="Рулевой колонки" :checked="createStore.is_steering_column_drives"
                  @update-checked="
                     (value) =>
                        handleFieldUpdate('is_steering_column_drives', value)
                  " />
               <SimpleCheckboxTemplate
label="Складывающихся зеркал" :checked="createStore.is_folding_mirrors_drives"
                  @update-checked="
                     (value) =>
                        handleFieldUpdate('is_folding_mirrors_drives', value)
                  " />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Память настроек</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate
label="Передних сидений" :checked="createStore.is_front_seats_setting"
                  @update-checked="
                     (value) =>
                        handleFieldUpdate('is_front_seats_setting', value)
                  " />
               <SimpleCheckboxTemplate
label="Задних сидений" :checked="createStore.is_rear_seats_setting"
                  @update-checked="
                     (value) =>
                        handleFieldUpdate('is_rear_seats_setting', value)
                  " />
               <SimpleCheckboxTemplate
label="Зеркал" :checked="createStore.is_mirrors_setting" @update-checked="
                  (value) => handleFieldUpdate('is_mirrors_setting', value)
               " />
               <SimpleCheckboxTemplate
label="Рулевой колонки" :checked="createStore.is_steering_column_setting"
                  @update-checked="
                     (value) =>
                        handleFieldUpdate('is_steering_column_setting', value)
                  " />
            </div>
         </div>
      </div>
      <div class="characteristics__content">
         <div class="checkbox-section">
            <div class="checkbox-section__title">Помощь при вождении</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate
label="Система контроля слепых зон"
                  :checked="createStore.is_blind_spot_monitoring" @update-checked="
                     (value) =>
                        handleFieldUpdate('is_blind_spot_monitoring', value)
                  " />
               <SimpleCheckboxTemplate
label="Автоматический парковщик" :checked="createStore.is_automatic_parking"
                  @update-checked="
                     (value) => handleFieldUpdate('is_automatic_parking', value)
                  " />
               <SimpleCheckboxTemplate
label="Датчик дождя" :checked="createStore.is_rain_sensor" @update-checked="
                  (value) => handleFieldUpdate('is_rain_sensor', value)
               " />
               <SimpleCheckboxTemplate
label="Датчик света" :checked="createStore.is_light_sensor" @update-checked="
                  (value) => handleFieldUpdate('is_light_sensor', value)
               " />
               <SimpleCheckboxTemplate
label="Задний парктроник" :checked="createStore.is_rear_parking_sensor"
                  @update-checked="
                     (value) =>
                        handleFieldUpdate('is_rear_parking_sensor', value)
                  " />
               <SimpleCheckboxTemplate
label="Передний парктроник" :checked="createStore.is_front_parking_sensor"
                  @update-checked="
                     (value) =>
                        handleFieldUpdate('is_front_parking_sensor', value)
                  " />
               <SimpleCheckboxTemplate
label="Камера заднего вида" :checked="createStore.is_rear_view_camera"
                  @update-checked="
                     (value) => handleFieldUpdate('is_rear_view_camera', value)
                  " />
               <SimpleCheckboxTemplate
label="Круиз-контроль" :checked="createStore.is_cruise_control" @update-checked="
                  (value) => handleFieldUpdate('is_cruise_control', value)
               " />
               <SimpleCheckboxTemplate
label="Бортовой компьютер" :checked="createStore.is_onboard_computer"
                  @update-checked="
                     (value) => handleFieldUpdate('is_onboard_computer', value)
                  " />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Противоугонная система</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate
label="Сигнализация" :checked="createStore.is_alarm_system" @update-checked="
                  (value) => handleFieldUpdate('is_alarm_system', value)
               " />
               <SimpleCheckboxTemplate
label="Центральный замок" :checked="createStore.is_central_lock" @update-checked="
                  (value) => handleFieldUpdate('is_central_lock', value)
               " />
               <SimpleCheckboxTemplate
label="Иммобилайзер" :checked="createStore.is_immobilizer" @update-checked="
                  (value) => handleFieldUpdate('is_immobilizer', value)
               " />
               <SimpleCheckboxTemplate
label="Спутник" :checked="createStore.is_satellite" @update-checked="
                  (value) => handleFieldUpdate('is_satellite', value)
               " />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Подушки безопасности</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate
label="Фронтальные" :checked="createStore.is_frontal_airbags" @update-checked="
                  (value) => handleFieldUpdate('is_frontal_airbags', value)
               " />
               <SimpleCheckboxTemplate
label="Коленные" :checked="createStore.is_knee_high_airbags" @update-checked="
                  (value) => handleFieldUpdate('is_knee_high_airbags', value)
               " />
               <SimpleCheckboxTemplate
label="Шторки" :checked="createStore.is_curtains_airbags" @update-checked="
                  (value) => handleFieldUpdate('is_curtains_airbags', value)
               " />
               <SimpleCheckboxTemplate
label="Боковые (перед)" :checked="createStore.is_side_front_airbags"
                  @update-checked="
                     (value) =>
                        handleFieldUpdate('is_side_front_airbags', value)
                  " />
               <SimpleCheckboxTemplate
label="Боковые (зад)" :checked="createStore.is_side_rear_airbags"
                  @update-checked="
                     (value) => handleFieldUpdate('is_side_rear_airbags', value)
                  " />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Активная безопасность</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate
label="Антиблокировка тормозов" :checked="createStore.is_anti_lock_brakes"
                  @update-checked="
                     (value) => handleFieldUpdate('is_anti_lock_brakes', value)
                  " />
               <SimpleCheckboxTemplate
label="Антипробуксовка" :checked="createStore.is_anti_slip" @update-checked="
                  (value) => handleFieldUpdate('is_anti_slip', value)
               " />
               <SimpleCheckboxTemplate
label="Курсовая устойчивость" :checked="createStore.is_exchange_rate_stability"
                  @update-checked="
                     (value) =>
                        handleFieldUpdate('is_exchange_rate_stability', value)
                  " />
               <SimpleCheckboxTemplate
label="Распред. тормозных усилий"
                  :checked="createStore.is_distrib_braking_forces" @update-checked="
                     (value) =>
                        handleFieldUpdate('is_distrib_braking_forces', value)
                  " />
               <SimpleCheckboxTemplate
label="Экстренное торможение" :checked="createStore.is_emergency_braking"
                  @update-checked="
                     (value) => handleFieldUpdate('is_emergency_braking', value)
                  " />
               <SimpleCheckboxTemplate
label="Блок. дифференциала" :checked="createStore.is_differential_block"
                  @update-checked="
                     (value) =>
                        handleFieldUpdate('is_differential_block', value)
                  " />
               <SimpleCheckboxTemplate
label="Обнаружение пешеходов" :checked="createStore.is_pedestrian_detection"
                  @update-checked="
                     (value) =>
                        handleFieldUpdate('is_pedestrian_detection', value)
                  " />
            </div>
         </div>
      </div>
      <div class="characteristics__content">
         <div class="checkbox-section">
            <div class="checkbox-section__title">Шины и диски</div>
            <div class="checkbox-section__items">
               <SelectSkeleton v-if="loading" layout="column" />
               <SelectUI
v-else layout="column" input-width="310px" :initial-selected-option="createStore.tires_wheels_id" :is-revers="true"
                  :options="WheelsOptions" placeholder="Нажмите для выбора" @update-sort="
                     (value) => handleFieldUpdate('tires_wheels_id', value)
                  " />
               <SimpleCheckboxTemplate
label="Зимний комплект" :checked="createStore.is_winter_included"
                  @update-checked="
                     (value) => handleFieldUpdate('is_winter_included', value)
                  " />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Аудиосистема</div>
            <div class="checkbox-section__items">
               <SelectSkeleton v-if="loading" layout="column" />
               <SelectUI
v-else layout="column" input-width="310px" :initial-selected-option="createStore.audio_systems_id" :options="AudioSystemOptions"
                  placeholder="Нажмите для выбора" @update-sort="
                     (value) => handleFieldUpdate('audio_systems_id', value)
                  " />
               <SimpleCheckboxTemplate
label="Сабвуфер" :checked="createStore.is_subwoofer" @update-checked="
                  (value) => handleFieldUpdate('is_subwoofer', value)
               " />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Фары</div>
            <div class="checkbox-section__items">
               <SelectSkeleton v-if="loading" layout="column" />
               <SelectUI
v-else layout="column" input-width="310px" :initial-selected-option="createStore.headlight_id" :options="HeadlightOptions"
                  placeholder="Нажмите для выбора" @update-sort="
                     (value) => handleFieldUpdate('headlight_id', value)
                  " />
               <SimpleCheckboxTemplate
label="Омыватели фар" :checked="createStore.is_washers" @update-checked="
                  (value) => handleFieldUpdate('is_washers', value)
               " />
               <SimpleCheckboxTemplate
label="Адаптивное освещение" :checked="createStore.is_adaptive_lighting"
                  @update-checked="
                     (value) => handleFieldUpdate('is_adaptive_lighting', value)
                  " />
               <SimpleCheckboxTemplate
label="Противотуманные фары" :checked="createStore.is_antifog" @update-checked="
                  (value) => handleFieldUpdate('is_antifog', value)
               " />
            </div>
         </div>
         <div class="checkbox-section">
            <div class="checkbox-section__title">Мультимедиа и навигация</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate
label="CD/DVD/Bluray" :checked="createStore.is_CD_DVD_Bluray" @update-checked="
                  (value) => handleFieldUpdate('is_CD_DVD_Bluray', value)
               " />
               <SimpleCheckboxTemplate
label="AUX" :checked="createStore.is_AUX" @update-checked="
                  (value) => handleFieldUpdate('is_AUX', value)
               " />
               <SimpleCheckboxTemplate
label="MP3" :checked="createStore.is_MP3" @update-checked="
                  (value) => handleFieldUpdate('is_MP3', value)
               " />
               <SimpleCheckboxTemplate
label="Управление на руле" :checked="createStore.is_steering_wheel_control"
                  @update-checked="
                     (value) =>
                        handleFieldUpdate('is_steering_wheel_control', value)
                  " />
               <SimpleCheckboxTemplate
label="Bluetooth" :checked="createStore.is_Bluetooth" @update-checked="
                  (value) => handleFieldUpdate('is_Bluetooth', value)
               " />
               <SimpleCheckboxTemplate
label="Радио" :checked="createStore.is_Radio" @update-checked="
                  (value) => handleFieldUpdate('is_Radio', value)
               " />
               <SimpleCheckboxTemplate
label="TV" :checked="createStore.is_TV"
                  @update-checked="(value) => handleFieldUpdate('is_TV', value)" />
               <SimpleCheckboxTemplate
label="Видео" :checked="createStore.is_Video" @update-checked="
                  (value) => handleFieldUpdate('is_Video', value)
               " />
               <SimpleCheckboxTemplate
label="USB" :checked="createStore.is_USB" @update-checked="
                  (value) => handleFieldUpdate('is_USB', value)
               " />
               <SimpleCheckboxTemplate
label="GPS навигатор" :checked="createStore.is_GPS_navigator" @update-checked="
                  (value) => handleFieldUpdate('is_GPS_navigator', value)
               " />
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import SelectSkeleton from '@/components/SelectSkeleton.vue'
import SelectUI from '@/components/ui/SelectUI.vue'
import { useCreateAutosOptionsModel } from '@/composables/create/useCreateAutosOptionsModel'

defineOptions({ name: 'CreateAutosOptionsForm' })

const {
   loading,
   createStore,
   powerSteeringOptions: PowerSteeringOptions,
   salonOptions: SalonOptions,
   electricWindowOptions: ElectricWindowOptions,
   audioSystemOptions: AudioSystemOptions,
   wheelsOptions: WheelsOptions,
   headlightOptions: HeadlightOptions,
   climateOptions: ClimateOptions,
   updateField: handleFieldUpdate
} = useCreateAutosOptionsModel()
</script>

<style lang="scss" scoped>
.characteristics {
   display: flex;
   flex-direction: row;
   gap: 40px;

   @media (max-width: 1200px) {
      flex-wrap: wrap;
      gap: 24px;
   }

   @media (max-width: 768px) {
      flex-direction: column;
      gap: 24px;

      &__title {
         width: 100%;
      }
   }

   &__content {
      display: flex;
      flex-direction: column;
      gap: 24px;
      flex: 1;

      @media (max-width: 768px) {
         gap: 16px;
      }
   }
}

.characteristics__title {
   flex-basis: 220px;
   flex-shrink: 0;
   font-size: 14px;
   font-weight: 700;
   margin-bottom: 24px;
   color: #323232;
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

      @media (max-width: 768px) {
         width: 100%;
      }
   }

   &__title {
      font-size: 12px;
      color: #323232;
   }
}

:deep(.select-field--no-label) {
   width: 310px;
   max-width: 310px;
}

:deep(.select-field--no-label .select-field__control) {
   width: 100%;
   max-width: 100%;
}

@media (max-width: 768px) {
   :deep(.select-field--no-label) {
      width: 100%;
      max-width: 100%;
   }
}
</style>

