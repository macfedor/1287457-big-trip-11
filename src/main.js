import {createEventTemplate} from "./components/event.js";
import {createEventEditTemplate} from "./components/event-edit.js";
import {createEventListTemplate} from "./components/event-list.js";
import {createFilterTemplate} from "./components/filter.js";
import {createMenuTemplate} from "./components/menu.js";
import {createSortTemplate} from "./components/sort.js";
import {createTripInfoTemplate} from "./components/trip-info.js";
import {createTripInfoCostTemplate} from "./components/trip-info-cost.js";
import {createTripInfoMainTemplate} from "./components/trip-info-main.js";

const EVENTS_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector(`.page-header`);
const mainElement = document.querySelector(`.page-main`);
const tripMainElement = headerElement.querySelector(`.trip-main`);
const controlsElement = headerElement.querySelector(`.trip-controls`);
const eventsElement = mainElement.querySelector(`.trip-events`);

render(tripMainElement, createTripInfoTemplate(), `afterBegin`);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);

render(tripInfoElement, createTripInfoMainTemplate(), `beforeEnd`);
render(tripInfoElement, createTripInfoCostTemplate(), `beforeEnd`);
render(controlsElement, createFilterTemplate(), `beforeEnd`);

const cotrolsFirstTitle = controlsElement.querySelector(`h2`);
render(cotrolsFirstTitle, createMenuTemplate(), `afterEnd`);

render(eventsElement, createSortTemplate(), `beforeEnd`);
render(eventsElement, createEventEditTemplate(), `beforeEnd`);
render(eventsElement, createEventListTemplate(), `beforeEnd`);

const eventsListElement = eventsElement.querySelector(`.trip-events__list`);

for (let i = 0; i < EVENTS_COUNT; i++) {
  render(eventsListElement, createEventTemplate(), `beforeEnd`);
}
