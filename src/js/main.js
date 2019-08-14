import '@babel/polyfill';
import './polyfill';
import Accordion from './Accordion';
import BurgerMenu from './burger-menu';
import Filter from './filter';
import FilterChange from './filter-change';
import OpenAlbum from './open-album';
import Slider from './Slider';
import SubMenu from './sub-menu';
import Search from './search';
import UserForm from './user-form';
import createSocials from './social';
import {addFavorites} from './add-favorites';
import './_gallery-slider';
import './party-card-list';
import './reviews';
import './request';
import './tile-list-toggle';
import FromValidation from './form-validation';
import Subscription from './subscription';

new Accordion({
  el: '.accordion',
  collapsible: true,
  active: false,
  heightStyle: 'content',
  animate: 200,
  headers: '.ui-accordion-header'
});

class App {
  static init(props = {}) {
    if (document.querySelector(`.filter`)) {
      new Filter();

      if (document.querySelector(`.gallery`)) {
        const openAlbum = new OpenAlbum();
        new FilterChange(openAlbum.init.bind(openAlbum));
      } else if (document.querySelector(`.cards`)) {
        new FilterChange(addFavorites);
      } else {
        new FilterChange();
      }
    }

    if (document.querySelector(`form`)) {
      Array.from(document.querySelectorAll(`form`)).forEach((item) => {
        if (item.classList.contains(`search`)) return;

        if (item.classList.contains(`registration`)) {
          new FromValidation(item, function(answer) {
            window.location.href = `${window.location.origin}${answer.redirect}`;
          });
          return;
        }

        if (item.classList.contains(`recovery`)) {
          const popup = new Subscription(item);
          new FromValidation(item, popup.onFormValid.bind(popup));
          return;
        }

        if (item.classList.contains(`login`)) {
          new FromValidation(item, function(answer) {
            window.location.href = `${window.location.origin}${answer.redirect}`;
          });
          return;
        }

        if (item.classList.contains(`lk__editor-form`)) {
          const popup = new Subscription(item);
          new FromValidation(item, popup.onFormValid.bind(popup));
          return;
        };

        new FromValidation(item);
      });
    }

    if (document.querySelector(`.user-form`)) {
      const userForm = new UserForm();

      const hash = window.location.hash;

      switch (hash.slice(1)) {
        case `login`:
          userForm.loginOpen();
          break;

        case `registration`:
          userForm.regOpen();
          break;

        case `recovery`:
          userForm.recoveryOpen();
          break;

        default:
          break;
      }
    }

    if (objectFitImages) {
      objectFitImages();
    }

    new BurgerMenu();
    new SubMenu();
    new Search();
    new Slider();
    addFavorites();
    if (document.querySelector(`.rambler-share`)) {
      createSocials();
    }

    if (document.querySelector(`.subscription`)) {
      const subscription = document.querySelector(`.subscription`);
      new Subscription(subscription);
    }
  }

  static findAncestor(el, selector) {
    while (!el.matches(selector) && (el = el.parentElement));
    return el;
  }
}

App.init();
window.App = App;
