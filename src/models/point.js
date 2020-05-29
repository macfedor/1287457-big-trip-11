export default class Point {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.price = data[`base_price`];
    this.dateStart = new Date(data[`date_from`]);
    this.dateEnd = new Date(data[`date_to`]);
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.destination = data[`destination`];
    this.offers = data[`offers`];
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  toRAW() {
    return {
      "id": this.id,
      "type": this.type,
      "base_price": Number(this.price),
      "date_from": this.dateStart,
      "date_to": this.dateEnd,
      "is_favorite": this.isFavorite,
      "destination": this.destination,
      "offers": this.offers
    };
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}
