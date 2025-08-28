<template>
  <div class="optimization-option">
    <ul class="optimization-option__form">
      <li class="optimization-option__item">
        <span class="optimization-option__text">Раздел</span>
        <AdsDropdown placeholder="Выберите" />
      </li>
      <li class="optimization-option__item">
        <span class="optimization-option__text">URL</span>
        <AutosTextTemplate placeholder="URL" />
      </li>
      <li class="optimization-option__item" v-if="isActive">
        <span class="optimization-option__text">Город</span>
        <AdsDropdown placeholder="Выберите" />
      </li>
      <li class="optimization-option__item" v-if="isActive">
        <span class="optimization-option__text">Созданно</span>
        <p>11.12.2024 | 15:23</p>
      </li>
      <li class="optimization-option__item" v-if="isActive">
        <span class="optimization-option__text">Изменено</span>
        <div>
          11.12.2024 | 15:23
          <ButtonUI svg="search-svg" text="найти" buttonClass="btn--primary" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import AdsDropdown from './AdsDropdown.vue';
import AutosTextTemplate from './AutosTextTemplate.vue';
import ButtonUI from './ButtonUI.vue';

export default {
  components: {
    AdsDropdown,
    AutosTextTemplate,
    ButtonUI,
  },
  props: {
    isActive: Boolean,
  },
};
</script>
