import {
   isDisksCreateFlow,
   isFullWheelsCreateFlow,
   isMotoCreateFlow,
   isMotoMotorcyclesCreateFlow,
   isMotoScootersCreateFlow,
   isMotoTiresCreateFlow,
   isMotorOilCreateFlow,
   isPartsWheelsFlow,
   isTiresCreateFlow
} from './flows'

export const isRequiredValueFilled = (value) => {
   if (value === null || value === undefined) return false
   if (typeof value === 'string') return value.trim() !== ''
   if (Array.isArray(value)) return value.length > 0
   if (typeof value === 'number') return Number.isFinite(value)
   if (typeof value === 'object') return Object.keys(value).length > 0
   return true
}

const hasAllRequiredValues = (fields) =>
   fields.every((field) => isRequiredValueFilled(field))

const collectMissingRequiredFieldLabels = (fields) =>
   fields
      .filter((field) => !isRequiredValueFilled(field.value))
      .map((field) => field.label)

const normalizeComparableToken = (value) =>
   String(value ?? '')
      .trim()
      .toLowerCase()

const isPositiveFlagValue = (value) => {
   const token = normalizeComparableToken(value)
   return (
      token === '1' ||
      token === 'yes' ||
      token === 'да' ||
      token === 'true'
   )
}

const isUsedConditionValue = (value) => {
   const token = normalizeComparableToken(value)
   return (
      token === '2' ||
      token === 'used' ||
      token === 'бу' ||
      token === 'б/у'
   )
}

const isNewConditionValue = (value) => {
   const token = normalizeComparableToken(value)
   return (
      token === '1' ||
      token === 'new' ||
      token === 'новое' ||
      token === 'новые'
   )
}

const isNoPtsValue = (value) => {
   const token = normalizeComparableToken(value)
   return token === '0' || token === 'none' || token === 'no' || token === 'нет'
}

const isTiresFieldsFilled = (state) => {
   const requiredFields = [
      state.tires_condition_id,
      state.tires_count,
      state.tires_brand_id,
      state.tires_manufacturer,
      state.tires_model_id,
      state.tires_season_id,
      state.tires_width_id,
      state.tires_height_id,
      state.tires_diameter_id,
      state.tires_load_index_id,
      state.tires_speed_index_id,
      state.tires_run_flat_id
   ]

   const tiresCount = Number.parseInt(String(state.tires_count), 10)
   const isStaggeredSetVisible = Number.isFinite(tiresCount) && tiresCount > 1
   const isStaggeredSet = isPositiveFlagValue(state.tires_staggered_set_id)
   const isUsedTires = isUsedConditionValue(state.tires_condition_id)

   if (isStaggeredSetVisible && isStaggeredSet) {
      requiredFields.push(
         state.tires_rear_width_id,
         state.tires_rear_height_id,
         state.tires_rear_diameter_id
      )
   }

   if (isUsedTires) {
      requiredFields.push(
         state.tires_tread_depth_id,
         state.tires_bulges_count_id,
         state.tires_side_repair_count_id
      )
   }

   const hasRequiredFields = hasAllRequiredValues(requiredFields)

   if (!hasRequiredFields) return false
   if (!isUsedTires) return true

   return [
      state.tires_defect_none,
      state.tires_defect_uneven_wear,
      state.tires_defect_tread_delamination,
      state.tires_defect_cracks,
      state.tires_defect_driven_flat
   ].some((value) => Number(value) === 1)
}

const isDisksFieldsFilled = (state) => {
   const requiredFields = [
      state.disks_condition_id,
      state.disks_count,
      state.disks_brand_id,
      state.disks_manufacturer,
      state.disks_model_id,
      state.disks_rim_diameter_id,
      state.disks_hole_count_id,
      state.disks_hole_pattern_diameter_id,
      state.disks_type_id,
      state.disks_dia_id,
      state.disks_et_id,
      state.disks_rim_width_id
   ]

   const isUsedDisks = isUsedConditionValue(state.disks_condition_id)
   const isRepairYes = isPositiveFlagValue(state.disks_repair_status_id)

   if (isUsedDisks) {
      requiredFields.push(
         state.disks_repair_status_id,
         state.disks_cracks_count_id,
         state.disks_geometry_changes_count_id,
         state.disks_paint_type_id,
         state.disks_center_caps_id,
         state.disks_pressure_sensors_id
      )

      if (isRepairYes) {
         requiredFields.push(
            state.disks_straightened_count_id,
            state.disks_welded_count_id
         )
      }
   }

   const hasRequiredFields = hasAllRequiredValues(requiredFields)

   if (!hasRequiredFields) return false
   if (!isUsedDisks) return true

   return [
      state.disks_defect_none,
      state.disks_defect_scratches,
      state.disks_defect_chips,
      state.disks_defect_coating_delamination,
      state.disks_defect_corrosion_rust
   ].some((value) => Number(value) === 1)
}

