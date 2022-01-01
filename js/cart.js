import { PageHeader } from "./page-header.js";
import { createElement } from "./utils.js";

new PageHeader();

const DeliveryMethod = {
  PICKUP: {
    name: `pickup`,
    cost: 0,
  },
  MSK: {
    name: `deliveryMsk`,
    cost: 300,
  },
  RUSSIA_POST: {
    name: `russiaPost`,
    cost: 100,
  },
};

class Cart {
  constructor() {
    this.products = document.querySelectorAll(`.order__cart-item`);
    this.deliveryInputs = document.querySelectorAll(
      `input[name="deliveryMethod"]`
    );
    this.deliveryMethod = document.querySelector(
      `input[name="deliveryMethod"]:checked`
    ).value;
    this.deliveryContainer = document.querySelector(
      `.order__delivery-adress-list`
    );
    this.deliveryCostElement = document.querySelector(
      `[data-confirmation="deliveryCost"]`
    );
    this.productsPriceElement = document.querySelector(
      `[data-confirmation="productsPrice"]`
    );
    this.totalPriceElement = document.querySelector(
      `[data-confirmation="totalPrice"]`
    );
    this.totalPriceInput = document.querySelector(`input[name="totalPrice"]`);
    this.deliveryPriceInput = document.querySelector(
      `input[name="deliveryPrice"]`
    );
    this.postMsgElement = document.querySelector(
      `.order__confirmation-post-msg`
    );

    this.changeDeliveryMethod = this.changeDeliveryMethod.bind(this);

    this.deliveryInputs.forEach((input) => {
      input.addEventListener(`change`, this.changeDeliveryMethod);
    });
  }

  init() {
    this.renderDeliveryfields(this.deliveryMethod);
  }

  changeDeliveryMethod(evt) {
    this.deliveryMethod = evt.target.value;
    this.renderDeliveryfields(this.deliveryMethod);
  }

  generateAdressField() {
    return `<li class="form-elements__item form-elements__item--column">
    <label class="form-elements__label-text" for="adress-field">
      <span class="form-elements__label-text-title">Адрес</span>
      <span class="form-elements__label-text-required">*</span>
    </label>
    <input class="form-elements__input-text" type="text" name="adress" id="adress-field" required>
  </li>`;
  }

  generatePostField() {
    return `<li class="form-elements__item form-elements__item--column">
    <label class="form-elements__label-text" for="zip-code-field">
      <span class="form-elements__label-text-title">Почтовый индекс</span>
      <span class="form-elements__label-text-required">*</span>
    </label>
    <input class="form-elements__input-text" type="number" name="zipСode" id="zip-code-field" required>
  </li>`;
  }

  generateCityField() {
    return `<li class="form-elements__item form-elements__item--column">
    <label class="form-elements__label-text" for="city-field">
      <span class="form-elements__label-text-title">Город</span>
      <span class="form-elements__label-text-required">*</span>
    </label>
    <input class="form-elements__input-text" type="text" name="city" id="city-field" required>
  </li>`;
  }

  renderDeliveryfields(deliveryMethod) {
    this.deliveryContainer.innerHTML = ``;
    this.postMsgElement.classList.add(`visually-hidden`);

    switch (deliveryMethod) {
      case DeliveryMethod.PICKUP.name:
        this.deliveryCostElement.innerHTML = `${DeliveryMethod.PICKUP.cost} ₽`;
        break;
      case DeliveryMethod.MSK.name:
        this.deliveryContainer.append(
          createElement(this.generateAdressField())
        );
        this.deliveryCostElement.innerHTML = `${DeliveryMethod.MSK.cost} ₽`;
        break;
      case DeliveryMethod.RUSSIA_POST.name:
        this.deliveryContainer.append(createElement(this.generatePostField()));
        this.deliveryContainer.append(createElement(this.generateCityField()));
        this.deliveryContainer.append(
          createElement(this.generateAdressField())
        );
        this.deliveryCostElement.innerHTML = `${DeliveryMethod.RUSSIA_POST.cost} ₽`;
        this.postMsgElement.classList.remove(`visually-hidden`);
        break;
    }

    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    const productsPrice = parseInt(this.productsPriceElement.innerHTML, 10);
    const deliveryPrice = parseInt(this.deliveryCostElement.innerHTML, 10);
    const totalPrice = productsPrice + deliveryPrice;
    this.totalPriceElement.innerHTML = `${totalPrice} ₽`;
    this.fillPriceInputs(totalPrice, deliveryPrice);
  }

  fillPriceInputs(totalPrice, deliveryPrice) {
    this.totalPriceInput.value = totalPrice;
    this.deliveryPriceInput.value = deliveryPrice;
  }
}

const cart = new Cart();
cart.init();
