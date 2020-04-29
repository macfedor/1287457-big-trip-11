import {castFormat, getRandomArrayItem, getRandomIntegerNumber, getRandomDate} from "../utils/common.js";
import {MIN_PRICE, MAX_PRICE, MIN_SENTENCES, MAX_SENTENCES, MAX_DAYS_DIFF, MAX_EVENTS_DIFF, FIRST_DAY, DESCRIPTION_PARTS, CITIES, EVENT_TYPES, PHOTO_LINK, MAX_PHOTO_COUNT} from "../consts.js";

const generateDescription = () => {
  return new Array(getRandomIntegerNumber(MIN_SENTENCES, MAX_SENTENCES)).fill(``).map(() => getRandomArrayItem(DESCRIPTION_PARTS)).join(`. `);
};

const generateDates = () => {
  const lastDay = new Date();
  lastDay.setDate(FIRST_DAY.getDate() + getRandomIntegerNumber(0, MAX_DAYS_DIFF));

  const dateStart = getRandomDate(FIRST_DAY, lastDay);

  const maxDayEnd = new Date();
  maxDayEnd.setDate(dateStart.getDate() + getRandomIntegerNumber(0, MAX_EVENTS_DIFF));

  const dateEnd = getRandomDate(dateStart, maxDayEnd);
  if (dateEnd < dateStart) {
    dateEnd.setDate(dateStart.getDate() + 1); // костыль для рандомных тестовых данных - время окончания не должно быть меньше времени начала
    dateEnd.setMonth(dateStart.getMonth());
  }

  const getDuration = (start, end) => {
    let diff = Math.ceil((end.getTime() - start.getTime()) / 60000);
    const days = Math.floor(diff / (60 * 24));
    if (days > 0) {
      diff -= days * 60 * 24;
    }
    const hours = Math.floor(diff / 60);
    if (hours > 0) {
      diff -= hours * 60;
    }
    return `${days ? `${castFormat(days)}D` : ``} ${hours ? `${castFormat(hours)}H` : ``} ${diff ? `${castFormat(diff)}M` : ``}`;
  };

  return {
    dateStart,
    dateEnd,
    duration: getDuration(dateStart, dateEnd)
  };
};

const generatePhoto = () => {
  return PHOTO_LINK + Math.random();
};

const generatePhotos = (count) => {
  return new Array(count).fill(``).map(generatePhoto);
};

const generateEvent = () => {
  const dates = generateDates();

  return {
    description: generateDescription(),
    type: getRandomArrayItem(EVENT_TYPES),
    city: getRandomArrayItem(CITIES),
    dateStart: dates.dateStart,
    dateEnd: dates.dateEnd,
    duration: dates.duration,
    price: getRandomIntegerNumber(MIN_PRICE, MAX_PRICE),
    photos: generatePhotos(getRandomIntegerNumber(1, MAX_PHOTO_COUNT))
  };
};

export const generateEvents = (count) => {
  return new Array(count).fill(``).map(generateEvent);
};
