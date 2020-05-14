import AbstractComponent from "../components/abstract-component.js";
import FilterComponent, {FilterTypes} from "../components/filter.js";
import {renderPosition, renderComponent} from "../utils/render.js";

export default class FiltersController extends AbstractComponent {
  constructor(container, pointsModel) {
    super();
    this._pointsModel = pointsModel;
    this._container = container;
    this._filterComponent = null;
    this._activeFilterType = FilterTypes.EVERYTHING;
    this._onDataChange = this._onDataChange.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
  }

  render() {
    const filters = Object.values(FilterTypes).map((filterType) => {
      return {
        name: filterType,
        isChecked: filterType === this._activeFilterType,
      };
    });

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this.onFilterChange);
    renderComponent(this._container, this._filterComponent, renderPosition.BEFOREEND);
  }

  _onDataChange() {
    this.render();
  }

  onFilterChange(filterType) {
    this._activeFilterType = filterType;
    this._pointsModel.setActiveFilter(filterType);
    document.querySelector(`#filter-${filterType}`).checked = true;
  }
}
