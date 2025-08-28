import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export function useQueryParams() {
  const router = useRouter();
  const route = useRoute();

  const queryParams = ref({});

  const loadQueryParamsFromRoute = () => {
    const rawQuery = route.query;

    queryParams.value = Object.fromEntries(
      Object.entries(rawQuery).map(([key, value]) => {
        const num = Number(value);
        return [key, isNaN(num) ? value : num];
      })
    );
    sessionStorage.setItem('queryParams', JSON.stringify(queryParams.value));
  };

  const buildQueryString = (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (
        value !== 0 &&
        value !== '' &&
        value !== null &&
        value !== undefined
      ) {
        searchParams.append(key, value);
      }
    });
    return searchParams.toString();
  };

  const updateQueryParams = () => {
    const queryString = buildQueryString(queryParams.value);
    const parsed = Object.fromEntries(
      new URLSearchParams(queryString).entries()
    );
    router.push({ query: parsed });
    sessionStorage.setItem('queryParams', JSON.stringify(queryParams.value));
  };

  onMounted(() => {
    const savedQueryParams = sessionStorage.getItem('queryParams');
    if (savedQueryParams) {
      queryParams.value = JSON.parse(savedQueryParams);
    } else {
      loadQueryParamsFromRoute();
    }
  });

  return {
    queryParams,
    updateQueryParams,
    buildQueryString,
    loadQueryParamsFromRoute,
  };
}
