<template>
  <div class="card-skeleton">
    <div class="card-skeleton__image"></div>
    <div class="card-skeleton__section">
      <div class="card-skeleton__body">
        <div class="card-skeleton__container">
          <div class="card-skeleton__title"></div>
          <div class="card-skeleton__block">
            <div class="card-skeleton__price"></div>
            <div class="card-skeleton__currency"></div>
          </div>
          <div class="card-skeleton__description"></div>
          <div class="card-skeleton__info">
            <div class="card-skeleton__location"></div>
          </div>
        </div>
      </div>
      <div class="card-skeleton__more">
        <div class="card-skeleton__more-row">
          <div class="card-skeleton__button"></div>
          <div class="card-skeleton__button"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-skeleton {
  display: flex;
  flex-direction: row;
  background: var(--white);
  box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
  border-radius: 6px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;

  .card-skeleton__image {
    min-width: 200px;
    height: 200px;
    background: linear-gradient(
      90deg,
      #e0e0e0 25%,
      var(--color-stroke) 50%,
      #e0e0e0 75%
    );
    background-size: 200% 200%;
    animation: pulse 2s infinite linear;

    @media (max-width: 768px) {
      min-width: 160px;
      height: 160px;
    }

    @media (max-width: 480px) {
      min-width: 125px;
      height: 145px;
    }
  }

  .card-skeleton__section {
    display: flex;
    flex-direction: row;
    width: 100%;
    flex-grow: 1;
  }

  .card-skeleton__body {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    height: 100%;
    padding: 16px;
  }

  .card-skeleton__container {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    height: 100%;
  }

  .card-skeleton__title,
  .card-skeleton__price,
  .card-skeleton__currency,
  .card-skeleton__description,
  .card-skeleton__location,
  .card-skeleton__date {
    background: linear-gradient(
      90deg,
      #e0e0e0 25%,
      var(--color-stroke) 50%,
      #e0e0e0 75%
    );
    background-size: 200% 200%;
    animation: pulse 2s infinite linear;
    border-radius: 6px;
  }

  .card-skeleton__title {
    height: 18px;
    width: 70%;
  }

  .card-skeleton__block {
    display: flex;
    gap: 5px;
    align-items: center;
  }

  .card-skeleton__price {
    height: 18px;
    width: 40%;
  }

  .card-skeleton__currency {
    height: 18px;
    width: 20%;
  }

  .card-skeleton__description {
    height: 18px;
    width: 120px;
  }

  .card-skeleton__info {
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-top: auto;
  }

  .card-skeleton__location,
  .card-skeleton__date {
    height: 14px;
    width: 110px;
  }

  .card-skeleton__mobile {
    display: flex;
    gap: 10px;
  }

  .card-skeleton__more {
    display: flex;
    gap: 86px;
    width: 100%;
    height: 100%;
    flex-direction: row;
    padding: 16px;
    margin-left: auto;
    justify-content: flex-end;
  }

  .card-skeleton__more-row {
    display: flex;
    flex-direction: row;
    gap: 16px;

    @media (max-width: 480px) {
      flex-direction: column;
      gap: 8px;
    }
  }

  .card-skeleton__more-column {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .card-skeleton__button {
    width: 34px;
    height: 34px;
    background: linear-gradient(
      90deg,
      #e0e0e0 25%,
      var(--color-stroke) 50%,
      #e0e0e0 75%
    );
    background-size: 200% 200%;
    animation: pulse 2s infinite linear;
    border-radius: 6px;
  }

  .card-skeleton__button__block {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

@keyframes pulse {
  0% {
    background-position: 0% 0%;
  }

  50% {
    background-position: 100% 100%;
  }

  100% {
    background-position: 0% 0%;
  }
}
</style>
