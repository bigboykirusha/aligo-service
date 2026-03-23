import { resolveCreateFlowFromPayload } from '../flowResolvers'
import { first, asObject, coalesce } from './utils'

export const mapMetaPatch = (carData, fallbackFlow) => ({
   id: carData?.id,
   id_user_owner_ads: carData?.id_user_owner_ads,
   create_by_user_id:
      carData?.create_by_user_id ??
      carData?.id_user_owner_ads ??
      carData?.user?.id ??
      null,
   main_category_id:
      carData?.main_category_id ?? carData?.main_category?.id ?? null,
   sub_category_id: carData?.sub_category_id ?? carData?.sub_category?.id ?? null,
   last_category_id:
      carData?.last_category_id ?? carData?.last_category?.id ?? null,
   is_draft: carData?.is_draft,
   isDraftEditMode: Number(carData?.is_draft) === 1,
   is_published: carData?.is_published,
   condition_id: carData?.condition?.id ?? carData?.condition_id ?? null,
   create_flow: resolveCreateFlowFromPayload(carData, { fallbackFlow })
})

export const mapAppearancePatch = (carData) => ({
   photos: carData?.photos || [],
   color_ids:
      first(carData?.auto_appearances)?.color?.map((color) => color.id) || [],
   color_custom: first(carData?.auto_appearances)?.color_custom || null
})

export const mapRegistrationPatch = (carData) => {
   const registrationData = first(carData?.auto_registration_data)

   return {
      country_id: registrationData?.country?.id || null,
      vin: coalesce(registrationData?.vin, carData?.vin),
      state_number: registrationData?.state_number || null
   }
}

export const mapTechnicalSpecsPatch = (carData) => {
   const techSpecs = first(carData?.auto_technical_specifications)

   return {
      brand_id: techSpecs?.brand?.id || null,
      model_id: techSpecs?.model?.id || null,
      generation_id:
         techSpecs?.generation?.id || techSpecs?.generation_standart?.id || null,
      modification_id:
         techSpecs?.modification?.id ||
         techSpecs?.modification_standart?.id ||
         null,
      equipment_id:
         techSpecs?.equipment?.id || techSpecs?.equipment_standart?.id || null,
      year_id: techSpecs?.year_release?.id || null,
      car_body_type_id: techSpecs?.car_body_type?.id || null,
      count_doors: techSpecs?.count_doors || null,
      transmission_id: techSpecs?.transmission?.id || null,
      engine_type_id: techSpecs?.engine_type?.id || null,
      engine_volume: coalesce(
         techSpecs?.engine_volume,
         techSpecs?.engine_capacity,
         techSpecs?.volume,
         carData?.engine_volume
      ),
      power_range: coalesce(
         techSpecs?.power_range,
         techSpecs?.power,
         carData?.power_range
      ),
      drive_id: techSpecs?.drive?.id || null,
      handlebar_id: techSpecs?.handlebar?.id || null
   }
}

export const mapHistoryAndMaintenancePatch = (carData) => {
   const historyConditions = first(carData?.auto_history_conditions)
   const maintenanceData = first(carData?.maintenance_data)

   return {
      mileage: historyConditions?.mileage || null,
      count_owners: historyConditions?.count_owners?.id || null,
      state_id: historyConditions?.state?.id || null,
      pts_id: historyConditions?.pts?.id || null,
      is_service_book: maintenanceData?.is_service_book || 0,
      is_serviced_dealer: maintenanceData?.is_serviced_dealer || 0,
      is_under_warranty: maintenanceData?.is_under_warranty || 0
   }
}

