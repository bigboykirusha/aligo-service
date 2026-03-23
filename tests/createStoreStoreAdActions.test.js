import { describe, expect, it, vi, beforeEach } from 'vitest'
import {
   CREATE_FLOW_CARS,
   CREATE_FLOW_PARTS_CAR_TIRES,
   CREATE_FLOW_PARTS_MOTOR_OIL,
   CREATE_FLOW_MOTO_MOTORCYCLES,
   CREATE_FLOW_MOTO_SCOOTERS
} from '../store/createStore/flows'

const hoisted = vi.hoisted(() => ({
   getCarById: vi.fn(),
   getMotoById: vi.fn(),
   getAutogoodsById: vi.fn(),
   createAutogoodsAd: vi.fn(),
   createCarAd: vi.fn(),
   createMotoAd: vi.fn(),
   updateAutogoodsAd: vi.fn(),
   updateCarAd: vi.fn(),
   updateMotoAd: vi.fn()
}))

vi.mock(
   '@/services/apiClient',
   () => ({
      getCarById: hoisted.getCarById,
      getMotoById: hoisted.getMotoById,
      getAutogoodsById: hoisted.getAutogoodsById,
      createAutogoodsAd: hoisted.createAutogoodsAd,
      createCarAd: hoisted.createCarAd,
      createMotoAd: hoisted.createMotoAd,
      updateAutogoodsAd: hoisted.updateAutogoodsAd,
      updateCarAd: hoisted.updateCarAd,
      updateMotoAd: hoisted.updateMotoAd
   }),
   { virtual: true }
)

