import {getRandomIntegerNumber, getRandomArrayItem} from "./utils/common.js";

export const MIN_PRICE = 10;

export const MAX_PRICE = 1000;

export const MIN_SENTENCES = 1; // минимум предложений в описании

export const MAX_SENTENCES = 5; // максимум предложений в описании

export const MAX_DAYS_DIFF = 5; // максимальный разброс дат для events

export const MAX_EVENTS_DIFF = 2; // максимальный разброс дат между началом и окончанием event

export const FIRST_DAY = new Date();

const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

export const DESCRIPTION_PARTS = DESCRIPTION.split(`. `);

export const MAX_OFFERS_COUNT = 3; // максимум допопций в списке

export const MONTH_SHORT_NAMES = [
  `JAN`,
  `FEB`,
  `MAR`,
  `APR`,
  `MAY`,
  `JUN`,
  `JUL`,
  `AUG`,
  `SEP`,
  `OCT`,
  `NOV`,
  `DEC`
];

export const TRIP_POINTS_TYPES = {
  'taxi': {
    type: `taxi`,
    icon: `taxi.png`,
    action: `to`,
  },
  'bus': {
    type: `bus`,
    icon: `bus.png`,
    action: `to`,
  },
  'train': {
    type: `train`,
    icon: `train.png`,
    action: `to`,
  },
  'ship': {
    type: `ship`,
    icon: `ship.png`,
    action: `to`,
  },
  'transport': {
    type: `transport`,
    icon: `transport.png`,
    action: `to`,
  },
  'drive': {
    type: `drive`,
    icon: `drive.png`,
    action: `to`,
  },
  'flight': {
    type: `flight`,
    icon: `flight.png`,
    action: `to`,
  },
  'check-in': {
    type: `check-in`,
    icon: `check-in.png`,
    action: `in`,
  },
  'sightseeing': {
    type: `sightseeing`,
    icon: `sightseeing.png`,
    action: `in`,
  },
  'restaurant': {
    type: `restaurant`,
    icon: `restaurant.png`,
    action: `in`,
  },
};

export const PHOTO_LINK = `http://picsum.photos/248/152?r=`;

export const MAX_PHOTO_COUNT = 5;

const generateDescription = () => {
  return new Array(getRandomIntegerNumber(MIN_SENTENCES, MAX_SENTENCES)).fill(``).map(() => getRandomArrayItem(DESCRIPTION_PARTS)).join(`. `);
};

const generatePhoto = () => {
  return {
    src: PHOTO_LINK + Math.random(),
    description: generateDescription()
  };
};

const generatePhotos = (count) => {
  return new Array(count).fill(``).map(generatePhoto);
};

export const DESTINATIONS = [
  {
    description: generateDescription(),
    name: `Chamonix`,
    pictures: generatePhotos(getRandomIntegerNumber(1, MAX_PHOTO_COUNT))
  },
  {
    description: generateDescription(),
    name: `Amsterdam`,
    pictures: generatePhotos(getRandomIntegerNumber(1, MAX_PHOTO_COUNT))
  },
  {
    description: generateDescription(),
    name: `Geneva`,
    pictures: generatePhotos(getRandomIntegerNumber(1, MAX_PHOTO_COUNT))
  },
  {
    description: generateDescription(),
    name: `Moscow`,
    pictures: generatePhotos(getRandomIntegerNumber(1, MAX_PHOTO_COUNT))
  },
  {
    description: generateDescription(),
    name: `Stambul`,
    pictures: generatePhotos(getRandomIntegerNumber(1, MAX_PHOTO_COUNT))
  },
  {
    description: generateDescription(),
    name: `Omsk`,
    pictures: generatePhotos(getRandomIntegerNumber(1, MAX_PHOTO_COUNT))
  },
  {
    description: generateDescription(),
    name: `Tbilisi`,
    pictures: generatePhotos(getRandomIntegerNumber(1, MAX_PHOTO_COUNT))
  },
];
