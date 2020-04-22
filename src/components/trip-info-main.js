import {MONTH_SHORT_NAMES} from "../consts.js";

export const createTripInfoMainTemplate = (data) => {
  const firstItem = data[0];
  const lastItem = data[data.length - 1];

  return (
    `
      <div class="trip-info__main">
        <h1 class="trip-info__title">${firstItem.city} — ${data.length > 3 ? `...` : data[1].city} — ${lastItem.city}</h1>
        <p class="trip-info__dates">${MONTH_SHORT_NAMES[firstItem.dateStart.getMonth()]} ${firstItem.dateStart.getDate()}&nbsp;—&nbsp;${lastItem.dateStart.getMonth() === firstItem.dateStart.getMonth() ? `` : MONTH_SHORT_NAMES[lastItem.dateStart.getMonth()]}${lastItem.dateStart.getDate()}</p>
      </div>
    `
  );
};
