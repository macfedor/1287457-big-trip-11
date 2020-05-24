import AbstractComponent from "../components/abstract-component.js";
import EventComponent from "../components/event.js";
import EventEditComponent from "../components/event-edit.js";
import EventsListItemComponent from "../components/events-list-item.js";
import PointModel from "../models/point.js";
import {renderPosition, renderComponent, replace, remove} from "../utils/render.js";
import {formatDateRAW, ucFirst} from "../utils/common.js";

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`
};

const generateEmptyPoint = () => {
  return {
    id: String(new Date() + Math.random()),
    type: `taxi`,
    destination: {
      description: ``,
      name: ``,
      pictures: [],
    },
    dateStart: new Date(),
    dateEnd: new Date(),
    price: ``,
    isFavorite: false,
    offers: []
  };
};

export let EmptyPoint = generateEmptyPoint();

export default class PointController extends AbstractComponent {
  constructor(container, onDataChange, onViewChange) {
    super();
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this.mode = Mode.DEFAULT;
    this._eventComponent = null;
    this._eventEditComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._destination = null;
    this._offersList = null;
  }

  destroyNewEvent() {
    this.destroy();
    const newEventButton = document.querySelector(`.trip-main__event-add-btn`);
    newEventButton.disabled = false;
  }

  resetEmptyPoint() {
    EmptyPoint = generateEmptyPoint();
  }

  _openEventEdit() {
    this._onViewChange();
    this.mode = Mode.EDIT;
    replace(this._eventEditComponent, this._eventComponent);
  }

  _closeEventEdit() {
    if (this.mode === Mode.ADDING) {
      this.destroyNewEvent();
      this.resetEmptyPoint();
      return;
    }
    replace(this._eventComponent, this._eventEditComponent);
    this.mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this._closeEventEdit();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  setDefaultView() {
    if (this.mode !== Mode.DEFAULT) {
      this._closeEventEdit();
    }
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  parseFormData(formData) {
    const type = formData.get(`event-type`);
    const dataDateStart = formatDateRAW(formData.get(`event-start-time`));
    const dataDateEnd = formatDateRAW(formData.get(`event-end-time`));
    const offers = [];
    const typicalOffers = this._offersList.find((offer) => offer.type === type).offers;

    for (let key of formData.keys()) {
      if (key.indexOf(`event-offer-`) !== -1) {
        const offerName = ucFirst(key.split(`event-offer-`)[1].split(`_`).join(` `));
        const offerPrice = typicalOffers.find((offer) => offer.title.toLowerCase() === offerName.toLowerCase()).price;
        offers.push({title: offerName, price: offerPrice});
      }
    }

    return new PointModel({
      "type": type,
      "date_from": dataDateStart,
      "date_to": dataDateEnd,
      "base_price": formData.get(`event-price`),
      "destination": {
        name: this._destination.name,
        description: this._destination.description,
        pictures: this._destination.pictures,
      },
      "is_favorite": formData.get(`event-favorite`),
      "offers": offers,
    });
  }

  render(point, mode, destinations, offers) {

    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventComponent(point);
    this._eventEditComponent = new EventEditComponent(point, destinations, offers);

    this._destination = point.destination;
    this._offersList = offers;

    this._eventComponent.setOpenButtonClickHandler(() => {
      this._openEventEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setCloseButtonClickHandler(() => {
      this._closeEventEdit();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._eventEditComponent.getData();
      const data = this.parseFormData(formData);
      this._onDataChange(this, point, data);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      this.resetEmptyPoint();
    });

    this._eventEditComponent.setFavoriteButtonClickHandler(() => {
      const newPoint = PointModel.clone(point);
      newPoint.isFavorite = !newPoint.isFavorite;
      this._onDataChange(this, point, newPoint);
    });

    this._eventEditComponent.setDeleteButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, point, null);
      this._closeEventEdit();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEventEditComponent && oldEventComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._eventEditComponent, oldEventEditComponent);
        } else {
          const eventsListItemComponent = new EventsListItemComponent();
          renderComponent(this._container, eventsListItemComponent, renderPosition.BEFOREEND);
          renderComponent(eventsListItemComponent.getElement(), this._eventComponent, renderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        renderComponent(this._container, this._eventEditComponent, renderPosition.AFTEREND);
        document.addEventListener(`keydown`, this._onEscKeyDown);
        this.mode = Mode.ADDING;
        break;
    }

  }
}
