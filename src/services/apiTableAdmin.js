import axios from 'axios';
import { getCookie } from './auth';
import { useCookie } from '@/composables/useCookie';
import { usePopupErrorStore } from '@/store/popupErrorStore';

const API_BASE_URL = 'https://api.aligo.ru/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const userData = JSON.parse(getCookie('userData'));
  const token = userData ? userData.token : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// SEO Фильтры
export const getSeoFilterSection = async (params) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;
  let response;
  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);
    if (params) {
      response = await apiClient.get(
        `/moderations/filter/get_section?${params}`
      );
    } else response = await apiClient.get(`/moderations/filter/get_section?`);

    // order_by
    // section_id
    clearTimeout(timeoutId);
    return { data: response.data.data, totalCount: response.data.total_count };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};
export const getSeoFilterLog = async (id = null, queryParams = '') => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    let endpoint = '/moderations/work_seo_filters/get_logs';
    if (id) {
      endpoint += `/${id}`;
    }

    if (queryParams) {
      endpoint += `?${queryParams}`;
    }

    const response = await apiClient.get(endpoint);

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};
export const getSeoFilterItems = async (params) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);
    if (params) {
      const response = await apiClient.get(
        `/moderations/work_seo_filters/get_exists_work_seo_filters?${params}`
      );
      clearTimeout(timeoutId);
      return response;
    } else {
      const response = await apiClient.get(
        `/moderations/work_seo_filters/get_exists_work_seo_filters`
      );
      clearTimeout(timeoutId);
      return response;
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};
export const copySeoFilterItem = async (id) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  // получаем URl и убираем все лишнее
  const currentUrl = window.location.href;
  const urlObj = new URL(currentUrl);
  const baseUrl = `${urlObj.origin}${urlObj.pathname}`;

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    const response = await apiClient.get(
      `/moderations/work_seo_filters/replicate/${id}`,
      {
        params: {
          log: baseUrl,
        },
      }
    );
    // id

    clearTimeout(timeoutId);
    return { data: response.data.data, totalCount: response.data.total_count };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};
export const getHistoryChanges = async (id) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    const response = await apiClient.get(
      `/moderations/work_seo_filters/get_history_changes/${id}`
    );
    // id

    clearTimeout(timeoutId);
    return { data: response.data.data, totalCount: response.data.total_count };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};
// пересечения
export const getSeoFilterIntersection = async (params) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    let timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    let response;

    if (params) {
      response = await apiClient.get(
        `/moderations/work_seo_filters/get_filter_intersections?${params}`
      );
    } else {
      response = await apiClient.get(
        `/moderations/work_seo_filters/get_filter_intersections?section_id=1`
      );
    }

    clearTimeout(timeoutId);
    return { data: response.data.data, totalCount: response.data.total_count };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};

export const dublicateSerch = async (params) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    const response = await apiClient.get(
      `/moderations/work_seo_filters/get_filter_intersections?${params}`
    );
    // section_id обяз
    // city_id
    // is_no_indicate_city город не указан
    // order_by
    // all_city все города

    clearTimeout(timeoutId);
    return { data: response.data.data, totalCount: response.data.total_count };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};
//
export const checkItem = async (id) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    const response = await apiClient.get(
      `/moderations/work_seo_filters/show/${id} `
    );

    clearTimeout(timeoutId);
    return { data: response.data.data, totalCount: response.data.total_count };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};

export const getAttributeValues = async () => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    const response = await apiClient.get(
      `/moderations/work_seo_filters/get_accurate_values_or_attribute`
    );

    clearTimeout(timeoutId);
    return { data: response.data.data, totalCount: response.data.total_count };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};
export const addItemSeoFilter = async (formData) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    const response = await apiClient.post(
      `/moderations/work_seo_filters/add`,
      formData
    );

    clearTimeout(timeoutId);
    return { data: response.data.data, totalCount: response.data.total_count };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};
export const updateItemSeoFilter = async (id, formData) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    const response = await apiClient.post(
      `/moderations/work_seo_filters/update/${id}`,
      formData
    );

    clearTimeout(timeoutId);
    return { data: response.data.data, totalCount: response.data.total_count };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};

