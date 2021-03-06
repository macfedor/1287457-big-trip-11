import AbstractComponent from "../components/abstract-component.js";
import EventComponent from "../components/event.js";
import EventEditComponent from "../components/event-edit.js";
import EventsListItemComponent from "../components/events-list-item.js";
import PointModel from "../models/point.js";
import {renderPosition, renderComponent, replace, remove} from "../utils/render.js";
import {formatDateRAW, formatText} from "../utils/common.js";
import {ButtonText, KeyName} from "../consts.js";

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`
};

const SHAKE_ANIMATION_TIMEOUT = 600;
const SHAKE_ANIMATION_STYLE = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
const ERROR_BORDER_STYLE = `1px solid #ff0000`;

const generateEmptyPoint = () => {
  return {
    type: `bus`,
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

export let emptyPoint = generateEmptyPoint();

export default class PointController extends AbstractComponent {
  constructor(container, onDataChange, onViewChange, onClose) {
    super();
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onClose = onClose;
    this.mode = Mode.DEFAULT;
    this._eventComponent = null;
    this._eventEditComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._destinationsList = null;
    this._offersList = null;
  }

  destroyNewEvent() {
    this.destroy();
    const newEventButton = document.querySelector(`.trip-main__event-add-btn`);
    newEventButton.disabled = false;
  }

  resetEmptyPoint() {
    emptyPoint = generateEmptyPoint();
  }

  _openEventEdit() {
    this._eventEditComponent.saveInnerBackup();
    this._onViewChange();
    this.mode = Mode.EDIT;
    replace(this._eventEditComponent, this._eventComponent);
  }

  _closeEventEdit() {
    if (this.mode === Mode.ADDING) {
      this.destroyNewEvent();
      this.resetEmptyPoint();
      this._onClose();
      return;
    }
    this._eventEditComponent.restoreInnerBackup();
    this._eventEditComponent.recoveryListeners();
    replace(this._eventComponent, this._eventEditComponent);
    this.mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === KeyName.ESCAPE || evt.key === KeyName.ESC;
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

  blockElement() {
    const formElements = this._eventEditComponent.getElement().querySelectorAll(`input, button, textarea, fieldset`);
    formElements.forEach((item) => {
      item.disabled = true;
    });
  }

  unblockElement() {
    const formElements = this._eventEditComponent.getElement().querySelectorAll(`input, button, textarea, fieldset`);
    formElements.forEach((item) => {
      item.disabled = false;
    });
  }

  parseFormData(formData) {
    const type = formData.get(`event-type`);
    const dataDateStart = formatDateRAW(formData.get(`event-start-time`));
    const dataDateEnd = formatDateRAW(formData.get(`event-end-time`));
    const offers = [];
    const typicalOffers = this._offersList.find((offer) => offer.type === type).offers;

    for (const key of formData.keys()) {
      if (key.indexOf(`event-offer-`) !== -1) {
        const currentOffer = typicalOffers.find((offer) => formatText(offer.title) === formatText(key.split(`event-offer-`)[1].split(`_`).join(` `)));
        offers.push({title: currentOffer.title, price: currentOffer.price});
      }
    }

    const currentDestination = this._destinationsList.find((destination) => destination.name === formData.get(`event-destination`));

    return new PointModel({
      "type": type,
      "date_from": dataDateStart,
      "date_to": dataDateEnd,
      "base_price": formData.get(`event-price`),
      "destination": {
        name: currentDestination.name,
        description: currentDestination.description,
        pictures: currentDestination.pictures,
      },
      "is_favorite": formData.get(`event-favorite`),
      "offers": offers,
    });
  }

  shake() {
    this._eventEditComponent.getElement().style.animation = SHAKE_ANIMATION_STYLE;
    this._eventComponent.getElement().style.animation = SHAKE_ANIMATION_STYLE;

    setTimeout(() => {
      this._eventEditComponent.getElement().style.animation = ``;
      this._eventComponent.getElement().style.animation = ``;

      this._eventEditComponent.setData({
        SAVE_BUTTON_TEXT: ButtonText.SAVE,
        DELETE_BUTTON_TEXT: ButtonText.DELETE,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  setErrorStyle() {
    this._eventEditComponent.getElement().style.border = ERROR_BORDER_STYLE;
  }

  deleteErrorStyle() {
    this._eventEditComponent.getElement().style.border = ``;
  }

  render(point, mode, destinations, offers) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventComponent(point);
    this._eventEditComponent = new EventEditComponent(point, destinations, offers);

    this._destinationsList = destinations;
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
      this._eventEditComponent.setData({
        SAVE_BUTTON_TEXT: ButtonText.SAVING,
      });
      const formData = this._eventEditComponent.getData();
      const data = this.parseFormData(formData);
      this._onDataChange(this, point, data);
      this.resetEmptyPoint();
    });

    this._eventEditComponent.setDeleteButtonClickHandler((evt) => {
      evt.preventDefault();
      if (this.mode === Mode.ADDING) {
        this.destroyNewEvent();
        this.resetEmptyPoint();
        this._onClose();
        return;
      }
      this._eventEditComponent.setData({
        DELETE_BUTTON_TEXT: ButtonText.DELETING,
      });
      this._onDataChange(this, point, null);
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
