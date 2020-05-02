import FilterComponent from "./components/filter.js";
import MenuComponent from "./components/menu.js";
import InfoBlockComponent from "./components/trip-info.js";
import TripController from "./controllers/trip.js";
import {generateEvents} from "./mock/event.js";
import {filters} from "./mock/filter.js";
import {compareDates} from "./utils/common.js";
import {renderPosition, renderComponent} from "./utils/render.js";

const EVENTS_COUNT = 22;
const events = generateEvents(EVENTS_COUNT);
const sortedEvents = events.concat().sort(compareDates);

const headerElement = document.querySelector(`.page-header`);
const mainElement = document.querySelector(`.page-main`);
const tripMainElement = headerElement.querySelector(`.trip-main`);
const controlsElement = headerElement.querySelector(`.trip-controls`);
const eventsElement = mainElement.querySelector(`.trip-events`);

renderComponent(tripMainElement, new InfoBlockComponent(sortedEvents), renderPosition.AFTERBEGIN);

renderComponent(controlsElement, new FilterComponent(filters), renderPosition.BEFOREEND);

const cotrolsFirstTitle = controlsElement.querySelector(`h2`);
renderComponent(cotrolsFirstTitle, new MenuComponent(), renderPosition.AFTEREND);

const tripController = new TripController(eventsElement);

tripController.render(sortedEvents);
