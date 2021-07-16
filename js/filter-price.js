import { DESKTOP_WIDTH } from "./const.js";
import { disableBodyScroll, enableBodyScroll } from "./bodyScrollLock.es6.js";

const Toggles = {
  MIN: `min`,
  MAX: `max`,
};

export class PriceScale {
  constructor(container) {
    this.clientWidth = document.body.clientWidth;
    this.leftToggleElement = container.querySelector(
      `[data-price-toggle="min"]`
    );
    this.rightToggleElement = container.querySelector(
      `[data-price-toggle="max"]`
    );
    this.scaleBarElement = container.querySelector(`.filters__scale-bar`);
    this.rangeElement = container.querySelector(`.filters__range-controls`);

    // Вычитаем ширину тоггла чтобы при максимальной выкрутке он не исчезал за край экрана
    this.WIDTH_SCALE =
      this.rangeElement.offsetWidth - this.leftToggleElement.offsetWidth;
    this.MAX_PRICE = 7800;
    this.inputMin = container.querySelector(`[data-price-num="min"]`);
    this.inputMax = container.querySelector(`[data-price-num="max"]`);

    this.toggle = null;
    this.startX = null;
    this.walkX = null;
    this.positionToggle = null;

    this.EventsToggle = {
      START: this.isTouchDevice() ? `touchstart` : `mousedown`,
      MOVE: this.isTouchDevice() ? `touchmove` : `mousemove`,
      END: this.isTouchDevice() ? `touchend` : `mouseup`,
    };

    // Байндинг методов
    this.restoreAfterResize = this.restoreAfterResize.bind(this);
    this.touchFilterToggle = this.touchFilterToggle.bind(this);
    this.onToggleMove = this.onToggleMove.bind(this);
    this.onToggleStop = this.onToggleStop.bind(this);
    this.onScaleHandler = this.onScaleHandler.bind(this);

    this.rangeElement.addEventListener(
      this.EventsToggle.START,
      this.onScaleHandler
    );

    window.addEventListener(`resize`, this.restoreAfterResize);
  }

  init() {
    this.inputMin.innerHTML = `${this.calculatePriceValue(
      this.leftToggleElement.offsetLeft
    )} ₽`;
    this.inputMax.innerHTML = `${this.calculatePriceValue(
      this.rightToggleElement.offsetLeft
    )} ₽`;
  }

  restoreAfterResize() {
    const minTogglePrice = this.inputMin.innerHTML.split(` `)[0];
    const maxTogglePrice = this.inputMax.innerHTML.split(` `)[0];

    this.leftToggleElement.style.left = `${
      (minTogglePrice / this.MAX_PRICE) * this.rangeElement.offsetWidth
    }px`;
    this.rightToggleElement.style.left = `${
      (maxTogglePrice / this.MAX_PRICE) * this.rangeElement.offsetWidth
    }px`;

    this.scaleBarElement.style.left = `${this.leftToggleElement.offsetLeft}px`;

    this.scaleBarElement.style.width =
      this.rightToggleElement.offsetLeft -
      this.leftToggleElement.offsetLeft +
      this.rightToggleElement.offsetWidth +
      `px`;

    this.WIDTH_SCALE =
      this.rangeElement.offsetWidth - this.leftToggleElement.offsetWidth;
  }

  calculatePriceValue(togglePosition) {
    return (
      Math.round(((this.MAX_PRICE / this.WIDTH_SCALE) * togglePosition) / 100) *
      100
    );
  }

  isTouchDevice() {
    return !!(`ontouchstart` in window);
  }

  onScaleHandler(evt) {
    const scalePositionTouch = Math.ceil(
      (evt.clientX || evt.touches[0].clientX) - this.rangeElement.offsetLeft
    );

    const diffLeftToggle = Math.abs(
      scalePositionTouch - this.leftToggleElement.offsetLeft
    );
    const diffRightToggle = Math.abs(
      scalePositionTouch - this.rightToggleElement.offsetLeft
    );

    if (diffLeftToggle < diffRightToggle) {
      this.leftToggleElement.style.left = `${scalePositionTouch}px`;
      this.inputMin.innerHTML = `${this.calculatePriceValue(
        scalePositionTouch
      )} ₽`;
      this.touchFilterToggle(evt, this.leftToggleElement);
    } else {
      this.rightToggleElement.style.left = `${scalePositionTouch}px`;
      this.inputMax.innerHTML = `${this.calculatePriceValue(
        scalePositionTouch
      )} ₽`;
      this.touchFilterToggle(evt, this.rightToggleElement);
    }
  }

