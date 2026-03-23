/**
 * API for autogoods (tires, rims)
 */
import { executeApiRequest, getApiClient, getResponseDataField } from '../apiUtils'

const resolveAutogoodsResponseData = (response) => {
   const dataField = getResponseDataField(response)
   if (dataField !== undefined) return dataField
   return response?.data ?? []
}

const shouldTryNextAutogoodsEndpoint = (error) => {
   const status = Number(error?.response?.status || 0)
   return status === 404 || status === 405
}

const requestAutogoodsOptions = async ({
   endpoints = [],
   params = undefined,
   errorMessage = 'Failed to load autogoods options.'
}) =>
   executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const endpointList = Array.isArray(endpoints)
            ? endpoints.filter(Boolean)
            : [endpoints].filter(Boolean)

         if (!endpointList.length) return []

         let lastError = null
         for (let index = 0; index < endpointList.length; index += 1) {
            const endpoint = endpointList[index]

            try {
               const response = await apiClient.get(endpoint, {
                  ...(params ? { params } : {})
               })
               return resolveAutogoodsResponseData(response)
            } catch (error) {
               lastError = error
               const isLastEndpoint = index === endpointList.length - 1
               if (isLastEndpoint || !shouldTryNextAutogoodsEndpoint(error)) {
                  throw error
               }
            }
         }

         if (lastError) throw lastError
         return []
      },
      {
         errorMessage,
         throwError: true
      }
   )

export const createAutogoodsAd = async (params) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient('apiClientData')
         const response = await apiClient.post('/autogoods', params, {
            headers: { 'Content-Type': 'multipart/form-data' }
         })
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Failed to create autogoods advertisement.'
      }
   )
}

export const getAutogoodsById = async (autogoodsId) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get(`/autogoods/${autogoodsId}`)
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Failed to load autogoods advertisement by id.',
         throwError: true
      }
   )
}

export const getAutogoodsFiltered = async (filters = {}) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const params = {
            page: 1,
            count: 20,
            order_by: 'desc',
            ...(filters && typeof filters === 'object' ? filters : {})
         }
         const response = await apiClient.get('/autogoods_filters', {
            params
         })
         return {
            data: getResponseDataField(response),
            totalCount:
               response?.data?.meta?.total_count ??
               response?.data?.total_count ??
               0,
            seo: response?.data?.seo ?? null
         }
      },
      {
         errorMessage: 'Failed to load autogoods advertisements.'
      }
   )
}

export const updateAutogoodsAd = async (autogoodsId, params) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient('apiClientData')
         const response = await apiClient.post(
            `/autogoods/${autogoodsId}`,
            params,
            {
               headers: { 'Content-Type': 'multipart/form-data' }
            }
         )
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Failed to update autogoods advertisement.'
      }
   )
}

export const getAutogoodsSubCategory = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/autogoods_sub_category'],
      errorMessage: 'Failed to load autogoods subcategories.'
   })
}

export const getAutogoodsLastCategory = async (subCategoryId) => {
   const normalizedSubCategoryId = Number(subCategoryId)
   return requestAutogoodsOptions({
      endpoints: ['/autogoods_last_category'],
      ...(Number.isFinite(normalizedSubCategoryId)
         ? {
              params: {
                 sub_category_id: normalizedSubCategoryId
              }
           }
         : {}),
      errorMessage: 'Failed to load autogoods final categories.'
   })
}

export const getAutogoodsDiskBrand = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_disk_brand'],
      errorMessage: 'Failed to load disk brands.'
   })
}

export const getAutogoodsDiskModel = async (brandId) => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_disk_model'],
      params: { brand_id: brandId },
      errorMessage: 'Failed to load disk models.'
   })
}

export const getAutogoodsDiskRimWidth = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_disk_rim_width'],
      errorMessage: 'Failed to load disk rim width options.'
   })
}

export const getAutogoodsDiskRimDiameter = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_disk_diameter'],
      errorMessage: 'Failed to load disk diameter options.'
   })
}

export const getAutogoodsDiskRimOffset = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_disk_et_offset'],
      errorMessage: 'Failed to load disk offset options.'
   })
}

export const getAutogoodsDiskRimBolt = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_disk_hole_counts'],
      errorMessage: 'Failed to load disk hole count options.'
   })
}

export const getAutogoodsDiskRimBoltDiameter = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_disk_hole_diameter'],
      errorMessage: 'Failed to load disk hole diameter options.'
   })
}

export const getAutogoodsDiskRimDia = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_disk_dia'],
      errorMessage: 'Failed to load disk DIA options.'
   })
}

export const getAutogoodsDiskRimType = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_disk_type_disk'],
      errorMessage: 'Failed to load disk type options.'
   })
}

export const getAutogoodsDiskCondition = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_disk_condition'],
      errorMessage: 'Failed to load disk condition options.'
   })
}

export const getAutogoodsDiskCount = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_disk_count'],
      errorMessage: 'Failed to load disk count options.'
   })
}

export const getAutogoodsDiskRepairStatus = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_disk_repair_disk'],
      errorMessage: 'Failed to load disk repair options.'
   })
}

