<template>
  <div class="card-skeleton">
    <div class="card-skeleton__image"></div>
    <div class="card-skeleton__body">
      <div class="card-skeleton__title"></div>
      <div class="card-skeleton__block">
        <div class="card-skeleton__price"></div>
        <div class="card-skeleton__currency"></div>
      </div>
      <div class="card-skeleton__info">
        <div class="card-skeleton__location"></div>
        <div class="card-skeleton__date"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-skeleton {
  display: flex;
  flex-direction: row;
  height: 120px;
  background: var(--white);
  box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
  border-radius: 6px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;

  .card-skeleton__image {
    width: 120px;
    max-height: 120px;
    background: linear-gradient(
      90deg,
      #e0e0e0 25%,
      var(--color-stroke) 50%,
      #e0e0e0 75%
    );
    background-size: 200% 200%;
    animation: pulse 2s infinite linear;
  }

  .card-skeleton__body {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 14px 16px;
    background: var(--white);
    flex: 1;
  }

  .card-skeleton__title,
  .card-skeleton__price,
  .card-skeleton__currency,
  .card-skeleton__location,
  .card-skeleton__date,
  .card-skeleton__username {
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
    height: 16px;
    width: 70%;
    margin-bottom: 8px;
  }

  .card-skeleton__block {
    display: flex;
    column-gap: 5px;
    margin-bottom: 10px;
  }

  .card-skeleton__price {
    height: 18px;
    width: 40%;
  }

  .card-skeleton__currency {
    height: 18px;
    width: 20%;
  }

  .card-skeleton__info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 12px;
    margin-top: auto;
    color: var(--color-explain);
  }

  .card-skeleton__location,
  .card-skeleton__date {
    height: 14px;
    width: 100px;
  }

  .card-skeleton__more {
    display: flex;
    width: 400px;
    gap: 10px;
    padding: 16px;
    margin-right: 40px;

    @media screen and (max-width: 991px) {
      width: 300px;
    }

    @media screen and (max-width: 768px) {
      margin-right: 0;
      width: auto;
    }

    @media screen and (max-width: 480px) {
      padding-left: 0;
    }
  }

  .card-skeleton__wishlist {
    margin-right: 110px;

    @media screen and (max-width: 991px) {
      margin-right: 40px;
    }

    @media screen and (max-width: 480px) {
      margin: 0;
    }
  }

  .card-skeleton__wishlist-button {
    width: 24px;
    height: 24px;
    background: linear-gradient(
      90deg,
      #e0e0e0 25%,
      var(--color-stroke) 50%,
      #e0e0e0 75%
    );
    background-size: 200% 200%;
    animation: pulse 2s infinite linear;
    border-radius: 50%;
  }

  .card-skeleton__section {
    display: flex;
    width: 100%;
    gap: 16px;

    @media screen and (max-width: 768px) {
      flex-direction: column;
      gap: 8px;
    }

    @media screen and (max-width: 480px) {
      display: none;
    }
  }

  .card-skeleton__username {
    height: 14px;
    width: 80px;
    margin-right: auto;
  }

  .card-skeleton__buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    @media screen and (max-width: 768px) {
      width: fit-content;
      gap: 12px;
    }
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