describe('create store ad actions hydrate', () => {
   beforeEach(() => {
      hoisted.getCarById.mockReset()
      hoisted.getMotoById.mockReset()
      hoisted.getAutogoodsById.mockReset()
      hoisted.createAutogoodsAd.mockReset()
      hoisted.createCarAd.mockReset()
      hoisted.createMotoAd.mockReset()
      hoisted.updateAutogoodsAd.mockReset()
      hoisted.updateCarAd.mockReset()
      hoisted.updateMotoAd.mockReset()
      vi.resetModules()
   })

   it('uses motos endpoint first when route main_category_id points to moto', async () => {
      const { hydrateCreateStoreFromApiById } = await import(
         '../store/createStore/storeAdActions'
      )

      hoisted.getMotoById.mockResolvedValue({
         id: 997,
         main_category_id: 2,
         sub_category_id: 1,
         sub_category: { id: 1, title: 'Мотоциклы' },
         ads_parameter: {}
      })

      const store = {
         create_flow: CREATE_FLOW_CARS,
         setCreateFlow: vi.fn()
      }

      await hydrateCreateStoreFromApiById({
         store,
         id: 997,
         userStore: {},
         routeMainCategoryId: 2
      })

      expect(hoisted.getMotoById).toHaveBeenCalledWith(997)
      expect(hoisted.getCarById).not.toHaveBeenCalled()
   })

   it.each([
      {
         subCategoryId: 1,
         expectedFlow: CREATE_FLOW_MOTO_MOTORCYCLES
      },
      {
         subCategoryId: 2,
         expectedFlow: CREATE_FLOW_MOTO_SCOOTERS
      }
   ])(
      'hydrates moto draft to correct flow by sub_category_id=$subCategoryId',
      async ({ subCategoryId, expectedFlow }) => {
         const { hydrateCreateStoreFromApiById } = await import(
            '../store/createStore/storeAdActions'
         )

         hoisted.getMotoById.mockResolvedValue({
            id: 997,
            main_category_id: 2,
            sub_category_id: subCategoryId,
            sub_category: {
               id: subCategoryId,
               title: subCategoryId === 1 ? 'motorcycles' : 'scooters'
            },
            ads_parameter: {}
         })

         const store = {
            create_flow: CREATE_FLOW_CARS,
            setCreateFlow: vi.fn()
         }

         await hydrateCreateStoreFromApiById({
            store,
            id: 997,
            userStore: {},
            routeMainCategoryId: 2
         })

         expect(store.setCreateFlow).toHaveBeenCalledWith(expectedFlow)
         expect(hoisted.getCarById).not.toHaveBeenCalled()
      }
   )

   it('uses autos endpoint first when route main_category_id points to cars', async () => {
      const { hydrateCreateStoreFromApiById } = await import(
         '../store/createStore/storeAdActions'
      )

      hoisted.getCarById.mockResolvedValue({
         id: 4230,
         main_category_id: 1,
         ads_parameter: {}
      })

      const store = {
         create_flow: CREATE_FLOW_CARS,
         setCreateFlow: vi.fn()
      }

      await hydrateCreateStoreFromApiById({
         store,
         id: 4230,
         userStore: {},
         routeQuery: { main_category_id: 1 }
      })

      expect(hoisted.getCarById).toHaveBeenCalledWith(4230)
      expect(hoisted.getMotoById).not.toHaveBeenCalled()
   })

   it('throws explicit mismatch error for cars route hint with moto payload', async () => {
      const { hydrateCreateStoreFromApiById } = await import(
         '../store/createStore/storeAdActions'
      )

      hoisted.getCarById.mockResolvedValue({
         id: 997,
         main_category_id: 2,
         ads_parameter: {}
      })

      const store = {
         create_flow: CREATE_FLOW_CARS,
         setCreateFlow: vi.fn()
      }

      await expect(
         hydrateCreateStoreFromApiById({
            store,
            id: 997,
            userStore: {},
            routeMainCategoryId: 1
         })
      ).rejects.toThrow('Draft category mismatch')
   })

   it('keeps fallback probing when route hint is absent', async () => {
      const { hydrateCreateStoreFromApiById } = await import(
         '../store/createStore/storeAdActions'
      )

      hoisted.getCarById.mockResolvedValue({
         id: 997,
         main_category_id: 2,
         ads_parameter: {}
      })
      hoisted.getMotoById.mockResolvedValue({
         id: 997,
         main_category_id: 2,
         sub_category_id: 1,
         sub_category: { id: 1, title: 'Мотоциклы' },
         ads_parameter: {}
      })

      const store = {
         create_flow: CREATE_FLOW_CARS,
         setCreateFlow: vi.fn()
      }

      await hydrateCreateStoreFromApiById({
         store,
         id: 997,
         userStore: {}
      })

      expect(hoisted.getCarById).toHaveBeenCalledWith(997)
      expect(hoisted.getMotoById).toHaveBeenCalledWith(997)
      expect(store.setCreateFlow).toHaveBeenCalledWith(
         CREATE_FLOW_MOTO_MOTORCYCLES
      )
   })

   it('falls back to autogoods when autos endpoint returns unsuccessful payload', async () => {
      const { hydrateCreateStoreFromApiById } = await import(
         '../store/createStore/storeAdActions'
      )

      hoisted.getCarById.mockResolvedValue({
         success: false,
         message: 'not found'
      })
      hoisted.getAutogoodsById.mockResolvedValue({
         id: 25,
         main_category_id: 3,
         sub_category_id: 1,
         last_category_id: 1,
         entity: {
            condition: { id: 2 },
            brand: { id: 7 }
         },
         ads_parameter: {}
      })

      const store = {
         create_flow: CREATE_FLOW_CARS,
         setCreateFlow: vi.fn()
      }

      await hydrateCreateStoreFromApiById({
         store,
         id: 25,
         userStore: {}
      })

      expect(hoisted.getCarById).toHaveBeenCalledWith(25)
      expect(hoisted.getAutogoodsById).toHaveBeenCalledWith(25)
      expect(store.setCreateFlow).toHaveBeenCalledWith(CREATE_FLOW_CARS)
   })

   it('falls back to autos payload when autogoods route hint returns unsuccessful payload', async () => {
      const { hydrateCreateStoreFromApiById } = await import(
         '../store/createStore/storeAdActions'
      )

      hoisted.getAutogoodsById.mockResolvedValue({
         success: false,
         message: 'not found'
      })
      hoisted.getCarById.mockResolvedValue({
         id: 25,
         main_category_id: 3,
         sub_category_id: 1,
         last_category_id: 1,
         ads_parameter: {}
      })

      const store = {
         create_flow: CREATE_FLOW_PARTS_CAR_TIRES,
         setCreateFlow: vi.fn()
      }

      await hydrateCreateStoreFromApiById({
         store,
         id: 25,
         userStore: {},
         routeMainCategoryId: 3
      })

      expect(hoisted.getAutogoodsById).toHaveBeenCalledWith(25)
      expect(hoisted.getCarById).toHaveBeenCalledWith(25)
   })
})

