import moment from "moment";
import AbstractComponent from "./abstract-component.js";
import {formatTime, formatDate, castFormat, ucFirst} from "../utils/common.js";
import {MAX_OFFERS_COUNT, TRIP_POINTS_TYPES} from "../consts.js";

const createEventOffer = (offer) => {
  return (
    `
      <li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        +
        €&nbsp;<span class="event__offer-price">${offer.price}</span>
      </li>
    `
  );
};

const createEventTemplate = (currentEvent) => {
  let offersListTemplate = ``;
  if (currentEvent.offers && currentEvent.offers.length > 0) {
    offersListTemplate = `
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${currentEvent.offers.slice(0, MAX_OFFERS_COUNT).map((item) => createEventOffer(item)).join(``)}
      </ul>
    `;
  }

  const duration = moment.duration(currentEvent.dateEnd.getTime() - currentEvent.dateStart.getTime());
  let durationString = ``;
  durationString += duration._data.days ? castFormat(duration._data.days) + `D ` : ``;
  durationString += duration._data.hours ? castFormat(duration._data.hours) + `H ` : ``;
  durationString += duration._data.minutes ? castFormat(duration._data.minutes) + `M` : ``;

  return (
    `<div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${TRIP_POINTS_TYPES[currentEvent.type].icon}" alt="Event type icon">
      </div>
      <h3 class="event__title">${ucFirst(currentEvent.type)} ${TRIP_POINTS_TYPES[currentEvent.type].action} ${currentEvent.destination.name}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${formatDate(currentEvent.dateStart)}">${formatTime(currentEvent.dateStart)}</time>
          —
          <time class="event__end-time" datetime="${formatDate(currentEvent.dateEnd)}">${formatTime(currentEvent.dateEnd)}</time>
        </p>
        <p class="event__duration">${durationString}</p>
      </div>

      <p class="event__price">
        €&nbsp;<span class="event__price-value">${currentEvent.price}</span>
      </p>
      ${offersListTemplate}
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>`
  );
};

export default class Point extends AbstractComponent {
  constructor(currentEvent) {
    super();
    this._event = currentEvent;
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  setOpenButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }
}
