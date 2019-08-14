import {filterResultTemplateId, filterClassNames} from './constants';

const INDENT = 150;

class FilterChange {
  constructor(func, obj) {
    this.mainFilter = document.querySelector(filterClassNames.mainFilterForm);
    this.characterFilter = document.querySelector(filterClassNames.characterFilterForm) || null;
    this.monthFilter = document.querySelector(filterClassNames.monthFilter) || null;
    this.resetButton = document.querySelector(filterClassNames.reset) || null;
    this.filterResult = document.querySelector(filterClassNames.filterResult) || null;
    this.list = document.querySelector(filterClassNames.list) || null;
    this.mainFilterElements = {};
    this.filterDataSelected = {};
    this.mainFilterResultsObj = this.filterResult ? {} : null;
    this.onMainNiceFilterClick = this.onMainNiceFilterClick.bind(this);
    this.onMonthNiceFilterClick = this.onMonthNiceFilterClick.bind(this);
    this.backendCallback = func;
    this.backendObj = obj;
    this.scrollTop;
    this.isinProgress = false;
    this.isFull = this.list.dataset.pages === undefined ? true : this.list.dataset.pages <= 1;
    this.onWindowScroll = this.onWindowScroll.bind(this);
    this.onFormElementChange();
    this.fillMainFormElements();
    this.getHashFromUrl();
    this.init();

    if (document.querySelector(filterClassNames.mainNiceSelect)) {
      this.mainNiceSelect = $(`${filterClassNames.mainNiceSelect}:not(${filterClassNames.monthFilterNiceSelect})`).niceSelect();
      this.onSelectsChange(this.mainFilter, this.mainNiceSelect, this.onMainNiceFilterClick);

      // заменяем дефолтный span с выбранным значением кастомного селекта на новый, который не меняется, при выборе нового значения
      Array.from(this.mainFilter.querySelectorAll(`.nice-select`)).forEach((niceSelect) => {
        const currentText = niceSelect.querySelector(`.current`);
        const selectTitle = niceSelect.querySelector(`[data-value='select-title']`);
        const newCurrent = document.createElement(`span`);

        newCurrent.textContent = selectTitle.textContent;
        currentText.style.display = `none`;

        niceSelect.insertBefore(newCurrent, currentText);
      });
    }

    if (document.querySelector(filterClassNames.monthFilterNiceSelect)) {
      this.monthFilterNiceSelect = $(filterClassNames.monthFilterNiceSelect).niceSelect();
      this.onSelectsChange(this.monthFilter, this.monthFilterNiceSelect, this.onMonthNiceFilterClick);
      document.querySelector(`${filterClassNames.monthFilter} .nice-select`).addEventListener(`click`, this.onMonthClick.bind(this));
    }

    if (this.resetButton) {
      this.resetButton.addEventListener(`click`, (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        window.location.hash = '';
        window.location.reload();
      });
    }
  };

  get isInViewport() {
    const rect = this.list.getBoundingClientRect();

    return (rect.bottom - document.documentElement.clientHeight) <= INDENT;
  };

  /**
   * Создаем объект с данными по всем элементам главного фильтра
   */
  fillMainFormElements() {
    Array.from(this.mainFilter.elements).forEach((item) => {
      switch (item.type) {
        case `select-multiple`:
          const selectedOptions = Array.from(item.options).filter((option) => option.selected && !option.classList.contains(`visually-hidden`));
          this.mainFilterElements[item.name] = {
            node: item,
            type: item.type,
            options: []
          };

          selectedOptions.forEach((option) => {
            this.mainFilterElements[item.name].options.push(
              {
                name: option.textContent,
                option: option
              }
            );
          });
          break;
        case `checkbox`:
          this.mainFilterElements[item.name] = {
            node: item,
            type: item.type,
            name: item.labels[0].textContent
          };
          break;

        case `select-one`:
          const option = item.options[item.selectedIndex] || item.options[1] || null;

          this.mainFilterElements[item.name] = {
            node: item,
            type: item.type,
            name: option.textContent
          };
        default:
          break;
      }
    });
  };

