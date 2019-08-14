import createSocials from './social';

export default class Album {
  constructor(props) {
    this.main = document.querySelector(`.album[data-id='${props.id}']`);
    this.wrap = this.main.querySelector(`.album__slider-list`);
    this.prev = this.main.querySelector(`.album__btn--prev`);
    this.next = this.main.querySelector(`.album__btn--next`);
    this.slides = this.wrap ? this.wrap.querySelectorAll(`.album__slider-item`) : null;
    this.counterCurrent = this.main.querySelector(`.album__counter-current`);
    this.counterAll = this.main.querySelector(`.album__counter-all`);
    this.maxPosition = this.slides ? this.slides.length - 1 : 0;
    this.btns = this.main.querySelectorAll(`.album__pag-btn`);
    this.state = {
      hash: '',
      position: window.location.hash.match(/index=\d{0,}/) && window.location.hash.match(/index=\d{0,}/)[0] ? Number(window.location.hash.match(/index=\d{0,}/)[0].replace(`index=`, ``)) : 0,
      xDown: 0,
      yDown: 0,
      title: props && props.title ? props.title : '',
    };
    if (this.state.position > this.maxPosition) this.state.position = 0;
    this.date = this.main.querySelector('.album__publish-data');
    this.author = this.main.querySelector('.album__meta-author');
    this.metaTitle = this.main.querySelector('.album__meta-title');
    this.onAlbumKeydown = this.onAlbumKeydown.bind(this);

    this.init();
  }

  prevSlide() {
    if (this.state.position >= 0)--this.state.position;
    if (this.state.position < 0) this.state.position = this.maxPosition;

    this.transform(`translateX(-${this.state.position}00%)`);
    this.counterCurrent.textContent = `${this.state.position + 1}`;
    this.setMeta();
  }

  nextSlide() {
    if (this.state.position <= this.maxPosition)++this.state.position;
    if (this.state.position > this.maxPosition) this.state.position = 0;

    this.transform(`translateX(-${this.state.position}00%)`);
    this.counterCurrent.textContent = `${this.state.position + 1}`;
    this.setMeta();
  }

  numSlide(num) {
    this.state.position = num;
    this.transform(`translateX(-${this.state.position}00%)`);
    this.counterCurrent.textContent = `${this.state.position + 1}`;
    this.setMeta();
  }

  setCurrent(num) {
    for (let i = 0; i < this.btns.length; i++) {
      this.btns[i].classList.toggle(`album__pag-btn--current`, i === num);
    }
  }

  setMeta() {
    this.counterAll.textContent = ` / ${this.maxPosition + 1}`;
    this.counterCurrent.textContent = `${this.state.position + 1}`;
    this.setCurrent(this.state.position);
    this.wrap.dataset.current = this.state.position;
    window.history.replaceState({}, ``, window.location.href.replace(/index=\d{0,}/, `index=${this.state.position}`));
  }

  onTouchstart(event) {
    this.state.xDown = event.touches[0].clientX;
    this.state.yDown = event.touches[0].clientY;
    this.wrap.removeEventListener(`touchstart`, this.onTouchstart.bind(this), {
      passive: true
    });
    this.wrap.addEventListener(
      `touchmove`,
      this.onTouchmove.bind(this),
      false,
      {
        passive: true
      }
    );
  }

  onTouchmove(event) {
    if (!this.state.xDown || !this.state.yDown) return false;

    const xDiff = this.state.xDown - event.touches[0].clientX;
    const yDiff = this.state.yDown - event.touches[0].clientY;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      xDiff > 0 ? this.nextSlide() : this.prevSlide();
    }

    this.state.xDown = 0;
    this.state.yDown = 0;

    this.wrap.removeEventListener(`touchmove`, this.onTouchmove.bind(this), {
      passive: true
    });
    this.wrap.addEventListener(
      `touchstart`,
      this.onTouchstart.bind(this),
      false,
      {
        passive: true
      }
    );
  }

  onMouseDown(event) {
    event.preventDefault();
    this.state.xDown = event.clientX;
    this.state.yDown = event.clientY;

    this.wrap.removeEventListener(
      `mousedown`,
      this.onMouseDown.bind(this),
      false,
      {
        passive: true
      }
    );
    this.wrap.addEventListener(`mouseup`, this.onMouseUp.bind(this), false, {
      passive: true
    });
  }

  onMouseUp(event) {
    event.preventDefault();

    const xDiff = this.state.xDown - event.clientX;
    const yDiff = this.state.yDown - event.clientY;

    if (!this.state.xDown || !this.state.yDown) {
      return;
    }

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      xDiff > 0 ? this.nextSlide() : this.prevSlide();
    }

    this.state.xDown = 0;
    this.state.yDown = 0;

    this.wrap.addEventListener(
      `mousedown`,
      this.onMouseDown.bind(this),
      false,
      {
        passive: true
      }
    );
    this.wrap.removeEventListener(`mouseup`, this.onMouseUp.bind(this), false, {
      passive: true
    });
  }

  onAlbumKeydown(event) {
    if (event.keyCode === 37) {
      this.prevSlide();
    }
    if (event.keyCode === 39) {
      this.nextSlide();
    }
  }

  init() {
    if (this.counterAll) this.setMeta();

    createSocials(this.main);

    if (this.author) {
      const currentAuthor = this.main.querySelector(`.album__item-author`)
        ? this.main.querySelector(`.album__item-author`).textContent
        : '';
      this.author.textContent = currentAuthor;
      this.metaTitle.textContent = this.state.title;
    }

    this.prev && this.prev.addEventListener(`click`, this.prevSlide.bind(this));
    this.next && this.next.addEventListener(`click`, this.nextSlide.bind(this));

    if (this.wrap && this.btns) {
      for (let i = 0; i < this.btns.length; i++) {
        this.btns[i].addEventListener(`click`, this.numSlide.bind(this, i));
      }

      this.transform(`translateX(-${this.state.position}00%)`);

      this.wrap.addEventListener(
        `touchstart`,
        this.onTouchstart.bind(this),
        false,
        {
          passive: true
        }
      );
      this.wrap.addEventListener(
        `mousedown`,
        this.onMouseDown.bind(this),
        false,
        {
          passive: true
        }
      );
    }
  }

  transform(param) {
    this.wrap.style[`transform`] = param;
  }
}
