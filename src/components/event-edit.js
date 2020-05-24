import AbstractSmartComponent from "./abstract-smart-component.js";
import {TRIP_POINTS_TYPES} from "../consts.js";
import {castFormat, formatTime, formatDateDefault, ucFirst} from "../utils/common.js";
import {renderPosition, renderElement} from "../utils/render.js";
import {EmptyPoint} from "../controllers/point.js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import moment from "moment";
const transfers = Object.values(TRIP_POINTS_TYPES).filter((item) => item.action === `to`);
const activities = Object.values(TRIP_POINTS_TYPES).filter((item) => item.action === `in`);

const generateEventType = (item, currentItem) => {
  return (
    `
      <div class="event__type-item">
        <input id="event-type-${item.type}-${item.id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item.type}" ${item.type === currentItem.type ? `checked=""` : ``}>
        <label class="event__type-label  event__type-label--${item.type}" for="event-type-${item.type}-${item.id}">${ucFirst(item.type)}</label>
      </div>
    `
  );
};

const generateOffer = (offer, activeOffersList, pointId) => {
  const code = offer.title.toLowerCase().split(` `).join(`_`);
  return (
    `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${code}-${pointId}" type="checkbox" name="event-offer-${code}" ${activeOffersList.find((item) => item.title === offer.title) ? `checked=""` : ``}>
        <label class="event__offer-label" for="event-offer-${code}-${pointId}">
          <span class="event__offer-title">${offer.title}</span>
          +
          €&nbsp;<span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
    `
  );
};

