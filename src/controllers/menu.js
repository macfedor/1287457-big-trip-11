import AbstractComponent from "../components/abstract-component.js";
import MenuComponent, {MenuItems} from "../components/menu.js";
import {renderPosition, renderComponent} from "../utils/render.js";

export default class MenuController extends AbstractComponent {
  constructor(container) {
    super();
    this._container = container;
    this._menuComponent = null;
    this._onMenuChange = this._onMenuChange.bind(this);
  }

  render() {
    this._menuComponent = new MenuComponent(MenuItems);
    this._menuComponent.setClickHandler(this._onMenuChange);
    renderComponent(this._container, this._menuComponent, renderPosition.AFTEREND);
  }

  _onMenuChange(item) {
    this._menuComponent.setActiveItem(item);
    this._menuComponent.toggleScreen(item.dataset.name);
  }

}
