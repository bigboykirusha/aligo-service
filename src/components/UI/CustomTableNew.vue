<template>
  <div class="table__wrapper">
    <div
      class="table-header"
      ref="tableHeader"
      :style="{
        'grid-template-columns': headerRows.map((h) => h.width).join(' '),
      }"
    >
      <CustomTableHeaderItem
        v-for="item in headerRows"
        :key="item.name"
        :name="item.name"
        :helper="item.helper"
        :code="item.code"
        :filter="item.filter"
        @heder-item-action="headerSlotClicked"
      />
    </div>
    <div
      class="table-body"
      ref="tableBody"
      @scroll="syncScroll"
      v-if="!immersed"
    >
      <!-- одноуровневый -->
      <div
        class="table-box__row"
        v-for="item in itemRows"
        :key="item.number"
        :style="{
          'grid-template-columns': headerRows.map((h) => h.width).join(' '),
          height: computedHeight,
        }"
      >
        <CustomTableItem
          :headerRow="headerRows"
          :item="item"
          :lineClamp="lineClamp"
          @slot-clicked="forwardSlotClicked"
          @item-action="itemAction"
        >
          <template #slot-start="{ item, emitEvent }">
            <slot name="slot-start" :item="item" :emitEvent="emitEvent" />
          </template>

          <template #slot-end="{ item, emitEvent }">
            <slot name="slot-end" :item="item" :emitEvent="emitEvent" />
          </template>
        </CustomTableItem>
      </div>
      <div ref="observerTrigger" class="scroll-trigger"></div>
    </div>
    <!-- многоуровневый -->
    <div class="table-body" ref="tableBody" @scroll="syncScroll" v-else>
      <div>
        <template v-for="item in itemRows" :key="item.option">
          <h4 class="table-body-tytle" v-if="item.option.type === 'header'">
            {{ item.option.value }}
          </h4>
          <div
            class="table-box__row table-box__row--bold"
            v-if="item.option.type === 'item'"
            :style="{
              'grid-template-columns': headerRows.map((h) => h.width).join(' '),
              height: computedHeight,
            }"
          >
            <CustomTableItem
              :headerRow="headerRows"
              :item="item.option.value"
              @slot-clicked="forwardSlotClicked"
              @item-action="itemAction"
              @update:value="handleUpdateValue"
            >
              <template #slot-start="{ item, emitEvent }">
                <slot name="slot-start" :item="item" :emitEvent="emitEvent" />
              </template>

              <template #slot-end="{ item, emitEvent }">
                <slot name="slot-end" :item="item" :emitEvent="emitEvent" />
              </template>
            </CustomTableItem>
          </div>
          <div
            class="table-box__row"
            :class="{
              'table-box__row--sub': item.option.subitem,
            }"
            v-for="subItem in item.itemRows"
            :key="subItem.id.value"
            :style="{
              'grid-template-columns': headerRows.map((h) => h.width).join(' '),
              height: computedHeight,
            }"
          >
            <CustomTableItem
              :headerRow="headerRows"
              :item="subItem"
              :lineClamp="lineClamp"
              :subItemMod="item.option.subitem"
              @slot-clicked="forwardSlotClicked"
              @item-action="itemAction"
              @update:value="handleUpdateValue"
            >
              <template #slot-start="{ item, emitEvent }">
                <slot name="slot-start" :item="item" :emitEvent="emitEvent" />
              </template>

              <template #slot-end="{ item, emitEvent }">
                <slot name="slot-end" :item="item" :emitEvent="emitEvent" />
              </template>
            </CustomTableItem>
          </div>
        </template>
      </div>
    </div>
  </div>

  <CustomTablePagination
    v-if="tablePagination"
    :current-page="currentPage"
    :total-pages="totalPages"
    :per-page="perPage"
    @change="changePagination"
    @changePerPage="changePerPage"
  />
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  defineProps,
  defineEmits,
} from 'vue';
import CustomTableHeaderItem from '@/components/UI/CustomTableHeaderItem.vue';
import CustomTableItem from '@/components/UI/CustomTableItem.vue';
import CustomTablePagination from '@/components/UI/CustomTablePagination.vue';

const props = defineProps({
  height: {
    type: String,
    default: 'auto',
  },
  immersed: {
    type: Boolean,
    default: false,
  },
  titleBody: {
    type: String,
    default: '',
  },
  tablePagination: {
    type: Boolean,
    default: true,
  },
  headerRows: {
    type: Array,
    default: () => [],
  },
  lineClamp: {
    type: Number,
    default: 1,
    validator: (value) => Number.isInteger(value) && value > 0,
  },
  itemRows: {
    type: Array,
    default: () => [],
  },
  currentPage: {
    type: Number,
    required: true,
  },
  perPage: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits([
  'slot-clicked',
  'heder-item-action',
  'option-table-btn',
  'update:currentPage',
  'update:perPage',
]);

const totalPages = computed(() => Math.ceil(props.total / props.perPage));

const changePagination = (pageNumber) => {
  emit('update:currentPage', pageNumber);
};

const changePerPage = (count) => {
  emit('update:perPage', count);
};

const tableHeader = ref(null);
const tableBody = ref(null);
const observerTrigger = ref(null);
const viewportWidth = ref(window.innerWidth);

const computedHeight = computed(() => {
  return viewportWidth.value <= 1024 ? 'auto' : 'auto';
});

const syncScroll = () => {
  if (tableHeader.value && tableBody.value) {
    tableHeader.value.scrollLeft = tableBody.value.scrollLeft;
  }
};

const headerSlotClicked = (code, filterTypre) => {
  emit('heder-item-action', code, filterTypre);
};
const forwardSlotClicked = (name, item) => {
  emit('slot-clicked', name, item);
};

const itemAction = (name, item) => {
  emit('slot-clicked', name, item);
};

// Отслеживаем изменение ширины экрана
const updateViewportWidth = () => {
  viewportWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', updateViewportWidth);

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        console.log('Доскролили до самого низа!');
      }
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    }
  );

  if (observerTrigger.value) {
    observer.observe(observerTrigger.value);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateViewportWidth);
});
</script>

<style lang="scss">
.scroll-trigger {
  height: 1px;
}
</style>