export const mapOptionsPatch = (carData) => {
   const optionsRoot = first(carData?.auto_additional_options)
   const climateOptions = first(carData?.auto_additional_options_climate_management)
   const salonOptions = first(carData?.auto_additional_options_salon)
   const headlightsOptions = first(carData?.auto_additional_headlights)
   const airbagsOptions = first(carData?.auto_additional_options_airbag)
   const heatingOptions = first(carData?.auto_additional_options_heating)
   const electricDriveOptions = first(carData?.auto_additional_options_electric_drive)
   const settingMemoryOptions = first(
      carData?.auto_additional_options_setting_memory
   )
   const anticreepingSystem = first(
      carData?.auto_additional_options_anticreeping_system
   )
   const audioSystem = first(carData?.auto_additional_audio_system)
   const activeSecurity = first(carData?.auto_additional_active_security)
   const drivingAssistanceOptions = first(
      carData?.auto_additional_options_driving_assistance
   )
   const mediaOptions = first(carData?.auto_additional_multimedia_navigation)
   const wheelsOptions = first(carData?.auto_additional_tires_wheels)

   return {
      power_steering_id: optionsRoot?.power_steering?.id || null,
      salon_id: salonOptions?.salon?.id || null,
      electric_windows_id: optionsRoot?.electric_windows?.id || null,
      tires_wheels_id: wheelsOptions?.tires_wheels?.[0]?.id || null,
      climate_management_id: climateOptions?.climate_management?.id || null,
      headlight_id: headlightsOptions?.headlight?.[0]?.id || null,
      audio_systems_id:
         optionsRoot?.audio_systems?.id || audioSystem?.audio_system?.[0]?.id || null,

      is_front_seats: heatingOptions.is_front_seats,
      is_rear_seats: heatingOptions.is_rear_seats,
      is_mirrors: heatingOptions.is_mirrors,
      is_rear_window: heatingOptions.is_rear_window,
      is_steering_wheel: heatingOptions.is_steering_wheel,

      is_front_seats_drives: electricDriveOptions.is_front_seats_drives,
      is_rear_seats_drives: electricDriveOptions.is_rear_seats_drives,
      is_mirrors_drives: electricDriveOptions.is_mirrors_drives,
      is_steering_column_drives: electricDriveOptions.is_steering_column_drives,
      is_folding_mirrors_drives: electricDriveOptions.is_folding_mirrors_drives,

      is_front_seats_setting: settingMemoryOptions.is_front_seats_setting,
      is_rear_seats_setting: settingMemoryOptions.is_rear_seats_setting,
      is_mirrors_setting: settingMemoryOptions.is_mirrors_setting,
      is_steering_column_setting: settingMemoryOptions.is_steering_column_setting,

      is_blind_spot_monitoring:
         drivingAssistanceOptions.is_blind_spot_monitoring,
      is_automatic_parking: drivingAssistanceOptions.is_automatic_parking,
      is_rain_sensor: drivingAssistanceOptions.is_rain_sensor,
      is_light_sensor: drivingAssistanceOptions.is_light_sensor,
      is_rear_parking_sensor: drivingAssistanceOptions.is_rear_parking_sensor,
      is_front_parking_sensor: drivingAssistanceOptions.is_front_parking_sensor,
      is_rear_view_camera: drivingAssistanceOptions.is_rear_view_camera,
      is_cruise_control: drivingAssistanceOptions.is_cruise_control,
      is_onboard_computer: drivingAssistanceOptions.is_onboard_computer,

      is_alarm_system: anticreepingSystem.is_alarm_system,
      is_central_lock: anticreepingSystem.is_central_lock,
      is_immobilizer: anticreepingSystem.is_immobilizer,
      is_satellite: anticreepingSystem.is_satellite,

      is_frontal_airbags: airbagsOptions.is_frontal_airbags,
      is_knee_high_airbags: airbagsOptions.is_knee_high_airbags,
      is_curtains_airbags: airbagsOptions.is_curtains_airbags,
      is_side_front_airbags: airbagsOptions.is_side_front_airbags,
      is_side_rear_airbags: airbagsOptions.is_side_rear_airbags,

      is_anti_lock_brakes: activeSecurity.is_anti_lock_brakes,
      is_anti_slip: activeSecurity.is_anti_slip,
      is_exchange_rate_stability: activeSecurity.is_exchange_rate_stability,
      is_distrib_braking_forces: activeSecurity.is_distrib_braking_forces,
      is_emergency_braking: activeSecurity.is_emergency_braking,
      is_differential_block: activeSecurity.is_differential_block,
      is_pedestrian_detection: activeSecurity.is_pedestrian_detection,

      is_CD_DVD_Bluray: mediaOptions.is_CD_DVD_Bluray,
      is_AUX: mediaOptions.is_AUX,
      is_MP3: mediaOptions.is_MP3,
      is_steering_wheel_control: mediaOptions.is_steering_wheel_control,
      is_Bluetooth: mediaOptions.is_Bluetooth,
      is_Radio: mediaOptions.is_Radio,
      is_TV: mediaOptions.is_TV,
      is_Video: mediaOptions.is_Video,
      is_USB: mediaOptions.is_USB,
      is_GPS_navigator: mediaOptions.is_GPS_navigator,
      is_subwoofer: audioSystem.is_subwoofer,

      is_antifog: headlightsOptions.is_antifog,
      is_washers: headlightsOptions.is_washers,
      is_adaptive_lighting: headlightsOptions.is_adaptive_lighting,

      is_athermal_glazing: climateOptions.is_athermal_glazing,
      is_leather_wheel: salonOptions.is_leather_wheel,
      is_hatch: salonOptions.is_hatch,
      is_wheel_control: climateOptions.is_wheel_control,
      is_winter_included: wheelsOptions.is_winter_included
   }
}

export const mapAdParamsPatch = (carData) => {
   const adsParams = asObject(carData?.ads_parameter)

   return {
      ads_description: adsParams?.ads_description || null,
      place_inspection: adsParams?.place_inspection ?? null,
      amount: adsParams?.amount ?? null,
      city_name: adsParams?.city?.title || null,
      city_id: adsParams?.city?.id || null,
      latitude: adsParams?.latitude ?? null,
      longitude: adsParams?.longitude ?? null,
      communication_method_id:
         adsParams?.communication_method_id?.id ??
         adsParams?.communication_method_id ??
         null,
      username: adsParams?.username ?? null,
      email: adsParams?.email ?? null,
      phone: adsParams?.phone ?? null
   }
}

export const mapUserContactPatch = (userStore, adParamsPatch = {}) => ({
   username: adParamsPatch?.username ?? userStore?.username ?? null,
   email:
      adParamsPatch?.email ??
      userStore?.unconfirmed_email ??
      userStore?.email ??
      null,
   phone: adParamsPatch?.phone ?? userStore?.phoneNumber ?? null,
   isUserDataInitialized: true
})
