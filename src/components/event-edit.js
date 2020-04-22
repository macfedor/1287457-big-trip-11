import {CITIES, EVENT_TYPES} from "../consts.js";
import {castFormat, formatTime} from "../utils.js";
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
      <img class="event__photo" src="${photo}" alt="Event photo">
    `
  );
};

export const createEventEditTemplate = (data) => {
  return (
    `
      <form class="trip-events__item  event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${data.type.icon}" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              ${transfers.length > 0 ?
      `
                  <fieldset class="event__type-group">
                    <legend class="visually-hidden">Transfer</legend>
                    ${transfers.map((item) => generateEventType(item, data)).join(``)}
                  </fieldset>
                `
      : ``}
              

              ${activities.length > 0 ?
      `
                  <fieldset class="event__type-group">
                    <legend class="visually-hidden">Transfer</legend>
                    ${activities.map((item) => generateEventType(item, data)).join(``)}
                  </fieldset>
                `
      : ``}
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${data.type.name} ${data.type.action}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${data.city}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${CITIES.map((city) => {
      return (
        `
        <option value="${city}"></option>
      `
      );
    })};
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${castFormat(data.dateStart.getDate())}/${castFormat(data.dateStart.getMonth())}/${data.dateStart.getFullYear().toString().substr(-2)} ${formatTime(data.dateStart)}">
            —
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${castFormat(data.dateEnd.getDate())}/${castFormat(data.dateEnd.getMonth())}/${data.dateEnd.getFullYear().toString().substr(-2)} ${formatTime(data.dateEnd)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              €
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${data.price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
        <section class="event__details">
          ${data.type.offers ?
      `
            <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>

              <div class="event__available-offers">
                ${data.type.offers.map(generateOffer).join(``)}
              </div>
            </section>
          ` : ``} 
          <section class="event__section  event__section--destination">
            ${data.description ? `
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${data.description}</p>
            ` : ``}
            ${data.photos ? `
              <div class="event__photos-container">
                <div class="event__photos-tape">
                  ${data.photos.map(generatePhoto).join(`\n`)}
                </div>
              </div>
            ` : ``}
          </section>    
        </section>
      </form>
    `
  );
};
