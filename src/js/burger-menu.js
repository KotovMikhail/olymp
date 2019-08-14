const Class = {
  MENU: `header__content`,
  MENU_OPEN: `header__content--open`,
  BURGER_BTN: `header__burger`,
  CLOSE_BTN: `header__close`,
  OVERLAY: `header__overlay`,
  OVERLAY_SHOW: `header__overlay--show`
};

const ESC_KEYCODE = 27;

class BurgerMenu {
  constructor() {
    this.menu = document.querySelector(`.${Class.MENU}`);
    this.burgerBtn = document.querySelector(`.${Class.BURGER_BTN}`);
    this.closeBtn = document.querySelector(`.${Class.CLOSE_BTN}`);
    this.overlay = document.querySelector(`.${Class.OVERLAY}`);

    if (this.burgerBtn) {
      this.burgerBtn.addEventListener(`click`, this.menuOpen.bind(this));
    }
  }

  onWindowResize() {
    const viewportHeight = window.innerHeight;
    this.menu.style.height = viewportHeight + 'px';
  }

  menuOpen() {
    this.closeBtn.addEventListener(`click`, this.menuClose.bind(this));
    window.addEventListener(`keydown`, this.onEscPress.bind(this));
    this.overlay.addEventListener(`click`, this.menuClose.bind(this));
    this.burgerBtn.removeEventListener(`click`, this.menuOpen.bind(this));
    window.addEventListener(`resize`, this.onWindowResize.bind(this), false);

    this.onWindowResize();
    this.menu.classList.add(Class.MENU_OPEN);
    this.overlay.classList.add(Class.OVERLAY_SHOW);
    document.body.classList.add(`body--modal-open`);
  }

  menuClose() {
    this.burgerBtn.addEventListener(`click`, this.menuOpen.bind(this));
    this.closeBtn.removeEventListener(`click`, this.menuClose.bind(this));
    this.overlay.removeEventListener(`click`, this.menuClose.bind(this));
    window.removeEventListener(`keydown`, this.onEscPress.bind(this));
    window.removeEventListener(`resize`, this.onWindowResize.bind(this), false);

    this.menu.classList.remove(Class.MENU_OPEN);
    this.overlay.classList.remove(Class.OVERLAY_SHOW);
    document.body.classList.remove(`body--modal-open`);
  }

  onEscPress(e) {
    if (
      this.menu.classList.contains(Class.MENU_OPEN) &&
      e.keyCode === ESC_KEYCODE
    ) {
      this.menuClose();
    }
  }
}

export default BurgerMenu;
