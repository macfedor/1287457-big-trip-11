import EventComponent from "./components/event.js";
import EventEditComponent from "./components/event-edit.js";
import FilterComponent from "./components/filter.js";
import MenuComponent from "./components/menu.js";
import SortComponent from "./components/sort.js";
import InfoBlockComponent from "./components/trip-info.js";
import {generateEvents} from "./mock/event.js";
import {filters} from "./mock/filter.js";
import {sorts} from "./mock/sort.js";
import {compareDates, render, renderPosition, createElement, formatDate} from "./utils.js";
import {MONTH_SHORT_NAMES} from "./consts.js";

const EVENTS_COUNT = 22;
const events = generateEvents(EVENTS_COUNT);
const sortedEvents = events.concat().sort(compareDates);

const headerElement = document.querySelector(`.page-header`);
const mainElement = document.querySelector(`.page-main`);
const tripMainElement = headerElement.querySelector(`.trip-main`);
const controlsElement = headerElement.querySelector(`.trip-controls`);
const eventsElement = mainElement.querySelector(`.trip-events`);

const renderEvent = (container, currentEvent) => {

  const onEditButtonClick = () => {
    container.replaceChild(eventEditElement.getElement(), eventElement.getElement());
  };

  const onEditFormSubmit = (evt) => {
    evt.preventDefault();
    container.replaceChild(eventElement.getElement(), eventEditElement.getElement());
  };

  const eventElement = new EventComponent(currentEvent);
  const eventEditElement = new EventEditComponent(currentEvent);

  const editBtn = eventElement.getElement().querySelector(`.event__rollup-btn`);
  editBtn.addEventListener(`click`, onEditButtonClick);

  const editForm = eventEditElement.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, onEditFormSubmit);

  render(container, eventElement.getElement(), renderPosition.BEFOREEND);
};

const renderEventsList = () => {

  const createEventsListBlock = () => {
    return (
      `<ul class="trip-days"></ul>`
    );
  };

  const createEventsDay = (day) => {
    return (
      `<li class="trip-days__item  day">
          <div class="day__info">
            <span class="day__counter">${day.dayNumber}</span>
            <time class="day__date" datetime="${formatDate(day.date)}">${MONTH_SHORT_NAMES[day.date.getMonth()]} ${day.date.getDate()}</time>
          </div>
          <ul class="trip-events__list"></ul>
        </li>`
    );
  };

  render(eventsElement, createElement(createEventsListBlock()), renderPosition.BEFOREEND);
  const eventsListElement = eventsElement.querySelector(`.trip-days`);

  const createEventsList = (points, eventsContainer) => {
    let dayNumber = 0;
    let lastDate = new Date(0);
    let container;
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
        render(eventsContainer, createElement(createEventsDay(dayData)), renderPosition.BEFOREEND);
        const days = eventsContainer.querySelectorAll(`.trip-days__item.day`);
        container = days[days.length - 1].querySelector(`.trip-events__list`);
      }
      renderEvent(container, currentEvent);
    });
  };

  createEventsList(sortedEvents, eventsListElement);
};

render(tripMainElement, new InfoBlockComponent(sortedEvents).getElement(), renderPosition.AFTERBEGIN);

render(controlsElement, new FilterComponent(filters).getElement(), renderPosition.BEFOREEND);

const cotrolsFirstTitle = controlsElement.querySelector(`h2`);
render(cotrolsFirstTitle, new MenuComponent().getElement(), renderPosition.AFTEREND);

render(eventsElement, new SortComponent(sorts).getElement(), renderPosition.BEFOREEND);

renderEventsList();

