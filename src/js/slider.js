import { createElement } from "./utils.js";
import { TABLET_WIDTH, DESKTOP_WIDTH } from "./const.js";
import { disableBodyScroll, enableBodyScroll } from "./bodyScrollLock.es6.js";

// Создадим пустой объект без прототипа
const Direction = Object.create(null);
Direction.LEFT = `left`;
Direction.RIGHT = `right`;

const SlidesQty = {
  MOBILE: 1,
  TABLET: 3,
  DESKTOP: 4,
};

const Mode = {
  LOOP: `loop`,
  ADAPTIVE: `adaptive`,
};

const MIN_SWIPE_SIZE = 30; // В процентах

export class Slider {
  constructor(container, options = { mode: Mode.LOOP }) {
    this.container = container;
    this.containerWidth = container.offsetWidth;
    this.containerToggles = container.querySelector(`[data-toggle="list"]`);
    this.mode = options.mode;
    this.sliderListElement = container.querySelector(`[data-slider="list"]`); // Список с слайдами
    this.slideElements = container.querySelectorAll(`[data-slider="slide"]`); // Псевомассив со слайдами
    this.slideWidth = null;
    this.listWidth = null;

    this.maxSteps = null;
    this.currentStep = 0;

    this.currentPositionSlider = 0;
    this.startX = null;
    this.startY = null;
    this.walkX = null;
    this.walkY = null;
    this.isSwiping = false;
    this.isVerticalScroll = false;

    // Байндинг методов
    this.calculateWidthContainer = this.calculateWidthContainer.bind(this);
    this.swipeStart = this.swipeStart.bind(this);
    this.swipeMove = this.swipeMove.bind(this);
    this.swipeEnd = this.swipeEnd.bind(this);
    // this.onToggleClick = this.onToggleClick.bind(this);

    // Слушатели событий
    window.addEventListener(`resize`, this.calculateWidthContainer);
    this.sliderListElement.addEventListener(`touchstart`, this.swipeStart);
    this.sliderListElement.addEventListener(`touchmove`, this.swipeMove);
    this.sliderListElement.addEventListener(`touchend`, this.swipeEnd);
  }

  calculateWidthContainer() {
    this.containerWidth = this.container.offsetWidth;

    if (this.containerWidth < TABLET_WIDTH) {
      this.slideWidth = this.containerWidth;
      this.maxSteps = this.slideElements.length - SlidesQty.MOBILE;
    }

    if (
      this.containerWidth >= TABLET_WIDTH &&
      this.containerWidth < DESKTOP_WIDTH
    ) {
      this.slideWidth = this.containerWidth / SlidesQty.TABLET;
      this.maxSteps = this.slideElements.length - SlidesQty.TABLET;
    }

    if (this.containerWidth >= DESKTOP_WIDTH) {
      this.slideWidth = this.containerWidth / SlidesQty.DESKTOP;
      this.maxSteps = this.slideElements.length - SlidesQty.DESKTOP;
    }

    this.listWidth = this.slideWidth * this.slideElements.length;
    this.sliderListElement.style.width = `${this.listWidth}px`;
    this.appendToggles();
  }

  swipeStart(evt) {
    this.startX = Math.ceil(evt.touches[0].clientX);
    this.startY = Math.ceil(evt.touches[0].clientY);
  }

  swipeMove(evt) {
    this.walkY = Math.ceil(evt.touches[0].clientY) - this.startY;
    this.walkX = Math.ceil(evt.touches[0].clientX) - this.startX;

    if (this.isVerticalScroll) {
      this.sliderListElement.style.touchAction = `pan-y`;
    } else if (this.isSwiping) {
      disableBodyScroll(this.sliderListElement);
      this.sliderListElement.style.transition = `0ms`;
      this.sliderListElement.style.transform = `translateX(${
        this.currentPositionSlider + this.walkX * 1.5
      }px)`;
    } else if (this.walkY > 2 || this.walkY < -2) {
      this.isVerticalScroll = true;
    } else {
      this.isSwiping = true;
    }
  }

  swipeEnd(evt) {
    const endPos = Math.ceil(evt.changedTouches[0].clientX + this.walkX);
    const swipeSize = Math.ceil((this.walkX / this.slideWidth) * 100);

    if (endPos > this.startX && swipeSize > MIN_SWIPE_SIZE && this.isSwiping) {
      this.changeCurrentPosition(Direction.LEFT);
    } else if (
      endPos < this.startX &&
      swipeSize < -MIN_SWIPE_SIZE &&
      this.isSwiping
    ) {
      this.changeCurrentPosition(Direction.RIGHT);
    } else {
      this.switchSLide();
    }

    enableBodyScroll(this.sliderListElement);
    this.isSwiping = false;
    this.isVerticalScroll = false;
    this.sliderListElement.style.touchAction = `auto`;
  }

  changeCurrentPosition(direction) {
    switch (direction) {
      case Direction.LEFT:
        this.currentPositionSlider += this.slideWidth;
        this.currentStep -= 1;
        break;
      case Direction.RIGHT:
        this.currentPositionSlider -= this.slideWidth;
        this.currentStep += 1;
        break;
    }

    this.makeSwitching();
  }

  goToFirstSlide() {
    this.currentPositionSlider = 0;
    this.switchSLide();
  }

  switchSLide() {
    this.sliderListElement.style.transition = `0.3s`;
    this.sliderListElement.style.transform = `translateX(${this.currentPositionSlider}px)`;
  }

  resetToStart() {
    this.containerToggles.innerHTML = ``;
    this.goToFirstSlide();
    this.currentStep = 0;
  }

  makeSwitching() {
    switch (this.mode) {
      case Mode.LOOP:
        if (this.currentStep > this.maxSteps || this.currentStep < 0) {
          this.currentStep = 0;
          this.goToFirstSlide();
        } else {
          this.switchSLide();
        }
        break;
    }

    this.changeActiveToggle();
  }

  // Функции которые генерят и аппендят тогглы
  generateMarkupToggle() {
    return `<li data-toggle-status=""></li>`;
  }

  appendToggles() {
    if (this.containerToggles.children.length - 1 !== this.maxSteps) {
      // Сначала сбрасываем все показатели
      this.resetToStart();

      // Отрисовываем тоглы
      for (let i = 0; i <= this.maxSteps; i++) {
        const toggle = createElement(this.generateMarkupToggle());
        i === 0
          ? (toggle.dataset.toggleStatus = `active`)
          : (toggle.dataset.toggleStatus = `none`);
        toggle.addEventListener(`click`, () => {
          this.onToggleClick(i);
        });
        this.containerToggles.append(toggle);
      }
    }
  }

  changeActiveToggle() {
    let activeElement = this.containerToggles.querySelector(
      `[data-toggle-status="active"]`
    );
    activeElement.dataset.toggleStatus = `none`;
    this.containerToggles.children[
      this.currentStep
    ].dataset.toggleStatus = `active`;
  }

  onToggleClick(toggleIndex) {
    const diffSteps = toggleIndex - this.currentStep;
    const switchStep = -(this.slideWidth * diffSteps);
    this.currentPositionSlider += switchStep;
    this.switchSLide();

    this.currentStep = toggleIndex;
    this.changeActiveToggle();
  }
}