const isMotoTiresFieldsFilled = (state) => {
   return hasAllRequiredValues([
      state.moto_tires_condition_id,
      state.moto_tires_brand_id,
      state.moto_tires_width_id,
      state.moto_tires_height_id,
      state.moto_tires_diameter_id,
      state.moto_tires_axle_id
   ])
}

const isFullWheelsFieldsFilled = (state) => {
   const requiredFields = [
      state.full_wheels_condition_id,
      state.full_wheels_count,
      state.full_wheels_brand_id,
      state.full_wheels_manufacturer,
      state.full_wheels_model_id,
      state.full_wheels_staggered_set_id,
      state.full_wheels_front_width_id,
      state.full_wheels_front_height_id,
      state.full_wheels_front_diameter_id,
      state.full_wheels_load_index_id,
      state.full_wheels_speed_index_id,
      state.full_wheels_season_id,
      state.full_wheels_run_flat_id,
      state.full_wheels_tread_depth_id,
      state.full_wheels_year_id,
      state.full_wheels_disk_hole_count_id,
      state.full_wheels_disk_hole_pattern_diameter_id,
      state.full_wheels_disk_type_id,
      state.full_wheels_disk_dia_id,
      state.full_wheels_disk_et_id,
      state.full_wheels_disk_rim_width_id
   ]

   const isStaggered = Number(state.full_wheels_staggered_set_id) === 1
   if (isStaggered) {
      requiredFields.push(
         state.full_wheels_rear_width_id,
         state.full_wheels_rear_height_id,
         state.full_wheels_rear_diameter_id
      )
   }

   return hasAllRequiredValues(requiredFields)
}

const isMotorOilFieldsFilled = (state) => {
   return hasAllRequiredValues([
      state.motor_oil_condition_id,
      state.motor_oil_brand_id,
      state.motor_oil_sae_id,
      state.motor_oil_volume_id,
      state.motor_oil_acea_id,
      state.motor_oil_api_id,
      state.motor_oil_oem_id
   ])
}

const isMotoMotorcyclesFieldsFilled = (state) => {
   const requiredFields = [
      state.vin,
      state.moto_motorcycle_condition_id,
      state.moto_motorcycle_availability_id,
      state.moto_motorcycle_brand_id,
      state.moto_motorcycle_model_id,
      state.moto_motorcycle_type_id,
      state.moto_motorcycle_year,
      state.moto_motorcycle_engine_type_id,
      state.moto_motorcycle_power_hp,
      state.moto_motorcycle_engine_volume,
      state.moto_motorcycle_fuel_feed_id,
      state.moto_motorcycle_drive_type_id,
      state.moto_motorcycle_stroke_id,
      state.moto_motorcycle_count_cylinder_id,
      state.moto_motorcycle_number_of_gears_id,
      state.moto_motorcycle_transmission_id,
      state.moto_motorcycle_cylinder_position_id,
      state.moto_motorcycle_engine_cooling_id,
      state.moto_motorcycle_pts_id
   ]

   const isNewCondition = isNewConditionValue(state.moto_motorcycle_condition_id)
   const hasNoPts = isNoPtsValue(state.moto_motorcycle_pts_id)

   if (!isNewCondition) {
      requiredFields.push(state.moto_motorcycle_mileage)
   }

   if (!isNewCondition && !hasNoPts) {
      requiredFields.push(state.moto_motorcycle_count_owner_id)
   }

   return hasAllRequiredValues(requiredFields)
}

