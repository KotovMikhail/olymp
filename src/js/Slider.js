import Carousel from './Carousel';

export default class Slider {
  constructor(props = {}) {
    this.main = document.querySelectorAll(props.main ? props.main : '.carousel');
    this.wrap = props.wrap ? props.wrap : '.carousel__wrapper';
    this.prev = props.prev ? props.prev : '.carousel-btns__btn--prev';
    this.next = props.next ? props.next : '.carousel-btns__btn--next';
    this.main && this.init();
  }

  init() {
    for (const item of this.main) {
      const wrap = item.querySelector(this.wrap);
      const prev = item.querySelector(this.prev);
      const next = item.querySelector(this.next);

      new Carousel({ item, wrap, prev, next });
    }
  }
}
