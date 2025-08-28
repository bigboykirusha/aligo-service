import { loginUserByPhone, confirmPhoneCode } from './apiClient';

export const requestCode = async (isPhone, contactInfo) => {
   const requestData = isPhone ? { phone: contactInfo } : { email: contactInfo };
   const response = await loginUserByPhone(requestData);
   return response;
};

export const verifyCode = async (isPhone, contactInfo, code) => {
   const requestData = isPhone ? { phone: contactInfo, code } : { email: contactInfo, code };
   const response = await confirmPhoneCode(requestData);
   return response;
};