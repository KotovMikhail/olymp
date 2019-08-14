import {favorites} from './constants';
import Subscription from './subscription';

const loginButton = document.querySelector(`.nav__user-btn--login`);

export const onFavoritesClick = (e) => {
  const favoritButton = e.target.closest(`.${favorites.className}`);
  const hint = favoritButton.querySelector(`span`);

  if (e.currentTarget.dataset.url) {
    $.ajax({
      url: `${window.location.origin}${e.currentTarget.dataset.url}`,
      type: 'POST',
      success: function(answer) {
        if (answer.success) {
          const quantity = document.querySelector(`.nav__user-quantity`);
          hint.textContent = favoritButton.title = answer.state ? favorites.fullText : favorites.noFullText;
          favoritButton.setAttribute(`aria-label`, answer.state ? favorites.fullText : favorites.noFullText);
          favoritButton.classList.toggle(`${favorites.className}${favorites.prefix}`);

          if (answer.count > 0 && quantity) {
            quantity.style.display = `inline`;
            quantity.textContent = `(${answer.count})`;
          } else if (quantity) {
            quantity.style.display = `none`;
          }

          if (window.location.pathname === `/ru/favorites` && !answer.state) {
            const card = favoritButton.closest(`.lk__event`);

            if (card && card.parentElement) {
              card.parentElement.removeChild(card);
            }
          }
        } else {
          new Subscription(null, answer.message);
        }
      }
    });
  } else if (loginButton) {
    loginButton.click();
  }

  favoritButton.blur();
};

export const addFavorites = () => {
  const favoritesButtons = document.querySelectorAll(`.${favorites.className}`);

  if (favoritesButtons) {
    Array.from(favoritesButtons).forEach((it) => {
      it.addEventListener(`click`, onFavoritesClick);
    });
  }
};
