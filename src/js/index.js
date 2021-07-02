import { PageHeader } from "./page-header.js";
import { Slider } from "./slider.js";

new PageHeader();

const sliderContainerElement = document.querySelector(
  `.product-slider__container`
);
const slider = new Slider(sliderContainerElement);
slider.calculateWidthContainer();
