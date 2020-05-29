import AbstractComponent from "./abstract-component.js";
import {SortType} from "../consts.js";
import {statisticsComponent, tripController} from "../main.js";

const ACTIVE_CLASS = `trip-tabs__btn--active`;

export const MenuItems = {
  TABLE: `Table`,
  STATS: `Stats`,
};

const createMenuItem = (item, index) => {
  return (
    `<a data-name="${item}" class="trip-tabs__btn ${index === 0 ? `trip-tabs__btn--active` : ``}" href="#">${item}</a>`
  );
};

const createMenuTemplate = (menuItems) => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${Object.values(menuItems).map((menuItem, index) => createMenuItem(menuItem, index)).join(``)}
    </nav>`
  );
};

export default class Menu extends AbstractComponent {
  constructor(menuItems) {
    super();
    this._items = menuItems;
  }

  getTemplate() {
    return createMenuTemplate(this._items);
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      handler(evt.target);
    });
  }

  setActiveItem(item) {
    this.getElement().querySelector(`.${ACTIVE_CLASS}`).classList.remove(ACTIVE_CLASS);
    item.classList.add(ACTIVE_CLASS);
  }

  toggleScreen(currentScreen) {
    switch (currentScreen) {
      case MenuItems.TABLE:
        statisticsComponent.hide();
        tripController.show();
        tripController.sort(SortType.EVENT);
        break;
      case MenuItems.STATS:
        statisticsComponent.show();
        tripController.hide();
        break;
    }
  }
}
