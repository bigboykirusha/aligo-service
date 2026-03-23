import { defineStore } from 'pinia'
import {
   CREATE_FLOW_CARS,
   CREATE_FLOW_MOTO_MOTORCYCLES,
   CREATE_FLOW_MOTO_SCOOTERS,
   CREATE_FLOW_PARTS_CAR_DISKS,
   CREATE_FLOW_PARTS_CAR_TIRES,
   CREATE_FLOW_PARTS_FULL_WHEELS,
   CREATE_FLOW_PARTS_MOTO_TIRES,
   CREATE_FLOW_PARTS_MOTOR_OIL,
   isDisksCreateFlow,
   isFullWheelsCreateFlow,
   isMotoMotorcyclesCreateFlow,
   isMotoScootersCreateFlow,
   isMotoTiresCreateFlow,
   isMotorOilCreateFlow,
   isTiresCreateFlow
} from './createStore/flows'
import { createInitialCreateState } from './createStore/state'
import {
   isAdFieldsFilled as isAdFieldsFilledByFlow,
   isCharacteristicFieldsFilled as isCharacteristicFieldsFilledByFlow
} from './createStore/validation'
import { isAnyCreateFieldFilled } from './createStore/getters'
import { getCreateTabsByFlow } from './createStore/tabs'
import {
   autoSaveCreateField,
   autoSaveCreateFields,
   initializeCreateUserData,
   setCreateFieldWithAutosave,
   updateCreateConditionDependentFields
} from './createStore/dataActions'
import {
   resetCreateStoreState,
   setCreateFlowState,
   setCreateStoreActiveTab
} from './createStore/uiStateActions'
import { useUserStore } from './user'
import {
   hydrateCreateStoreFromApiById,
   sendCreateStoreAdByFlow,
   updateCreateStoreAdByFlow
} from './createStore/storeAdActions'

export {
   CREATE_FLOW_CARS,
   CREATE_FLOW_MOTO_MOTORCYCLES,
   CREATE_FLOW_MOTO_SCOOTERS,
   CREATE_FLOW_PARTS_CAR_DISKS,
   CREATE_FLOW_PARTS_CAR_TIRES,
   CREATE_FLOW_PARTS_FULL_WHEELS,
   CREATE_FLOW_PARTS_MOTO_TIRES,
   CREATE_FLOW_PARTS_MOTOR_OIL
}

export const useCreateStore = defineStore('create', {
   state: () => ({
      ...createInitialCreateState(),
      activeTab: 1,
      tabs: getCreateTabsByFlow(CREATE_FLOW_CARS)
   }),
   getters: {
      isCarsFlow: (state) => state.create_flow === CREATE_FLOW_CARS,
      isPassengerTiresFlow: (state) => isTiresCreateFlow(state.create_flow),
      isPassengerDisksFlow: (state) => isDisksCreateFlow(state.create_flow),
      isPassengerMotoTiresFlow: (state) =>
         isMotoTiresCreateFlow(state.create_flow),
      isPassengerFullWheelsFlow: (state) =>
         isFullWheelsCreateFlow(state.create_flow),
      isMotorOilFlow: (state) => isMotorOilCreateFlow(state.create_flow),
      isMotoMotorcyclesFlow: (state) =>
         isMotoMotorcyclesCreateFlow(state.create_flow),
      isMotoScootersFlow: (state) => isMotoScootersCreateFlow(state.create_flow),
      isAutosaveInProgress: (state) => state.autosave_pending_count > 0,
      hasAutosaveError: (state) => Boolean(state.autosave_last_error),
      isCharacteristicFieldsFilled: (state) =>
         isCharacteristicFieldsFilledByFlow(state),
      isAdFieldsFilled: (state) => isAdFieldsFilledByFlow(state),
      isAnyFieldFilled: (state) => isAnyCreateFieldFilled(state)
   },
   actions: {
      setCreateFlow(flow = CREATE_FLOW_CARS) {
         setCreateFlowState({ store: this, flow })
      },

      async initializeUserData() {
         const userStore = useUserStore()
         await initializeCreateUserData({
            store: this,
            userStore
         })
      },

      async updateConditionDependentFields() {
         await updateCreateConditionDependentFields({ store: this })
      },

      async setField(field, value) {
         return setCreateFieldWithAutosave({
            store: this,
            field,
            value
         })
      },

      setPhotos(photos) {
         this.photos = photos
      },

      removePhoto(index) {
         this.photos.splice(index, 1)
      },

      setColorId(color_ids) {
         this.color_ids = color_ids
      },

      setColorCustom(color_custom) {
         this.color_custom = color_custom
      },

      async autoSaveField(field, value) {
         return autoSaveCreateField({
            store: this,
            field,
            value
         })
      },

      async autoSaveFields(patch) {
         return autoSaveCreateFields({
            store: this,
            patch
         })
      },

      async sendAd(formData) {
         return sendCreateStoreAdByFlow({
            store: this,
            formData
         })
      },

      async updateAd(formData) {
         return updateCreateStoreAdByFlow({
            store: this,
            formData
         })
      },

      async setStoreFromApi(id, options = {}) {
         const userStore = useUserStore()
         return hydrateCreateStoreFromApiById({
            store: this,
            id,
            userStore,
            ...options
         })
      },

      resetParams() {
         resetCreateStoreState({ store: this })
      },

      setActiveTab(index) {
         setCreateStoreActiveTab({ store: this, index })
      }
   }
})

