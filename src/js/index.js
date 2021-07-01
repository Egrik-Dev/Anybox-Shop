import { Slider } from "./slider.js";

const sliderContainerElement = document.querySelector(
  `.product-slider__container`
);
const slider = new Slider(sliderContainerElement);
slider.calculateWidthContainer();
