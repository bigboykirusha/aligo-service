import { getCarsFiltered } from '@/services/apiClient'

const createEmptyFilteredCarsResponse = () => ({
   data: [],
   totalCount: 0,
   seo: null
})

export const fetchFilteredCarsByPayload = async (payload) => {
   try {
      const filteredCars = await getCarsFiltered(payload)
      return {
         data: Array.isArray(filteredCars?.data) ? filteredCars.data : [],
         totalCount: Number(filteredCars?.totalCount || 0),
         seo: filteredCars?.seo || null
      }
   } catch (error) {
      console.error('Failed to fetch filtered cars.', error)
      return createEmptyFilteredCarsResponse()
   }
}

