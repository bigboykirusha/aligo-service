<template>
  <ul class="ui-breadcrumbs">
    <li
      v-for="(item, i) in items"
      :key="i"
      class="ui-breadcrumbs__item"
      :class="{
        'ui-breadcrumbs__item--close': item.childrens,
        'ui-breadcrumbs__item--opened': item.showChildrens,
      }"
    >
      <RouterLink :to="item.link" class="ui-breadcrumbs__item-link">
        {{ item.name }}
      </RouterLink>

      <div v-if="item.childrens" class="ui-breadcrumbs__item-popup">
        <div
          v-for="(children, j) in item.childrens"
          :key="j"
          class="ui-breadcrumbs__item-childrens"
        >
          <RouterLink
            :to="children.link"
            class="ui-breadcrumbs__item-childrens-link"
          >
            {{ children.name }}
          </RouterLink>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

defineEmits(['update:items']);

// const changeChildrensVisible = (idx, state = undefined) => {
//   const items = [...props.items];

//   if (state === undefined) items[idx].showChildrens = !items[idx].showChildrens;
//   else items[idx].showChildrens = state;
//   emit('update:items', items);
// };
</script>

<style lang="scss">
.ui-breadcrumbs {
  display: flex;
  align-items: center;
  column-gap: 10px;
  margin-bottom: 14px;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  margin-right: -15px;
  padding-right: 15px;
  margin-left: -15px;
  padding-left: 15px;

  &::-webkit-scrollbar {
    display: none;
  }
}

.ui-breadcrumbs__item {
  display: flex;
  align-items: center;
  white-space: nowrap;

  &:not(:first-child)::before {
    content: '';
    display: block;
    width: 1px;
    height: 10px;
    background-color: #868799;
    transform: rotate(20deg);
    margin-right: 10px;
  }
}
.ui-breadcrumbs__item-link {
  font-weight: 400;
  font-size: 10px;
  line-height: 14px;
  color: #868799;
  @include transition();
  &:hover {
    color: $blue;
  }
}

.ui-breadcrumbs__item-popup,
.ui-breadcrumbs__item-arrow {
  display: none;
}

@include mq($tablet) {
  .ui-breadcrumbs {
    margin-bottom: 16px;
    margin-right: 0;
    padding-right: 0;
    margin-left: 0;
    padding-left: 0;
    overflow: unset;
    flex-wrap: wrap;
  }

  .ui-breadcrumbs__item-link {
    font-size: 11px;
    line-height: 15px;
  }

  .ui-breadcrumbs__item {
    .ui-breadcrumbs__item-arrow:nth-of-type(2) {
      display: none;
    }

    &--opened {
      .ui-breadcrumbs__item-arrow {
        transform: rotate(180deg);

        &:nth-of-type(1) {
          display: none;
        }
        &:nth-of-type(2) {
          display: flex;
        }
      }
    }
  }
  .ui-breadcrumbs__item--opened {
    .ui-breadcrumbs__item-link {
      position: relative;
      z-index: 2;
    }
    .ui-breadcrumbs__item-arrow {
      position: relative;
      z-index: 2;
      margin-left: 5px;
    }
  }

  .ui-breadcrumbs__item--close {
    position: relative;
    .ui-breadcrumbs__item-popup {
      min-width: 185px;
      padding: 32px 8px 8px;
      position: absolute;
      top: -10px;
      left: 5px;
      display: block;
      border-radius: 10px;
      background: var(--white);
      box-shadow: 0px 0px 14px 0px rgba(93, 95, 107, 0.1);
    }
  }

  .ui-breadcrumbs__item-arrow {
    display: flex;
    align-items: center;
    margin-left: 5px;
    cursor: pointer;
  }

  .ui-breadcrumbs__item--opened {
    z-index: 2;
  }

  .ui-breadcrumbs__item-childrens-link {
    font-size: 12px;
    font-weight: 400;
    margin-bottom: 10px;
    @include transition();
    &:hover {
      color: $blue;
    }
  }
}
@include mq($wd) {
  .ui-breadcrumbs {
    margin-bottom: 30px;
  }
  .ui-breadcrumbs__item-link {
    font-size: 12px;
    line-height: 16px;
  }
}
</style>
