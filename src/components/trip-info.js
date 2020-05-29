import AbstractComponent from "./abstract-component.js";
import {MONTH_SHORT_NAMES, SortType} from "../consts.js";
import {getSortedEvents} from "../utils/common.js";

const createTripInfoCost = (tripPoints) => {
  let total = 0;

  tripPoints.forEach((tripPoint) => {
    total += +tripPoint.price;
    if (tripPoint.offers.length) {
      tripPoint.offers.forEach((offer) => {
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
  if (!tripPoints.length) {
    return ``;
  }

  const firstItem = tripPoints[0];
  const lastItem = tripPoints[tripPoints.length - 1];

  let citiesInfo = `${firstItem.destination.name} — ... — ${lastItem.destination.name}`;
  let datesInfo = `${MONTH_SHORT_NAMES[firstItem.dateStart.getMonth()]} ${firstItem.dateStart.getDate()}&nbsp;—&nbsp;${lastItem.dateEnd.getMonth() === firstItem.dateStart.getMonth() ? `` : MONTH_SHORT_NAMES[lastItem.dateEnd.getMonth()]} ${lastItem.dateEnd.getDate()}`;

  switch (tripPoints.length) {
    case 1:
      citiesInfo = `${firstItem.destination.name}`;
      if (firstItem.dateStart.getDate() === firstItem.dateEnd.getDate() && firstItem.dateStart.getMonth() === firstItem.dateEnd.getMonth()) {
        datesInfo = `${MONTH_SHORT_NAMES[firstItem.dateStart.getMonth()]} ${firstItem.dateStart.getDate()}`;
      }
      break;
    case 2:
      citiesInfo = `${firstItem.destination.name} — ${lastItem.destination.name}`;
      break;
    case 3:
      citiesInfo = `${firstItem.destination.name} — ${tripPoints[1].destination.name} — ${lastItem.destination.name}`;
      break;
  }

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${citiesInfo}</h1>
      <p class="trip-info__dates">${datesInfo}</p>
    </div>`
  );
};

const createTripInfoTemplate = (tripPoints) => {
  const sortedPoints = getSortedEvents(tripPoints, SortType.EVENT);

  return (
    `<section class="trip-main__trip-info trip-info">
      ${createTripInfoMain(sortedPoints)}
      ${createTripInfoCost(sortedPoints)}
    </section>`
  );
};

export default class TripInfo extends AbstractComponent {
  constructor(tripPoints) {
    super();
    this._points = tripPoints;
  }

  getTemplate() {
    return createTripInfoTemplate(this._points);
  }
}
