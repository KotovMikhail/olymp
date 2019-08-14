const DISABLED_BTN = `carousel-btns__btn--disabled`;

export default class Carousel {
  constructor(settings) {
    this.main = settings.item;
    this.wrap = settings.wrap;
    this.prev = settings.prev;
    this.next = settings.next;
    this.slides = settings.wrap.children;
    this.xDown = 0;
    this.yDown = 0;
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onTouchstart = this.onTouchstart.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onTouchmove = this.onTouchmove.bind(this);
    this.addListener();
  }

  getTranslateWidth() {
    return this.wrap.scrollWidth / this.slides.length;
  }

  prevSlide() {
    const currentTranslate = this.wrap.style.transform ? parseInt(this.wrap.style.transform.match(/\d+/), 10) : 0;
    const newTranslate = -currentTranslate + this.getTranslateWidth();

    this.next.classList.remove(DISABLED_BTN);

    if (newTranslate >= 0) {
      this.transform(`translateX(0px)`);
      this.prev.classList.add(DISABLED_BTN);
      this.next.focus();
      return false;
    }

    this.transform(`translateX(${newTranslate}px)`);
  }

  nextSlide() {
    const currentTranslate = this.wrap.style.transform ? parseInt(this.wrap.style.transform.match(/\d+/), 10) : 0;
    const newTranslate = currentTranslate + this.getTranslateWidth();
    const maxTranslate = this.wrap.scrollWidth - this.wrap.clientWidth;

    this.prev.classList.remove(DISABLED_BTN);

    if (maxTranslate <= newTranslate) {
      this.transform(`translateX(-${maxTranslate}px)`);
      this.next.classList.add(DISABLED_BTN);
      this.prev.focus();
      return false;
    }

    this.transform(`translateX(-${newTranslate}px)`);
  }

  transform(param) {
    this.wrap.style[`transform`] = param;
  }

  onTouchstart(event) {
    event.preventDefault();
    this.xDown = event.touches[0].clientX;
    this.yDown = event.touches[0].clientY;
    this.main.removeEventListener(`touchstart`, this.onTouchstart, false);
    this.main.addEventListener(`touchmove`, this.onTouchmove, false);
  }

  onTouchmove(event) {
    event.preventDefault();
    if (!this.xDown || !this.yDown) return false;

    const xDiff = this.xDown - event.touches[0].clientX;
    const yDiff = this.yDown - event.touches[0].clientY;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      xDiff > 0 ? this.nextSlide() : this.prevSlide();
    }

    this.xDown = 0;
    this.yDown = 0;

    this.main.removeEventListener(`touchmove`, this.onTouchmove, false);
    this.main.addEventListener(`touchstart`, this.onTouchstart, false);
  }

  onMouseDown(event) {
    event.preventDefault();
    this.xDown = event.clientX;
    this.yDown = event.clientY;

    this.wrap.removeEventListener(`mousedown`, this.onMouseDown, false);
    this.wrap.addEventListener(`mouseup`, this.onMouseUp, false);
  }

  onMouseUp(event) {
    event.preventDefault();

    const xDiff = this.xDown - event.clientX;
    const yDiff = this.yDown - event.clientY;

    if (!this.xDown || !this.yDown) return false;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      xDiff > 0 ? this.nextSlide() : this.prevSlide();
    }

    this.xDown = 0;
    this.yDown = 0;

    this.wrap.addEventListener(`mousedown`, this.onMouseDown, false);
    this.wrap.removeEventListener(`mouseup`, this.onMouseUp, false);
  }

  addListener() {
    if (this.prev !== null) {
      this.prev.addEventListener(`click`, this.prevSlide.bind(this));
    }

    if (this.next !== null) {
      this.next.addEventListener(`click`, this.nextSlide.bind(this));
    }

    this.main.addEventListener(`touchstart`, this.onTouchstart, false);
    this.wrap.addEventListener(`mousedown`, this.onMouseDown, false);
  }
}
