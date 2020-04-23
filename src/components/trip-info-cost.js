export const createTripInfoCostTemplate = (data) => {
  let total = 0;
  data.forEach((item) => {
    total += item.price;
    if (item.type.offers) { // пока мы берем офферы из типов событий. как приедут настоящие данные перепишем эту часть (т.к. пока хз, как там все организовано, то почему бы пока не сделать так?)
      item.type.offers.forEach((offer) => {
        total += +offer.price;
      });
    }
  });
  return (
    `
      <p class="trip-info__cost">
        Total: €&nbsp;<span class="trip-info__cost-value">${total}</span>
      </p>
    `
  );
};
