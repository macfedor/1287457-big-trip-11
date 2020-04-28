import {createElement} from "../utils.js";

const createFilterTemplate = (filters) => {
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filters.map(createFilterItem).join(``)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

const createFilterItem = (filterItem) => {
  const code = filterItem.name.toLowerCase();
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${code}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${code}" ${filterItem.isChecked ? `checked=""` : ``}>
      <label class="trip-filters__filter-label" for="filter-${code}">${filterItem.name}</label>
    </div>`
  );
};

export default class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
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
