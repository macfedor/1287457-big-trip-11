import API from "./api/index.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";
import StatisticsComponent from "./components/statistics.js";
import InfoBlockComponent from "./components/trip-info.js";
import TripController from "./controllers/trip.js";
import FiltersController from "./controllers/filters.js";
import MenuController from "./controllers/menu.js";
import Points from "./models/points.js";
import {renderPosition, renderComponent, renderElement, removeElement} from "./utils/render.js";

const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;
const AUTHORIZATION = `Basic hjq389q3sffkadf8llm=`;

const StoreData = {
  POINTS_STORE_PREFIX: `bigtrip-localstorage`,
  POINTS_STORE_VER: `v1`,
  OFFERS_STORE_PREFIX: `bigtrip-localstorage-offers`,
  OFFERS_STORE_VER: `v1`,
  DESTINATIONS_STORE_PREFIX: `bigtrip-localstorage-destinations`,
  DESTINATIONS_STORE_VER: `v1`,
};

const StoreName = {
  POINTS: `${StoreData.POINTS_STORE_PREFIX}-${StoreData.POINTS_STORE_VER}`,
  OFFERS: `${StoreData.OFFERS_STORE_PREFIX}-${StoreData.OFFERS_STORE_VER}`,
  DESTINATIONS: `${StoreData.DESTINATIONS_STORE_PREFIX}-${StoreData.DESTINATIONS_STORE_VER}`,
};

const headerElement = document.querySelector(`.page-header`);
const mainElement = document.querySelector(`.page-main`);
const tripMainElement = headerElement.querySelector(`.trip-main`);
const controlsElement = headerElement.querySelector(`.trip-controls`);
const eventsElement = mainElement.querySelector(`.trip-events`);
const pageBodyElement = mainElement.querySelector(`.page-body__container`);
const controlsFirstTitleElement = controlsElement.querySelector(`h2`);
const newEventButton = document.querySelector(`.trip-main__event-add-btn`);

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(StoreName.POINTS, window.localStorage);
const storeOffers = new Store(StoreName.OFFERS, window.localStorage);
const storeDestinations = new Store(StoreName.DESTINATIONS, window.localStorage);
const apiWithProvider = new Provider(api, store, storeOffers, storeDestinations);
const pointsModel = new Points();
const filtersController = new FiltersController(controlsElement, pointsModel);
const menuController = new MenuController(controlsFirstTitleElement);
export const tripController = new TripController(eventsElement, pointsModel, filtersController, apiWithProvider);
export const statisticsComponent = new StatisticsComponent(pointsModel);

newEventButton.addEventListener(`click`, tripController.addNewEvent);

menuController.render();
renderComponent(pageBodyElement, statisticsComponent, renderPosition.BEFOREEND);
statisticsComponent.hide();

const preloadInfo = `<div class="preload-container">Loading…</div>`;
renderElement(eventsElement, preloadInfo, renderPosition.AFTERBEGIN);

Promise.all([apiWithProvider.getPoints(), apiWithProvider.getDestinations(), apiWithProvider.getOffers()])
  .then((values) => {
    const preloadElement = eventsElement.querySelector(`.preload-container`);
    removeElement(preloadElement);

    const [points, destinations, offers] = values;
    pointsModel.setPoints(points);
    tripController.render(destinations, offers);
    renderComponent(tripMainElement, new InfoBlockComponent(points), renderPosition.AFTERBEGIN);
    filtersController.render(points);
  })
  .catch(() => {

  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  apiWithProvider.sync();

  document.title = document.title.replace(`[offline]`, ``);
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