  touchFilterToggle(evt, toggle) {
    evt.preventDefault();

    this.toggle = toggle;
    this.startX = evt.clientX || evt.touches[0].clientX;
    this.positionToggle = toggle.offsetLeft;

    this.scaleBarElement.style.width =
      this.rightToggleElement.offsetLeft -
      this.leftToggleElement.offsetLeft +
      this.rightToggleElement.offsetWidth +
      `px`;

    if (this.toggle.dataset.priceToggle === Toggles.MIN) {
      this.scaleBarElement.style.left = toggle.offsetLeft + `px`;
    }

    if (this.clientWidth < DESKTOP_WIDTH) {
      disableBodyScroll(evt.target);
    }

    document.addEventListener(this.EventsToggle.MOVE, this.onToggleMove);
    document.addEventListener(this.EventsToggle.END, this.onToggleStop);
  }

  onToggleMove(moveEvt) {
    this.walkX =
      Math.ceil(moveEvt.clientX || moveEvt.touches[0].clientX) - this.startX;
    let coordXToggle = this.positionToggle + this.walkX;

    this.toggle.style.left = coordXToggle + `px`;
    this.scaleBarElement.style.width =
      this.rightToggleElement.offsetLeft -
      this.leftToggleElement.offsetLeft +
      this.rightToggleElement.offsetWidth +
      `px`;

    const movingScaleAndToggle = () => {
      switch (this.toggle.dataset.priceToggle) {
        case Toggles.MIN:
          this.scaleBarElement.style.left = coordXToggle + `px`;
          this.inputMin.innerHTML = `${this.calculatePriceValue(
            coordXToggle
          )} ₽`;

          // Сделаем чтобы при упирания левого тоггла в край шкалы движение останавливалось
          if (coordXToggle < 0) {
            this.toggle.style.left = `0px`;
            this.scaleBarElement.style.left = `0px`;
            this.scaleBarElement.style.width =
              this.rightToggleElement.offsetLeft +
              this.rightToggleElement.offsetWidth +
              `px`;
            this.inputMin.innerHTML = `${0} ₽`;
          }

          if (coordXToggle >= this.rightToggleElement.offsetLeft) {
            this.toggle.style.left = this.rightToggleElement.offsetLeft + `px`;
            this.scaleBarElement.style.left =
              this.rightToggleElement.offsetLeft + `px`;
            this.scaleBarElement.style.width = `0px`;
            this.inputMin.innerHTML = `${this.calculatePriceValue(
              this.rightToggleElement.offsetLeft
            )} ₽`;
          }
          break;
        case Toggles.MAX:
          this.inputMax.innerHTML = `${this.calculatePriceValue(
            this.rightToggleElement.offsetLeft
          )} ₽`;

          // Сделаем чтобы при упирания правого тоггла в край шкалы движение останавливалось
          if (coordXToggle > this.WIDTH_SCALE) {
            this.toggle.style.left = this.WIDTH_SCALE + `px`;
            this.scaleBarElement.style.width =
              this.WIDTH_SCALE -
              this.leftToggleElement.offsetLeft +
              this.rightToggleElement.offsetWidth +
              `px`;
            this.inputMax.innerHTML = `${this.MAX_PRICE} ₽`;
          }

          if (coordXToggle <= this.leftToggleElement.offsetLeft) {
            this.toggle.style.left = this.leftToggleElement.offsetLeft + `px`;
            this.scaleBarElement.style.width = `0px`;
            this.inputMax.innerHTML = `${this.calculatePriceValue(
              this.leftToggleElement.offsetLeft
            )} ₽`;
          }
          break;
      }
    };

    movingScaleAndToggle();
  }

  onToggleStop(evt) {
    // Проверим находятся ли оба тоггла на max значении
    if (this.leftToggleElement.offsetLeft === this.WIDTH_SCALE) {
      this.leftToggleElement.classList.add(`filters__bar-toggle--up`);
    } else {
      this.leftToggleElement.classList.remove(`filters__bar-toggle--up`);
    }
    enableBodyScroll(evt.target);
    document.removeEventListener(this.EventsToggle.MOVE, this.onToggleMove);
    document.removeEventListener(this.EventsToggle.END, this.onToggleStop);
  }
}