export const getAutogoodsDiskStraightenedCount = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_disk_straighten_count_disk'],
      errorMessage: 'Failed to load disk straightened count options.'
   })
}

export const getAutogoodsDiskWeldedCount = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_disk_brew_count_disk'],
      errorMessage: 'Failed to load disk welded count options.'
   })
}

export const getAutogoodsDiskCrackCount = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_disk_crack_count_disk'],
      errorMessage: 'Failed to load disk crack count options.'
   })
}

export const getAutogoodsDiskGeometryChangeCount = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_disk_change_geometry_count_disk'],
      errorMessage: 'Failed to load disk geometry change count options.'
   })
}

export const getAutogoodsDiskColoringType = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_disk_coloring_type_disk'],
      errorMessage: 'Failed to load disk coloring type options.'
   })
}

export const getAutogoodsDiskCentralCap = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_disk_central_cap'],
      errorMessage: 'Failed to load disk central cap options.'
   })
}

export const getAutogoodsDiskPressureSensor = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_disk_pressure_sensor'],
      errorMessage: 'Failed to load disk pressure sensor options.'
   })
}

export const getAutogoodsTireBrand = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_tire_brand'],
      errorMessage: 'Failed to load tire brands.'
   })
}

export const getAutogoodsTireModel = async (brandId) => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_tire_model'],
      params: { brand_id: brandId },
      errorMessage: 'Failed to load tire models.'
   })
}

export const getAutogoodsTireCondition = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_tire_condition'],
      errorMessage: 'Failed to load tire condition options.'
   })
}

export const getAutogoodsTireCount = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_tire_count'],
      errorMessage: 'Failed to load tire count options.'
   })
}

export const getAutogoodsTireSeasonality = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_tire_seasonality'],
      errorMessage: 'Failed to load tire seasonality options.'
   })
}

export const getAutogoodsTireYear = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_tire_year'],
      errorMessage: 'Failed to load tire year options.'
   })
}

export const getAutogoodsTireStaggeredSet = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_tire_staggered_set'],
      errorMessage: 'Failed to load tire staggered set options.'
   })
}

export const getAutogoodsTireWidth = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_tire_width'],
      errorMessage: 'Failed to load tire width options.'
   })
}

export const getAutogoodsTireHeight = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_tire_height'],
      errorMessage: 'Failed to load tire height options.'
   })
}

export const getAutogoodsTireDiameter = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_tire_diameter'],
      errorMessage: 'Failed to load tire diameter options.'
   })
}

export const getAutogoodsTireWidthRear = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_tire_width_rear'],
      errorMessage: 'Failed to load rear tire width options.'
   })
}

export const getAutogoodsTireHeightRear = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_tire_height_rear'],
      errorMessage: 'Failed to load rear tire height options.'
   })
}

export const getAutogoodsTireDiameterRear = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_tire_diameter_rear'],
      errorMessage: 'Failed to load rear tire diameter options.'
   })
}

export const getAutogoodsTireLoadIndex = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_tire_load_index'],
      errorMessage: 'Failed to load tire load index options.'
   })
}

export const getAutogoodsTireSpeedIndex = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_tire_speed_index'],
      errorMessage: 'Failed to load tire speed index options.'
   })
}

export const getAutogoodsTireRunFlat = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_tire_run_flat'],
      errorMessage: 'Failed to load tire run flat options.'
   })
}

export const getAutogoodsTireTreadDepth = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_tire_tread_depth'],
      errorMessage: 'Failed to load tire tread depth options.'
   })
}

export const getAutogoodsTireBulgeCounts = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_tire_bulge_counts'],
      errorMessage: 'Failed to load tire bulge count options.'
   })
}

export const getAutogoodsTireSideRepairCount = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_tire_side_repair_count'],
      errorMessage: 'Failed to load tire side repair count options.'
   })
}

export const getAutogoodsMotoTireCondition = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_moto_tire_condition'],
      errorMessage: 'Failed to load moto tire condition options.'
   })
}

export const getAutogoodsMotoTireBrand = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_moto_tire_brand'],
      errorMessage: 'Failed to load moto tire brand options.'
   })
}

export const getAutogoodsMotoTireWidth = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_moto_tire_width'],
      errorMessage: 'Failed to load moto tire width options.'
   })
}

export const getAutogoodsMotoTireHeight = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_moto_tire_height'],
      errorMessage: 'Failed to load moto tire height options.'
   })
}

export const getAutogoodsMotoTireDiameter = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_moto_tire_diameter'],
      errorMessage: 'Failed to load moto tire diameter options.'
   })
}

export const getAutogoodsMotoTireAxle = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_moto_tire_axle'],
      errorMessage: 'Failed to load moto tire axle options.'
   })
}

export const getAutogoodsMotorOilCondition = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_motor_oil_condition'],
      errorMessage: 'Failed to load motor oil condition options.'
   })
}

export const getAutogoodsMotorOilBrand = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_motor_oil_brand'],
      errorMessage: 'Failed to load motor oil brand options.'
   })
}

export const getAutogoodsMotorOilViscosityClassSae = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_motor_oil_viscosity_class_sae'],
      errorMessage: 'Failed to load motor oil SAE options.'
   })
}

