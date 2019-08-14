const Classes = {
  SEARCH_BTN_HEADER: `header__search-btn`,
  SEARCH_BTN_NAV: `nav__search-btn`,
  SEARCH_BTN_NAV_OPEN: `nav__search-btn--search-open`,
  NAV: `nav__pages`,
  NAV_OPEN: `nav__pages--search-open`,
  SEARCH: `search`,
  SEARCH_OPEN: `search--open`,
  OVERLAY: `header__overlay`,
  OVERLAY_SHOW: `header__overlay--show`,
  CLOSE_BTN: `search__close`
};

const ESC_KEYCODE = 27;

class Search {
  constructor() {
    this.headerSearchBtns = document.querySelector(`.${Classes.SEARCH_BTN_HEADER}`);
    this.navSearchBtn = document.querySelector(`.${Classes.SEARCH_BTN_NAV}`);
    this.search = document.querySelector(`.${Classes.SEARCH}`);
    this.input = this.search ? this.search.querySelector(`input`) : false;
    this.nav = document.querySelector(`.${Classes.NAV}`);
    this.overlay = document.querySelector(`.${Classes.OVERLAY}`);
    this.closeBtn = this.search ? this.search.querySelector(`.${Classes.CLOSE_BTN}`) : false;

    if (this.input && this.closeBtn) {
      if (this.headerSearchBtns) {
        this.headerSearchBtns.addEventListener(`click`, this.searchOpen.bind(this));
      }
      if (this.navSearchBtn) {
        this.navSearchBtn.addEventListener(`click`, this.searchOpen.bind(this));
      }
    }
  }

  searchOpen() {
    this.search.classList.add(Classes.SEARCH_OPEN);
    this.input.focus();
    this.nav.classList.add(Classes.NAV_OPEN);
    this.navSearchBtn.classList.add(Classes.SEARCH_BTN_NAV_OPEN);
    this.overlay.classList.add(Classes.OVERLAY_SHOW);

    this.overlay.addEventListener(`click`, this.searchClose.bind(this));
    this.closeBtn.addEventListener(`click`, this.searchClose.bind(this));
    window.addEventListener(`keydown`, this.onEscPress.bind(this));
    document.body.classList.add(`body--modal-open`);
  }

  searchClose() {
    this.search.classList.remove(Classes.SEARCH_OPEN);
    this.nav.classList.remove(Classes.NAV_OPEN);
    this.navSearchBtn.classList.remove(Classes.SEARCH_BTN_NAV_OPEN);
    this.overlay.classList.remove(Classes.OVERLAY_SHOW);

    this.overlay.removeEventListener(`click`, this.searchClose.bind(this));
    this.closeBtn.removeEventListener(`click`, this.searchClose.bind(this));
    window.removeEventListener(`keydown`, this.onEscPress.bind(this));
    document.body.classList.remove(`body--modal-open`);
  }

  onEscPress(event) {
    if (
      this.search.classList.contains(Classes.SEARCH_OPEN) &&
      event.keyCode === ESC_KEYCODE
    ) {
      this.searchClose();
    }
  }
}

export default Search;