const isMotoScootersFieldsFilled = (state) => {
   const requiredFields = [
      state.vin,
      state.moto_scooter_condition_id,
      state.moto_scooter_availability_id,
      state.moto_scooter_brand_id,
      state.moto_scooter_model_id,
      state.moto_scooter_type_id,
      state.moto_scooter_year,
      state.moto_scooter_engine_type_id,
      state.moto_scooter_power_hp,
      state.moto_scooter_engine_volume,
      state.moto_scooter_fuel_feed_id,
      state.moto_scooter_stroke_id,
      state.moto_scooter_transmission_id,
      state.moto_scooter_pts_id
   ]

   const isNewCondition = isNewConditionValue(state.moto_scooter_condition_id)
   const hasNoPts = isNoPtsValue(state.moto_scooter_pts_id)

   if (!isNewCondition) {
      requiredFields.push(state.moto_scooter_mileage)
   }

   if (!isNewCondition && !hasNoPts) {
      requiredFields.push(state.moto_scooter_count_owner_id)
   }

   return hasAllRequiredValues(requiredFields)
}

const isCarsFieldsFilled = (state) => {
   const requiredFields = [
      state.photos,
      state.color_ids,
      state.country_id,
      state.vin,
      state.brand_id,
      state.model_id,
      state.generation_id,
      state.modification_id,
      state.equipment_id,
      state.year_id,
      state.count_doors,
      state.car_body_type_id,
      state.transmission_id,
      state.engine_type_id,
      state.handlebar_id,
      state.condition_id,
      state.drive_id,
      state.pts_id
   ]

   if (Number(state.country_id) !== 1) {
      requiredFields.push(state.state_number)
   }

   if (Number(state.condition_id) === 2) {
      requiredFields.push(state.state_id)
   }

   return hasAllRequiredValues(requiredFields)
}

const getTiresMissingFieldLabels = (state) => {
   const missing = collectMissingRequiredFieldLabels([
      { label: 'Состояние', value: state.tires_condition_id },
      { label: 'Количество шин', value: state.tires_count },
      { label: 'Бренд', value: state.tires_brand_id },
      { label: 'Производитель', value: state.tires_manufacturer },
      { label: 'Модель', value: state.tires_model_id },
      { label: 'Сезон', value: state.tires_season_id },
      { label: 'Ширина', value: state.tires_width_id },
      { label: 'Высота', value: state.tires_height_id },
      { label: 'Диаметр', value: state.tires_diameter_id },
      { label: 'Индекс нагрузки', value: state.tires_load_index_id },
      { label: 'Индекс скорости', value: state.tires_speed_index_id },
      { label: 'RunFlat', value: state.tires_run_flat_id }
   ])

   const tiresCount = Number.parseInt(String(state.tires_count), 10)
   const isStaggeredSetVisible = Number.isFinite(tiresCount) && tiresCount > 1
   const isStaggeredSet = isPositiveFlagValue(state.tires_staggered_set_id)
   const isUsedTires = isUsedConditionValue(state.tires_condition_id)

   if (isStaggeredSetVisible && isStaggeredSet) {
      missing.push(
         ...collectMissingRequiredFieldLabels([
            { label: 'Задняя ширина', value: state.tires_rear_width_id },
            { label: 'Задняя высота', value: state.tires_rear_height_id },
            { label: 'Задний диаметр', value: state.tires_rear_diameter_id }
         ])
      )
   }

   if (isUsedTires) {
      missing.push(
         ...collectMissingRequiredFieldLabels([
            { label: 'Остаток протектора', value: state.tires_tread_depth_id },
            { label: 'Количество грыж', value: state.tires_bulges_count_id },
            { label: 'Количество боковых ремонтов', value: state.tires_side_repair_count_id }
         ])
      )

      if (
         ![
            state.tires_defect_none,
            state.tires_defect_uneven_wear,
            state.tires_defect_tread_delamination,
            state.tires_defect_cracks,
            state.tires_defect_driven_flat
         ].some((value) => Number(value) === 1)
      ) {
         missing.push('Дефекты шин')
      }
   }

   return missing
}

