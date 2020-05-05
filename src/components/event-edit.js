import AbstractSmartComponent from "./abstract-smart-component.js";
import {DESTINATIONS, EVENT_TYPES} from "../consts.js";
import {castFormat, formatTime} from "../utils/common.js";
const transfers = EVENT_TYPES.filter((item) => item.action === `to`);
const activities = EVENT_TYPES.filter((item) => item.action === `in`);

const generateEventType = (item, currentItem) => {
  const code = item.name.toLowerCase();
  return (
    `
      <div class="event__type-item">
        <input id="event-type-${code}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${code}" ${item.name === currentItem.type.name ? `checked=""` : ``}>
        <label class="event__type-label  event__type-label--${code}" for="event-type-${code}-1">${item.name}</label>
      </div>
    `
  );
};

const generateOffer = (offer) => {
  const code = offer.name.toLowerCase();
  return (
    `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${code}-1" type="checkbox" name="event-offer-${code}" ${offer.isChecked ? `checked=""` : ``}>
        <label class="event__offer-label" for="event-offer-${code}-1">
          <span class="event__offer-title">${offer.name}</span>
          +
          €&nbsp;<span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
    `
  );
};

const generatePhoto = (photo) => {
  return (
    `
      <img class="event__photo" src="${photo.src}" alt="${photo.description}">
    `
  );
};

const generateCityOption = (destination) => {
  return (
    `
      <option value="${destination.name}"></option>
    `
  );
};

const createEventEditTemplate = (eventItem) => {

  let transfersBlock = ``;
  if (transfers.length > 0) {
    transfersBlock = `
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Transfer</legend>
        ${transfers.map((item) => generateEventType(item, eventItem)).join(``)}
      </fieldset>
    `;
  }

  let activitiesBlock = ``;
  if (activities.length > 0) {
    activitiesBlock = `
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Transfer</legend>
        ${activities.map((item) => generateEventType(item, eventItem)).join(``)}
      </fieldset>
    `;
  }

  let offersBlock = ``;
  if (eventItem.type.offers) {
    offersBlock = `
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${eventItem.type.offers.map(generateOffer).join(``)}
        </div>
      </section>
    `;
  }

  let descriptionBlock = ``;
  if (eventItem.destination.description) {
    descriptionBlock = `
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${eventItem.destination.description}</p>
    `;
  }

  let photosBlock = ``;
  if (eventItem.destination.pictures) {
    photosBlock = `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${eventItem.destination.pictures.map(generatePhoto).join(`\n`)}
        </div>
      </div>
    `;
  }

  const isFavorite = eventItem.isFavorite ? `checked` : ``;

  return (
    `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${eventItem.type.icon}" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              ${transfersBlock}
              ${activitiesBlock}
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${eventItem.type.name} ${eventItem.type.action}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${eventItem.destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${DESTINATIONS.map(generateCityOption).join(``)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${castFormat(eventItem.dateStart.getDate())}/${castFormat(eventItem.dateStart.getMonth())}/${eventItem.dateStart.getFullYear().toString().substr(-2)} ${formatTime(eventItem.dateStart)}">
            —
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${castFormat(eventItem.dateEnd.getDate())}/${castFormat(eventItem.dateEnd.getMonth())}/${eventItem.dateEnd.getFullYear().toString().substr(-2)} ${formatTime(eventItem.dateEnd)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              €
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${eventItem.price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${offersBlock} 
          <section class="event__section  event__section--destination">
            ${descriptionBlock}
            ${photosBlock}
          </section>    
        </section>
      </form>
    </li>`
  );
};

export default class EventEdit extends AbstractSmartComponent {
  constructor(eventItem) {
    super();
    this._event = eventItem;
    this._subscribeOnEvents();
    this._submitHandler = null;
    this._favoriteBtnClickHandler = null;
    this._closeHandler = null;
  }

  getTemplate() {
    return createEventEditTemplate(this._event);
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setCloseButtonClickHandler(this._closeHandler);
    this.setFavoriteButtonClickHandler(this._favoriteBtnClickHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
    this._closeHandler = handler;
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, handler);
    this._favoriteBtnClickHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    const currentType = element.querySelector(`[name="event-type"]:checked`).value;
    const destinationElement = element.querySelector(`[name="event-destination"]`);

    element.querySelectorAll(`[name="event-type"]`).forEach((it) => {
      it.addEventListener(`click`, () => {
        if (it.value !== currentType) {
          this._event.type = EVENT_TYPES.find((type) => type.type === it.value);
          this.rerender();
        }
      });
    });

    destinationElement.addEventListener(`change`, (evt) => {
      const newValue = evt.target.value;
      if (!newValue) {
        evt.target.value = this._event.destination.name;
        return;
      }
      this._event.destination = DESTINATIONS.find((it) => it.name === newValue);
      this.rerender();
    });

    destinationElement.addEventListener(`keydown`, (evt) => {
      if (evt.key !== `Backspace`) {
        evt.preventDefault();
      }
    });

  }
}
