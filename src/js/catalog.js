import { PageHeader } from "./page-header.js";
import { PriceScale } from "./filter-price.js";

new PageHeader();

const priceContainerElement = document.querySelector(
  `[data-price="container"]`
);
const priceScale = new PriceScale(priceContainerElement);
priceScale.init();
