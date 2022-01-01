import { PageHeader } from "./page-header.js";
import { createElement } from "./utils.js";

new PageHeader();

const parametersListElement = document.querySelector(
  `[data-parameters="list"]`
);
const parametersBtnElement = document.querySelector(`[data-parameters="btn"]`);

const clickAddBtn = () => {
  const itemsQty = parametersListElement.children.length;
  const parameterItemElement = createElement(
    generateParametersInputs(itemsQty)
  );

  const delBtnElement = parameterItemElement.querySelector(
    `[data-parameters="del-btn"]`
  );

  delBtnElement.addEventListener(`click`, (evt) => {
    evt.target.parentElement.remove();
  });

  parametersListElement.append(parameterItemElement);
};

const generateParametersInputs = (itemsQty) => {
  return `<li class="form-elements__item" data-parameters="item">
  <input class="form-elements__input-text" type="text" name="parameter-key-${
    itemsQty + 1
  }" id="parameter--key-${itemsQty + 1}-field"
    placeholder="Ключ" required>
  <label class="visually-hidden" for="parameter--key-${
    itemsQty + 1
  }-field">Ключ параметра ${itemsQty + 1}</label>
  <span class="form-elements__dash">-</span>
  <input class="form-elements__input-text" type="text" name="parameter-value-${
    itemsQty + 1
  }"
    id="parameter--value-${itemsQty + 1}-field" placeholder="Значение" required>
  <label class="visually-hidden" for="parameter--key-1-field">Значение параметра ${
    itemsQty + 1
  }</label>
  <button class="add-product__parameters-del-btn btn" data-parameters="del-btn"><span
  class="visually-hidden">Удалить характеристику</span>
  </button>
</li>`;
};

parametersBtnElement.addEventListener(`click`, clickAddBtn);

// Реализация подгрузки инпутов file

let itemImageElement = document.querySelector(`[data-image="item"]`);
let inputImageElement = itemImageElement.querySelector(`input[name="image"]`);
const containerImageElement = document.querySelector(
  `[data-image="container"]`
);

const MAX_IMAGES_QTY = 3;

const generateInputFile = (sequence) => {
  return `<li class="add-product__image-item add-product__image-item--new">
  <div class="add-product__image-wrapper">
    <label class="add-product__label-file" for="image-field-${sequence}"><span class="visually-hidden">Картинка</span>
      <svg class="add-product__img-add">
        <use xlink:href="img/sprite.svg#icon-plus"></use>
      </svg>
      <input class="form-elements__input-file" type="file" name="image" id="image-field-${sequence}"
        placeholder="Выберите картинку" data-image-last="true">
    </label>
  </div>
</li>`;
};

const generateCheckImg = () => {
  return `<svg class="add-product__img-add" style="fill: #71af2e">
  <use xlink:href="img/sprite.svg#icon-circle-check"></use>
</svg>`;
};

const addFileListener = () => {
  inputImageElement.addEventListener(`change`, addNewInputFile);
};

const removeFileListener = () => {
  inputImageElement.removeEventListener(`change`, addNewInputFile);
};

const addCheckImg = () => {
  const parentNode = itemImageElement.querySelector(`.add-product__label-file`);
  const plusImg = parentNode.querySelector(`.add-product__img-add`);
  const doneImg = createElement(generateCheckImg());
  parentNode.replaceChild(doneImg, plusImg);
};

const addNewInputFile = () => {
  removeFileListener();
  addCheckImg();

  const allInputs = document.querySelectorAll(`input[name="image"]`);

  if (allInputs.length < MAX_IMAGES_QTY) {
    itemImageElement = createElement(generateInputFile(allInputs.length + 1));
    inputImageElement = itemImageElement.querySelector(`input[name="image"]`);
    addFileListener();
    containerImageElement.append(itemImageElement);
  }
};

addFileListener();
