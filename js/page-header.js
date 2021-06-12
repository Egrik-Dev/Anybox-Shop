const navOpenBtnElement = document.querySelector(`.page-header__open-btn`);
const navElement = document.querySelector(`.page-header__nav`);

navOpenBtnElement.addEventListener(`click`, () => {
  navElement.classList.add(`page-header__nav--open`);
});

const navCloseBtnElement = document.querySelector(`.page-header__close-btn`);

navCloseBtnElement.addEventListener(`click`, () => {
  navElement.classList.remove(`page-header__nav--open`);
});
