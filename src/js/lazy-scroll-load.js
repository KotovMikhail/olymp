import {playbillTileEvents, playbillListEvents} from './cardsData';
import {onFavoritesClick} from './add-favorites';

const INDENT = 150;
const classNames = {
  cards: `cards`,
  playbillList: `playbill--list`
};

export default class LazyScroll {
  constructor() {
    this.cards = document.querySelector(`.${classNames.cards}`);
    this.isList = !!document.querySelector(`.${classNames.playbillList}`);
    this.data = this.isList ? playbillListEvents : playbillTileEvents;
    this.isFull = false;
    this.isinProgress = false;
    this.startFrom= 0;
    this.init();
  };

  get isInViewport() {
    const rect = this.cards.getBoundingClientRect();

    return (rect.bottom - document.documentElement.clientHeight) <= INDENT;
  };

  makeTileCard(opt) {
    const template = document.getElementById(`card-template`);
    if (!template) return;
    const card = template.querySelector(`article`).cloneNode(true);
    const link = card.querySelector(`.card-tile__link`);
    const image = card.querySelector(`img`);
    const day = card.querySelector(`.card-tile__day`);
    const timeWeek = card.querySelector(`.card-tile__time-week`);
    const type = card.querySelector(`.card-tile__type`);
    const regalia = card.querySelector(`.card-tile__regalia`);
    const age = card.querySelector(`.card-tile__age-restrictions`);
    const buttonStar = card.querySelector(`.card-tile__button-star`);
    const buttonStarHint = card.querySelector(`.button-star__hint`);
    const title = card.querySelector(`.card-tile__title span`);
    const author = card.querySelector(`.card-tile__producer`);
    const country = card.querySelector(`.card-tile__country`);
    const place = card.querySelector(`.card-tile__place`);

    link.href = opt.href ? opt.href : `#`;
    image.src= opt.image;
    image.srcset = opt.image2x;
    image.alt = opt.title;
    image.width = 388;
    image.height = 232;
    day.textContent = `${opt.day} — ${opt.month}`;
    timeWeek.textContent = `${opt.time}, ${opt.dayWeek}`;
    type.textContent = opt.type;
    age.textContent = opt.age;
    title.textContent = opt.title;
    title.href = opt.href ? opt.href : `#`;
    author.textContent = opt.author;
    country.textContent = opt.from;
    place.href = opt.placeHref ? opt.placeHref : `#`;
    place.textContent = opt.place;
    buttonStar.addEventListener(`click`, onFavoritesClick);

    opt.regalias
    ? regalia.querySelector(`span`).textContent = opt.regalias
    : regalia.parentNode.removeChild(regalia);

    if (opt.fullStar) {
      buttonStar.classList.add(`button-star--full`);
      buttonStarHint.textContent = `в избранном`;
    }

    return card;
  };

  fillInCards(count) {
    const lists = document.querySelectorAll(`.playbill__card-list`);
    const container = document.createElement(`div`);
    let list;

    if (lists.length > 1) {
      list = lists[1];
    } else {
      list = document.createElement(`ul`);
      container.classList.add(`container`);
      list.classList.add(`playbill__card-list`);
    }

    for (let i = this.startFrom; i < this.startFrom + count; i++) {
      if (!this.data[i]) break;

      const item = document.createElement(`li`);
      item.classList.add(`playbill__card-item`);
      item.appendChild(this.makeTileCard(this.data[i]));

      list.appendChild(item);
    }

    if (lists.length <= 1) {
      container.appendChild(list);
      this.cards.appendChild(container);
    }

    this.startFrom += count;
    this.isFull = this.data.length <= this.startFrom;
    this.isinProgress = false;
  }

  onWindowScroll() {
    if (!this.isList && this.isInViewport && !this.isFull && !this.isinProgress) {
      this.isinProgress = true;

      setTimeout(() => this.fillInCards(10), 1000);
    }
  };

  init() {
    if (!this.isList) {
      this.cards.innerHTML = ``;
      this.fillInCards(9);

      const mailing = document.getElementById(`mailing-template`).querySelector(`.mailing`).cloneNode(true);
      this.cards.appendChild(mailing);
    }

    window.addEventListener(`scroll`, this.onWindowScroll.bind(this));
  };
};
