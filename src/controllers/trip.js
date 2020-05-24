import AbstractComponent, {HIDDEN_CLASS} from "../components/abstract-component.js";
import EventsListComponent from "../components/events-list.js";
import EventsDayComponent from "../components/events-day.js";
import SortComponent, {sortType} from "../components/sort.js";
import NoEventsComponent from "../components/no-events.js";
import InfoBlockComponent from "../components/trip-info.js";
import {FilterTypes} from "../components/filter.js";
import PointController, {EmptyPoint, Mode} from "../controllers/point.js";
import {renderPosition, renderComponent} from "../utils/render.js";


const getSortedEvents = (events, type) => {
  let sortedEvents = [];
  const preSortedEvents = events.slice();

  switch (type) {
    case sortType.TIME:
      sortedEvents = preSortedEvents.sort((a, b) => (b.dateEnd.getTime() - b.dateStart.getTime()) - (a.dateEnd.getTime() - a.dateStart.getTime()));
      break;
    case sortType.PRICE:
      sortedEvents = preSortedEvents.sort((a, b) => b.price - a.price);
      break;
    case sortType.EVENT:
      sortedEvents = preSortedEvents.sort((a, b) => a.dateStart.getTime() - b.dateStart.getTime());
      break;
  }

  return sortedEvents;
};

export default class TripController extends AbstractComponent {
  constructor(container, pointsModel, filtersController, api) {
    super();
    this._pointsModel = pointsModel;
    this._filtersController = filtersController;
    this._container = container;
    this._eventsListComponent = new EventsListComponent();
    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._sortComponent.setChangeSortTypeHandler(this._sortTypeChangeHandler);
    this._showedEventsControllers = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
    this.createNewEvent = this.createNewEvent.bind(this);
    this._resetFilter = this._resetFilter.bind(this);
    this.sort = this.sort.bind(this);
    this._defaultSortType = sortType.EVENT;
    this._currentSortType = sortType.EVENT;
    this._creatingEvent = null;
    this._destinationsData = null;
    this._offersData = null;
    this._api = api;
  }

  show() {
    this._container.classList.remove(HIDDEN_CLASS);
  }

  hide() {
    this._container.classList.add(HIDDEN_CLASS);
  }

  _resetFilter() {
    this._filtersController.onFilterChange(FilterTypes.EVERYTHING);
  }

  sort(currentSortType) {
    const listElement = this._container.querySelector(`.trip-days`);
    const daysTitleElement = this._container.querySelector(`.trip-sort__item--day`);
    const points = this._pointsModel.getPoints();

    this._removePoints();
    daysTitleElement.innerHTML = currentSortType === sortType.EVENT ? `Day` : ``;
    const sortedEvents = getSortedEvents(points, currentSortType);

    if (currentSortType === sortType.EVENT) {
      this._createEventsList(sortedEvents, listElement);
    } else {
      renderComponent(listElement, new EventsDayComponent(), renderPosition.BEFOREEND);
      const sortedEventsListElement = listElement.querySelector(`.trip-events__list`);

      this._showedEventsControllers = [];
      sortedEvents.forEach((currentEvent) => {
        const pointController = new PointController(sortedEventsListElement, this._onDataChange, this._onViewChange);
        pointController.render(currentEvent, Mode.DEFAULT, this._destinationsData, this._offersData);
        this._showedEventsControllers = this._showedEventsControllers.concat(pointController);
      });
    }
    this._currentSortType = currentSortType;
  }

  _sortTypeChangeHandler(currentSortType) {
    this.sort(currentSortType);
  }

  _createEventsList(points, eventsContainer) {
    let dayNumber = 0;
    let lastDate = new Date(0);
    let eventContainer;
    this._showedEventsControllers = [];
    points.forEach((currentEvent) => {
      const eventDate = new Date(currentEvent.dateStart);
      eventDate.setHours(0, 0, 0, 0); // время не участвует в сравнении дат
      if (eventDate.getTime() !== lastDate.getTime()) {
        dayNumber++;
        lastDate = eventDate;
        const dayData = {
          dayNumber,
          date: currentEvent.dateStart
        };
        renderComponent(eventsContainer, new EventsDayComponent(dayData), renderPosition.BEFOREEND);
        const days = eventsContainer.querySelectorAll(`.trip-days__item.day`);
        eventContainer = days[days.length - 1].querySelector(`.trip-events__list`);
      }
      const pointController = new PointController(eventContainer, this._onDataChange, this._onViewChange);
      pointController.render(currentEvent, Mode.DEFAULT, this._destinationsData, this._offersData);
      this._showedEventsControllers = this._showedEventsControllers.concat(pointController);
    });
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EmptyPoint) {
      this._creatingEvent = null;
      if (newData !== null) {
        this._pointsModel.addPoint(newData);
      }
      pointController.destroy();
      const newEventButton = document.querySelector(`.trip-main__event-add-btn`);
      newEventButton.disabled = false;
      this._updatePoints();
      this._updateTripInfo();
    } else if (newData === null) {
      this._pointsModel.removePoint(oldData.id);
      this._updatePoints();
      this._updateTripInfo();
    } else {
      this._api.updatePoint(oldData.id, newData)
        .then((pointModel) => {
          this._pointsModel.updatePoint(oldData.id, pointModel);
          this._updatePoints();
          this._updateTripInfo();
        });
    }
  }

  _updatePoints() {
    this._removePoints();
    this.render(this._destinationsData, this._offersData);
  }

  _onViewChange() {
    if (this._creatingEvent) {
      this._creatingEvent.destroyNewEvent();
    }
    this._showedEventsControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._sortComponent.setSortType(this._defaultSortType);
    this._removePoints();
    const daysTitleElement = this._container.querySelector(`.trip-sort__item--day`);
    daysTitleElement.innerHTML = `Day`;
    this.render(this._destinationsData, this._offersData);
  }

  _removePoints() {
    const listElement = this._container.querySelector(`.trip-days`);
    this._showedEventsControllers.forEach((pointController) => pointController.destroy());
    listElement.innerHTML = ``;
    this._showedEventsControllers = [];
  }

  _updateTripInfo() {
    const tripMainElement = document.querySelector(`.trip-main`);
    const tripInfoElement = tripMainElement.querySelector(`.trip-main__trip-info`);
    tripInfoElement.remove();
    renderComponent(tripMainElement, new InfoBlockComponent(getSortedEvents(this._pointsModel.getPoints(), this._currentSortType)), renderPosition.AFTERBEGIN);
  }

  createNewEvent() {
    this._removePoints();
    this._resetFilter();
    const newEventButton = document.querySelector(`.trip-main__event-add-btn`);
    const container = document.querySelector(`.trip-events__trip-sort`);
    const pointController = new PointController(container, this._onDataChange, this._onViewChange);
    this._creatingEvent = pointController;
    newEventButton.disabled = true;
    this._creatingEvent.render(EmptyPoint, Mode.ADDING);
  }

  render(destinations, offers) {
    if (!this._destinationsData) {
      this._destinationsData = destinations;
    }
    if (!this._offersData) {
      this._offersData = offers;
    }
    const points = getSortedEvents(this._pointsModel.getPoints(), this._currentSortType);
    if (!points.length) {
      renderComponent(this._container, this._noEventsComponent, renderPosition.BEFOREEND);
      return;
    }
    renderComponent(this._container, this._sortComponent, renderPosition.BEFOREEND);
    renderComponent(this._container, this._eventsListComponent, renderPosition.BEFOREEND);

    const eventsListElement = this._container.querySelector(`.trip-days`);

    this._createEventsList(points, eventsListElement);
  }
}
