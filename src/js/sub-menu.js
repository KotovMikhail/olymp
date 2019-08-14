const Class = {
  SUB_MENU: `nav__pages-item--with-sub`,
  CHECKBOX: `nav__pages-checkbox`,
  SUB_LIST: `nav__sub-pages-link`
};

const ENTER_KEYCODE = 13;
const ESC_KEYCODE = 27;

class SubMenu {
  constructor() {
    this.subMenuAll = document.querySelectorAll(`.${Class.SUB_MENU}`);
    this.boundCheckboxFocus = (e) => this.onCheckboxFocus(e);
    this.boundCheckboxChange = (e) => this.onCheckboxChange(e);
    this.addListeners();
  }

  onCheckboxFocus(e) {
    window.addEventListener(`keydown`, this.onCheckboxEnter.bind(this));
  }

  onCheckboxEnter(e) {
    if (e.keyCode === ENTER_KEYCODE) {
      e.target.checked = !e.target.checked;
      this.onCheckboxChange(e);
    }
  }

  onCheckboxChange(e) {
    const checkbox = e.target;
    const subMenu = checkbox.parentElement;
    const subList = subMenu.querySelector(`.${Class.SUB_LIST}`);
    const label = subMenu.querySelector(`label`);

    const hideMenu = () => {
      checkbox.checked = false;
      window.removeEventListener(`keydown`, onEscPress);
      document.removeEventListener(`click`, onAnowerClick, true);
    };

    const onEscPress = (e) => {
      if (e.keyCode === ESC_KEYCODE) {
        hideMenu();
      }
    };

    const onAnowerClick = (e) => {
      if (e.target !== subList && e.target !== label && e.target !== checkbox) {
        hideMenu();
      }
    };

    if (checkbox.checked) {
      window.addEventListener(`keydown`, onEscPress);
      document.addEventListener(`click`, onAnowerClick, true);
    }
  }

  addListeners() {
    for (let i = 0; i < this.subMenuAll.length; i++) {
      const subMenu = this.subMenuAll[i];
      const checkbox = subMenu.querySelector(`.${Class.CHECKBOX}`);
      checkbox.addEventListener(`focus`, this.boundCheckboxFocus);
      checkbox.addEventListener(`change`, this.boundCheckboxChange);
    }
  }
}

export default SubMenu;
