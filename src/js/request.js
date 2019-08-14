import {ESC_KEYCODE, requestData} from './constants';

const requestLink = document.querySelector(`.${requestData.link}`);

if (requestLink) {
  const hintSuccess = document.querySelector(`.${requestData.hintSuccess}`);
  const hintNoSuccess = document.querySelector(`.${requestData.hintNoSuccess}`);
  const linkRegistration = document.querySelector(`.${requestData.linkRegistration}`) || null;
  const linkLoginIn = document.querySelector(`.${requestData.linkLoginIn}`) || null;
  const menuLoginLink = document.querySelector(`.${requestData.loginLinkClass}`) || null;
  const menuRegisterLink = document.querySelector(`.${requestData.registerLinkClass}`) || null;

  const onRequestLinkClick = (e) => {
    e.preventDefault();
    const url = e.currentTarget.dataset.url;

    $.ajax({
      url: url,
      type: 'POST',
      success: function(answer) {
        if (answer.result) {
          const buttonClose = hintSuccess.querySelector(`.${requestData.buttonClose}`);
          hintSuccess.classList.add(requestData.hintOpen);
          requestLink.textContent = requestData.successText;
          requestLink.classList.add(requestData.successClass);
          requestLink.removeAttribute(`href`);
          requestLink.blur();

          requestLink.removeEventListener(`click`, onRequestLinkClick);
          buttonClose.addEventListener(`click`, onHintClose);
          document.addEventListener(`keydown`, onDocumentKeyDown);
        } else {
          const buttonClose = hintNoSuccess.querySelector(`.${requestData.buttonClose}`);
          hintNoSuccess.classList.add(requestData.hintOpen);
          requestLink.blur();

          buttonClose.addEventListener(`click`, onHintClose);
          document.addEventListener(`keydown`, onDocumentKeyDown);
        }
      }
    });
  };

  const onLinkRegistrationClick = function(e) {
    e.preventDefault();

    if (menuLoginLink && menuRegisterLink) {
      menuLoginLink.click();
      menuRegisterLink.click();
      hintNoSuccess.querySelector(`.${requestData.buttonClose}`).click();
    }
  };

  const onLinkLoginInClick = function(e) {
    e.preventDefault();

    if (menuLoginLink) {
      menuLoginLink.click();
      hintNoSuccess.querySelector(`.${requestData.buttonClose}`).click();
    }
  };

  const onHintClose = (e) => {
    const hint = document.querySelector(`.${requestData.hintOpen}`);

    hint.classList.remove(requestData.hintOpen);
    e.currentTarget.removeEventListener(`click`, onHintClose);
    document.removeEventListener(`keydown`, onDocumentKeyDown);
  };

  const onDocumentKeyDown = (e) => {
    if (e.keyCode === ESC_KEYCODE) {
      onHintClose();
    }
  };

  requestLink.addEventListener(`click`, onRequestLinkClick);
  linkRegistration.addEventListener(`click`, onLinkRegistrationClick);
  linkLoginIn.addEventListener(`click`, onLinkLoginInClick);
}
