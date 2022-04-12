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
];
