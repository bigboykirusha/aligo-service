<template>
  <div class="dropdown-skeleton">
    <div class="dropdown-skeleton__label"></div>
    <div class="dropdown-skeleton__input">
      <div class="input-text-skeleton">
        <div class="input-text-skeleton__input"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dropdown-skeleton {
  display: flex;
  position: relative;
  width: auto;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  &__label {
    height: 14px;
    background: #e0e0e0;
    border-radius: 4px;
    width: 100px;
    margin-right: 47px;
    animation: pulse 1.5s infinite ease-in-out;
  }

  &__input {
    height: 34px;
    width: 100%;
    max-width: 460px;
    background: #e0e0e0;
    border-radius: 6px;
    display: flex;
    align-items: center;
    padding: 12px;
    animation: pulse 1.5s infinite ease-in-out;

    @media (max-width: 768px) {
      width: 100%;
    }

    .input-text-skeleton {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      background: #e0e0e0;
      border-radius: 6px;
      animation: pulse 1.5s infinite ease-in-out;

      &__input {
        width: 100%;
        height: 100%;
        background: #e0e0e0;
        border-radius: 6px;
      }
    }
  }

  &__list {
    position: absolute;
    border: 1px solid var(--color-stroke);
    border-top: none;
    left: 270px;
    top: 34px;
    z-index: 5;
    display: flex;
    flex-direction: column;
    list-style: none;
    width: calc(100% - 270px);
    max-height: 187px;
    background: var(--white);
    border-radius: 6px;
    overflow-y: auto;
  }

  &__list-item {
    display: flex;
    align-items: center;
    padding: 12px;
    font-size: 14px;
    line-height: 1.29em;
    gap: 10px;
    background: var(--white);
    animation: pulse 1.5s infinite ease-in-out;

    .checkbox-skeleton {
      width: 16px;
      height: 16px;
      background: #e0e0e0;
      border-radius: 2px;
      margin-right: 10px;
      animation: pulse 1.5s infinite ease-in-out;
    }

    .text-skeleton {
      height: 14px;
      background: #e0e0e0;
      border-radius: 4px;
      width: 100%;
      animation: pulse 1.5s infinite ease-in-out;
    }
  }
}

@keyframes pulse {
  0% {
    background-color: #e0e0e0;
  }

  50% {
    background-color: var(--color-stroke);
  }

  100% {
    background-color: #e0e0e0;
  }
}
</style>
