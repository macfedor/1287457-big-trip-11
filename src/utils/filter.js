import {FilterTypes} from "../components/filter.js";

const getFuturePoints = (points) => {
  return points.filter((point) => point.dateStart > new Date());
};

const getPastPoints = (points) => {
  return points.filter((point) => point.dateEnd < new Date());
};

export const getPointsByFilter = (points, filterType) => {
  let result = ``;
  switch (filterType) {
    case FilterTypes.PAST:
      result = getPastPoints(points);
      break;
    case FilterTypes.FUTURE:
      result = getFuturePoints(points);
      break;
    case FilterTypes.EVERYTHING:
      result = points;
      break;
  }
  return result;
};