const getDisksMissingFieldLabels = (state) => {
   const missing = collectMissingRequiredFieldLabels([
      { label: 'Состояние', value: state.disks_condition_id },
      { label: 'Количество дисков', value: state.disks_count },
      { label: 'Бренд', value: state.disks_brand_id },
      { label: 'Производитель', value: state.disks_manufacturer },
      { label: 'Модель', value: state.disks_model_id },
      { label: 'Диаметр обода', value: state.disks_rim_diameter_id },
      { label: 'Количество отверстий', value: state.disks_hole_count_id },
      { label: 'PCD', value: state.disks_hole_pattern_diameter_id },
      { label: 'Тип диска', value: state.disks_type_id },
      { label: 'DIA', value: state.disks_dia_id },
      { label: 'ET', value: state.disks_et_id },
      { label: 'Ширина обода', value: state.disks_rim_width_id }
   ])

   const isUsedDisks = isUsedConditionValue(state.disks_condition_id)
   const isRepairYes = isPositiveFlagValue(state.disks_repair_status_id)

   if (isUsedDisks) {
      missing.push(
         ...collectMissingRequiredFieldLabels([
            { label: 'Ремонт дисков', value: state.disks_repair_status_id },
            { label: 'Количество трещин', value: state.disks_cracks_count_id },
            { label: 'Изменения геометрии', value: state.disks_geometry_changes_count_id },
            { label: 'Тип окраса', value: state.disks_paint_type_id },
            { label: 'Центральные колпачки', value: state.disks_center_caps_id },
            { label: 'Датчики давления', value: state.disks_pressure_sensors_id }
         ])
      )

      if (isRepairYes) {
         missing.push(
            ...collectMissingRequiredFieldLabels([
               { label: 'Количество правок', value: state.disks_straightened_count_id },
               { label: 'Количество сварок', value: state.disks_welded_count_id }
            ])
         )
      }

      if (
         ![
            state.disks_defect_none,
            state.disks_defect_scratches,
            state.disks_defect_chips,
            state.disks_defect_coating_delamination,
            state.disks_defect_corrosion_rust
         ].some((value) => Number(value) === 1)
      ) {
         missing.push('Дефекты дисков')
      }
   }

   return missing
}

const getMotoTiresMissingFieldLabels = (state) =>
   collectMissingRequiredFieldLabels([
      { label: 'Состояние', value: state.moto_tires_condition_id },
      { label: 'Бренд', value: state.moto_tires_brand_id },
      { label: 'Ширина', value: state.moto_tires_width_id },
      { label: 'Высота', value: state.moto_tires_height_id },
      { label: 'Диаметр', value: state.moto_tires_diameter_id },
      { label: 'Ось', value: state.moto_tires_axle_id }
   ])

const getFullWheelsMissingFieldLabels = (state) => {
   const missing = collectMissingRequiredFieldLabels([
      { label: 'Состояние', value: state.full_wheels_condition_id },
      { label: 'Количество колес', value: state.full_wheels_count },
      { label: 'Бренд', value: state.full_wheels_brand_id },
      { label: 'Производитель', value: state.full_wheels_manufacturer },
      { label: 'Модель', value: state.full_wheels_model_id },
      { label: 'Разноширокий комплект', value: state.full_wheels_staggered_set_id },
      { label: 'Передняя ширина', value: state.full_wheels_front_width_id },
      { label: 'Передняя высота', value: state.full_wheels_front_height_id },
      { label: 'Передний диаметр', value: state.full_wheels_front_diameter_id },
      { label: 'Индекс нагрузки', value: state.full_wheels_load_index_id },
      { label: 'Индекс скорости', value: state.full_wheels_speed_index_id },
      { label: 'Сезон', value: state.full_wheels_season_id },
      { label: 'RunFlat', value: state.full_wheels_run_flat_id },
      { label: 'Остаток протектора', value: state.full_wheels_tread_depth_id },
      { label: 'Год выпуска', value: state.full_wheels_year_id },
      { label: 'Количество отверстий', value: state.full_wheels_disk_hole_count_id },
      { label: 'PCD', value: state.full_wheels_disk_hole_pattern_diameter_id },
      { label: 'Тип диска', value: state.full_wheels_disk_type_id },
      { label: 'DIA', value: state.full_wheels_disk_dia_id },
      { label: 'ET', value: state.full_wheels_disk_et_id },
      { label: 'Ширина обода', value: state.full_wheels_disk_rim_width_id }
   ])

   if (Number(state.full_wheels_staggered_set_id) === 1) {
      missing.push(
         ...collectMissingRequiredFieldLabels([
            { label: 'Задняя ширина', value: state.full_wheels_rear_width_id },
            { label: 'Задняя высота', value: state.full_wheels_rear_height_id },
            { label: 'Задний диаметр', value: state.full_wheels_rear_diameter_id }
         ])
      )
   }

   return missing
}

const getMotorOilMissingFieldLabels = (state) =>
   collectMissingRequiredFieldLabels([
      { label: 'Состояние', value: state.motor_oil_condition_id },
      { label: 'Бренд', value: state.motor_oil_brand_id },
      { label: 'SAE', value: state.motor_oil_sae_id },
      { label: 'Объем', value: state.motor_oil_volume_id },
      { label: 'ACEA', value: state.motor_oil_acea_id },
      { label: 'API', value: state.motor_oil_api_id },
      { label: 'OEM', value: state.motor_oil_oem_id }
   ])

