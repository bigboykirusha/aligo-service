import { CREATE_FLOW_CARS } from './flows'
import {
   mapAdParamsPatch,
   mapAppearancePatch,
   mapHistoryAndMaintenancePatch,
   mapMetaPatch,
   mapOptionsPatch,
   mapRegistrationPatch,
   mapTechnicalSpecsPatch,
   mapUserContactPatch
} from './mappers/coreMappers'
import { mapPartsFieldsPatch } from './mappers/partsFieldsMapper'
import { asObject } from './mappers/utils'

export const mapCreateStoreFromCarData = (
   carData = {},
   userStore = {},
   { fallbackFlow = CREATE_FLOW_CARS } = {}
) => {
   const source = asObject(carData)
   const adParamsPatch = mapAdParamsPatch(source)

   return {
      ...mapMetaPatch(source, fallbackFlow),
      ...mapPartsFieldsPatch(source, fallbackFlow),
      ...mapAppearancePatch(source),
      ...mapRegistrationPatch(source),
      ...mapTechnicalSpecsPatch(source),
      ...mapHistoryAndMaintenancePatch(source),
      ...mapOptionsPatch(source),
      ...adParamsPatch,
      ...mapUserContactPatch(asObject(userStore), adParamsPatch)
   }
}
