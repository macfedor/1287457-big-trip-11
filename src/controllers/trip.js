import AbstractComponent from "../components/abstract-component.js";
import EventComponent from "../components/event.js";
import EventEditComponent from "../components/event-edit.js";
import EventsListComponent from "../components/events-list.js";
import EventsDayComponent from "../components/events-day.js";
import SortComponent from "../components/sort.js";
import NoEventsComponent from "../components/no-events.js";
import {sorts} from "../mock/sort.js";
import {renderPosition, renderComponent, replace} from "../utils/render.js";

const renderEvent = (container, currentEvent) => {
  const openEventEdit = () => {
    replace(eventEditElement, eventElement);
  };

  const closeEventEdit = () => {
    replace(eventElement, eventEditElement);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      closeEventEdit();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const eventElement = new EventComponent(currentEvent);
  const eventEditElement = new EventEditComponent(currentEvent);

  eventElement.setOpenEventButtonClickHandler(() => {
    openEventEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  eventEditElement.setEventEditSubmitHandler((evt) => {
    evt.preventDefault();
    closeEventEdit();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  renderComponent(container, eventElement, renderPosition.BEFOREEND);
};


export default class TripController extends AbstractComponent {
  constructor(container) {
    super();
    this._container = container;
    this._eventsListComponent = new EventsListComponent();
    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
  }

  render(events) {
    if (!events.length) {
      renderComponent(this._container, this._noEventsComponent, renderPosition.BEFOREEND);
      return;
    }

    renderComponent(this._container, new SortComponent(sorts), renderPosition.BEFOREEND);
    renderComponent(this._container, this._eventsListComponent, renderPosition.BEFOREEND);

    const eventsListElement = this._container.querySelector(`.trip-days`);

    const createEventsList = (points, eventsContainer) => {
      let dayNumber = 0;
      let lastDate = new Date(0);
      let eventContainer;
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
        renderEvent(eventContainer, currentEvent);
      });
    };

    createEventsList(events, eventsListElement);
  }
}
