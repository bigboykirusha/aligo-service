export const validatePhoneNumber = (phone) => {
   const phoneRegex = /^(\+7|7)?(9\d{2})(\d{3})(\d{2})(\d{2})$/;
   return phoneRegex.test(phone);
};

export const validateEmail = (email) => {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailRegex.test(email);
};

export const validateUsername = (username) => {
   const usernamePattern = /^[a-zA-Zа-яА-ЯёЁ\s-]{1,20}$/;
   const containsBoth = /[a-zA-Z]/.test(username) && /[а-яА-ЯёЁ]/.test(username);
   return usernamePattern.test(username) && !containsBoth;
};
