function allocate(_sales, _purchases) {
  const sales = structureData(_sales, "created");
  const purchases = structureData(_purchases, "receiving");
  const LAST_PURCHASE_INDEX = purchases.length - 1;

  let stock = 0; // in real life, maybe this should be an input as well since it might not always start from 0?
  let availabilityDate = sales[0].date; // timestamp of stock availability, initialized to first sale timestamp
  let availabilityDateString = sales[0].created; // date in string format of stock availability, initialized to first sale created date

  let purchaseIndex = 0; // index of the next purchase to process

  const result = [];

  for (let sale of sales) {
    // As long as we don't have enough stock, process the next purchase if there is any
    while (stock < sale.quantity && purchaseIndex <= LAST_PURCHASE_INDEX) {
      const purchase = purchases[purchaseIndex];
      stock += purchase.quantity;
      availabilityDate = purchase.date;
      availabilityDateString = purchase.receiving;
      purchaseIndex++;
    }

    if (stock >= sale.quantity) {
      // we have enough stock and push the availability date
      result.push({
        id: sale.id,
        availabilityDate:
          availabilityDate > sale.date ? availabilityDateString : sale.created, // It could be simplified to availabilityDate if it's ok to have an availabilityDate before the sales creation
      });
      stock -= sale.quantity;
      //THIS would be used to return orders that will not be satisfied anytime soon. If we need it.
      // } else {
      //   result.push({
      //     id: sale.id,
      //     availabilityDateString: "Not anytime soon, need more purchases",
      //   });
    }
  }

  return result;
}

// utils to sort orders and add a date timesteamp for easier date comparison
function structureData(orders, dateField) {
  return orders
    .map((order) => ({ ...order, date: new Date(order[dateField]).getTime() }))
    .sort((o1, o2) => o1.date - o2.date);
}

module.exports = allocate;
