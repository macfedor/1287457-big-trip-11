export const castFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hours = castFormat(date.getHours());
  const minutes = castFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = castFormat(date.getMonth() + 1);
  const day = castFormat(date.getDate());
  return `${year}-${month}-${day}T${formatTime(date)}`;
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

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const renderPosition = {
  AFTERBEGIN: `afterBegin`,
  BEFOREEND: `beforeEnd`,
  AFTEREND: `afterEnd`
};

export const render = (container, element, place) => {
  switch (place) {
    case renderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case renderPosition.BEFOREEND:
      container.append(element);
      break;
    case renderPosition.AFTEREND:
      if (container.nextSibling) {
        container.parentNode.insertBefore(element, container.nextSibling);
      } else {
        container.parentNode.append(element);
      }
      break;
  }
};
