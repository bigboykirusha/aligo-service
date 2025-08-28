const baseUrl = 'https://api.aligo.ru';

export const getImageUrl = (path, defaultAvatar) => {
   if (path) {
      return `${baseUrl}/${path}`;
   }
   return defaultAvatar;
};