import AbstractComponent from "../components/abstract-component.js";
import EventsListComponent from "../components/events-list.js";
import EventsDayComponent from "../components/events-day.js";
import SortComponent, {sortType} from "../components/sort.js";
import NoEventsComponent from "../components/no-events.js";
import PointController from "../controllers/point.js";
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
  }

  return sortedEvents;
};


export default class TripController extends AbstractComponent {
  constructor(container) {
    super();
    this._events = [];
    this._container = container;
    this._eventsListComponent = new EventsListComponent();
    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._sortComponent.setChangeSortTypeHandler(this._sortTypeChangeHandler);
    this._showedEventsControllers = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  _sortTypeChangeHandler(currentSortType) {
    const listElement = this._container.querySelector(`.trip-days`);
    const daysTitleElement = this._container.querySelector(`.trip-sort__item--day`);

    listElement.innerHTML = ``;
    daysTitleElement.innerHTML = ``;

    if (currentSortType === sortType.EVENT) {
      this._createEventsList(this._events, listElement);
    } else {
      const sortedEvents = getSortedEvents(this._events, currentSortType);

      renderComponent(listElement, new EventsDayComponent(), renderPosition.BEFOREEND);
      const sortedEventsListElement = listElement.querySelector(`.trip-events__list`);

      this._showedEventsControllers = [];
      sortedEvents.forEach((currentEvent) => {
        const pointController = new PointController(sortedEventsListElement, this._onDataChange, this._onViewChange);
        pointController.render(currentEvent);
        this._showedEventsControllers = this._showedEventsControllers.concat(pointController);
      });
    }
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
      pointController.render(currentEvent);
      this._showedEventsControllers = this._showedEventsControllers.concat(pointController);
    });
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._events.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newData, this._events.slice(index + 1));
    pointController.render(this._events[index]);
  }

  _onViewChange() {
    this._showedEventsControllers.forEach((it) => it.setDefaultView());
  }

  render(events) {
    if (!events.length) {
      renderComponent(this._container, this._noEventsComponent, renderPosition.BEFOREEND);
      return;
    }
    this._events = events;
    renderComponent(this._container, this._sortComponent, renderPosition.BEFOREEND);
    renderComponent(this._container, this._eventsListComponent, renderPosition.BEFOREEND);

    const eventsListElement = this._container.querySelector(`.trip-days`);

    this._createEventsList(events, eventsListElement);
  }
}
