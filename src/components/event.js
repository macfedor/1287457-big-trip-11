import {formatTime, formatDate} from "../utils.js";
import {MAX_OFFERS_COUNT, MONTH_SHORT_NAMES} from "../consts.js";
import {render} from "../main.js";
import {createEventEditTemplate} from "./event-edit.js";

const createEventOffer = (offer) => {
  return (
    `
      <li class="event__offer">
        <span class="event__offer-title">${offer.name}</span>
        +
        €&nbsp;<span class="event__offer-price">${offer.price}</span>
      </li>
    `
  );
};

export const createEventTemplate = (currentEvent) => {
  return (
    `
      <li class="trip-events__item">
        <div class="event">
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${currentEvent.type.icon}" alt="Event type icon">
          </div>
          <h3 class="event__title">${currentEvent.type.name} ${currentEvent.type.action} ${currentEvent.city}</h3>

          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${formatDate(currentEvent.dateStart)}">${formatTime(currentEvent.dateStart)}</time>
              —
              <time class="event__end-time" datetime="${formatDate(currentEvent.dateEnd)}">${formatTime(currentEvent.dateEnd)}</time>
            </p>
            <p class="event__duration">${currentEvent.duration}</p>
          </div>

          <p class="event__price">
            €&nbsp;<span class="event__price-value">${currentEvent.price}</span>
          </p>
          ${currentEvent.type.offers && currentEvent.type.offers.length > 0 ?
      `
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${currentEvent.type.offers.slice(0, MAX_OFFERS_COUNT).map((item) => createEventOffer(item)).join(``)}
          </ul>
          ` : ``}
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>
    `
  );
};

const createEventsDay = (day) => {
  return (
    `
      <li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${day.dayNumber}</span>
          <time class="day__date" datetime="${formatDate(day.date)}">${MONTH_SHORT_NAMES[day.date.getMonth()]} ${day.date.getDate()}</time>
        </div>
        <ul class="trip-events__list"></ul>
      </li>
    `
  );
};

export const createEventsList = (events, eventsListElement) => {
  let dayNumber = 0;
  let lastDate = new Date(0);
  let container;
  events.map((item, index) => {
    const eventDate = new Date(item.dateStart);
    eventDate.setHours(0, 0, 0, 0); // время не участвует в сравнении дат
    if (eventDate.getTime() !== lastDate.getTime()) {
      dayNumber++;
      lastDate = eventDate;
      const dayData = {
        dayNumber,
        date: item.dateStart
      };
      render(eventsListElement, createEventsDay(dayData), `beforeEnd`);
      const days = eventsListElement.querySelectorAll(`.trip-days__item.day`);
      container = days[days.length - 1].querySelector(`.trip-events__list`);
    }
    if (index === 0) {
      render(container, createEventEditTemplate(item), `beforeEnd`);
    } else {
      render(container, createEventTemplate(item), `beforeEnd`);
    }

    // index === 0 ? render(container, createEventEditTemplate(item), `beforeEnd`) : render(container, createEventTemplate(item), `beforeEnd`);
    // изначально был такой вариант условия, но на него ругается линтер - говорит "Expected an assignment or function call and instead saw an expression no-unused-expressions"
  });
};
