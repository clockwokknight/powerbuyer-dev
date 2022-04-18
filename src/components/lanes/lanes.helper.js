export const allFilterPossibleOptions = [
  // {
  //   label: "Date Of Purchase",
  //   value: JSON.stringify({ filter_type: "dop", input_type: "date_picker" }),
  // },
  {
    id: "dop_from,dop_to",
    label: "Date Of Purchase (Range)",
    value: JSON.stringify({
      fields: "dop_from,dop_to",
      filter_type: "date_picker_range",
    }),
  },
  {
    id: "purchase_price",
    label: "Purchase Price",
    value: JSON.stringify({
      fields: "purchase_price",
      filter_type: "input_range",
    }),
  },
  {
    id: "sale_price",
    label: "Sale Price",
    value: JSON.stringify({
      fields: "sale_price",
      filter_type: "input_range",
    }),
  },
  {
    id: "trade_in_price",
    label: "Trade In Price",
    value: JSON.stringify({
      fields: "trade_in_price",
      filter_type: "input_range",
    }),
  },
  {
    id: "market_ready",
    label: "Market Ready",
    value: JSON.stringify({
      fields: "market_ready",
      filter_type: "input_range",
    }),
  },
  {
    id: "color",
    label: "Vehicle Color",
    value: JSON.stringify({
      fields: "color",
      filter_type: "select",
    }),
  },
  {
    id: "gmtv_location_id",
    label: "GMTV Location",
    value: JSON.stringify({
      fields: "gmtv_location_id",
      filter_type: "select",
    }),
  },
  {
    id: "auction_id",
    label: "Auction Location",
    value: JSON.stringify({
      fields: "auction_id",
      filter_type: "select",
    }),
  },
  {
    id: "mileage",
    label: "Vehicle Mileage",
    value: JSON.stringify({
      fields: "mileage",
      filter_type: "input_range",
    }),
  },
  {
    id: "grade",
    label: "Grade",
    value: JSON.stringify({
      fields: "grade",
      filter_type: "input",
    }),
  },
  {
    id: "auto_check",
    label: "Auto Check",
    value: JSON.stringify({
      fields: "auto_check",
      filter_type: "input",
    }),
  },
  {
    id: "carfax",
    label: "Carfax",
    value: JSON.stringify({
      fields: "carfax",
      filter_type: "input",
    }),
  },
  {
    id: "make_id",
    label: "Vehicle Make",
    value: JSON.stringify({
      fields: "make_id",
      filter_type: "select",
    }),
  },
  {
    id: "model",
    label: "Vehicle Model",
    depends: ["make_id"],
    value: JSON.stringify({
      fields: "model",
      filter_type: "select",
    }),
  },
  {
    id: "year",
    label: "Vehicle Year (Range)",
    value: JSON.stringify({
      fields: "year",
      filter_type: "input_range",
    }),
  },
  {
    id: "order_by",
    label: "Sort By",
    value: JSON.stringify({
      fields: "order_by",
      filter_type: "select",
    }),
  },
];

export const sortOptions = [
  {
    label: "Mileage",
    value: "deal.mileage",
  },
  {
    label: "Vehicle Model",
    value: "vehicle_model.name",
  },
  {
    label: "Vehicle Make",
    value: "vehicle_make.name",
  },
  {
    label: "Purchase Price",
    value: "deal.purchase_price",
  },
];