const generateOffers = (point, offersData) => {
  const currentTypeOffers = offersData.find((offer) => offer.type === point.type);
  if (currentTypeOffers && currentTypeOffers.offers.length) {
    return (
      `
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${currentTypeOffers.offers.map((offer) => generateOffer(offer, point.offers, point.id)).join(``)}
          </div>
        </section>
      `
    );
  }
  return ``;
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

const createDescriptionBlock = (description) => {
  if (description) {
    return (
      `
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
      `
    );
  }
  return ``;
};

const createPhotosBlock = (pictures) => {
  if (pictures) {
    return (
      `
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${pictures.map(generatePhoto).join(`\n`)}
          </div>
        </div>
      `
    );
  }
  return ``;
};

const createEventEditTemplate = (eventItem, destinationsData, offersData) => {

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

  const offersBlock = generateOffers(eventItem, offersData);

  const isFavorite = eventItem.isFavorite ? `checked` : ``;
  let additionalClass = `trip-events__item`;
  let resetBtnText = `Close`;

  if (eventItem !== EmptyPoint) {
    additionalClass = ``;
    resetBtnText = `Delete`;
  }

  return (
    `<form class="event  event--edit ${additionalClass}" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${eventItem.id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${TRIP_POINTS_TYPES[eventItem.type].icon}" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${eventItem.id}" type="checkbox">

            <div class="event__type-list">
              ${transfersBlock}
              ${activitiesBlock}
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${eventItem.id}">
              ${ucFirst(eventItem.type)} ${TRIP_POINTS_TYPES[eventItem.type].action}
            </label>
            <input class="event__input  event__input--destination" required id="event-destination-${eventItem.id}" type="text" name="event-destination" value="${eventItem.destination.name}" list="destination-list-${eventItem.id}">
            <datalist id="destination-list-${eventItem.id}">
              ${destinationsData.map(generateCityOption).join(``)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${eventItem.id}">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-${eventItem.id}" type="text" name="event-start-time" value="${castFormat(eventItem.dateStart.getDate())}/${castFormat(eventItem.dateStart.getMonth())}/${eventItem.dateStart.getFullYear().toString().substr(-2)} ${formatTime(eventItem.dateStart)}">
            —
            <label class="visually-hidden" for="event-end-time-${eventItem.id}">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-${eventItem.id}" type="text" name="event-end-time" value="${castFormat(eventItem.dateEnd.getDate())}/${castFormat(eventItem.dateEnd.getMonth())}/${eventItem.dateEnd.getFullYear().toString().substr(-2)} ${formatTime(eventItem.dateEnd)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${eventItem.id}">
              <span class="visually-hidden">Price</span>
              €
            </label>
            <input class="event__input  event__input--price" required id="event-price-${eventItem.id}" type="number" name="event-price" value="${eventItem.price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${resetBtnText}</button>
          <input id="event-favorite-${eventItem.id}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite}>
          <label class="event__favorite-btn" for="event-favorite-${eventItem.id}">
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
            ${createDescriptionBlock(eventItem.destination.description)}
            ${createPhotosBlock(eventItem.destination.pictures)}
          </section>    
        </section>
      </form>`
  );
};

export default class EventEdit extends AbstractSmartComponent {
  constructor(eventItem, destinationsData, offersData) {
    super();
    this._event = eventItem;
    this._destinationsData = destinationsData || [];
    this._offersData = offersData || [];
    this._subscribeOnEvents();
    this._submitHandler = null;
    this._favoriteBtnClickHandler = null;
    this._deleteBtnClickHandler = null;
    this._closeHandler = null;
    this._flatpickrStart = null;
    this._flatpickrEnd = null;
    this._applyFlatpickr();
  }

  getTemplate() {
    return createEventEditTemplate(this._event, this._destinationsData, this._offersData);
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setCloseButtonClickHandler(this._closeHandler);
    this.setFavoriteButtonClickHandler(this._favoriteBtnClickHandler);
    this._subscribeOnEvents();
  }

  removeElement() {
    if (this._flatpickrStart) {
      this._flatpickrStart.destroy();
      this._flatpickrStart = null;
    }
    if (this._flatpickrEnd) {
      this._flatpickrEnd.destroy();
      this._flatpickrEnd = null;
    }

    super.removeElement();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  rerenderDestinationInfo(destination) {
    const container = document.querySelector(`.event--edit .event__section--destination`);
    container.innerHTML = ``;
    if (destination.description) {
      renderElement(container, createDescriptionBlock(destination.description), renderPosition.BEFOREEND);
    }
    if (destination.pictures) {
      renderElement(container, createPhotosBlock(destination.pictures), renderPosition.BEFOREEND);
    }
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
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

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, handler);
    this._deleteBtnClickHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    const currentType = element.querySelector(`[name="event-type"]:checked`) ? element.querySelector(`[name="event-type"]:checked`).value : ``;
    const destinationElement = element.querySelector(`[name="event-destination"]`);

    element.querySelectorAll(`[name="event-type"]`).forEach((it) => {
      it.addEventListener(`click`, () => {
        if (it.value !== currentType) {
          this._event.type = Object.keys(TRIP_POINTS_TYPES).find((type) => type === it.value);
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
      this._event.destination = this._destinationsData.find((it) => it.name === newValue);
      this.rerenderDestinationInfo(this._event.destination);
    });

    destinationElement.addEventListener(`keydown`, (evt) => {
      if (evt.key !== `Backspace`) {
        evt.preventDefault();
      }
    });

    const dateStartElement = this.getElement().querySelector(`[name="event-start-time"]`);
    const dateEndElement = this.getElement().querySelector(`[name="event-end-time"]`);
    dateStartElement.addEventListener(`change`, () => {
      const dateEnd = dateEndElement.value;
      const dateStartDefaultFormat = formatDateDefault(dateStartElement.value, `DD-MM-YY HH:mm`);
      const dateEndDefaultFormat = formatDateDefault(dateEnd, `DD-MM-YY HH:mm`);
      if (moment(dateEndDefaultFormat).isBefore(dateStartDefaultFormat)) {
        this._flatpickrEnd.destroy();
        this._flatpickrEnd = flatpickr(dateEndElement, {// time_24hr: true, - надо добавить это чтобы время было в нормальном формате, но линтер ругается
          dateFormat: `d/m/y H:i`,
          defaultDate: dateStartElement.value,
          enableTime: true,
          minDate: dateStartElement.value,
        });
      } else {
        this._flatpickrEnd.destroy();
        this._flatpickrEnd = flatpickr(dateEndElement, {
          dateFormat: `d/m/y H:i`,
          defaultDate: dateEnd,
          enableTime: true,
          minDate: dateStartElement.value,
        });
      }
    });
  }

  _applyFlatpickr() {
    if (this._flatpickrStart) {
      this._flatpickrStart.destroy();
      this._flatpickrStart = null;
    }
    if (this._flatpickrEnd) {
      this._flatpickrEnd.destroy();
      this._flatpickrEnd = null;
    }

    const dateStartElement = this.getElement().querySelector(`[name="event-start-time"]`);
    const dateEndElement = this.getElement().querySelector(`[name="event-end-time"]`);
    this._flatpickrStart = flatpickr(dateStartElement, {
      defaultDate: this._event.dateStart || `today`,
      dateFormat: `d/m/y H:i`,
      enableTime: true
    });
    this._flatpickrEnd = flatpickr(dateEndElement, {
      dateFormat: `d/m/y H:i`,
      defaultDate: this._event.dateEnd || `today`,
      enableTime: true,
      minDate: this._flatpickrStart.selectedDates[0],
    });
  }

  getData() {
    return new FormData(this.getElement());
  }

}
