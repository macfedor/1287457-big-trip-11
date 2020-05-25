import API from "./api.js";
import StatsComponent from "./components/stats.js";
import InfoBlockComponent from "./components/trip-info.js";
import TripController from "./controllers/trip.js";
import FiltersController from "./controllers/filters.js";
import MenuController from "./controllers/menu.js";
import Points from "./models/points.js";
import {renderPosition, renderComponent, renderElement, removeElement} from "./utils/render.js";

const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;
const AUTHORIZATION = `Basic hjq389q3hfkkadf8llm=`;

const headerElement = document.querySelector(`.page-header`);
const mainElement = document.querySelector(`.page-main`);
const tripMainElement = headerElement.querySelector(`.trip-main`);
const controlsElement = headerElement.querySelector(`.trip-controls`);
const eventsElement = mainElement.querySelector(`.trip-events`);
const pageBodyElement = mainElement.querySelector(`.page-body__container`);
const controlsFirstTitleElement = controlsElement.querySelector(`h2`);
const newEventButton = document.querySelector(`.trip-main__event-add-btn`);

const api = new API(END_POINT, AUTHORIZATION);
const pointsModel = new Points();
const filtersController = new FiltersController(controlsElement, pointsModel);
const menuController = new MenuController(controlsFirstTitleElement);
export const tripController = new TripController(eventsElement, pointsModel, filtersController, api);
export const statsComponent = new StatsComponent(pointsModel);

newEventButton.addEventListener(`click`, tripController.addNewEvent);

filtersController.render();
menuController.render();
renderComponent(pageBodyElement, statsComponent, renderPosition.BEFOREEND);
statsComponent.hide();

const preloadInfo = `<div class="preload-container">Loading…</div>`;
renderElement(eventsElement, preloadInfo, renderPosition.AFTERBEGIN);

Promise.all([api.getPoints(), api.getDestinations(), api.getOffers()])
  .then((values) => {
    const preloadElement = eventsElement.querySelector(`.preload-container`);
    removeElement(preloadElement);

    const [points, destinations, offers] = values;
    pointsModel.setPoints(points);
    renderComponent(tripMainElement, new InfoBlockComponent(points), renderPosition.AFTERBEGIN);
    tripController.render(destinations, offers);
  })
  .catch(() => {

  });
