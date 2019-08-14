// import Swiper from 'swiper';
import {media} from './constants';

if (document.querySelector(`.party-card-list`)) {
  let swiper;
  const onWindowResize = () => {
    if (window.innerWidth <= media.mobile) {
      if (!swiper) {
        swiper = new Swiper(`.party-card-list`, {
          navigation: {
            nextEl: '.party-card-list__button-arrow--next',
            prevEl: '.party-card-list__button-arrow--prev',
          },
          slidesPerView: 3,
          spaceBetween: 25,
          breakpoints: {
            530: {
              slidesPerView: 2,
              spaceBetween: 25,
            },
            374: {
              slidesPerView: 1,
              spaceBetween: 25,
            },
          }
        });
      }
    } else {
      if (swiper) {
        swiper.destroy();
        swiper = undefined;
      }
    }
  };

  window.addEventListener(`resize`, onWindowResize);
  onWindowResize();
}
