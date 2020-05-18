import moment from "moment";

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

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length - 1);
  return array[randomIndex];
};

export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min + 1));
};

export const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const compareDates = (a, b) => {
  return a.dateStart.getTime() - b.dateStart.getTime();
};

export const sortObjectByValues = (obj) => {
  return Object.fromEntries(Object.entries(obj).sort(function (a, b) {
    return b[1] - a[1];
  }));
};
