<template>
  <div class="users">
    <OptimizationHeader title="Пользователи" status="Сейчас на странице" :count="totalCount" />
    <CustomMainHeader :showCreateButton="true" @create="goToCreateProfilePage" @search="handleSearch" :sortOptions="[
      { label: 'Все', value: '0' },
      { label: 'Частные профили', value: '1' },
      { label: 'Коммерческие', value: '2' },
      { label: 'Заблокированные', value: '3' },
    ]" />
    <div class="users-table__box">
      <CustomTable :ItemRows="itemRow" :headerRows="headerRows" :lineClamp="5" height="120px"
        @heder-item-action="filterTableRow" @slot-clicked="handleButtonClick" @item-action="handleArrowOptionClick"
        :tablePagination="true" :currentPage="pagination.currentPage" :perPage="pagination.perPage"
        :total="pagination.totalCount" @update:currentPage="(val) => handlePageChange(val)">
        <!-- Слот в начале строки -->
        <template #slot-start="{ }">
          <CustomStatusIndicator status="green" title="В сети" />
        </template>
        <!-- Слот в конце строки -->
        <template #slot-end="{ item, emitEvent }">
          <CustomTableOption v-model="selectRole" :options="options"
            @update:model-value="handleOptionChange(item, emitEvent)" />
        </template>
      </CustomTable>
    </div>
    <CustomPreloder :isLoad="preloader" :size="74" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import CustomMainHeader from '@/components/UI/CustomMainHeader.vue';
import CustomTable from '@/components/UI/CustomTable.vue';
import CustomStatusIndicator from '@/components/UI/CustomStatusIndicator.vue';
import CustomTableOption from '@/components/UI/CustomTableOption.vue';
import OptimizationHeader from '@/components/SEO/OptimizationHeader.vue';
import CustomPreloder from '@/components/UI/CustomPreloder';

import { useSortTable } from '@/composables/useSortTable';
import { getUsers, deleteUser } from '@/services/apiClient';

import { useRouter } from 'vue-router';

const router = useRouter();
const preloader = ref(true);

const options = [
  {
    name: 'Опубликовать от имени',
    code: 'publishAs',
    error: false,
    success: false,
    svg: 'publish-svg',
    ValidateType: 'select',
  },
  {
    name: 'Копировать ссылку',
    code: 'copyLink',
    error: false,
    success: false,
    svg: 'copy-svg',
    ValidateType: 'select',
  },
];

const selectRole = ref({
  name: '',
  code: '',
  ValidateType: 'select',
  error: false,
  success: false,
});

const pagination = ref({
  currentPage: 1,
  perPage: 20,
  totalPages: 1,
  totalCount: 0,
});

const handlePageChange = (newPage) => {
  pagination.value.currentPage = newPage;
  fetchUsers(searchQuery.value);
};

const searchQuery = ref('');

const itemRow = ref([]);
const orderBy = 'desc';

const headerRows = ref([
  { name: 'Статус', width: '70px', helper: false },
  {
    name: 'Имя',
    width: '150px',
    helper: false,
    code: 'name',
    filter: 'alphabetical',
    sortDirection: 'desc',
  },
  {
    name: 'ID',
    width: '50px',
    helper: false,
    code: 'id',
    filter: 'numeric',
    sortDirection: 'desc',
  },
  { name: 'Телефон', width: '200px', helper: false },
  {
    name: 'E-mail',
    width: '200px',
    helper: false,
    code: 'email',
    filter: 'alphabetical',
    sortDirection: 'desc',
  },
  {
    name: 'Объяв. (O|C|A)',
    width: '150px',
    helper: {
      title: 'Статусы объявлений',
      html: `<p>Через разделитель перечислено количество объявлений в разных статусах:  </p>
      <p>П — публикуемыйе </p> 
      <p>С —  снятые  с публикации</p> 
      <p>А — перемещенные в архив</p>`,
    },
  },
  {
    name: 'Воронки',
    width: '100px',
    helper: {
      title: 'Воронка продаж',
      text: 'Цифра демонстрирует на каком этапе воронки продаж находится пользователь. В скобках указан номер воронки.',
    },
  },
  { name: '', width: '50px', helper: false },
]);

