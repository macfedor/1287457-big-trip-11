import {getRandomArrayItem, getRandomIntegerNumber, getRandomDate} from "../utils/common.js";
import {MIN_PRICE, MAX_PRICE, MAX_DAYS_DIFF, MAX_EVENTS_DIFF, FIRST_DAY, DESTINATIONS, EVENT_TYPES} from "../consts.js";

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

  dateStart.setSeconds(0, 0); // еще немного костылей
  dateEnd.setSeconds(0, 0);

  return {
    dateStart,
    dateEnd
  };
};

const generateEvent = () => {
  const dates = generateDates();
  return {
    id: String(new Date() + Math.random()),
    type: getRandomArrayItem(EVENT_TYPES),
    destination: getRandomArrayItem(DESTINATIONS),
    dateStart: dates.dateStart,
    dateEnd: dates.dateEnd,
    price: getRandomIntegerNumber(MIN_PRICE, MAX_PRICE),
    isFavorite: getRandomIntegerNumber(0, 1)
  };
};

export const generateEvents = (count) => {
  return new Array(count).fill(``).map(generateEvent);
};
