import Album from './album';
const ESC_KEYCODE = 27;

export default class OpenAlbum {
  constructor() {
    this.page = document.querySelector(`main`);
    this.album = document.querySelector(`.album`);
    this.links = document.querySelectorAll(`.card__link`);
    this.images = 'card__image';
    this.close = this.album ? this.album.querySelector(`.album__close`) : null;
    this.albumClose = this.albumClose.bind(this);
    this.onEscPress = this.onEscPress.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onWindowPopstate = this.onWindowPopstate.bind(this);
    this.albumOpen = this.albumOpen.bind(this);
    this.isOpen = false;
    this.init();

    if (window.location.hash.match(/url=[\w\-\/]{0,}/) && window.location.hash.match(/url=[\w\-\/]{0,}/)[0].replace(`url=/`, ``)) {
      this.backendUpload();
    }
  }

  onWindowPopstate() {
    if (this.isOpen) {
      this.albumClose();
    } else {
      this.backendUpload();
    }
  }

  onWindowResize() {
    const viewportHeight = window.innerHeight;
    if (document.querySelectorAll(`.album`)) {
      Array.from(document.querySelectorAll(`.album`)).forEach((item) => {
        item.style.height = viewportHeight + 'px';
      });
    }
  }

  albumOpen(event) {
    event.preventDefault();

    const listItem = App.findAncestor(event.target, '.gallery__item');
    if (listItem) {
      const index = document.querySelector(`.album[data-id='${listItem.dataset.id}'] .album__slider-list`)
      ? document.querySelector(`.album[data-id='${listItem.dataset.id}'] .album__slider-list`).dataset.current
      : 0;
      window.removeEventListener(`popstate`, this.onWindowPopstate);
      window.location.hash = `url=${listItem.dataset.url}&index=${index}`;
      window.addEventListener(`popstate`, this.onWindowPopstate);
      this.backendUpload(listItem.dataset);
      this.isOpen = true;
    }
  }

  backendUpload(dataset) {
    let hashId = window.location.hash.match(/url=[\w\-\/]{0,}/) || ``;
    if (hashId && hashId[0]) {
      hashId = hashId[0].replace(`url=/`, ``) || ``;
    }
    const url = hashId ? `${window.location.origin}/${hashId}` : `${window.location.origin}${dataset ? dataset.url : ''}`;
    const self = this;

    if (!dataset && !hashId) return;

    if (dataset && dataset.id && document.querySelector(`.album[data-id='${dataset.id}']`)) {
      document.body.classList.add(`body--modal-open`);
      document.addEventListener(`keydown`, this.onEscPress);
      window.addEventListener(`resize`, this.onWindowResize, false);
      this.album = document.querySelector(`.album[data-id='${dataset.id}']`);
      this.close = this.album.querySelector(`.album__close`);
      this.close.addEventListener(`click`, this.albumClose);
      this.album.classList.add(`album--open`);
      document.addEventListener(`keydown`, this.album.albumClass_.onAlbumKeydown);

      return;
    }

    $.ajax({
      url: url,
      type: 'POST',
      success: function(data) {
        const fragment = document.createDocumentFragment();
        const container = document.createElement(`div`);
        const urlMatch = window.location.href.match(/^([^?]+\?)(.*?)?(#.*)?$/);

        if (!dataset || !document.querySelector(`.album[data-id='${dataset.id}']`)) {
          container.innerHTML = data;
          Array.from(container.children).forEach((item) => fragment.appendChild(item));

          // в случае загрузки страницы по ссылке с хэшем, backendUpload запускается без аргументов, поэтому мы сами создаем необходимый dataset
          if (!dataset) {
            dataset = {};
            dataset.id = fragment.querySelector(`.album`).dataset.id;
          }

          document.querySelector(`main`).appendChild(fragment);
        }

        self.open(dataset);

        if (urlMatch && urlMatch[2]) {
          window.history.replaceState({}, '', `${urlMatch[1]}${urlMatch[2]}${urlMatch[3] ? urlMatch[3] : ''}`);
        } else if (urlMatch && urlMatch[1]) {
          window.history.replaceState({}, '', urlMatch[1]);
        } else {
          window.history.replaceState({}, '', window.location.href);
        }
      }
    });
  }

  albumClose() {
    this.isOpen = false;
    const id = this.album.dataset.id;

    this.album = document.querySelector(`.album[data-id='${id}']`);
    this.close = this.album.querySelector(`.album__close`);
    this.close.removeEventListener(`click`, this.albumClose);
    this.album.classList.remove(`album--open`);
    this.iframe = this.album.querySelector(`iframe`);

    const urlMatch = window.location.href.match(/^([^?]+\?)(.*?)?(#.*)?$/);

    document.body.classList.remove(`body--modal-open`);
    document.removeEventListener(`keydown`, this.onEscPress);
    window.removeEventListener(`resize`, this.onWindowResize, false);

    if (urlMatch && urlMatch[1]) {
      window.history.replaceState({}, '', `${urlMatch[1].replace(`/${id}`, '')}${urlMatch[2]}`);
    } else {
      window.history.replaceState({}, '', `${window.location.origin}${window.location.pathname}`);
    }

    if (window.location.href.endsWith(`#`)) window.history.replaceState({}, '', window.location.href.slice(0, -1));

    if (this.iframe) this.iframe.src = this.iframe.src;

    document.removeEventListener(`keydown`, this.album.albumClass_.onAlbumKeydown);
  }

  onEscPress(e) {
    if (e.keyCode === ESC_KEYCODE) {
      this.albumClose();
    }
  }

  init() {
    window.addEventListener(`popstate`, this.onWindowPopstate);

    Array.from(document.querySelectorAll(`.card__link`)).forEach((link) => {
      link.addEventListener('click', this.albumOpen);
    });
  }

  open(slide) {
    this.isOpen = true;
    document.body.classList.add(`body--modal-open`);
    document.addEventListener(`keydown`, this.onEscPress);
    window.addEventListener(`resize`, this.onWindowResize, false);
    const newAlbumClass = new Album(slide);
    this.album = document.querySelector(`.album[data-id='${slide.id}']`);
    this.close = this.album.querySelector(`.album__close`);
    this.close.addEventListener(`click`, this.albumClose);
    this.album.classList.add(`album--open`);
    this.album.albumClass_ = newAlbumClass;
    this.onWindowResize();
    document.addEventListener(`keydown`, this.album.albumClass_.onAlbumKeydown);
  }
}
