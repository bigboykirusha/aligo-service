import { useCookies } from 'vue3-cookies';

export function useCookie(name) {
  const { cookies } = useCookies();

  const getCookie = () => {
    return cookies.get(name);
  };

  const removeCookie = () => {
    cookies.remove(name);
  };

  return { getCookie, removeCookie };
}
