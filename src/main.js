import {createEventsList} from "./components/event.js";
import {createEventListTemplate} from "./components/event-list.js";
import {createFilterTemplate} from "./components/filter.js";
import {createMenuTemplate} from "./components/menu.js";
import {createSortTemplate} from "./components/sort.js";
import {createTripInfoTemplate} from "./components/trip-info.js";
import {createTripInfoCostTemplate} from "./components/trip-info-cost.js";
import {createTripInfoMainTemplate} from "./components/trip-info-main.js";
import {generateEvents} from "./mock/event.js";
import {filters} from "./mock/filter.js";
import {sorts} from "./mock/sort.js";
import {compareDates} from "./utils.js";

const EVENTS_COUNT = 22;
const events = generateEvents(EVENTS_COUNT);
const sortedEvents = events.concat().sort(compareDates);

export const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector(`.page-header`);
const mainElement = document.querySelector(`.page-main`);
const tripMainElement = headerElement.querySelector(`.trip-main`);
const controlsElement = headerElement.querySelector(`.trip-controls`);
const eventsElement = mainElement.querySelector(`.trip-events`);

render(tripMainElement, createTripInfoTemplate(), `afterBegin`);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);

render(tripInfoElement, createTripInfoMainTemplate(sortedEvents), `beforeEnd`);
render(tripInfoElement, createTripInfoCostTemplate(sortedEvents), `beforeEnd`);


render(controlsElement, createFilterTemplate(filters), `beforeEnd`);

const cotrolsFirstTitle = controlsElement.querySelector(`h2`);
render(cotrolsFirstTitle, createMenuTemplate(), `afterEnd`);

render(eventsElement, createSortTemplate(sorts), `beforeEnd`);
render(eventsElement, createEventListTemplate(), `beforeEnd`);

const eventsListElement = eventsElement.querySelector(`.trip-days`);

createEventsList(sortedEvents, eventsListElement);


