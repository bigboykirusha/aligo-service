import { defineAsyncComponent } from 'vue'
import {
   CREATE_WIZARD_STEP_AD_DETAILS,
   CREATE_WIZARD_STEP_AUTOS_OPTIONS,
   CREATE_WIZARD_STEP_AUTOS_PARAMETERS,
   CREATE_WIZARD_STEP_MOTO_MOTORCYCLES_PARAMETERS,
   CREATE_WIZARD_STEP_MOTO_SCOOTERS_PARAMETERS,
   CREATE_WIZARD_STEP_PARTS_DISKS_PARAMETERS,
   CREATE_WIZARD_STEP_PARTS_FULL_WHEELS_PARAMETERS,
   CREATE_WIZARD_STEP_PARTS_MOTO_TIRES_PARAMETERS,
   CREATE_WIZARD_STEP_PARTS_MOTOR_OIL_PARAMETERS,
   CREATE_WIZARD_STEP_PARTS_TIRES_PARAMETERS
} from '@/store/createStore/wizardSteps'

export const CREATE_WIZARD_STEP_COMPONENTS = {
   [CREATE_WIZARD_STEP_AUTOS_PARAMETERS]: defineAsyncComponent(
      () => import('@/components/create/forms/steps/CreateAutosParametersForm.vue')
   ),
   [CREATE_WIZARD_STEP_AUTOS_OPTIONS]: defineAsyncComponent(
      () => import('@/components/create/forms/steps/CreateAutosOptionsForm.vue')
   ),
   [CREATE_WIZARD_STEP_AD_DETAILS]: defineAsyncComponent(
      () => import('@/components/create/forms/steps/CreateAdDetailsForm.vue')
   ),
   [CREATE_WIZARD_STEP_PARTS_TIRES_PARAMETERS]: defineAsyncComponent(
      () =>
         import(
            '@/components/create/forms/parameters/CreatePassengerTiresParametersForm.vue'
         )
   ),
   [CREATE_WIZARD_STEP_PARTS_DISKS_PARAMETERS]: defineAsyncComponent(
      () =>
         import(
            '@/components/create/forms/parameters/CreatePassengerDisksParametersForm.vue'
         )
   ),
   [CREATE_WIZARD_STEP_PARTS_MOTO_TIRES_PARAMETERS]: defineAsyncComponent(
      () =>
         import(
            '@/components/create/forms/parameters/CreatePassengerMotoTiresParametersForm.vue'
         )
   ),
   [CREATE_WIZARD_STEP_PARTS_FULL_WHEELS_PARAMETERS]: defineAsyncComponent(
      () =>
         import(
            '@/components/create/forms/parameters/CreatePassengerFullWheelsParametersForm.vue'
         )
   ),
   [CREATE_WIZARD_STEP_PARTS_MOTOR_OIL_PARAMETERS]: defineAsyncComponent(
      () =>
         import(
            '@/components/create/forms/parameters/CreateMotorOilParametersForm.vue'
         )
   ),
   [CREATE_WIZARD_STEP_MOTO_MOTORCYCLES_PARAMETERS]: defineAsyncComponent(
      () =>
         import(
            '@/components/create/forms/parameters/CreateMotoMotorcycleParametersForm.vue'
         )
   ),
   [CREATE_WIZARD_STEP_MOTO_SCOOTERS_PARAMETERS]: defineAsyncComponent(
      () =>
         import(
            '@/components/create/forms/parameters/CreateMotoScooterParametersForm.vue'
         )
   )
}

export const resolveCreateWizardStepComponent = (stepKey) =>
   CREATE_WIZARD_STEP_COMPONENTS[stepKey] || null
