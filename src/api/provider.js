import Point from "../models/point.js";
import {generateRandomId} from "../utils/common.js";

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store, storeOffers, storeDestinations) {
    this._api = api;
    this._store = store;
    this._storeOffers = storeOffers;
    this._storeDestinations = storeDestinations;
  }

  _isOnline() {
    return window.navigator.onLine;
  }

  getPoints() {
    if (this._isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = createStoreStructure(points.map((point) => point.toRAW()));

          this._store.setItems(items);
          return points;
        });
    }

    const storePoints = Object.values(this._store.getItems());
    return Promise.resolve(Point.parsePoints(storePoints));
  }

  getOffers() {
    if (this._isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._storeOffers.setItems(offers);
          return offers;
        });
    }
    const storeOffers = Object.values(this._storeOffers.getItems());
    return Promise.resolve(storeOffers);
  }

  getDestinations() {
    if (this._isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._storeDestinations.setItems(destinations);
          return destinations;
        });
    }
    const storeDestinations = Object.values(this._storeDestinations.getItems());
    return Promise.resolve(storeDestinations);
  }

  updatePoint(id, data) {
    if (this._isOnline()) {
      return this._api.updatePoint(id, data)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, newPoint.toRAW());

          return newPoint;
        });
    }

    const localPoint = Point.clone(Object.assign(data, {id}));
    this._store.setItem(id, localPoint.toRAW());

    return Promise.resolve(localPoint);
  }

  createPoint(point) {
    if (this._isOnline()) {
      return this._api.createPoint(point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, newPoint.toRAW());

          return newPoint;
        });
    }

    const localNewPoint = Point.clone(Object.assign(point, {id: generateRandomId()}));
    this._store.setItem(localNewPoint.id, localNewPoint.toRAW());

    return Promise.resolve(localNewPoint);
  }

  deletePoint(id) {
    if (this._isOnline()) {
      return this._api.deletePoint(id)
        .then(() => this._store.removeItem(id));
    }

    this._store.removeItem(id);
    return Promise.resolve();
  }

  sync() {
    if (this._isOnline()) {
      const storePoints = Object.values(this._store.getItems());

      return this._api.sync(storePoints)
        .then((response) => {
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          const actualPoints = createStoreStructure([...createdPoints, ...updatedPoints]);

          this._store.setItems(actualPoints);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
