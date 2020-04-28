import {createElement} from "../utils.js";
import {MONTH_SHORT_NAMES} from "../consts.js";

const createTripInfoCost = (tripPoints) => {
  let total = 0;
  tripPoints.forEach((tripPoint) => {
    total += tripPoint.price;
    if (tripPoint.type.offers) { // пока мы берем офферы из типов событий. как приедут настоящие данные перепишем эту часть (т.к. пока хз, как там все организовано, то почему бы пока не сделать так?)
      tripPoint.type.offers.forEach((offer) => {
        total += +offer.price;
      });
    }
  });
  return (
    `<p class="trip-info__cost">
      Total: €&nbsp;<span class="trip-info__cost-value">${total}</span>
    </p>`
  );
};

const createTripInfoMain = (tripPoints) => {
  const firstItem = tripPoints[0];
  const lastItem = tripPoints[tripPoints.length - 1];

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${firstItem.city} — ${tripPoints.length > 3 ? `...` : tripPoints[1].city} — ${lastItem.city}</h1>
      <p class="trip-info__dates">${MONTH_SHORT_NAMES[firstItem.dateStart.getMonth()]} ${firstItem.dateStart.getDate()}&nbsp;—&nbsp;${lastItem.dateStart.getMonth() === firstItem.dateStart.getMonth() ? `` : MONTH_SHORT_NAMES[lastItem.dateStart.getMonth()]}${lastItem.dateStart.getDate()}</p>
    </div>`
  );
};

const createTripInfoTemplate = (tripPoints) => {
  return (
    `<section class="trip-main__trip-info trip-info">
      ${createTripInfoMain(tripPoints)}
      ${createTripInfoCost(tripPoints)}
    </section>`
  );
};

export default class TripInfo {
  constructor(tripPoints) {
    this._points = tripPoints;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._points);
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
