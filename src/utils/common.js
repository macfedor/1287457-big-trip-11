import moment from "moment";
import {SortType} from "../consts.js";

export const castFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  return moment(date).format(`HH:mm`);
};

export const formatDate = (date) => {
  return moment(date).format(`yyyy-MM-DDT${formatTime(date)}`);
};

export const formatDateDefault = (date, formatString) => {
  return moment(date, formatString).format();
};

export const formatDateRAW = (date) => {
  const [dateDate, dateTime] = date.split(` `);
  const [dateDay, dateMonth, dateYearShort] = dateDate.split(`/`);
  return `20${dateYearShort}-${dateMonth}-${dateDay}T${dateTime}`;
};

export const formatText = (string) => {
  return string.toLowerCase().replace(/(\,|')/g, ``);
};

export const sortObjectByValues = (obj) => {
  return Object.fromEntries(Object.entries(obj).sort(function (a, b) {
    return b[1] - a[1];
  }));
};

export const uppercaseFirstLetter = (string) => {
  return string[0].toUpperCase() + string.slice(1);
};

export const getSortedEvents = (events, type) => {
  let sortedEvents = [];
  const preSortedEvents = events.slice();

  switch (type) {
    case SortType.TIME:
      sortedEvents = preSortedEvents.sort((a, b) => (b.dateEnd.getTime() - b.dateStart.getTime()) - (a.dateEnd.getTime() - a.dateStart.getTime()));
      break;
    case SortType.PRICE:
      sortedEvents = preSortedEvents.sort((a, b) => b.price - a.price);
      break;
    case SortType.EVENT:
      sortedEvents = preSortedEvents.sort((a, b) => a.dateStart.getTime() - b.dateStart.getTime());
      break;
  }

  return sortedEvents;
};

export const generateRandomId = () => {
  return String(Math.random()).replace(`.`, ``);
};
