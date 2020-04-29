import AbstractComponent from "./abstract-component.js";
import {formatDate} from "../utils/common.js";
import {MONTH_SHORT_NAMES} from "../consts.js";

const createEventsDayTemplate = (day) => {
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

export default class EventsDay extends AbstractComponent {
  constructor(day) {
    super();
    this._day = day;
  }

  getTemplate() {
    return createEventsDayTemplate(this._day);
  }
}