const getMotoMotorcyclesMissingFieldLabels = (state) => {
   const missing = collectMissingRequiredFieldLabels([
      { label: 'VIN', value: state.vin },
      { label: 'Состояние', value: state.moto_motorcycle_condition_id },
      { label: 'Наличие', value: state.moto_motorcycle_availability_id },
      { label: 'Марка', value: state.moto_motorcycle_brand_id },
      { label: 'Модель', value: state.moto_motorcycle_model_id },
      { label: 'Тип', value: state.moto_motorcycle_type_id },
      { label: 'Год выпуска', value: state.moto_motorcycle_year },
      { label: 'Тип двигателя', value: state.moto_motorcycle_engine_type_id },
      { label: 'Мощность, л.с.', value: state.moto_motorcycle_power_hp },
      { label: 'Объем двигателя', value: state.moto_motorcycle_engine_volume },
      { label: 'Подача топлива', value: state.moto_motorcycle_fuel_feed_id },
      { label: 'Тип привода', value: state.moto_motorcycle_drive_type_id },
      { label: 'Тактность', value: state.moto_motorcycle_stroke_id },
      { label: 'Количество цилиндров', value: state.moto_motorcycle_count_cylinder_id },
      { label: 'Количество передач', value: state.moto_motorcycle_number_of_gears_id },
      { label: 'Коробка передач', value: state.moto_motorcycle_transmission_id },
      { label: 'Расположение цилиндров', value: state.moto_motorcycle_cylinder_position_id },
      { label: 'Охлаждение двигателя', value: state.moto_motorcycle_engine_cooling_id },
      { label: 'ПТС', value: state.moto_motorcycle_pts_id }
   ])

   const isNewCondition = isNewConditionValue(state.moto_motorcycle_condition_id)
   const hasNoPts = isNoPtsValue(state.moto_motorcycle_pts_id)

   if (!isNewCondition) {
      missing.push(
         ...collectMissingRequiredFieldLabels([
            { label: 'Пробег', value: state.moto_motorcycle_mileage }
         ])
      )
   }

   if (!isNewCondition && !hasNoPts) {
      missing.push(
         ...collectMissingRequiredFieldLabels([
            { label: 'Количество владельцев', value: state.moto_motorcycle_count_owner_id }
         ])
      )
   }

   return missing
}

const getMotoScootersMissingFieldLabels = (state) => {
   const missing = collectMissingRequiredFieldLabels([
      { label: 'VIN', value: state.vin },
      { label: 'Состояние', value: state.moto_scooter_condition_id },
      { label: 'Наличие', value: state.moto_scooter_availability_id },
      { label: 'Марка', value: state.moto_scooter_brand_id },
      { label: 'Модель', value: state.moto_scooter_model_id },
      { label: 'Тип', value: state.moto_scooter_type_id },
      { label: 'Год выпуска', value: state.moto_scooter_year },
      { label: 'Тип двигателя', value: state.moto_scooter_engine_type_id },
      { label: 'Мощность, л.с.', value: state.moto_scooter_power_hp },
      { label: 'Объем двигателя', value: state.moto_scooter_engine_volume },
      { label: 'Подача топлива', value: state.moto_scooter_fuel_feed_id },
      { label: 'Тактность', value: state.moto_scooter_stroke_id },
      { label: 'Коробка передач', value: state.moto_scooter_transmission_id },
      { label: 'ПТС', value: state.moto_scooter_pts_id }
   ])

   const isNewCondition = isNewConditionValue(state.moto_scooter_condition_id)
   const hasNoPts = isNoPtsValue(state.moto_scooter_pts_id)

   if (!isNewCondition) {
      missing.push(
         ...collectMissingRequiredFieldLabels([
            { label: 'Пробег', value: state.moto_scooter_mileage }
         ])
      )
   }

   if (!isNewCondition && !hasNoPts) {
      missing.push(
         ...collectMissingRequiredFieldLabels([
            { label: 'Количество владельцев', value: state.moto_scooter_count_owner_id }
         ])
      )
   }

   return missing
}