// delet
export const deletSeoFilterItem = async (id) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  const currentUrl = window.location.href;
  const urlObj = new URL(currentUrl);
  const baseUrl = `${urlObj.origin}${urlObj.pathname}`;

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    const response = await apiClient.delete(
      `/moderations/work_seo_filters/${id}`,
      {
        params: {
          log: baseUrl,
        },
      }
    );
    // id

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};

//  SEO section

export const getSeoSectionOptions = async () => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    let timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    let response;

    response = await apiClient.get(`/moderations/filter/get_section/`);

    clearTimeout(timeoutId);
    return { data: response.data.data, totalCount: response.data.total_count };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};

export const getSeoSectionLog = async (id = null, queryParams = '') => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    let timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    let endpoint = '/moderations/seo_sections/get_logs';
    if (id) {
      endpoint += `/${id}`;
    }

    if (queryParams) {
      endpoint += `?${queryParams}`;
    }

    const response = await apiClient.get(endpoint);

    clearTimeout(timeoutId);
    return response.data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};

export const getSeoSection = async (params) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    let timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    let response;

    if (params) {
      response = await apiClient.get(
        `/moderations/seo_sections/get_exists_seo_sections?ElementsAuto=0&${params}`
      );
    } else {
      response = await apiClient.get(
        `/moderations/seo_sections/get_exists_seo_sections?ElementsAuto=0`
      );
    }

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};

export const copySeoSectionItem = async (id) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;
  const currentUrl = window.location.href;
  const urlObj = new URL(currentUrl);
  const baseUrl = `${urlObj.origin}${urlObj.pathname}`;

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    const response = await apiClient.get(
      `/moderations/seo_sections/replicate/${id}`,
      {
        params: {
          log: baseUrl,
        },
      }
    );

    clearTimeout(timeoutId);
    return { data: response.data.data, totalCount: response.data.total_count };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};
// delet
export const deletSeoSectionItem = async (id) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;
  const currentUrl = window.location.href;
  const urlObj = new URL(currentUrl);
  const baseUrl = `${urlObj.origin}${urlObj.pathname}`;

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    const response = await apiClient.delete(`/moderations/seo_sections/${id}`, {
      params: {
        log: baseUrl,
      },
    });
    // id

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};
export const getHistoryChangesItemSeoCategory = async (id) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    const response = await apiClient.get(
      `/moderations/seo_sections/get_history_changes/${id}`
    );

    clearTimeout(timeoutId);
    return { data: response.data.data, totalCount: response.data.total_count };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};

export const getSeoSectionItem = async (id) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    const response = await apiClient.get('/moderations/seo_sections/show', {
      params: {
        CityGET: 1,
        ElementID: id,
      },
    });

    clearTimeout(timeoutId);
    return response.data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};
// Post
export const addItemSeoSection = async (formData) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    const response = await apiClient.post(
      `/moderations/seo_sections/add`,
      formData
    );

    clearTimeout(timeoutId);
    return response.data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};
export const updateItemSeoSection = async (id, formData) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    const response = await apiClient.post(
      `/moderations/seo_sections/update/${id}`,
      formData
    );

    clearTimeout(timeoutId);
    return response.data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};

//  SEO Ads

export const getSeoAdsOptions = async () => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    let timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    let response;

    response = await apiClient.get(`/moderations/filter/get_section/`);

    clearTimeout(timeoutId);
    return { data: response.data.data, totalCount: response.data.total_count };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};

export const getSeoAdsLog = async (id = null, queryParams = '') => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    let timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    let endpoint = '/moderations/seo_ads/get_logs';
    if (id) {
      endpoint += `/${id}`;
    }

    if (queryParams) {
      endpoint += `?${queryParams}`;
    }

    const response = await apiClient.get(endpoint);

    clearTimeout(timeoutId);
    return response.data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};

export const getSeoAds = async (params) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    let timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    let response;

    if (params) {
      response = await apiClient.get(
        `/moderations/seo_ads/get_exists_seo_ads?ElementsAuto=0&${params}`
      );
    } else {
      response = await apiClient.get(
        `/moderations/seo_ads/get_exists_seo_ads?ElementsAuto=0`
      );
    }

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};

