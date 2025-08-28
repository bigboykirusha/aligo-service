<template>
  <div class="optimization-option">
    <ul class="optimization-option__form">
      <li class="optimization-option__item">
        <span class="optimization-option__text">Раздел</span>
        <AdsDropdown placeholder="Выберите" />
      </li>
      <li class="optimization-option__item">
        <span class="optimization-option__text">URL</span>
        <AutosTextTemplate placeholder=" URL" />
      </li>
      <li class="optimization-option__item" v-if="isActive">
        <span class="optimization-option__text">Город</span>
        <AdsDropdown placeholder="Выберите" />
      </li>
      <li class="optimization-option__item" v-if="isActive">
        <span class="optimization-option__text">Созданно</span>
        <p>11.12.2024 | 15 : 23</p>
      </li>
      <li class="optimization-option__item" v-if="isActive">
        <span class="optimization-option__text">Изменено</span>
        <div>
          11.12.2024 | 15 : 23
          <ButtonUI
            svg="search-svg"
            text="найти"
            buttonClass="btn--primary"
            @action="serchItem"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import AdsDropdown from '@/components/AdsDropdown';
import ButtonUI from '@/components/UI/ButtonUI';
import AutosTextTemplate from '@/components/UI/AutosTextTemplate';

const serchItem = () => {};
</script>
