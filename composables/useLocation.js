import { ref, computed } from 'vue';
import { debounce } from 'lodash-es';
import {
   getRegions,
   getCitiesByRegion,
   searchCitiesByName,
} from '~/services/apiClient';

export function useLocation() {
   const regions = ref([]);
   const cities = ref([]);
   const selectedRegion = ref(null);
   const searchQuery = ref('');
   const isLoading = ref(false);
   const error = ref(null);

   const fetchRegions = async () => {
      // Simple cache to avoid refetching static region list
      const cachedRegions = localStorage.getItem('regions');
      if (cachedRegions) {
         try {
            regions.value = JSON.parse(cachedRegions);
            return;
         } catch (err) {
            localStorage.removeItem('regions'); 
            console.error('Ошибка парсинга кэша регионов', err);
         }
      }

      try {
         isLoading.value = true;
         error.value = null;
         const data = await getRegions();
         regions.value = data;
         localStorage.setItem('regions', JSON.stringify(data));
      } catch (e) {
         error.value = 'Ошибка получения регионов';
         console.error(e);
      } finally {
         isLoading.value = false;
      }
   };

   const fetchCitiesForRegion = async (region) => {
      try {
         isLoading.value = true;
         error.value = null;
         selectedRegion.value = region;
         searchQuery.value = '';
         const response = await getCitiesByRegion(region.id);
         cities.value = response || []; // Ensure it's an array
      } catch (e) {
         error.value = 'Ошибка получения городов';
         console.error(e);
         cities.value = [];
      } finally {
         isLoading.value = false;
      }
   };

   const _searchCities = async (query) => {
      try {
         const response = await searchCitiesByName(query);
         // Проверьте структуру ответа вашего API (response или response.data)
         cities.value = response?.data || response || [];
      } catch (e) {
         error.value = 'Ошибка поиска городов';
         console.error(e);
         cities.value = [];
      } finally {
         isLoading.value = false;
      }
   };

   const debouncedApiCall = debounce(_searchCities, 300);

   // Основная функция для вызова из watch или событий
   const debouncedSearch = (query) => {
      // Сбрасываем регион, если начали печатать в поиске
      if (selectedRegion.value) selectedRegion.value = null;

      if (!query || query.trim() === '') {
         debouncedApiCall.cancel();
         cities.value = [];
         isLoading.value = false;
         return;
      }

      isLoading.value = true;
      error.value = null;
      debouncedApiCall(query);
   };

   const clearRegionSelection = () => {
      selectedRegion.value = null;
      cities.value = [];
      searchQuery.value = '';
   };

   const displayedCities = computed(() => cities.value);

   return {
      regions,
      selectedRegion,
      searchQuery,
      isLoading,
      error,
      fetchRegions,
      fetchCitiesForRegion,
      debouncedSearch,
      clearRegionSelection,
      displayedCities,
   };
}