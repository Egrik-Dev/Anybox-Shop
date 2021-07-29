import { PageHeader } from "./page-header.js";
import { Slider } from "./slider.js";

new PageHeader();

const sliderContainerElement = document.querySelector(
  `.product-card__img-container`
);

const slider = new Slider(sliderContainerElement, {
  mode: `loop`,
  isRenderToggles: false,
});

slider.calculateWidthContainer();
