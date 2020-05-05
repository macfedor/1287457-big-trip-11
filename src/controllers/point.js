import AbstractComponent from "../components/abstract-component.js";
import EventComponent from "../components/event.js";
import EventEditComponent from "../components/event-edit.js";
import {renderPosition, renderComponent, replace} from "../utils/render.js";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class PointController extends AbstractComponent {
  constructor(container, onDataChange, onViewChange) {
    super();
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._eventComponent = null;
    this._eventEditComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  _openEventEdit() {
    this._onViewChange();
    this._mode = Mode.EDIT;
    replace(this._eventEditComponent, this._eventComponent);
  }

  _closeEventEdit() {
    replace(this._eventComponent, this._eventEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this._closeEventEdit();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeEventEdit();
    }
  }

  render(point) {
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
      this._closeEventEdit();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, point, Object.assign({}, point, {
        isFavorite: !point.isFavorite,
      }));
    });

    if (oldEventEditComponent && oldEventComponent) {
      replace(this._eventComponent, oldEventComponent);
      replace(this._eventEditComponent, oldEventEditComponent);
    } else {
      renderComponent(this._container, this._eventComponent, renderPosition.BEFOREEND);
    }
  }
}
