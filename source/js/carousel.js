const Selector = {
  MAIN: `.carousel`,
  WRAP: `.carousel__wrapper`,
  PREV: `.carousel-btns__btn--prev`,
  NEXT: `.carousel-btns__btn--next`
};

const DISABLED_BTN = `carousel-btns__btn--disabled`;

class Carousel {
  constructor(settings) {
    this.main = settings.main;
    this.wrap = settings.wrap;
    this.prev = settings.prev;
    this.next = settings.next;
    this.slides = settings.wrap.children;
  }

  getTranslateWidth() {
    return this.wrap.scrollWidth / this.slides.length;
  }

  prevSlide() {
    const currentTranslate = this.wrap.style.transform ?
      parseInt(this.wrap.style.transform.match(/\d+/), 10) : 0;
    const newTranslate = -currentTranslate + this.getTranslateWidth();

    this.next.classList.remove(DISABLED_BTN);

    if (newTranslate >= 0) {
      this.wrap.style[`transform`] = `translateX(0px)`;
      this.prev.classList.add(DISABLED_BTN);
    } else {
      this.wrap.style[`transform`] = `translateX(${newTranslate}px)`;
    }
  }

  nextSlide() {
    const currentTranslate = this.wrap.style.transform ?
      parseInt(this.wrap.style.transform.match(/\d+/), 10) : 0;
    const newTranslate = currentTranslate + this.getTranslateWidth();
    const maxTranslate = this.wrap.scrollWidth - this.wrap.clientWidth;

    this.prev.classList.remove(DISABLED_BTN);

    if (maxTranslate <= newTranslate) {
      this.wrap.style[`transform`] = `translateX(-${maxTranslate}px)`;
      this.next.classList.add(DISABLED_BTN);
    } else {
      this.wrap.style[`transform`] = `translateX(-${newTranslate}px)`;
    }
  }

  addListener() {
    // BUTTONS

    if (this.prev !== null) {
      this.prev.addEventListener(`click`, () => {
        this.prevSlide();
      });
    }

    if (this.next !== null) {
      this.next.addEventListener(`click`, () => {
        this.nextSlide();
      });
    }

    // TOUCH
    let xDown = 0;
    let yDown = 0;

    this.wrap.addEventListener(`touchstart`, (e) => {
      xDown = e.touches[0].clientX;
      yDown = e.touches[0].clientY;
    }, false);

    this.wrap.addEventListener(`touchmove`, (e) => {
      if (!xDown || !yDown) {
        return;
      }

      const xDiff = xDown - e.touches[0].clientX;
      const yDiff = yDown - e.touches[0].clientY;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }

      xDown = 0;
      yDown = 0;
    }, false);
  }
}

const addCarousel = () => {
  const mainAll = document.querySelectorAll(Selector.MAIN);

  if (mainAll.length === 0) {
    return;
  }

  for (let i = 0; i < mainAll.length; i++) {
    const main = mainAll[i];
    const wrap = main.querySelector(Selector.WRAP);
    const prev = main.querySelector(Selector.PREV);
    const next = main.querySelector(Selector.NEXT);

    const carousel = new Carousel({
      main,
      wrap,
      prev,
      next
    });

    carousel.addListener();
  }
};

export default addCarousel;
