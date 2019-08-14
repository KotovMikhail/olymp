export default class Subscription {
  constructor(form, text) {
    this.form = form;
    this.text = text || `Форма успешно отправлена`;
    this.email = this.form ? this.form.querySelector(`.subscription__input`) : null;
  }

  onFormValid(answer) {
    const popup = answer ? this.createPopup(answer.message) : this.createPopup();
    document.body.appendChild(popup);
    const popupRemove = () => {
      if (popup && popup.parentElement) {
        document.body.removeChild(popup);
      }
    };

    const close = popup.querySelector(`.subscription__popup-close`);
    close.addEventListener(`click`, popupRemove);
    if (this.email) this.email.value = ``;

    const time = setTimeout(() => {
      close.removeEventListener(`click`, popupRemove);
      popupRemove();
      clearTimeout(time);
    }, 5000);
  }

  createPopup(message) {
    const popup = document.createElement(`div`);
    const text = document.createElement(`span`);
    const close = document.createElement(`button`);
    popup.className = `subscription__popup`;
    text.className = `subscription__popup-text`;
    close.className = `subscription__popup-close`;
    text.textContent = message || this.text;
    popup.appendChild(text);
    popup.appendChild(close);
    return popup;
  }
}
