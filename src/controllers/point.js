import AbstractComponent from "../components/abstract-component.js";
import EventComponent from "../components/event.js";
import EventEditComponent from "../components/event-edit.js";
import EventsListItemComponent from "../components/events-list-item.js";
import {renderPosition, renderComponent, replace, remove} from "../utils/render.js";

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`
};

export let EmptyPoint = {
  id: String(new Date() + Math.random()),
  type: {// переделать когда появятся реальные данные, оставить только название типа
    name: `Taxi`,
    type: `taxi`,
    action: `to`,
    icon: `taxi.png`
  },
  destination: {
    description: ``,
    name: ``,
  },
  dateStart: new Date(),
  dateEnd: new Date(),
  price: ``,
  isFavorite: false
};

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
  }

  destroyNewEvent() {
    this.destroy();
    const newEventButton = document.querySelector(`.trip-main__event-add-btn`);
    newEventButton.disabled = false;
  }

  resetEmptyPoint() {
    EmptyPoint = {
      id: String(new Date() + Math.random()),
      type: {// переделать когда появятся реальные данные, оставить только название типа
        name: `Taxi`,
        type: `taxi`,
        action: `to`,
        icon: `taxi.png`
      },
      destination: {
        description: ``,
        name: ``,
      },
      dateStart: new Date(),
      dateEnd: new Date(),
      price: ``,
      isFavorite: false
    };
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

  render(point, mode) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventComponent(point);
    this._eventEditComponent = new EventEditComponent(point);

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
      const data = this._eventEditComponent.getData();
      const modifiedPoint = Object.assign({}, point, data);
      this._onDataChange(this, point, modifiedPoint); // тут перетираются значения в destination и offer. надо посмотреть, в каком виде данные будут поступать от сервера и тогда разобраться с этой частью
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      this.resetEmptyPoint();
    });

    this._eventEditComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, point, Object.assign({}, point, {
        isFavorite: !point.isFavorite,
      }));
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
