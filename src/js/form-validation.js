const INVALID_CLASS = `input-invalid`;
const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

export default class FromValidation {
  constructor(form, func) {
    this.form = form;
    this.backendCallback = func;
    this.textAll = form.querySelectorAll(`input[type='text']`);
    this.email = form.querySelector(`input[type="email"]`);
    this.password = form.querySelector(`input[type='password']`);
    this.submit = form.querySelector(`button[type='submit']`);
    this.boundResetValidation = (e) => this.resetValidation(e);
    this.addListeners();
  }

  /**
   * Делает поле визаульно невалидным (вешает класс, добавляет сообщение об ошибке)
   * @param {Node} input
   * @param {String} invalidMessage
   */
  validation(input, invalidMessage) {
    input.setCustomValidity(invalidMessage);
    input.classList.add(INVALID_CLASS);
    const container = input.parentElement;
    const validMessage = input.closest(`.g-recaptcha`) ? this.form.querySelector(`.g-recaptcha + .invalid-text`) : container.querySelector(`.invalid-text`);
    validMessage.textContent = invalidMessage || ``;
    input.addEventListener(`input`, this.boundResetValidation);
  };

  /**
   * Сбрасывает невалидное состояние поля
   * @param {Event} e
   */
  resetValidation(e) {
    const input = e.target;
    const container = input.parentElement;
    const validMessage = container.querySelector(`.invalid-text`);
    validMessage.textContent = ``;
    input.setCustomValidity(``);
    input.classList.remove(INVALID_CLASS);
    input.removeEventListener(`input`, this.boundResetValidation);
  }

  /**
   * Функция callback для клика по кнопке отправки формы
   * @param {Event} e
   */
  onSubmitClick(e) {
    e && e.preventDefault();

    const self = this;
    const data = new FormData(this.form);
    let result = [];

    for (const i of data) {
      result.push(`${i[0]}=${i[1]}`);
    }

    result = result.join(`&`);

    $.ajax({
      url: self.form.action,
      type: 'POST',
      data: result,
      success: function(answer) {
        if (!answer.success) {
          if (answer.errors) {
            for (const error in answer.errors) {
              if (answer.errors.hasOwnProperty(error) && self.form.elements[error]) {
                const errorObj = answer.errors[error];
                const message = errorObj[Object.keys(errorObj)[0]];
                self.validation(self.form.elements[error], message);
              }
            }
          } else if (answer.message) {
            self.validation(self.form.querySelector(`input`), answer.message);
          }
        } else if (self.backendCallback) {
          self.backendCallback(answer);
        }
      }
    });
  };

  /**
   * Функция callback для отправки формы
   * @param {Event} e
   */
  onFormSubmit(e) {
    e.preventDefault();

    this.onSubmitClick();
  };

  addListeners() {
    if (this.submit) {
      this.submit.addEventListener(`click`, this.onSubmitClick.bind(this));
    }

    if (this.form.querySelector(`.lk__reminders-input`)) {
      const self = this;

      this.form.querySelector(`.lk__reminders-input`).addEventListener(`change`, () => {
        self.onSubmitClick();
      });
    }

    if (this.form.querySelector(`.lk__editor-sub-input`)) {
      const self = this;

      this.form.querySelector(`.lk__editor-sub-input`).addEventListener(`change`, () => {
        self.onSubmitClick();
      });
    }
  }
}
