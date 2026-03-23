import {
   getMotoAvailability,
   getMotoCondition,
   getMotoCountOwner,
   getMotoDriveType,
   getMotoEngineCooling,
   getMotoEngineType,
   getMotoFuelFeed,
   getMotoNumberOfGears,
   getMotoPts,
   getMotoStroke,
   getMotoTransmission,
   getMopedBrand,
   getMopedModel,
   getMopedType,
   getYear
} from '~/services/apiClient'
import { useCreateMotoParametersModel } from '~/composables/create/useCreateMotoParametersModel'

export const useCreateMotoScooterParametersModel = () =>
   useCreateMotoParametersModel({
      flowKey: 'moto_scooter',
      brandLoader: getMopedBrand,
      modelLoader: getMopedModel,
      typeLoader: getMopedType,
      yearLoader: getYear,
      conditionLoader: getMotoCondition,
      availabilityLoader: getMotoAvailability,
      engineTypeLoader: getMotoEngineType,
      fuelFeedLoader: getMotoFuelFeed,
      driveTypeLoader: getMotoDriveType,
      strokeLoader: getMotoStroke,
      transmissionLoader: getMotoTransmission,
      numberOfGearsLoader: getMotoNumberOfGears,
      engineCoolingLoader: getMotoEngineCooling,
      ptsLoader: getMotoPts,
      countOwnerLoader: getMotoCountOwner
   })
