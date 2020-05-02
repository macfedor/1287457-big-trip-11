import AbstractComponent from "./abstract-component.js";

const createEventsListTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class EventsList extends AbstractComponent {
  getTemplate() {
    return createEventsListTemplate();
  }
}
