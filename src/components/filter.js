import AbstractComponent from "./abstract-component.js";

export const FilterTypes = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

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

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = evt.target.value;
      handler(filterName);
    });
  }
}
