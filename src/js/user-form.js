import FormValidation from './form-validation';

const Class = {
  LOGIN_OPEN_BTN: `nav__user-btn--login`,
  LOGIN: `login`,
  REG: `registration`,
  FORM_SHOW: `user-form--show`,
  REG_OPEN_BTN: `user-form__register`,
  LOGIN_BACK_BTN: `user-form__login`,
  OVERLAY: `header__overlay`,
  OVERLAY_SHOW: `header__overlay--show`,
  CLOSE_BTN: `user-form__close`,
  RECOVERY: `recovery`,
  RECOVERY_OPEN: `user-form__recovery`,
  BOTTOM_REG_OPEN_BTN: `subscription__btn`
};

const ESC_KEYCODE = 27;

export default class UserForm {
  constructor() {
    this.loginOpenBtn = document.querySelector(`.${Class.LOGIN_OPEN_BTN}`);
    this.loginForm = document.querySelector(`.${Class.LOGIN}`);
    this.loginCloseBtn = this.loginForm.querySelector(`.${Class.CLOSE_BTN}`);
    this.regOpenBtn = document.querySelector(`.${Class.REG_OPEN_BTN}`);
    this.bottomRegOpenBtn = document.querySelector(`.${Class.BOTTOM_REG_OPEN_BTN}`) || null;
    this.regForm = document.querySelector(`.${Class.REG}`);
    this.regCloseBtn = this.regForm.querySelector(`.${Class.CLOSE_BTN}`);
    this.loginBackBtn = document.querySelector(`.${Class.LOGIN_BACK_BTN}`);
    this.overlay = document.querySelector(`.${Class.OVERLAY}`);
    this.recovery = document.querySelector(`.${Class.RECOVERY}`);
    this.recoveryOpenBtn = document.querySelector(`.${Class.RECOVERY_OPEN}`);
    this.recoveryCloseBtn = this.recovery.querySelector(`.${Class.CLOSE_BTN}`);

    this.regOpen = this.regOpen.bind(this);
    this.loginOpen = this.loginOpen.bind(this);
    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.onEscPress = this.onEscPress.bind(this);
    this.onRegOpenBtnClick = this.onRegOpenBtnClick.bind(this);
    this.onRecoveryOpenClick = this.onRecoveryOpenClick.bind(this);
    this.onCloseBtnClick = this.onCloseBtnClick.bind(this);
    this.onLoginBackBtnClick = this.onLoginBackBtnClick.bind(this);

    if (this.loginOpenBtn) this.loginOpenBtn.addEventListener(`click`, this.regOpen);
    if (this.bottomRegOpenBtn) this.bottomRegOpenBtn.addEventListener(`click`, this.regOpen);
  }

  loginOpen(e) {
    e && e.preventDefault();
    window.scrollTo(0, 0);

    window.location.hash = `login`;

    this.loginForm.classList.add(Class.FORM_SHOW);
    this.overlay.classList.add(Class.OVERLAY_SHOW);

    this.loginOpenBtn.removeEventListener(`click`, this.regOpen);
    this.overlay.addEventListener(`click`, this.onOverlayClick);
    window.addEventListener(`keydown`, this.onEscPress);
    this.loginCloseBtn.addEventListener(
      `click`,
      this.onCloseBtnClick
    );
    this.regOpenBtn.addEventListener(`click`, this.onRegOpenBtnClick);
    this.recoveryOpenBtn.addEventListener(`click`, this.onRecoveryOpenClick);
  }

  loginClose() {
    window.history.replaceState({}, '', `${window.location.href.replace(/#.{0,}/, ``)}`);

    this.loginForm.classList.remove(Class.FORM_SHOW);
    this.overlay.classList.remove(Class.OVERLAY_SHOW);

    this.loginOpenBtn.addEventListener(`click`, this.regOpen);
    this.overlay.removeEventListener(`click`, this.onOverlayClick);
    window.removeEventListener(`keydown`, this.onEscPress);
    this.loginCloseBtn.removeEventListener(
      `click`,
      this.onCloseBtnClick
    );
    this.regOpenBtn.removeEventListener(`click`, this.onRegOpenBtnClick);
    this.recoveryOpenBtn.removeEventListener(`click`, this.onRecoveryOpenClick);
  }

  regOpen(e) {
    e && e.preventDefault();
    window.scrollTo(0, 0);
    window.location.hash = `registration`;

    this.regForm.classList.add(Class.FORM_SHOW);
    this.overlay.classList.add(Class.OVERLAY_SHOW);

    this.loginOpenBtn.removeEventListener(`click`, this.regOpen);
    this.regOpenBtn.removeEventListener(
      `click`,
      this.onRegOpenBtnClick
    );
    this.overlay.addEventListener(`click`, this.onOverlayClick);
    window.addEventListener(`keydown`, this.onEscPress);
    this.regCloseBtn.addEventListener(`click`, this.onCloseBtnClick);
    this.loginBackBtn.addEventListener(`click`, this.onLoginBackBtnClick);
  }

  regClose() {
    window.history.replaceState({}, '', `${window.location.href.replace(/#.{0,}/, ``)}`);

    this.regForm.classList.remove(Class.FORM_SHOW);
    this.overlay.classList.remove(Class.OVERLAY_SHOW);

    this.regOpenBtn.addEventListener(
      `click`,
      this.onRegOpenBtnClick
    );
    this.overlay.removeEventListener(`click`, this.onOverlayClick);
    window.removeEventListener(`keydown`, this.onEscPress);
    this.regCloseBtn.removeEventListener(
      `click`,
      this.onCloseBtnClick
    );
    this.loginBackBtn.removeEventListener(`click`, this.onLoginBackBtnClick);
  }

  recoveryOpen() {
    window.location.hash = `recovery`;

    this.recovery.classList.add(Class.FORM_SHOW);
    this.overlay.classList.add(Class.OVERLAY_SHOW);

    this.overlay.addEventListener(`click`, this.onOverlayClick);
    window.addEventListener(`keydown`, this.onEscPress);
    this.recoveryOpenBtn.removeEventListener(`click`, this.onRecoveryOpenClick);
    this.recoveryCloseBtn.addEventListener(`click`, this.onCloseBtnClick);
  }

  recoveryClose() {
    window.history.replaceState({}, '', `${window.location.href.replace(/#.{0,}/, ``)}`);

    this.recovery.classList.remove(Class.FORM_SHOW);
    this.overlay.classList.remove(Class.OVERLAY_SHOW);

    this.overlay.removeEventListener(`click`, this.onOverlayClick);
    window.removeEventListener(`keydown`, this.onEscPress);
    this.recoveryCloseBtn.removeEventListener(`click`, this.onCloseBtnClick);
  }

  onRegOpenBtnClick(event) {
    event.preventDefault();
    this.loginClose();
    this.regOpen();
  }

  onLoginBackBtnClick(event) {
    event.preventDefault();
    this.regClose();
    this.loginOpen();
  }

  onRecoveryOpenClick(event) {
    event.preventDefault();
    this.regClose();
    this.loginClose();
    this.recoveryOpen();
  }

  onOverlayClick() {
    this.loginClose();
    this.regClose();
    this.recoveryClose();
  }

  onCloseBtnClick() {
    this.loginClose();
    this.regClose();
    this.recoveryClose();
  }

  onEscPress(event) {
    if (
      (this.loginForm.classList.contains(Class.FORM_SHOW) ||
        this.regForm.classList.contains(Class.FORM_SHOW)) &&
      event.keyCode === ESC_KEYCODE
    ) {
      this.loginClose();
      this.regClose();
      this.recoveryClose();
    }
  }
}
