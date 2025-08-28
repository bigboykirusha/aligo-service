<template>
  <div class="table__wrapper" :class="{ 'is-readonly': readOnly }">
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

    <div class="table-body" ref="tableBody" @scroll="syncScroll">
      <div
        class="table-box__row"
        v-for="item in ItemRows"
        :key="item.number"
        :class="{
          'table-box__row--change': item?.act?.change,
          'table-box__row--readonly': readOnly, 
        }"
        :style="{
          'grid-template-columns': headerRows.map((h) => h.width).join(' '),
          height: computedHeight,
        }"
      >
        <CustomTableItem
          :headerRow="headerRows"
          :item="item"
          :lineClamp="lineClamp"
          :readOnly="readOnly" 
          @slot-clicked="forwardSlotClicked"
          @item-action="itemAction"
          @select-update="UpdateSelect"
        >
          <template #slot-start="{ item, emitEvent }">
            <div @click.stop>
              <slot name="slot-start" :item="item" :emitEvent="emitEvent" />
            </div>
          </template>

          <template #slot-end="{ item, emitEvent }">
            <div class="slot-end" @click.stop>
              <slot name="slot-end" :item="item" :emitEvent="emitEvent" />
            </div>
          </template>
        </CustomTableItem>
      </div>

      <div ref="observerTrigger" class="scroll-trigger"></div>
    </div>
  </div>
  <CustomTablePagination
    v-if="tablePagination"
    :current-page="currentPage"
    :total-pages="totalPages"
    :per-page="perPage"
    :total="total"
    :readOnly="readOnly"
    :allOption="allOptionPagination"
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
  headerRows: {
    type: Array,
    default: () => [],
  },
  allOptionPagination: {
    type: Boolean,
    default: true,
  },
  tablePagination: {
    type: Boolean,
    default: true,
  },
  lineClamp: {
    type: Number,
    default: 1,
    validator: (value) => Number.isInteger(value) && value > 0,
  },
  ItemRows: {
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
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  'slot-clicked',
  'option-table-btn',
  'heder-item-action',
  'update:currentPage',
  'update:perPage',
  'item-action',
  'select-update',
]);

const totalPages = computed(() => Math.ceil(props.total / props.perPage));

const tableHeader = ref(null);
const tableBody = ref(null);
const observerTrigger = ref(null);
const viewportWidth = ref(window.innerWidth);

const updateViewportWidth = () => {
  viewportWidth.value = window.innerWidth;
};

const changePagination = (pageNumber) => {
  emit('update:currentPage', pageNumber);
};

const changePerPage = (count) => {
  emit('update:perPage', count);
};

onMounted(() => {
  window.addEventListener('resize', updateViewportWidth);

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        console.log('not empty');
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

const computedHeight = computed(() => {
  return viewportWidth.value <= 1024 ? 'auto' : 'auto';
});

const syncScroll = () => {
  if (tableHeader.value && tableBody.value) {
    tableHeader.value.scrollLeft = tableBody.value.scrollLeft;
  }
};
const UpdateSelect = (value, oldVlaue, item) => {
  emit('select-update', value, oldVlaue, item);
};

const headerSlotClicked = (code, filterTypre) => {
  emit('heder-item-action', code, filterTypre);
};

const forwardSlotClicked = (name, item) => {
  emit('slot-clicked', name, item);
};

const itemAction = (name, item) => {
  console.log('Item action triggered:', name, item);
  emit('item-action', name, item);
};
</script>

<style lang="scss">
.scroll-trigger {
  height: 1px;
}

.table-box__row--readonly {
  pointer-events: none;
  opacity: 0.85;
}

.table-box__row--readonly .slot-end{
  pointer-events: auto;
}
</style>