describe('create store ad actions mutations', () => {
   beforeEach(() => {
      hoisted.createAutogoodsAd.mockReset()
      hoisted.createCarAd.mockReset()
      hoisted.createMotoAd.mockReset()
      hoisted.getAutogoodsById.mockReset()
      hoisted.updateAutogoodsAd.mockReset()
      hoisted.updateCarAd.mockReset()
      hoisted.updateMotoAd.mockReset()
      vi.resetModules()
   })

   it('uses autogoods endpoint and remaps tires payload fields on create', async () => {
      const { sendCreateStoreAdByFlow } = await import(
         '../store/createStore/storeAdActions'
      )

      hoisted.createAutogoodsAd.mockResolvedValue({ success: true, id: 11 })

      const formData = new FormData()
      formData.append('tires_condition_id', '2')
      formData.append('tires_count', '4')
      formData.append('tires_brand_id', '15')
      formData.append('tires_model_id', '77')
      formData.append('ads_description', 'desc')

      await sendCreateStoreAdByFlow({
         store: {
            create_flow: CREATE_FLOW_PARTS_CAR_TIRES,
            main_category_id: 3,
            sub_category_id: 1,
            last_category_id: 1
         },
         formData
      })

      expect(hoisted.createAutogoodsAd).toHaveBeenCalledTimes(1)
      expect(hoisted.createCarAd).not.toHaveBeenCalled()

      const requestFormData = hoisted.createAutogoodsAd.mock.calls[0][0]
      expect(requestFormData.get('condition_id')).toBe('2')
      expect(requestFormData.get('count_id')).toBe('4')
      expect(requestFormData.get('brand_id')).toBe('15')
      expect(requestFormData.get('model_id')).toBe('77')
      expect(requestFormData.get('main_category_id')).toBe('3')
      expect(requestFormData.get('sub_category_id')).toBe('1')
      expect(requestFormData.get('last_category_id')).toBe('1')
      expect(requestFormData.get('tires_condition_id')).toBeNull()
      expect(requestFormData.get('place_inspection')).toBeNull()
   })

   it('uses autogoods endpoint on update for parts flow', async () => {
      const { updateCreateStoreAdByFlow } = await import(
         '../store/createStore/storeAdActions'
      )

      hoisted.updateAutogoodsAd.mockResolvedValue({ success: true, id: 22 })

      const formData = new FormData()
      formData.append('motor_oil_brand_id', '9')

      await updateCreateStoreAdByFlow({
         store: {
            id: 22,
            create_flow: CREATE_FLOW_PARTS_MOTOR_OIL,
            main_category_id: 3,
            sub_category_id: 10,
            last_category_id: 7
         },
         formData
      })

      expect(hoisted.updateAutogoodsAd).toHaveBeenCalledTimes(1)
      expect(hoisted.updateCarAd).not.toHaveBeenCalled()
   })

   it('keeps place_inspection in cars create payload', async () => {
      const { sendCreateStoreAdByFlow } = await import(
         '../store/createStore/storeAdActions'
      )

      hoisted.createCarAd.mockResolvedValue({ success: true, id: 13 })

      const formData = new FormData()
      formData.append('ads_description', 'desc')
      formData.append('place_inspection', 'Россия, Москва')

      await sendCreateStoreAdByFlow({
         store: {
            create_flow: CREATE_FLOW_CARS,
            main_category_id: 1
         },
         formData
      })

      expect(hoisted.createCarAd).toHaveBeenCalledTimes(1)
      const requestFormData = hoisted.createCarAd.mock.calls[0][0]
      expect(requestFormData.get('place_inspection')).toBe('Россия, Москва')
   })

   it('keeps place_inspection in moto create payload', async () => {
      const { sendCreateStoreAdByFlow } = await import(
         '../store/createStore/storeAdActions'
      )

      hoisted.createMotoAd.mockResolvedValue({ success: true, id: 14 })

      const formData = new FormData()
      formData.append('ads_description', 'desc')
      formData.append('place_inspection', 'Россия, Москва')

      await sendCreateStoreAdByFlow({
         store: {
            create_flow: CREATE_FLOW_MOTO_MOTORCYCLES,
            main_category_id: 2,
            sub_category_id: 1
         },
         formData
      })

      expect(hoisted.createMotoAd).toHaveBeenCalledTimes(1)
      const requestFormData = hoisted.createMotoAd.mock.calls[0][0]
      expect(requestFormData.get('place_inspection')).toBe('Россия, Москва')
   })

   it('keeps place_inspection in autogoods create payload', async () => {
      const { sendCreateStoreAdByFlow } = await import(
         '../store/createStore/storeAdActions'
      )

      hoisted.createAutogoodsAd.mockResolvedValue({ success: true, id: 15 })

      const formData = new FormData()
      formData.append('tires_condition_id', '2')
      formData.append('place_inspection', 'Россия, Москва')

      await sendCreateStoreAdByFlow({
         store: {
            create_flow: CREATE_FLOW_PARTS_CAR_TIRES,
            main_category_id: 3,
            sub_category_id: 1,
            last_category_id: 1
         },
         formData
      })

      expect(hoisted.createAutogoodsAd).toHaveBeenCalledTimes(1)
      const requestFormData = hoisted.createAutogoodsAd.mock.calls[0][0]
      expect(requestFormData.get('place_inspection')).toBe('Россия, Москва')
   })
})
