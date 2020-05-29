import AbstractComponent from "./abstract-component.js";

const createEventsListItemTemplate = () => {
  return (
    `<li class="trip-events__item"></li>`
  );
};

export default class EventsListItem extends AbstractComponent {
  getTemplate() {
    return createEventsListItemTemplate();
  }
}