  createMainFilterResultsObj(formData) {
    this.mainFilterResultsObj = {};

    for (const element of formData) {
      const name = element[0];
      const value = element[1];
      const node = this.mainFilterElements[name].node;

      switch (node.type) {
        case `select-one`:
          const values = [];
          this.mainFilterResultsObj[name] = {
            value: values.push(value),
            type: `select-one`,
            name: node.options[node.selectedIndex].textContent,
            node: node
          };
          break;

        case `checkbox`:
          this.mainFilterResultsObj[name] = {
            value: name,
            type: `checkbox`,
            name: node.labels[0].textContent,
            node: node
          };
          break;

        case `select-multiple`:
          const selectedOptions = Array.from(this.mainFilterElements[name].node.options).filter((option) => option.selected && !option.classList.contains(`visually-hidden`));

          this.mainFilterResultsObj[name] = {
            values: [],
            options: [],
            type: `select-multiple`,
            node: node
          };

          selectedOptions.forEach((option) => {
            this.mainFilterResultsObj[name].options.push(
              {
                name: option.textContent,
                value: option.value,
                option: option
              }
            );
            this.mainFilterResultsObj[name].values.push(option.value);
          });
          break;
          
        default:
          break;
      }
    }

    this.createFilterResult();
  }

  /**
   *  Заполняет объект с выбранными пунктами фильтра
   * @param {Boolean} isNewPages
   */
  onFilterChange(isNewPages) {
    const formData = new FormData(this.mainFilter);

    // если у нас существует блок с результатами фильтра, заполняем объект для него, и вызываем соответствующий метод
    if (this.filterResult) this.createMainFilterResultsObj(formData);

    this.filterDataSelected = formData;

    if (this.characterFilter) {
      for (const item of new FormData(this.characterFilter)) {
        this.filterDataSelected.append(item[0], item[1]);
      }
    }

    if (this.monthFilter) {
      for (const item of new FormData(this.monthFilter)) {
        this.filterDataSelected.append(item[0], item[1]);
      }
    }

    if (isNewPages) {
      this.filterDataSelected.append(`page`, Number(this.list.dataset.page) + 1);
    } else {
      this.list.dataset.page = `1`;
      this.filterDataSelected.append(`page`, this.list.dataset.page);
    }

    this.backendUpload(this.filterDataSelected);
  };

  /**
   * Функция-callback, которая вызывает функцию onFilterChange при изменении элементов фильтра
   * @param {Event} e
   */
  onFormElementChange(e) {
    Array.from(this.mainFilter.children).forEach((it) => {
      it.addEventListener(`change`, (e) => {
        this.onFilterChange();
        e.target.blur();
      });
    });

    if (this.characterFilter) {
      Array.from(this.characterFilter.children).forEach((it) => {
        it.addEventListener(`change`, (e) => {
          this.onFilterChange();
          e.target.blur();
        });
      });
    }

    if (this.monthFilter) {
      Array.from(this.monthFilter.children).forEach((it) => {
        it.addEventListener(`change`, (e) => {
          e.target.blur();
        });
      });
    }
  };

  /**
   * Создает блок с выбранным пунком фильтра
   * @param {String} name
   * @param {Object} option
   * @return {Node} node-элемент с текстом выбранного пункта фильтра
   */
  createFilterresultBlock(name, option) {
    const result = document.getElementById(filterResultTemplateId).querySelector(`div`).cloneNode(true);

    // привязываем элемент формы, к которому относится этот рузельтат, с отображаемым блоком с результатом выбора
    result.type = this.mainFilterResultsObj[name].type;
    result.name = name;
    result.input = result.type !== `select-multiple` ? this.mainFilterResultsObj[name].node : option.option;

    result.querySelector(`.filter-result__text`).textContent = result.type !== `select-multiple` ? this.mainFilterResultsObj[name].name : option.name;

    // вешаем на "крестик" слушатель клика, который удаляет элемент и обновляет объект с данными фильтра
    result.querySelector(`button`).addEventListener(`click`, () => {
      if (result.type === `select-one`) {
        result.input.options[0].selected = true;
      } else if (result.type === `checkbox`) {
        result.input.checked = false;
      } else if (result.type === `select-multiple`) {
        result.input.selected = false;
      }

      // если мы "закрыли" блок с результатом фильтра, то удаляем данные об этом выборе фильтра из нашего объекта-фильтра
      // delete this.mainFilterResultsObj[result.name];

      this.filterResult.removeChild(result);
      // переопределяем наш кастомный селект (так работает библиотека)
      this.onSelectsChange(this.mainFilter, this.mainNiceSelect, this.onMainNiceFilterClick);
      this.onFilterChange();
    });

    return result;
  };

