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

export const EVENT_TYPES = [
  {
    name: `Taxi`,
    type: `taxi`,
    action: `to`,
    icon: `taxi.png`,
    offers: [
      {
        name: `Order Uber`,
        price: `35`,
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      }
    ]
  },
  {
    name: `Bus`,
    type: `bus`,
    action: `to`,
    icon: `bus.png`,
    offers: [
      {
        name: `Offer2`,
        price: `35`,
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer3`,
        price: `35`,
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer4`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer5`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      }
    ]
  },
  {
    name: `Train`,
    type: `train`,
    action: `to`,
    icon: `train.png`,
    offers: [
      {
        name: `Order Uber`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer2`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      }
    ]
  },
  {
    name: `Ship`,
    type: `ship`,
    action: `to`,
    icon: `ship.png`,
    offers: [
      {
        name: `Order Uber`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer2`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer3`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer4`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer5`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      }
    ]
  },
  {
    name: `Transport`,
    type: `transport`,
    action: `to`,
    icon: `transport.png`,
    offers: [
      {
        name: `Order Uber`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer2`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer3`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer4`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      }
    ]
  },
  {
    name: `Drive`,
    type: `drive`,
    action: `to`,
    icon: `drive.png`,
  },
  {
    name: `Flight`,
    type: `flight`,
    action: `to`,
    icon: `flight.png`,
    offers: [
      {
        name: `Order Uber`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer2`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer3`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer4`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer5`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      }
    ]
  },
  {
    name: `Check-in`,
    type: `check-in`,
    icon: `check-in.png`,
    action: `in`,
    offers: [
      {
        name: `Order Uber`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer2`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer3`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer4`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer5`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      }
    ]
  },
  {
    name: `Sightseeing`,
    type: `sightseeing`,
    icon: `sightseeing.png`,
    action: `in`,
    offers: [
      {
        name: `Order Uber`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer2`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer3`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer4`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer5`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      }
    ]
  },
  {
    name: `Restaurant`,
    type: `restaurant`,
    icon: `restaurant.png`,
    action: `in`,
    offers: [
      {
        name: `Order Uber`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer2`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer3`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer4`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      },
      {
        name: `Offer5`,
        price: Math.round(getRandomIntegerNumber(10, 100)),
        isChecked: Math.round(getRandomIntegerNumber(0, 1))
      }
    ]
  }
];

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
