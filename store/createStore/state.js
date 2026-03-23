import {
   createAdSection,
   createCommonCharacteristicsSection,
   createMetaSection
} from './stateSections/baseState'
import {
   createMaintenanceSection,
   createOptionsFlagsSection,
   createOptionsIdsSection,
   createRegistrationAndSpecsSection
} from './stateSections/autoState'
import {
   createFullWheelsSection,
   createMotoTiresSection,
   createMotorOilSection,
   createPassengerDisksSection,
   createPassengerTiresSection
} from './stateSections/partsState'
import {
   createMotoMotorcycleSection,
   createMotoScooterSection
} from './stateSections/motoState'

export const createInitialCreateState = () => ({
   ...createMetaSection(),
   ...createCommonCharacteristicsSection(),
   ...createPassengerTiresSection(),
   ...createPassengerDisksSection(),
   ...createMotoTiresSection(),
   ...createFullWheelsSection(),
   ...createMotorOilSection(),
   ...createMotoMotorcycleSection(),
   ...createMotoScooterSection(),
   ...createRegistrationAndSpecsSection(),
   ...createMaintenanceSection(),
   ...createOptionsIdsSection(),
   ...createOptionsFlagsSection(),
   ...createAdSection()
})

export const createResetCreateState = () => {
   const resetState = createInitialCreateState()
   delete resetState.currency_id
   delete resetState.phone
   delete resetState.email
   delete resetState.username

   return {
      ...resetState,
      is_service_book: 0,
      is_serviced_dealer: 0,
      is_under_warranty: 0
   }
}