const handleButtonClick = (item) => {
  if (selectRole.value.name === 'Редактировать') {
    router.push(`/seo/sections/create/${item.id.value}/`);
  }
};

const goToCreateProfilePage = () => {
  router.push(`/create-profile/`);
};

const handleSearch = (query) => {
  searchQuery.value = query;
  fetchUsers(searchQuery.value);
};

const handleOptionChange = async (item, emitEvent) => {
  switch (selectRole.value.code) {
    case 'copyLink': {
      const profileLink = `${window.location.origin}/user/${item.id.value}/`;
      try {
        await navigator.clipboard.writeText(profileLink);
        console.log('Ссылка скопирована:', profileLink);
      } catch (err) {
        console.error('Ошибка копирования:', err);
      }
      break;
    }

    case 'deleteProfile': {
      try {
        await deleteUser(item.id.value);
        console.log(`Профиль #${item.id.value} удалён`);
        fetchUsers(); // обновляем таблицу
      } catch (err) {
        console.error('Ошибка удаления:', err);
      }
      break;
    }

    case 'publishAs': {
      try {
        router.push(`/createad/${item.id.value}/`);
      } catch (err) {
        console.error('Ошибка перехода на страницу создания объявления:', err);
      }
      break;
    }

    default:
      console.log('Неизвестное действие:', selectRole.value.code);
  }

  // если нужно — эмитим событие наверх
  if (emitEvent) emitEvent(selectRole.value.code, item);
};

const filterTableRow = (code, filterType) => {
  // Находим индекс элемента с соответствующим кодом
  console.log(code, filterType);
  const index = headerRows.value.findIndex((el) => el.code === code);

  const currentCondition = headerRows.value[index].sortDirection;
  useSortTable(itemRow.value, code, filterType, currentCondition);
  if (index !== -1) {
    headerRows.value[index].sortDirection =
      currentCondition === 'asc' ? 'desc' : 'asc';
  }
};

const handleArrowOptionClick = () => {
  // router.push(`/user/${item.id.value}/`);
};

const fetchUsers = async (search = '') => {
  preloader.value = true;

  try {
    const response = await getUsers({
      count: pagination.value.perPage,
      page: pagination.value.currentPage,
      order_by: orderBy,
      search,
    });

    const users = response.users || [];
    console.log(response);

    pagination.value.totalPages = response.total_page;
    pagination.value.currentPage = response.current_page;
    pagination.value.totalCount = response.total_count;

    itemRow.value = users.map((user) => ({
      customOptionStart: { slot: 'start', contenteditable: false },
      name: { value: user.username || '—', type: 'text', contenteditable: false },
      id: { value: user.id.toString(), type: 'text', contenteditable: false },
      phone: { value: user.phone || '—', type: 'text', contenteditable: false },
      email: { value: user.email || '—', type: 'text', contenteditable: false },
      ads: {
        value: `${user.count_ads?.count_published ?? 0} | ${user.count_ads?.count_off_published ?? 0} | ${user.count_ads?.count_in_archive ?? 0}`,
        type: 'text',
        contenteditable: false,
      },
      funnel: { value: '—', type: 'text', contenteditable: false },
      customOptionEnd: { slot: 'end', contenteditable: false, id: user.id },
    }));

  } catch (error) {
    console.error('Ошибка при загрузке пользователей', error);
  }

  preloader.value = false;
};

onMounted(() => {
  fetchUsers();
});
</script>

<style lang="scss">
.users {
  padding: 16px;
  width: 100%;
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    margin-top: 60px;
    height: 100%;
  }

  &-table__box {
    display: flex;
    min-height: calc(100vh - 164px - 32px);
    flex-direction: column;
    justify-content: space-between;

    @media (max-width: 768px) {
      height: 100%;
    }
  }

  &-option {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border-radius: 4px;
    background-color: #eef9ff;
    margin: 16px 0;
    padding: 12px 24px;

    &__btn-box {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    &__title-box {
      display: flex;
      justify-content: space-between;
    }

    &__item {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      width: 100%;
    }

    &__text-box {
      display: flex;
    }

    &__text {
      color: var(--color-text-select);
      font-weight: 400;
      font-size: 14px;
      min-width: 150px;
    }

    &__more {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &-btn {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      &-info {
        color: var(--primary);
      }
    }
  }
}
</style>
