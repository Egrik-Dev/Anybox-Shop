export class PageHeader {
  constructor() {
    this.navOpenBtnElement = document.querySelector(`.page-header__open-btn`);
    this.navElement = document.querySelector(`.page-header__nav`);
    this.bodyElement = document.querySelector(`body`);
    this.navCloseBtnElement = document.querySelector(`.page-header__close-btn`);

    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);

    this.navOpenBtnElement.addEventListener(`click`, this.openMenu);
    this.navCloseBtnElement.addEventListener(`click`, this.closeMenu);
  }

  openMenu() {
    this.navElement.classList.add(`page-header__nav--open`);
    this.bodyElement.style = `overflow: hidden;`;
  }

  closeMenu() {
    this.navElement.classList.remove(`page-header__nav--open`);
    this.bodyElement.style = ``;
  }
}
