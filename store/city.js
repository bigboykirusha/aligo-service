import { defineStore } from 'pinia'
import { useCookie } from '#app'

const DEFAULT_CITY = {
   name: '\u041c\u043e\u0441\u043a\u0432\u0430',
   id: '365',
   translit: 'moskva'
}

export const useCityStore = defineStore('city', {
   state: () => ({
      selectedCity: {
         name: useCookie('city_name').value || DEFAULT_CITY.name,
         id: useCookie('city_id').value || DEFAULT_CITY.id,
         translit: useCookie('city_translit').value || DEFAULT_CITY.translit
      }
   }),
   actions: {
      setSelectedCity(city) {
         if (!city || !city.id) {
            console.error('Invalid city data:', city)
            return
         }

         this.selectedCity = {
            name: city.name,
            id: city.id,
            translit: city.translit
         }

         const cityNameCookie = useCookie('city_name', {
            maxAge: 7 * 24 * 60 * 60
         })
         const cityIdCookie = useCookie('city_id', { maxAge: 7 * 24 * 60 * 60 })
         const cityTranslitCookie = useCookie('city_translit', {
            maxAge: 7 * 24 * 60 * 60
         })

         cityNameCookie.value = this.selectedCity.name
         cityIdCookie.value = this.selectedCity.id
         cityTranslitCookie.value = this.selectedCity.translit
      }
   }
})