const getCarsMissingFieldLabels = (state) => {
   const missing = collectMissingRequiredFieldLabels([
      { label: 'Фотографии', value: state.photos },
      { label: 'Цвет', value: state.color_ids },
      { label: 'Страна регистрации', value: state.country_id },
      { label: 'VIN или номер кузова', value: state.vin },
      { label: 'Марка', value: state.brand_id },
      { label: 'Модель', value: state.model_id },
      { label: 'Поколение', value: state.generation_id },
      { label: 'Модификация', value: state.modification_id },
      { label: 'Комплектация', value: state.equipment_id },
      { label: 'Год выпуска', value: state.year_id },
      { label: 'Количество дверей', value: state.count_doors },
      { label: 'Тип кузова', value: state.car_body_type_id },
      { label: 'Коробка передач', value: state.transmission_id },
      { label: 'Тип двигателя', value: state.engine_type_id },
      { label: 'Руль', value: state.handlebar_id },
      { label: 'Состояние', value: state.condition_id },
      { label: 'Привод', value: state.drive_id },
      { label: 'ПТС', value: state.pts_id }
   ])

   if (Number(state.country_id) !== 1) {
      missing.push(
         ...collectMissingRequiredFieldLabels([
            { label: 'Государственный номер', value: state.state_number }
         ])
      )
   }

   if (Number(state.condition_id) === 2) {
      missing.push(
         ...collectMissingRequiredFieldLabels([
            { label: 'Состояние автомобиля', value: state.state_id }
         ])
      )
   }

   return missing
}

export const isCharacteristicFieldsFilled = (state) => {
   if (isTiresCreateFlow(state.create_flow)) return isTiresFieldsFilled(state)
   if (isDisksCreateFlow(state.create_flow)) return isDisksFieldsFilled(state)
   if (isMotoTiresCreateFlow(state.create_flow))
      return isMotoTiresFieldsFilled(state)
   if (isFullWheelsCreateFlow(state.create_flow))
      return isFullWheelsFieldsFilled(state)
   if (isMotorOilCreateFlow(state.create_flow))
      return isMotorOilFieldsFilled(state)
   if (isMotoMotorcyclesCreateFlow(state.create_flow))
      return isMotoMotorcyclesFieldsFilled(state)
   if (isMotoScootersCreateFlow(state.create_flow))
      return isMotoScootersFieldsFilled(state)
   return isCarsFieldsFilled(state)
}

export const getMissingCharacteristicFieldLabels = (state) => {
   if (isTiresCreateFlow(state.create_flow)) return getTiresMissingFieldLabels(state)
   if (isDisksCreateFlow(state.create_flow)) return getDisksMissingFieldLabels(state)
   if (isMotoTiresCreateFlow(state.create_flow))
      return getMotoTiresMissingFieldLabels(state)
   if (isFullWheelsCreateFlow(state.create_flow))
      return getFullWheelsMissingFieldLabels(state)
   if (isMotorOilCreateFlow(state.create_flow))
      return getMotorOilMissingFieldLabels(state)
   if (isMotoMotorcyclesCreateFlow(state.create_flow))
      return getMotoMotorcyclesMissingFieldLabels(state)
   if (isMotoScootersCreateFlow(state.create_flow))
      return getMotoScootersMissingFieldLabels(state)
   return getCarsMissingFieldLabels(state)
}

export const isAdFieldsFilled = (state) => {
   const requiredFields = [
      state.username,
      state.email,
      state.phone,
      state.ads_description,
      state.place_inspection,
      state.communication_method_id,
      state.amount
   ]

   if (
      isPartsWheelsFlow(state.create_flow) ||
      isMotorOilCreateFlow(state.create_flow) ||
      isMotoCreateFlow(state.create_flow)
   ) {
      requiredFields.unshift(state.photos)
   }

   return hasAllRequiredValues(requiredFields)
}

export const getMissingAdFieldLabels = (state) => {
   const missing = collectMissingRequiredFieldLabels([
      { label: 'Имя', value: state.username },
      { label: 'Email', value: state.email },
      { label: 'Телефон', value: state.phone },
      { label: 'Описание', value: state.ads_description },
      { label: 'Место осмотра', value: state.place_inspection },
      { label: 'Способ связи', value: state.communication_method_id },
      { label: 'Цена', value: state.amount }
   ])

   if (
      isPartsWheelsFlow(state.create_flow) ||
      isMotorOilCreateFlow(state.create_flow) ||
      isMotoCreateFlow(state.create_flow)
   ) {
      missing.unshift(
         ...collectMissingRequiredFieldLabels([
            { label: 'Фотографии', value: state.photos }
         ])
      )
   }

   return missing
}



