import MenuComponent from "./components/menu.js";
import InfoBlockComponent from "./components/trip-info.js";
import TripController from "./controllers/trip.js";
import FiltersController from "./controllers/filters.js";
import Points from "./models/points.js";
import {generateEvents} from "./mock/event.js";
import {compareDates} from "./utils/common.js";
import {renderPosition, renderComponent} from "./utils/render.js";

const EVENTS_COUNT = 3;
const events = generateEvents(EVENTS_COUNT);
const sortedEvents = events.concat().sort(compareDates);

const headerElement = document.querySelector(`.page-header`);
const mainElement = document.querySelector(`.page-main`);
const tripMainElement = headerElement.querySelector(`.trip-main`);
const controlsElement = headerElement.querySelector(`.trip-controls`);
const eventsElement = mainElement.querySelector(`.trip-events`);

const pointsModel = new Points();
pointsModel.setPoints(sortedEvents);

renderComponent(tripMainElement, new InfoBlockComponent(sortedEvents), renderPosition.AFTERBEGIN);

const filtersController = new FiltersController(controlsElement, pointsModel);

filtersController.render();

const controlsFirstTitle = controlsElement.querySelector(`h2`);
renderComponent(controlsFirstTitle, new MenuComponent(), renderPosition.AFTEREND);

const tripController = new TripController(eventsElement, pointsModel, filtersController);

tripController.render();

const newEventButton = document.querySelector(`.trip-main__event-add-btn`);
newEventButton.addEventListener(`click`, tripController.createNewEvent);
