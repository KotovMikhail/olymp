if (document.querySelector('.gallery-slider')) {
  const miniatureButtonNext = document.querySelector(`.gallery-slider__miniature-button--next`);
  const miniatureButtonPrev = document.querySelector(`.gallery-slider__miniature-button--prev`);
  const buttonNext = document.querySelector(`.gallery-slider__button-arrow--next`);
  const buttonPrev = document.querySelector(`.gallery-slider__button-arrow--prev`);

  const swiper = new Swiper('.gallery-slider__container', {
    spaceBetween: 30,
    speed: 500,
    pagination: {
      el: '.gallery-slider__pagination',
      type: 'fraction',
    },
    navigation: {
      nextEl: '.gallery-slider__button-arrow--next',
      prevEl: '.gallery-slider__button-arrow--prev',
    },
    loop: true,
  });

  const onSlideChangeTransitionStart = function() {
    const previosImage = this.slides[this.activeIndex - 1] ? this.slides[this.activeIndex - 1].querySelector(`img`).cloneNode() : this.slides[this.slides.length - 3].querySelector(`img`).cloneNode();
    const nextImage = this.slides[this.activeIndex + 1] ? this.slides[this.activeIndex + 1].querySelector(`img`).cloneNode() : this.slides[2].querySelector(`img`).cloneNode();
    miniatureButtonPrev.innerHTML= ``;
    miniatureButtonNext.innerHTML = ``;

    miniatureButtonPrev.appendChild(previosImage);
    miniatureButtonNext.appendChild(nextImage);
  };

  const blurTarget = (e) => {
    e.currentTarget.blur();
  };

  miniatureButtonNext.addEventListener(`click`, function() {
    buttonNext.click();
    this.blur();
  });

  miniatureButtonPrev.addEventListener(`click`, function() {
    buttonPrev.click();
    this.blur();
  });

  buttonPrev.addEventListener(`click`, blurTarget);
  buttonNext.addEventListener(`click`, blurTarget);

  swiper.on('slideChangeTransitionStart', onSlideChangeTransitionStart);
}
