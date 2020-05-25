import AbstractComponent from "./abstract-component.js";

export const sortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};

const createSortTemplate = () => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>

      ${Object.values(sortType).map((item, index) => createSortItem(item, index)).join(``)}

      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

const createSortItem = (sortItem, index) => {
  const code = sortItem.toLowerCase();
  return (
    `<div class="trip-sort__item  trip-sort__item--${code}">
<input id="sort-${code}" class="trip-sort__input  visually-hidden" type="radio" ${index === 0 ? `checked` : ``} name="trip-sort" value="sort-${code}">
      <label class="trip-sort__btn trip-sort__btn--by-increase" for="sort-${code}" data-sort-type="${code}">
        ${sortItem}
      </label>
    </div>`
  );
};

export default class Sort extends AbstractComponent {
  constructor(sortItems) {
    super();
    this._sortItems = sortItems;
    this._sortType = null;
  }

  getTemplate() {
    return createSortTemplate(this._sortItems);
  }

  getSortType() {
    return this._sortType;
  }

  setSortType(currentSortType) {
    this._sortType = currentSortType;
  }

  setChangeSortTypeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `LABEL`) {
        return;
      }

      const currentSortType = evt.target.dataset.sortType;

      if (currentSortType === this._sortType) {
        return;
      }

      this._sortType = currentSortType;

      handler(this._sortType);
    });
  }
}
