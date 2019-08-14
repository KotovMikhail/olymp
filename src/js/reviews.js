// import Swiper from 'swiper';

if (document.querySelector(`.reviews__container`)) {
  const swiper = new Swiper(`.reviews__container`, {
    navigation: {
      nextEl: '.reviews__button-arrow--next',
      prevEl: '.reviews__button-arrow--prev',
    },
    slidesPerView: 2,
    spaceBetween: 60,
    breakpoints: {
      768: {
        slidesPerView: 1,
        spaceBetween: 10
      },
    }
  });
}