  onMainNiceFilterClick(e) {
    const target = e.target.closest(`li`) || null;
    const niceSelect = e.target.closest('.nice-select');
    const select = niceSelect.previousElementSibling;

    if (target && target.hasAttribute(`data-value`)) {
      setTimeout(() => {
        if (this.mainFilterResultsObj[select.name]) {
          const customOptions = Array.from(niceSelect.querySelectorAll(`[data-value]`));
          // находим ту нативную option, которую мы планировали выбрать в кастом селекте
          const currentOption = Array.from(select.options).find((option) => {
            return option.value === target.dataset.value;
          });

          if (currentOption.value === ``) {
            // если мы нажали пункт 'all' то в объекте с данными фильтра оставляет среди options только с value==='', остальные удаляем
            this.mainFilterResultsObj[select.name].options = {
              name: currentOption.textContent,
              value: currentOption.value,
              option: currentOption
            };
          } else {
            // фильтруем выделенные опции в объекте с данными фильтра, оставляем только те, которые не содержат value===''
            this.mainFilterResultsObj[select.name].options = this.mainFilterResultsObj[select.name].options.filter((it) => it.value !== ``);
            this.mainFilterResultsObj[select.name].values = this.mainFilterResultsObj[select.name].values.filter((it) => it !== ``);

            // помечаем выделенными те option, которые у нас имеются в объекте с данными фильтра, так как кастомный фильтр при клике выбирает только одну (не поддерживает multiple-select)
            this.mainFilterResultsObj[select.name].options.forEach((it) => {
              it.option.selected = true;
            });

            // добавляем в наш объект с данными фильтра текущую выбранную опцию
            this.mainFilterResultsObj[select.name].options.push(
              {
                name: currentOption.textContent,
                value: currentOption.value,
                option: currentOption
              }
            );
            this.mainFilterResultsObj[select.name].values.push(currentOption.value);

            // помечаем, как выделенные в кастомном селекте все опции, которые у нас считаются выделенными в объкете с данными фильтра
            customOptions.forEach((it) => {
              this.mainFilterResultsObj[select.name].values.some((val) => val === it.dataset.value)
              ? it.classList.add(`selected`)
              : it.classList.remove(`selected`);
            });
          }
        }

        this.onFilterChange();
        select.blur();
        niceSelect.blur();
      }, 100);
    }
  };

  onMonthNiceFilterClick(e) {
    const target = e.target.closest(`li`) || null;
    const niceSelect = e.target.closest('.nice-select');
    const select = niceSelect.previousElementSibling;

    if (target && target.hasAttribute(`data-value`)) {
      setTimeout(() => {
        this.onFilterChange();
        select.blur();
        niceSelect.blur();
      }, 100);
    }
  };

  onMonthClick(e) {
    this.list.dataset.page = 1;
    this.list.dataset.pages = '';

    if (!e.currentTarget.classList.contains(`open`) && window.innerWidth < 798) {
      this.scrollTop = window.pageYOffset;

      // Запрещаем прокрутку сайта при открытом модальном фильтре
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = this.scrollTop + 'px';
      document.body.style.height = '100%';
      document.body.style.width = '100%';
    } else {
      // Отменяем запрет на прокрутку сайта
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = null;
      document.body.style.height = '';
      document.body.style.width = '';
      window.scroll(0, this.scrollTop);
    }
  };

  /**
   * Вызывает обновление nice-select'а, чтобы отображались актуальные данные и заново развешивает на элементы кастомного селекта слушателей события клик
   * @param {Node} filter
   * @param {jQuery} niceSelect
   * @param {Function} callback
   */
  onSelectsChange(filter, niceSelect, callback) {
    // $(niceSelect).niceSelect(`update`);

    const formData = new FormData(this.mainFilter);
    const selects = filter.querySelectorAll(`.nice-select`);

    // если у нас существует блок с результатами фильтра, заполняем объект для него, и вызываем соответствующий метод
    if (this.filterResult) {
      this.createMainFilterResultsObj(formData);
    }

    Array.from(selects).forEach((it) => {
      const hideSelect = it.previousElementSibling;

      // Убираем все классы "selected" у кастомных фильтров
      Array.from(it.querySelectorAll(`[data-value]`)).forEach((li) => {
        li.classList.remove(`selected`);
      });

      /*
        Развешиваем заново классы у кастомных фильтров, в зависимости от выбранных в нативном селекте элеменах
        Такое усложнение вынуждено тем, что бибилотека кастомного селекта не подразумевает select-multiple
      */
      for (const key in this.mainFilterResultsObj) {
        if (this.mainFilterResultsObj.hasOwnProperty(key)
        && this.mainFilterResultsObj[key].node === hideSelect
        && (this.mainFilterResultsObj[key].type === `select-multiple`
        || this.mainFilterResultsObj[key].type === `select-one`)) {
          Array.from(it.querySelectorAll(`[data-value]`)).forEach((li) => {
            if (this.mainFilterResultsObj[key].values.some((elem) => elem === li.dataset.value)) {
              li.classList.add(`selected`);
            }
          });
        }
      }

      it.addEventListener(`click`, callback);
    });
  };

