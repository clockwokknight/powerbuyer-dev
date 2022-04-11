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
    id: "pp",
    label: "Purchase Price",
    value: JSON.stringify({
      fields: "pp",
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
    id: "make",
    label: "Vehicle Make",
    value: JSON.stringify({
      fields: "make",
      filter_type: "select",
    }),
  },
  {
    id: "model",
    label: "Vehicle Model",
    depends: ["make"],
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