export const copySeoAdsItem = async (formData) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  // получаем URl и убираем все лишнее

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    const response = await apiClient.post(
      `/moderations/seo_ads/replicate`,
      formData
    );

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};
// delet
export const deletSeoAdsItem = async (formData) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    const response = await apiClient.post(
      `/moderations/seo_ads/destroy`,
      formData
    );
    // id

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};

export const getHistoryChangesItemSeoAdsCategory = async (id) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    const response = await apiClient.get(
      `/moderations/seo_ads/get_history_changes/${id}`
    );

    clearTimeout(timeoutId);
    return { data: response.data.data, totalCount: response.data.total_count };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};

export const getSeoAdsItem = async (id) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    const response = await apiClient.get(
      `/moderations/seo_ads/show?CityGET=1&ElementID=${id}`
    );

    clearTimeout(timeoutId);
    return response.data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};

export const getCityWhithUrlAds = async (url) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    const response = await apiClient.get(
      `/moderations/seo_pages/get_cities_by_parameter?ElementURL=${url}`
    );
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при добавлении города.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при добавлении города: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};
// Post
export const addItemSeoAds = async (formData) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    const response = await apiClient.post(`/moderations/seo_ads/add`, formData);

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};
// export const updateItemSeoAds = async (id, formData) => {
//   const popupErrorStore = usePopupErrorStore();
//   let timeoutId;

//   try {
//     timeoutId = setTimeout(() => {
//       popupErrorStore.showWarning(
//         'Пожалуйста, подождите, сервер отвечает дольше обычного...'
//       );
//     }, 5000);

//     const response = await apiClient.post(
//       `/moderations/seo_ads/update/${id}`,
//       formData
//     );

//     clearTimeout(timeoutId);
//     return { data: response.data.data, totalCount: response.data.total_count };
//   } catch (error) {
//     clearTimeout(timeoutId);
//     if (error.response?.status === 403) {
//       // Clear the user tokens
//       const { setCookie } = useCookie('userData');
//       setCookie('userData');
//     }
//     const errorMessage =
//       'сервер временно недоступен, повторите попытку через 1 мин' ||
//       'Ошибка при получении данных истории объявлений.';
//     if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

//     console.error('Ошибка при получении данных истории объявлений: ', error);
//     return { success: false, message: errorMessage, ...error.response?.data };
//   }
// };

// seo section

export const copySeoSectionsItem = async (formData) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  // получаем URl и убираем все лишнее

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    const response = await apiClient.post(
      `/moderations/seo_sections/replicate`,
      formData
    );

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};

export const deletSeoSectionsItem = async (formData) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    const response = await apiClient.post(
      `/moderations/seo_sections/destroy`,
      formData
    );
    // id

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};

// seo pages

export const getSeoPages = async (params) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    let timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    let response;

    if (params) {
      response = await apiClient.get(
        `/moderations/seo_pages/get_exists_seo_pages?ElementsAuto=0&${params}`
      );
    } else {
      response = await apiClient.get(
        `/moderations/seo_pages/get_exists_seo_pages?ElementsAuto=0`
      );
    }

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};

export const copySeoPagesItem = async (formData) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  // получаем URl и убираем все лишнее

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    const response = await apiClient.post(
      `/moderations/seo_pages/replicate`,
      formData
    );

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};
// delet
export const deletSeoPagesItem = async (formData) => {
  const popupErrorStore = usePopupErrorStore();
  let timeoutId;

  try {
    timeoutId = setTimeout(() => {
      popupErrorStore.showWarning(
        'Пожалуйста, подождите, сервер отвечает дольше обычного...'
      );
    }, 5000);

    const response = await apiClient.post(
      `/moderations/seo_pages/destroy`,
      formData
    );
    // id

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.response?.status === 403) {
      // Clear the user tokens
      const { setCookie } = useCookie('userData');
      setCookie('userData');
    }
    const errorMessage =
      'сервер временно недоступен, повторите попытку через 1 мин' ||
      'Ошибка при получении данных истории объявлений.';
    if (error.response?.status >= 500) popupErrorStore.showError(errorMessage);

    console.error('Ошибка при получении данных истории объявлений: ', error);
    return { success: false, message: errorMessage, ...error.response?.data };
  }
};
