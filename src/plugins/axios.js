import axios from 'axios';
import VueCookies from 'vue-cookies';

const config = {
  baseURL: process.env.VUE_APP_ENDPOINT,
};

const client = axios.create(config);

const authInterceptor = (config) => {
  // проверка на токен
  const token = VueCookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

client.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      // проверка на токен
      VueCookies.remove('token');
    }
    return Promise.reject(error);
  }
);

client.interceptors.request.use(authInterceptor);

export default client;
