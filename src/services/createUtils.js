export const fetchDataWithCache = async (key, apiFunction) => {
   try {
      const cachedData = JSON.parse(localStorage.getItem(key));

      if (cachedData) {
         return cachedData;
      }

      const fetchedData = await apiFunction();
      localStorage.setItem(key, JSON.stringify(fetchedData));
      return fetchedData;

   } catch (error) {
      console.error(`Ошибка при получении данных для ${key}:`, error);
      return [];
   }
};