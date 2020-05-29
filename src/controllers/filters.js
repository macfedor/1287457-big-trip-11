import AbstractComponent from "../components/abstract-component.js";
import FilterComponent, {FilterTypes} from "../components/filter.js";
import {renderPosition, renderComponent, remove} from "../utils/render.js";
import {getFuturePoints, getPastPoints} from "../utils/filter.js";

export default class FiltersController extends AbstractComponent {
  constructor(container, pointsModel) {
    super();
    this._pointsModel = pointsModel;
    this._container = container;
    this._filterComponent = null;
    this._activeFilterType = FilterTypes.EVERYTHING;
    this.onFilterChange = this.onFilterChange.bind(this);
  }

  rerender() {
    remove(this._filterComponent);
    this.render();
  }

  _getFilterData() {
    const filterData = {};
    const activeFilter = this._pointsModel.getActiveFilter();
    if (activeFilter !== FilterTypes.EVERYTHING) {
      this._pointsModel.setActiveFilter(FilterTypes.EVERYTHING);
    }
    const points = this._pointsModel.getPoints();
    filterData[FilterTypes.EVERYTHING] = points.length;
    filterData[FilterTypes.FUTURE] = getFuturePoints(points).length;
    filterData[FilterTypes.PAST] = getPastPoints(points).length;

    return filterData;
  }

  render() {
    const filterData = this._getFilterData();
    if (!filterData[this._activeFilterType]) {
      this._activeFilterType = FilterTypes.EVERYTHING;
      this._pointsModel.setActiveFilter(FilterTypes.EVERYTHING);
    } else {
      this._pointsModel.setActiveFilter(this._activeFilterType);
    }

    const filters = Object.values(FilterTypes).map((filterType) => {
      return {
        name: filterType,
        isChecked: filterType === this._activeFilterType,
        isDisabled: !filterData[filterType]
      };
    });

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this.onFilterChange);
    renderComponent(this._container, this._filterComponent, renderPosition.BEFOREEND);
  }

  onFilterChange(filterType) {
    this._activeFilterType = filterType;
    this._pointsModel.setActiveFilter(filterType);
    document.querySelector(`#filter-${filterType}`).checked = true;
  }
}
