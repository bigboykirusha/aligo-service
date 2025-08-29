import axios from 'axios';

export const fetchSuggestions = async (query) => {
   const yandexApiKey = "8708a36c-fb2e-4f61-a74c-ef32f4fa22b1";

   try {
      const response = await axios.get(`https://geocode-maps.yandex.ru/1.x/`, {
         params: {
            apikey: yandexApiKey,
            format: 'json',
            geocode: query,
            results: 5,
         },
      });

      return response.data.response.GeoObjectCollection.featureMember.map((item) => {
         const name = item.GeoObject.name;
         const description = item.GeoObject.description;
         const fullAddress = `${description}, ${name}`;
         return { fullAddress, geoObject: item.GeoObject };
      });
   } catch (error) {
      console.error(error);
   }
};