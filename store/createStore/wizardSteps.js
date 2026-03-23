import {
   isDisksCreateFlow,
   isFullWheelsCreateFlow,
   isMotoMotorcyclesCreateFlow,
   isMotoScootersCreateFlow,
   isMotoTiresCreateFlow,
   isMotorOilCreateFlow,
   isTiresCreateFlow
} from './flows'

export const CREATE_WIZARD_STEP_AUTOS_PARAMETERS = 'autos-parameters'
export const CREATE_WIZARD_STEP_AUTOS_OPTIONS = 'autos-options'
export const CREATE_WIZARD_STEP_AD_DETAILS = 'ad-details'
export const CREATE_WIZARD_STEP_PARTS_TIRES_PARAMETERS = 'parts-tires-parameters'
export const CREATE_WIZARD_STEP_PARTS_DISKS_PARAMETERS = 'parts-disks-parameters'
export const CREATE_WIZARD_STEP_PARTS_MOTO_TIRES_PARAMETERS =
   'parts-moto-tires-parameters'
export const CREATE_WIZARD_STEP_PARTS_FULL_WHEELS_PARAMETERS =
   'parts-full-wheels-parameters'
export const CREATE_WIZARD_STEP_PARTS_MOTOR_OIL_PARAMETERS =
   'parts-motor-oil-parameters'
export const CREATE_WIZARD_STEP_MOTO_MOTORCYCLES_PARAMETERS =
   'moto-motorcycles-parameters'
export const CREATE_WIZARD_STEP_MOTO_SCOOTERS_PARAMETERS =
   'moto-scooters-parameters'

export const resolveCreateWizardParametersStepKey = (flow) => {
   if (isTiresCreateFlow(flow)) return CREATE_WIZARD_STEP_PARTS_TIRES_PARAMETERS
   if (isDisksCreateFlow(flow)) return CREATE_WIZARD_STEP_PARTS_DISKS_PARAMETERS
   if (isMotoTiresCreateFlow(flow))
      return CREATE_WIZARD_STEP_PARTS_MOTO_TIRES_PARAMETERS
   if (isFullWheelsCreateFlow(flow))
      return CREATE_WIZARD_STEP_PARTS_FULL_WHEELS_PARAMETERS
   if (isMotorOilCreateFlow(flow))
      return CREATE_WIZARD_STEP_PARTS_MOTOR_OIL_PARAMETERS
   if (isMotoMotorcyclesCreateFlow(flow))
      return CREATE_WIZARD_STEP_MOTO_MOTORCYCLES_PARAMETERS
   if (isMotoScootersCreateFlow(flow))
      return CREATE_WIZARD_STEP_MOTO_SCOOTERS_PARAMETERS
   return CREATE_WIZARD_STEP_AUTOS_PARAMETERS
}

export const getCreateWizardStepKeysByFlow = (flow) => {
   if (
      isTiresCreateFlow(flow) ||
      isDisksCreateFlow(flow) ||
      isMotoTiresCreateFlow(flow) ||
      isFullWheelsCreateFlow(flow) ||
      isMotorOilCreateFlow(flow) ||
      isMotoMotorcyclesCreateFlow(flow) ||
      isMotoScootersCreateFlow(flow)
   ) {
      return [resolveCreateWizardParametersStepKey(flow), CREATE_WIZARD_STEP_AD_DETAILS]
   }

   return [
      CREATE_WIZARD_STEP_AUTOS_PARAMETERS,
      CREATE_WIZARD_STEP_AUTOS_OPTIONS,
      CREATE_WIZARD_STEP_AD_DETAILS
   ]
}