  /**
   * Заполняет в разметке блок с результатами выбора фильтра
   */
  createFilterResult() {
    this.filterResult.innerHTML = ``;

    for (const element in this.mainFilterResultsObj) {
      if (this.mainFilterResultsObj.hasOwnProperty(element)) {
        let result;

        if (this.mainFilterResultsObj[element].type !== `select-multiple`) {
          result = this.createFilterresultBlock(element);

          this.filterResult.appendChild(result);
          return;
        }

        this.mainFilterResultsObj[element].options.forEach((option) => {
          result = this.createFilterresultBlock(element, option);

          this.filterResult.appendChild(result);
        });
      }
    }
  };

  getHashFromUrl() {
    if (this.filterResult) {
      const formData = new FormData(this.mainFilter);
      this.createMainFilterResultsObj(formData);
    }
  };

  onWindowScroll() {
    if (this.list && this.isInViewport && !this.isFull && !this.isinProgress) {
      this.isinProgress = true;

      this.onFilterChange(true);
    }
  };

  /**
   *  Должна отправлять get запрос на сервер с выбранными данными фильтра
   * @param {FormData} data
   */
  backendUpload(data) {
    const self = this;
    const url = `${window.location.origin}${window.location.pathname}`;
    let result = [];

    for (const i of data) {
      result.push(`${i[0]}=${i[1]}`);
    }

    result = result.join(`&`);

    $.ajax({
      url: url,
      type: 'GET',
      data: result,
      success: function(data) {
        const urlMatch = window.location.href.match(/^([^?]+\?)(.*?)?(#.*)?$/);
        const container = document.createElement(`div`);
        const content = document.createDocumentFragment();
        const getParameters = result.replace(/\&page=.*/, '').replace(/page=.*/, '');

        if (!getParameters.length && urlMatch) {
          urlMatch[1] = urlMatch[1].replace(/\?/, ``);
        }

        window.history.replaceState({}, '', `${urlMatch ? urlMatch[1] : window.location.href + '?'}${getParameters}`);

        if (window.location.href.endsWith(`?`)) window.history.replaceState({}, '', window.location.href.slice(0, -1));

        container.innerHTML = data;
        const list = container.querySelector(filterClassNames.list);

        if (list.dataset.page === '1') {
          window.removeEventListener(`scroll`, self.onWindowScroll);

          self.list.innerHTML = list.innerHTML;
          self.list.dataset.page = list.dataset.page;
          self.list.dataset.pages = list.dataset.pages;

          self.isFull = self.list.dataset.page >= self.list.dataset.pages;
          self.isinProgress = false;
          self.init();

          if (self.backendCallback) {
            self.backendCallback.bind(self.backendObj || self)(result);
          }

          return;
        }

        window.removeEventListener(`scroll`, self.onWindowScroll);

        Array.from(list.children).forEach((item) => {
          content.appendChild(item);
        });

        self.list.appendChild(content);
        self.list.dataset.page = list.dataset.page;
        self.list.dataset.pages = list.dataset.pages;

        self.isFull = self.list.dataset.page >= self.list.dataset.pages;
        self.isinProgress = false;
        self.init();

        if (self.backendCallback) {
          self.backendCallback.bind(self.backendObj || self)(result);
        }
      }
    });
  };

  /**
   * Сбрасывает фильтры
   * @param {Event} e
   */
  reset(e) {
    if (e) {
      e.preventDefault();
    }

    this.mainFilter.reset();

    if (this.mainNiceSelect) {
      this.onSelectsChange(this.mainFilter, this.mainNiceSelect, this.onMainNiceFilterClick);
    }

    if (this.filterResult) {
      this.filterResult.innerHTML = ``;
    }

    if (this.characterFilter) {
      this.characterFilter.reset();
    }

    if (this.monthNiceSelect) {
      this.onSelectsChange(this.monthFilter, this.monthFilterNiceSelect, this.onMonthNiceFilterClick);
    }

    this.onFilterChange();
    window.scrollTo(0, 0);
  };

  init() {
    if (!this.isFull) window.addEventListener(`scroll`, this.onWindowScroll);
  }
};

export default FilterChange;
