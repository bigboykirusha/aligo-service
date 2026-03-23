import {
   CREATE_FLOW_CARS,
   CREATE_FLOW_PARTS_CAR_DISKS,
   CREATE_FLOW_PARTS_CAR_TIRES,
   CREATE_FLOW_PARTS_FULL_WHEELS,
   CREATE_FLOW_PARTS_MOTO_TIRES,
   CREATE_FLOW_PARTS_MOTOR_OIL,
   isMotoCreateFlow
} from './flows'

const CARS_TABS = [
   { index: 1, label: 'Характеристики' },
   { index: 2, label: 'Опции' },
   { index: 3, label: 'Объявление' }
]

const PARTS_TABS = [
   { index: 1, label: 'Параметры товара' },
   { index: 2, label: 'Объявление' }
]

const MOTO_TABS = [
   { index: 1, label: 'Параметры техники' },
   { index: 2, label: 'Объявление' }
]

const cloneTabs = (tabs) => tabs.map((tab) => ({ ...tab }))

const isPartsCreateFlow = (flow) =>
   flow === CREATE_FLOW_PARTS_CAR_TIRES ||
   flow === CREATE_FLOW_PARTS_CAR_DISKS ||
   flow === CREATE_FLOW_PARTS_MOTO_TIRES ||
   flow === CREATE_FLOW_PARTS_FULL_WHEELS ||
   flow === CREATE_FLOW_PARTS_MOTOR_OIL

export const getCreateTabsByFlow = (flow = CREATE_FLOW_CARS) =>
   isMotoCreateFlow(flow)
      ? cloneTabs(MOTO_TABS)
      : isPartsCreateFlow(flow)
         ? cloneTabs(PARTS_TABS)
         : cloneTabs(CARS_TABS)

