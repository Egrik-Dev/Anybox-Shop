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

    this.EventsToggle = {
      START: this.isTouchDevice() ? `touchstart` : `mousedown`,
      MOVE: this.isTouchDevice() ? `touchmove` : `mousemove`,
      END: this.isTouchDevice() ? `touchend` : `mouseup`,
    };

    this.leftToggleElement.addEventListener(this.EventsToggle.START, (evt) => {
      this.touchFilterToggle(evt, this.leftToggleElement);
    });

    this.rightToggleElement.addEventListener(this.EventsToggle.START, (evt) => {
      this.touchFilterToggle(evt, this.rightToggleElement);
    });
  }

  init() {
    this.inputMin.innerHTML = `${this.calculatePriceValue(
      this.leftToggleElement.offsetLeft
    )} ₽`;
    this.inputMax.innerHTML = `${this.calculatePriceValue(
      this.rightToggleElement.offsetLeft
    )} ₽`;

    console.log(this);
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

  touchFilterToggle(evt, toggle) {
    evt.preventDefault();
    let startX = evt.clientX || evt.touches[0].clientX;
    const positionToggle = toggle.offsetLeft;

    if (this.clientWidth < DESKTOP_WIDTH) {
      disableBodyScroll(evt.target);
    }

    const onToggleMove = (moveEvt) => {
      let walkX =
        Math.ceil(moveEvt.clientX || moveEvt.touches[0].clientX) - startX;
      let coordXToggle = positionToggle + walkX;
      toggle.style.left = coordXToggle + `px`;
      this.scaleBarElement.style.width =
        this.rightToggleElement.offsetLeft -
        this.leftToggleElement.offsetLeft +
        this.rightToggleElement.offsetWidth +
        `px`;

      const movingScaleAndToggle = () => {
        switch (toggle.dataset.priceToggle) {
          case Toggles.MIN:
            this.scaleBarElement.style.left = coordXToggle + `px`;
            this.inputMin.innerHTML = `${this.calculatePriceValue(
              coordXToggle
            )} ₽`;

            // Сделаем чтобы при упирания левого тоггла в край шкалы движение останавливалось
            if (coordXToggle < 0) {
              toggle.style.left = `0px`;
              this.scaleBarElement.style.left = `0px`;
              this.scaleBarElement.style.width =
                this.rightToggleElement.offsetLeft +
                this.rightToggleElement.offsetWidth +
                `px`;
              this.inputMin.innerHTML = `${0} ₽`;
            }

            if (coordXToggle >= this.rightToggleElement.offsetLeft) {
              toggle.style.left = this.rightToggleElement.offsetLeft + `px`;
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
              toggle.style.left = this.WIDTH_SCALE + `px`;
              this.scaleBarElement.style.width =
                this.WIDTH_SCALE -
                this.leftToggleElement.offsetLeft +
                this.rightToggleElement.offsetWidth +
                `px`;
              this.inputMax.innerHTML = `${this.MAX_PRICE} ₽`;
            }

            if (coordXToggle <= this.leftToggleElement.offsetLeft) {
              toggle.style.left = this.leftToggleElement.offsetLeft + `px`;
              this.scaleBarElement.style.width = `0px`;
              this.inputMax.innerHTML = `${this.calculatePriceValue(
                this.leftToggleElement.offsetLeft
              )} ₽`;
            }
            break;
        }
      };

      movingScaleAndToggle();
    };

    const onToggleStop = () => {
      // Проверим находятся ли оба тоггла на max значении
      if (this.leftToggleElement.offsetLeft === this.WIDTH_SCALE) {
        this.leftToggleElement.classList.add(`filters__bar-toggle--up`);
      } else {
        this.leftToggleElement.classList.remove(`filters__bar-toggle--up`);
      }
      enableBodyScroll(evt.target);
      document.removeEventListener(this.EventsToggle.MOVE, onToggleMove);
      document.removeEventListener(this.EventsToggle.END, onToggleStop);
    };

    document.addEventListener(this.EventsToggle.MOVE, onToggleMove);
    document.addEventListener(this.EventsToggle.END, onToggleStop);
  }
}
