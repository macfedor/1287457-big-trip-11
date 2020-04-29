import {formatTime, formatDate, createElement} from "../utils.js";
import {MAX_OFFERS_COUNT} from "../consts.js";

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

const createEventTemplate = (currentEvent) => {
  let offersListTemplate = ``;
  if (currentEvent.type.offers && currentEvent.type.offers.length > 0) { // кажется в таком виде это чисто визуально проще воспринимать, чем через тернанрый оператор
    offersListTemplate = `
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${currentEvent.type.offers.slice(0, MAX_OFFERS_COUNT).map((item) => createEventOffer(item)).join(``)}
      </ul>
    `;
  }

  return (
    `<li class="trip-events__item">
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
          ${offersListTemplate}
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>`
  );
};

export default class Point {
  constructor(currentEvent) {
    this._event = currentEvent;
    this._element = null;
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
