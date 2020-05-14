import {FilterTypes} from "../components/filter.js";
import {getPointsByFilter} from "../utils/filter.js";

export default class Points {
  constructor() {
    this._points = [];
    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
    this._activeFilter = FilterTypes.EVERYTHING;
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  getPoints() {
    return getPointsByFilter(this._points, this._activeFilter);
  }

  getAllPoints() {
    return this._points;
  }

  setPoints(points) {
    this._points = points;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setActiveFilter(filterType) {
    this._activeFilter = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  updatePoint(pointId, newPoint) {
    const index = this._points.findIndex((it) => it.id === pointId);

    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), newPoint, this._points.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  removePoint(pointId) {
    const index = this._points.findIndex((it) => it.id === pointId);

    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), this._points.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  addPoint(newPoint) {
    this._points = [].concat(this._points, newPoint);
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }
}
