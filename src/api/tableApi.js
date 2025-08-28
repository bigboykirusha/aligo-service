import { SEO_URLS } from '@/const/api/index.js';
import client from '@/plugins/axios.js';

export const generateSitemaps = async () => {
  return client.get(SEO_URLS.generateSitemaps).catch(function (error) {
    return error.response;
  });
};

// export const authorizationUser = async (formData) => {
//   return client.post(SEO_URLS.authorization, formData).catch(function (error) {
//     return error.response;
//   });
// };

// import { registrationUser, authorizationUser } from '@/path/to/your/file.js';
