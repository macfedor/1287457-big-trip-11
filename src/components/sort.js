export const createSortTemplate = (sorts) => {
  return (
    `
      <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        <span class="trip-sort__item  trip-sort__item--day">Day</span>

        ${sorts.map(createSortItem).join(``)}

        <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
      </form>
    `
  );
};

const createSortItem = (data) => {
  const code = data.name.toLowerCase();
  return (
    `
      <div class="trip-sort__item  trip-sort__item--${code}">
        <input id="sort-${code}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${code}" ${data.isChecked ? `checked=""` : ``}>
        <label class="trip-sort__btn  ${data.isChecked ? `trip-sort__btn--active` : ``} trip-sort__btn--by-increase" for="sort-${code}">
          ${data.name}
        </label>
      </div>
    `
  );
};
