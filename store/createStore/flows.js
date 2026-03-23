export const CREATE_FLOW_CARS = 'cars'
export const CREATE_FLOW_PARTS_CAR_TIRES = 'parts-car-tires'
export const CREATE_FLOW_PARTS_CAR_DISKS = 'parts-car-disks'
export const CREATE_FLOW_PARTS_MOTO_TIRES = 'parts-moto-tires'
export const CREATE_FLOW_PARTS_FULL_WHEELS = 'parts-full-wheels'
export const CREATE_FLOW_PARTS_MOTOR_OIL = 'parts-motor-oil'
export const CREATE_FLOW_MOTO_MOTORCYCLES = 'moto-motorcycles'
export const CREATE_FLOW_MOTO_SCOOTERS = 'moto-scooters'

export const isTiresCreateFlow = (flow) => flow === CREATE_FLOW_PARTS_CAR_TIRES
export const isDisksCreateFlow = (flow) => flow === CREATE_FLOW_PARTS_CAR_DISKS
export const isMotoTiresCreateFlow = (flow) =>
   flow === CREATE_FLOW_PARTS_MOTO_TIRES
export const isFullWheelsCreateFlow = (flow) =>
   flow === CREATE_FLOW_PARTS_FULL_WHEELS
export const isMotorOilCreateFlow = (flow) =>
   flow === CREATE_FLOW_PARTS_MOTOR_OIL
export const isMotoMotorcyclesCreateFlow = (flow) =>
   flow === CREATE_FLOW_MOTO_MOTORCYCLES
export const isMotoScootersCreateFlow = (flow) =>
   flow === CREATE_FLOW_MOTO_SCOOTERS

export const isMotoCreateFlow = (flow) =>
   isMotoMotorcyclesCreateFlow(flow) || isMotoScootersCreateFlow(flow)

export const isPartsWheelsFlow = (flow) =>
   isTiresCreateFlow(flow) ||
   isDisksCreateFlow(flow) ||
   isMotoTiresCreateFlow(flow) ||
   isFullWheelsCreateFlow(flow)

export const isAutogoodsCreateFlow = (flow) =>
   isPartsWheelsFlow(flow) || isMotorOilCreateFlow(flow)

export const isTwoStepCreateFlow = (flow) =>
   isAutogoodsCreateFlow(flow) || isMotoCreateFlow(flow)

export const shouldShowPhotosOnCreateAdStep = (flow) =>
   isPartsWheelsFlow(flow) ||
   isMotorOilCreateFlow(flow) ||
   isMotoCreateFlow(flow)

export const resolveCreateFlow = (flow = CREATE_FLOW_CARS) => {
   if (isTiresCreateFlow(flow)) return CREATE_FLOW_PARTS_CAR_TIRES
   if (isDisksCreateFlow(flow)) return CREATE_FLOW_PARTS_CAR_DISKS
   if (isMotoTiresCreateFlow(flow)) return CREATE_FLOW_PARTS_MOTO_TIRES
   if (isFullWheelsCreateFlow(flow)) return CREATE_FLOW_PARTS_FULL_WHEELS
   if (isMotorOilCreateFlow(flow)) return CREATE_FLOW_PARTS_MOTOR_OIL
   if (isMotoMotorcyclesCreateFlow(flow)) return CREATE_FLOW_MOTO_MOTORCYCLES
   if (isMotoScootersCreateFlow(flow)) return CREATE_FLOW_MOTO_SCOOTERS
   return CREATE_FLOW_CARS
}
