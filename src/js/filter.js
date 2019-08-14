import {ESC_KEYCODE, media, filterClassNames} from './constants';

class Filter {
  constructor() {
    this.openButton = document.querySelector(`.${filterClassNames.openButton}`);
    this.filter = document.querySelector(`.${filterClassNames.filter}`);
    this.closeButton = document.querySelector(`.${filterClassNames.closeButton}`);
    this.scrollTop;
    this.isOpen = false;
    this.openClassName = filterClassNames.openClass;
    this.onOpenButtonClick = this.openFilter.bind(this);
    this.onCloseButtonClick = this.closeFilter.bind(this);
    this.onDocumentKeydown = this.onDocumentKeydown.bind(this);
    this.initListener();
  };

  /**
   * Открывает фильтр
   */
  openFilter() {
    this.isOpen = true;
    this.filter.classList.add(this.openClassName);

    this.closeButton.addEventListener('click', this.onCloseButtonClick);
    document.addEventListener('keydown', this.onDocumentKeydown);
    this.openButton.removeEventListener('click', this.onOpenButtonClick);

    this.scrollTop = window.pageYOffset;

    // Запрещаем прокрутку сайта при открытом модальном фильтре
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = -this.scrollTop + 'px';
    document.body.style.height = '100%';
    document.body.style.width = '100%';
  };

  /**
   * Закрывает фильтр
   */
  closeFilter() {
    this.isOpen = false;
    this.filter.classList.remove(this.openClassName);


    this.openButton.addEventListener('click', this.onOpenButtonClick);
    document.removeEventListener('keydown', this.onDocumentKeydown);
    this.closeButton.removeEventListener('click', this.onCloseButtonClick);

    // Отменяем запрет на прокрутку сайта
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = null;
    document.body.style.height = '';
    document.body.style.width = '';
    window.scroll(0, this.scrollTop);
  };

  /**
   * Вызываем закрытие фильтра, при нажатии на esc
   * @param {Event} e
   */
  onDocumentKeydown(e) {
    if (e.keyCode === ESC_KEYCODE) {
      this.closeFilter();
    }
  };

  /**
   * Закрываем фильтр при ресайзе окна больше заданного разрешения, если он был открыт
   */
  onWindowResize() {
    if (this.isOpen && document.documentElement.clientWidth > media.tablet) {
      this.closeFilter();
    }
  };

  /**
   * Вешаем обработчик на кнопку открытия фильтра
   */
  initListener() {
    this.openButton.addEventListener('click', this.onOpenButtonClick);
    window.addEventListener('resize', this.onWindowResize.bind(this));
  };
}

export default Filter;
