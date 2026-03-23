import {
   getMotoAvailability,
   getMotoCondition,
   getMotoCountCylinder,
   getMotoCountOwner,
   getMotoCylinderPosition,
   getMotoDriveType,
   getMotoEngineCooling,
   getMotoEngineType,
   getMotoFuelFeed,
   getMotoNumberOfGears,
   getMotoPts,
   getMotoStroke,
   getMotoTransmission,
   getMotorcycleBrand,
   getMotorcycleModel,
   getMotorcycleType,
   getYear
} from '~/services/apiClient'
import { useCreateMotoParametersModel } from '~/composables/create/useCreateMotoParametersModel'

export const useCreateMotoMotorcycleParametersModel = () =>
   useCreateMotoParametersModel({
      flowKey: 'moto_motorcycle',
      brandLoader: getMotorcycleBrand,
      modelLoader: getMotorcycleModel,
      typeLoader: getMotorcycleType,
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
      countOwnerLoader: getMotoCountOwner,
      extraLoaders: {
         countCylinderOptions: getMotoCountCylinder,
         cylinderPositionOptions: getMotoCylinderPosition
      }
   })
