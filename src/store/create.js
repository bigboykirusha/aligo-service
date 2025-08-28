import { defineStore } from 'pinia';
import { createCarAd, updateCarAd, getCarById, getUser } from '@/services/apiClient';
import { useUserStore } from './user';

const appendToFormData = (formData, field, value) => {
   if (Array.isArray(value)) {
      value.forEach(item => formData.append(`${field}[]`, item));
   } else {
      formData.append(field, value);
   }
};

export const useCreateStore = defineStore('create', {
   state: () => {
      return {
         id: null,
         id_user_owner_ads: null,
         create_by_user_id: null,
         is_draft: 1,
         is_published: 0,
         condition_id: null,

         // Характеристики
         photos: [],
         ids_delete_photos: [],
         color_ids: [],
         color_custom: null,

         // Регистрационные данные 
         country_id: null,
         vin: null,
         state_number: null, // с пробегом

         // Технические характеристики 
         brand_id: null,
         model_id: null,
         generation_id: null,
         equipment_id: null,
         year_id: null,
         car_body_type_id: null,
         count_doors: null,
         transmission_id: null,
         engine_type_id: null,
         drive_id: null,
         handlebar_id: null,

         // История эксплуатации и состояние 
         mileage: null,
         count_owners: null,
         state_id: null,
         pts_id: null,

         // TO Data
         is_service_book: null,
         is_serviced_dealer: null,
         is_under_warranty: null,

         // Опции 
         power_steering_id: null,
         salon_id: null,
         electric_windows_id: null,
         audio_systems_id: null,
         tires_wheels_id: null,
         climate_management_id: null,
         headlight_id: null,

         // Опции чекбоксы
         is_front_seats: null,
         is_rear_seats: null,
         is_mirrors: null,
         is_rear_window: null,
         is_steering_wheel: null,
         is_steering_wheel_control: null,
         is_front_seats_drives: null,
         is_rear_seats_drives: null,
         is_mirrors_drives: null,
         is_steering_column_drives: null,
         is_folding_mirrors_drives: null,
         is_front_seats_setting: null,
         is_rear_seats_setting: null,
         is_mirrors_setting: null,
         is_steering_column_setting: null,
         is_blind_spot_monitoring: null,
         is_automatic_parking: null,
         is_rain_sensor: null,
         is_light_sensor: null,
         is_rear_parking_sensor: null,
         is_front_parking_sensor: null,
         is_rear_view_camera: null,
         is_cruise_control: null,
         is_onboard_computer: null,
         is_alarm_system: null,
         is_central_lock: null,
         is_immobilizer: null,
         is_satellite: null,
         is_frontal_airbags: null,
         is_knee_high_airbags: null,
         is_curtains_airbags: null,
         is_side_front_airbags: null,
         is_side_rear_airbags: null,
         is_anti_lock_brakes: null,
         is_anti_slip: null,
         is_exchange_rate_stability: null,
         is_distrib_braking_forces: null,
         is_emergency_braking: null,
         is_differential_block: null,
         is_pedestrian_detection: null,
         is_CD_DVD_Bluray: null,
         is_AUX: null,
         is_MP3: null,
         is_Bluetooth: null,
         is_Radio: null,
         is_TV: null,
         is_Video: null,
         is_USB: null,
         is_GPS_navigator: null,
         is_subwoofer: null,
         is_antifog: null,
         is_washers: null,
         is_adaptive_lighting: null,
         is_athermal_glazing: null,
         is_leather_wheel: null,
         is_hatch: null,
         is_winter_included: null,
         is_wheel_control: null,

         // Объявление
         ads_description: null,
         place_inspection: null,
         amount: null,
         currency_id: 1,
         phone: null,
         email: null,
         city_id: null,
         city_name: null,
         latitude: null,
         longitude: null,
         communication_method_id: null,
         username: null,

         // Флаг для отслеживания инициализации данных пользователя
         isUserDataInitialized: false,
      };
   },
   getters: {
      isCharacteristicFieldsFilled: (state) => {
         const hasRegistrationField = !!(state.vin || state.state_number);

         return [
            state.photos,
            state.color_ids.length > 0,
            state.country_id,
            hasRegistrationField,
            ...(state.country_id !== 1 ? [state.state_number] : []),
            ...(state.condition_id == 2 ? [state.state_id] : []),
            state.brand_id,
            state.model_id,
            state.generation_id,
            state.equipment_id,
            state.year_id,
            state.count_doors,
            state.car_body_type_id,
            state.transmission_id,
            state.engine_type_id,
            state.handlebar_id,
            state.condition_id,
            state.drive_id,
            state.pts_id,
         ].every(field => field !== null && field !== "" && !(Array.isArray(field) && field.length === 0) && !(typeof field === 'object' && Object.keys(field).length === 0));
      },
      isAdFieldsFilled: (state) => {
         return [
            state.username,
            state.email,
            state.phone,
            state.ads_description,
            state.place_inspection,
            state.communication_method_id,
            state.city_id,
            state.amount
         ].every(field => field !== null);
      },
      isAnyFieldFilled: (state) => {
         return [
            state.photos.length > 0,
            state.color_ids.length > 0,
            state.country_id !== null,
            state.vin !== null,
            state.brand_id !== null,
            state.model_id !== null,
            state.year_id !== null,
            state.car_body_type_id !== null,
            state.count_doors !== null,
            state.transmission_id !== null,
            state.engine_type_id !== null,
            state.drive_id !== null,
            state.handlebar_id !== null,
            state.mileage !== null,
            state.count_owners !== null,
            state.state_id !== null,
            state.pts_id !== null,
         ].some(Boolean);
      }
   },
   actions: {
      async initializeUserData() {
         if (this.isUserDataInitialized) return;

         if (!this.create_by_user_id) {
            console.warn('⚠ create_by_user_id не задан — не можем инициализировать данные пользователя');
            return;
         }

         try {
            const userData = await getUser(this.create_by_user_id);

            if (!userData) {
               console.warn(`⚠ Пользователь с id=${this.create_by_user_id} не найден`);
               return;
            }

            // Заполняем данные
            this.username = userData.username || null;
            this.email = userData.unconfirmed_email || userData.email || null;
            this.phone = userData.phone || null;

            const fieldsToSave = {
               currency_id: this.currency_id,
            };

            if (userData.latitude && userData.longitude) {
               fieldsToSave.latitude = userData.latitude;
               fieldsToSave.longitude = userData.longitude;
            }

            if (userData.address) fieldsToSave.place_inspection = userData.address;
            if (userData.city_id) fieldsToSave.city_id = userData.city_id;
            if (userData.city_name) fieldsToSave.city_name = userData.city_name;

            for (const [field, value] of Object.entries(fieldsToSave)) {
               await this.setField(field, value);
            }

            this.isUserDataInitialized = true;
         } catch (error) {
            console.error('Ошибка при инициализации данных пользователя:', error);
         }
      },
      async updateConditionDependentFields() {
         if (this.condition_id === 2) {
            if (this.mileage !== null) {
               await this.setField('mileage', this.mileage);
            }
            if (this.count_owners !== null) {
               await this.setField('count_owners', this.count_owners);
            }
            if (this.state_id !== null) {
               await this.setField('state_id', this.state_id);
            }
         }
      },

      async setField(field, value) {
         if (value !== null && value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0)) {
            this[field] = value;
            if (field !== 'photos') {
               try {
                  const response = await this.autoSaveField(field, value);

                  if (field === 'condition_id' && value === 2) {
                     await this.updateConditionDependentFields();
                  }

                  return response;
               } catch (error) {
                  console.error(`Ошибка при авто-сохранении поля ${field}:`, error);
                  return { success: false, error };
               }
            }
         } else {
            console.log(`Поле ${field} не обновлено, так как значение пустое или некорректное.`);
         }
         return null;
      },

      setPhotos(photos) {
         this.photos = photos;
      },

      removePhoto(index) {
         this.photos.splice(index, 1);
      },

      setColorId(color_ids) {
         this.color_ids = color_ids;
      },

      setColorCustom(color_custom) {
         this.color_custom = color_custom;
      },

      async autoSaveField(field, value) {
         try {
            let formData = new FormData();

            if (field !== 'is_draft') {
               formData.append('is_draft', this.is_draft);
            }

            if (field === 'photos' && value instanceof File) {
               formData.append('photos[]', value);
            } else if (field === 'ids_delete_photos' && typeof value === 'number') {
               formData.append('ids_delete_photos[]', value);
            } else if (field === 'color_ids' && typeof value === 'number') {
               formData.append('color_ids[]', value);
            } else {
               appendToFormData(formData, field, value);
            }

            if (this.id) {
               formData.append('id', this.id);
               formData.append('is_cancelled', 0);
               return await this.updateCarAd(formData);
            } else {
               formData.append('create_by_user_id', this.create_by_user_id);
               const response = await this.sendCarAd(formData);
               this.id = response.id;
               this.id_user_owner_ads = response.id_user_owner_ads;
               this.initializeUserData();
               return response;
            }
         } catch (error) {
            console.error(`Ошибка автосохранения поля ${field}:`, error);
            throw error;
         }
      },

      async sendCarAd(formData) {
         try {
            const createdAd = await createCarAd(formData);
            return createdAd;
         } catch (error) {
            console.error('Ошибка при создании объявления', error);
         }
      },

      async updateCarAd(formData) {
         try {
            const updatedAd = await updateCarAd(this.id, formData);
            return updatedAd;
         } catch (error) {
            console.error('Ошибка при обновлении объявления', error);
         }
      },

      async setStoreFromApi(id) {
         const userStore = useUserStore();
         try {
            const carData = await getCarById(id);

            // Основные данные
            this.id = carData?.id;
            this.id_user_owner_ads = carData?.id_user_owner_ads;
            this.is_draft = carData?.is_draft;
            this.is_published = carData?.is_published;
            this.condition_id = carData?.condition?.id;

            // Характеристики
            this.photos = carData?.photos || [];
            this.color_ids = carData?.auto_appearances?.[0]?.color?.map(color => color.id) || [];
            this.color_custom = carData?.auto_appearances?.[0]?.color_custom || null;

            // Регистрационные данные
            this.country_id = carData?.auto_registration_data?.[0]?.country?.id || null;
            this.vin = carData?.auto_registration_data?.[0]?.vin || null;
            this.state_number = carData?.auto_registration_data?.[0]?.state_number || null;

            // Технические характеристики
            const techSpecs = carData?.auto_technical_specifications?.[0] || {};
            this.brand_id = techSpecs?.brand?.id || null;
            this.model_id = techSpecs?.model?.id || null;
            this.generation_id = techSpecs?.generation_standart?.id || null;
            this.equipment_id = techSpecs?.equipment_standart?.id || null;
            this.year_id = techSpecs?.year_release?.id || null;
            this.car_body_type_id = techSpecs?.car_body_type?.id || null;
            this.count_doors = techSpecs?.count_doors || null;
            this.transmission_id = techSpecs?.transmission?.id || null;
            this.engine_type_id = techSpecs?.engine_type?.id || null;
            this.drive_id = techSpecs?.drive?.id || null;
            this.handlebar_id = techSpecs?.handlebar?.id || null;

            // История эксплуатации и состояние
            const historyConditions = carData?.auto_history_conditions?.[0] || {};
            this.mileage = historyConditions?.mileage || null;
            this.count_owners = historyConditions?.count_owners?.id || null;
            this.state_id = historyConditions?.state?.id || null;
            this.pts_id = historyConditions?.pts?.id || null;

            // ТО данные
            const maintenanceData = carData?.maintenance_data?.[0] || {};
            this.is_service_book = maintenanceData?.is_service_book || 0;
            this.is_serviced_dealer = maintenanceData?.is_serviced_dealer || 0;
            this.is_under_warranty = maintenanceData?.is_under_warranty || 0;

            // Опции
            const climateOptions = carData.auto_additional_options_climate_management?.[0] || {};
            const salonOptions = carData.auto_additional_options_salon?.[0] || {};
            const headlightsOptions = carData.auto_additional_headlights?.[0] || {};
            const airbagsOptions = carData.auto_additional_options_airbag?.[0] || {};
            const heatingOptions = carData.auto_additional_options_heating?.[0] || {};
            const electricDriveOptions = carData.auto_additional_options_electric_drive?.[0] || {};
            const settingMemoryOptions = carData.auto_additional_options_setting_memory?.[0] || {};
            const anticreepingSystem = carData.auto_additional_options_anticreeping_system?.[0] || {};
            const audioSystem = carData.auto_additional_audio_system?.[0] || {};
            const activeSecurity = carData.auto_additional_active_security?.[0] || {};
            const drivingAssistanceOptions = carData.auto_additional_options_driving_assistance?.[0] || {};
            const mediaOptions = carData.auto_additional_multimedia_navigation?.[0] || {};
            const wheelsOptions = carData.auto_additional_tires_wheels?.[0] || {};

            // Опции
            this.power_steering_id = carData?.auto_additional_options?.[0]?.power_steering?.id || null;
            this.salon = salonOptions?.salon?.id || null;
            this.electric_window = carData?.auto_additional_options?.[0]?.electric_windows?.id || null;
            this.wheels = wheelsOptions?.tires_wheels?.[0]?.id || null;
            this.climate = climateOptions?.climate_management?.id || null;
            this.headlight = headlightsOptions?.headlight?.[0]?.id || null;

            // Опции чекбоксы
            this.is_front_seats = heatingOptions.is_front_seats;
            this.is_rear_seats = heatingOptions.is_rear_seats;
            this.is_mirrors = heatingOptions.is_mirrors;
            this.is_rear_window = heatingOptions.is_rear_window;
            this.is_steering_wheel = heatingOptions.is_steering_wheel;

            this.is_front_seats_drives = electricDriveOptions.is_front_seats_drives;
            this.is_rear_seats_drives = electricDriveOptions.is_rear_seats_drives;
            this.is_mirrors_drives = electricDriveOptions.is_mirrors_drives;
            this.is_steering_column_drives = electricDriveOptions.is_steering_column_drives;
            this.is_folding_mirrors_drives = electricDriveOptions.is_folding_mirrors_drives;

            this.is_front_seats_setting = settingMemoryOptions.is_front_seats_setting;
            this.is_rear_seats_setting = settingMemoryOptions.is_rear_seats_setting;
            this.is_mirrors_setting = settingMemoryOptions.is_mirrors_setting;
            this.is_steering_column_setting = settingMemoryOptions.is_steering_column_setting;

            this.is_blind_spot_monitoring = drivingAssistanceOptions.is_blind_spot_monitoring;
            this.is_automatic_parking = drivingAssistanceOptions.is_automatic_parking;
            this.is_rain_sensor = drivingAssistanceOptions.is_rain_sensor;
            this.is_light_sensor = drivingAssistanceOptions.is_light_sensor;
            this.is_rear_parking_sensor = drivingAssistanceOptions.is_rear_parking_sensor;
            this.is_front_parking_sensor = drivingAssistanceOptions.is_front_parking_sensor;
            this.is_rear_view_camera = drivingAssistanceOptions.is_rear_view_camera;
            this.is_cruise_control = drivingAssistanceOptions.is_cruise_control;
            this.is_onboard_computer = drivingAssistanceOptions.is_onboard_computer;

            this.is_alarm_system = anticreepingSystem.is_alarm_system;
            this.is_central_lock = anticreepingSystem.is_central_lock;
            this.is_immobilizer = anticreepingSystem.is_immobilizer;
            this.is_satellite = anticreepingSystem.is_satellite;

            this.is_frontal_airbags = airbagsOptions.is_frontal_airbags;
            this.is_knee_high_airbags = airbagsOptions.is_knee_high_airbags;
            this.is_curtains_airbags = airbagsOptions.is_curtains_airbags;
            this.is_side_front_airbags = airbagsOptions.is_side_front_airbags;
            this.is_side_rear_airbags = airbagsOptions.is_side_rear_airbags;

            this.is_anti_lock_brakes = activeSecurity.is_anti_lock_brakes;
            this.is_anti_slip = activeSecurity.is_anti_slip;
            this.is_exchange_rate_stability = activeSecurity.is_exchange_rate_stability;
            this.is_distrib_braking_forces = activeSecurity.is_distrib_braking_forces;
            this.is_emergency_braking = activeSecurity.is_emergency_braking;
            this.is_differential_block = activeSecurity.is_differential_block;
            this.is_pedestrian_detection = activeSecurity.is_pedestrian_detection;

            this.is_CD_DVD_Bluray = mediaOptions.is_CD_DVD_Bluray;
            this.is_AUX = mediaOptions.is_AUX;
            this.is_MP3 = mediaOptions.is_MP3;
            this.is_steering_wheel_control = mediaOptions.is_steering_wheel_control;
            this.is_Bluetooth = mediaOptions.is_Bluetooth;
            this.is_Radio = mediaOptions.is_Radio;
            this.is_TV = mediaOptions.is_TV;
            this.is_Video = mediaOptions.is_Video;
            this.is_USB = mediaOptions.is_USB;
            this.is_GPS_navigator = mediaOptions.is_GPS_navigator;
            this.is_subwoofer = audioSystem.is_subwoofer;

            this.is_antifog = headlightsOptions.is_antifog;
            this.is_washers = headlightsOptions.is_washers;
            this.is_adaptive_lighting = headlightsOptions.is_adaptive_lighting;

            this.is_athermal_glazing = climateOptions.is_athermal_glazing;
            this.is_leather_wheel = salonOptions.is_leather_wheel;
            this.is_hatch = salonOptions.is_hatch;
            this.is_wheel_control = climateOptions.is_wheel_control;
            this.is_winter_included = wheelsOptions.is_winter_included;

            // Объявление
            const adsParams = carData?.ads_parameter || {};
            this.ads_description = adsParams?.ads_description || null;
            this.place_inspection = adsParams?.place_inspection ?? null;
            this.amount = adsParams?.amount || null;
            this.city_name = adsParams?.city?.title || null;
            this.city_id = adsParams?.city?.id || null;
            this.latitude = adsParams?.latitude || null;
            this.longitude = adsParams?.longitude || null;
            this.communication_method_id = adsParams?.communication_method_id?.id || null;
            this.username = userStore.username || null;
            this.email = userStore.unconfirmed_email || userStore.email || null;
            this.phone = userStore.phoneNumber || null;
            this.isUserDataInitialized = true;

         } catch (error) {
            console.error('Ошибка при заполнении стора данными: ', error);
         }
      },
      resetParams() {
         Object.assign(this, {
            id: null,
            id_user_owner_ads: null,
            create_by_user_id: null,
            is_draft: 1,
            is_published: 0,
            condition_id: null,

            photos: [],
            ids_delete_photos: [],
            color_ids: [],
            color_custom: null,

            // Регистрационные данные
            country_id: null,
            vin: null,
            state_number: null,
            brand_id: null,
            model_id: null,
            generation_id: null,
            equipment_id: null,
            year_id: null,
            car_body_type_id: null,
            count_doors: null,
            transmission_id: null,
            engine_type_id: null,
            drive_id: null,
            handlebar_id: null,
            mileage: null,
            count_owners: null,
            state_id: null,
            pts_id: null,

            // Бинарные флаги
            is_service_book: 0,
            is_serviced_dealer: 0,
            is_under_warranty: 0,

            // Опции 
            power_steering_id: null,
            salon_id: null,
            electric_windows_id: null,
            audio_systems_id: null,
            tires_wheels_id: null,
            climate_management_id: null,
            headlight_id: null,

            // Опции (группируем чекбоксы)
            is_front_seats: null, is_rear_seats: null, is_mirrors: null, is_rear_window: null,
            is_steering_wheel: null, is_steering_wheel_control: null, is_front_seats_drives: null,
            is_rear_seats_drives: null, is_mirrors_drives: null, is_steering_column_drives: null,
            is_folding_mirrors_drives: null, is_front_seats_setting: null, is_rear_seats_setting: null,
            is_mirrors_setting: null, is_steering_column_setting: null, is_blind_spot_monitoring: null,
            is_automatic_parking: null, is_rain_sensor: null, is_light_sensor: null,
            is_rear_parking_sensor: null, is_front_parking_sensor: null, is_rear_view_camera: null,
            is_cruise_control: null, is_onboard_computer: null, is_alarm_system: null, is_central_lock: null,
            is_immobilizer: null, is_satellite: null, is_frontal_airbags: null, is_knee_high_airbags: null,
            is_curtains_airbags: null, is_side_front_airbags: null, is_side_rear_airbags: null,
            is_anti_lock_brakes: null, is_anti_slip: null, is_exchange_rate_stability: null,
            is_distrib_braking_forces: null, is_emergency_braking: null, is_differential_block: null,
            is_pedestrian_detection: null, is_CD_DVD_Bluray: null, is_AUX: null, is_MP3: null, is_Bluetooth: null,
            is_Radio: null, is_TV: null, is_Video: null, is_USB: null, is_GPS_navigator: null, is_subwoofer: null,
            is_antifog: null, is_washers: null, is_adaptive_lighting: null, is_athermal_glazing: null,
            is_leather_wheel: null, is_hatch: null, is_winter_included: null, is_wheel_control: null,

            // Описание, контакты, локация
            ads_description: null,
            place_inspection: null,
            amount: null,
            city_id: null,
            city_name: null,
            latitude: null,
            longitude: null,
            communication_method_id: null,
            isUserDataInitialized: false,
         });
      }
   },
});