export const getAutogoodsMotorOilVolume = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_motor_oil_volume'],
      errorMessage: 'Failed to load motor oil volume options.'
   })
}

export const getAutogoodsMotorOilStandartAcea = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_motor_oil_standart_acea'],
      errorMessage: 'Failed to load motor oil ACEA options.'
   })
}

export const getAutogoodsMotorOilStandartApi = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_motor_oil_standart_api'],
      errorMessage: 'Failed to load motor oil API options.'
   })
}

export const getAutogoodsMotorOilAllowOem = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_motor_oil_allow_oem'],
      errorMessage: 'Failed to load motor oil OEM options.'
   })
}

export const getAutogoodsMotorOilArticle = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_motor_oil_article'],
      errorMessage: 'Failed to load motor oil article options.'
   })
}

export const getAutogoodsWheelCondition = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_wheel_condition'],
      errorMessage: 'Failed to load wheel condition options.'
   })
}

export const getAutogoodsWheelCount = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_wheel_count'],
      errorMessage: 'Failed to load wheel count options.'
   })
}

export const getAutogoodsWheelBrand = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_wheel_brand'],
      errorMessage: 'Failed to load wheel brand options.'
   })
}

export const getAutogoodsWheelModel = async (brandId) => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_wheel_model'],
      params: { brand_id: brandId },
      errorMessage: 'Failed to load wheel model options.'
   })
}

export const getAutogoodsWheelStaggeredSet = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_wheel_staggered_set'],
      errorMessage: 'Failed to load wheel staggered set options.'
   })
}

export const getAutogoodsWheelWidth = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_wheel_width'],
      errorMessage: 'Failed to load wheel width options.'
   })
}

export const getAutogoodsWheelHeight = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_wheel_height'],
      errorMessage: 'Failed to load wheel height options.'
   })
}

export const getAutogoodsWheelDiameter = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_wheel_diameter'],
      errorMessage: 'Failed to load wheel diameter options.'
   })
}

export const getAutogoodsWheelWidthRear = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_wheel_width_rear'],
      errorMessage: 'Failed to load rear wheel width options.'
   })
}

export const getAutogoodsWheelHeightRear = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_wheel_height_rear'],
      errorMessage: 'Failed to load rear wheel height options.'
   })
}

export const getAutogoodsWheelDiameterRear = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_wheel_diameter_rear'],
      errorMessage: 'Failed to load rear wheel diameter options.'
   })
}

export const getAutogoodsWheelLoadIndex = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_wheel_load_index'],
      errorMessage: 'Failed to load wheel load index options.'
   })
}

export const getAutogoodsWheelSpeedIndex = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_wheel_speed_index'],
      errorMessage: 'Failed to load wheel speed index options.'
   })
}

export const getAutogoodsWheelSeasonality = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_wheel_seasonality'],
      errorMessage: 'Failed to load wheel seasonality options.'
   })
}

export const getAutogoodsWheelRunFlat = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_wheel_run_flat'],
      errorMessage: 'Failed to load wheel run flat options.'
   })
}

export const getAutogoodsWheelTreadDepth = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_wheel_tread_depth'],
      errorMessage: 'Failed to load wheel tread depth options.'
   })
}

export const getAutogoodsWheelYear = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_wheel_year'],
      errorMessage: 'Failed to load wheel year options.'
   })
}

export const getAutogoodsWheelDiskDiameter = async () => {
   // Backend does not expose a dedicated endpoint for full wheel disk diameter.
   return []
}

export const getAutogoodsWheelDiskHoleCounts = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_wheel_disk_hole_counts'],
      errorMessage: 'Failed to load wheel disk hole count options.'
   })
}

export const getAutogoodsWheelDiskHoleDiameter = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_wheel_disk_hole_diameter'],
      errorMessage: 'Failed to load wheel disk hole diameter options.'
   })
}

export const getAutogoodsWheelDiskType = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_wheel_type_disk'],
      errorMessage: 'Failed to load wheel disk type options.'
   })
}

export const getAutogoodsWheelDiskDia = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_wheel_dia'],
      errorMessage: 'Failed to load wheel DIA options.'
   })
}

export const getAutogoodsWheelOffsetEt = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_wheel_et_offset'],
      errorMessage: 'Failed to load wheel ET options.'
   })
}

export const getAutogoodsWheelDiskWidth = async () => {
   return requestAutogoodsOptions({
      endpoints: ['/get_autogoods_wheel_rim_width'],
      errorMessage: 'Failed to load wheel disk width options.'
   })
}

// Backward-compatible aliases used across existing modules.
export const getAutogoodsTireSectionWidth = getAutogoodsTireWidth
export const getAutogoodsTireAspectRatio = getAutogoodsTireHeight
export const getAutogoodsTireRimDiameter = getAutogoodsTireDiameter
export const getAutogoodsTireLoadIndice = getAutogoodsTireLoadIndex
export const getAutogoodsTireSpeedIndice = getAutogoodsTireSpeedIndex
export const getAutogoodsTireHomologation = getAutogoodsTireRunFlat
