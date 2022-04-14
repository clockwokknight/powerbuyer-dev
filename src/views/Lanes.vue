<script setup>
import { getAllLanes } from "@/hooks/lanes";
import { NInput } from "naive-ui";
import { computed, defineComponent, h, nextTick, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useQueryClient } from "vue-query";
import axios from "axios";
import Filter from "@/components/lanes/Filter.vue";

const route = useRoute();
const queryClient = useQueryClient();
const filter = ref({
  page: 1,
  per_page: 20,
});
const { data: lanes, isLoading: isLanesLoading } = getAllLanes(filter);
const pagination = computed(() => ({
  pageSize: filter.value.per_page,
  page: filter.value.page,
  itemCount: lanes.value?.total ?? 1,
  pageCount: lanes.value?.last_page ?? 1,
}));

const sortStatesRef = ref([]);
const sortKeyMapOrderRef = computed(() =>
  sortStatesRef.value.reduce((result, { columnKey, order }) => {
    result[columnKey] = order;
    return result;
  }, {})
);

const ShowOrEdit = defineComponent({
  props: {
    value: [String, Number],
    onUpdateValue: [Function, Array],
    inputType: {
      type: String,
      default: "text",
    },
  },
  setup(props) {
    const isEdit = ref(false);
    const inputRef = ref(null);
    const inputValue = ref(props.value);
    function handleOnClick() {
      console.log("clicking");
      isEdit.value = true;
      nextTick(() => {
        inputRef.value.focus();
      });
    }
    function handleChange() {
      props.onUpdateValue(inputValue.value);
      isEdit.value = false;
    }
    return () =>
      h(
        "div",
        {
          onClick: handleOnClick,
        },
        isEdit.value
          ? h(NInput, {
              type: props.inputType,
              ref: inputRef,
              value: inputValue.value,
              onUpdateValue: (v) => {
                inputValue.value = v;
              },
              onChange: handleChange,
              onBlur: handleChange,
            })
          : props.value
          ? props.value
          : h("span", { style: "padding: 10px 20px" })
      );
  },
});

const columns = computed(() => [
  {
    title: "Lane #",
    key: "lane_number",
    fixed: "left",
    width: 100,
    render(row) {
      return h(ShowOrEdit, {
        value: String(row.lane_number),
        onUpdateValue: async (val) => {
          if (parseInt(val) !== row.lane_number) {
            await axios.put("/lanes/" + row.id, { lane_number: val });
            await queryClient.invalidateQueries(["lanes"]);
          }
        },
      });
    },
    // sortOrder: sortKeyMapOrderRef.value.lane_number || false,
    // sorter: {
    //   compare: (a, b) => a.lane_number - b.lane_number,
    //   multiple: 1,
    // },
  },
  {
    title: "Notes",
    key: "deal.notes",
    ellipsis: {
      tooltip: true,
    },
    width: 300,
    render(row) {
      return h(ShowOrEdit, {
        value: row["deal.notes"] ?? "",
        inputType: "textarea",
        onUpdateValue: async (val) => {
          if (row["deal.notes"] !== val) {
            await axios.put("/deals/" + row["deal.id"], { notes: val });
            await queryClient.invalidateQueries(["lanes"]);
          }
        },
      });
    },
  },
  {
    title: "Sale Number",
    key: "sale_number",
    // fixed: "left",
    width: 150,
    // sortOrder: sortKeyMapOrderRef.value.sale_number || false,
    // sorter: {
    //   compare: (a, b) => a.sale_number - b.sale_number,
    //   multiple: 2,
    // },
  },
  {
    title: "VHR",
    key: "yellow_light",
    //fixed: 'left'
  },
  {
    title: "Year",
    key: "vehicle_make.vehicle_make_year",
    // sorter: "default",
    // fixed: "left",
  },
  {
    title: "Make",
    key: "vehicle_make.name",
  },
  {
    title: "Model",
    key: "vehicle_model.name",
    width: "max-content",
  },
  {
    title: "Body",
    key: "vehicle.body",
  },
  {
    title: "Mileage",
    key: "deal.mileage",
  },

  {
    title: "C. Cost",
    key: "floor_price",
  },
  {
    title: "Trade In Price",
    key: "deal.trade_in_price",
  },
  {
    title: "M. Ready",
    key: "deal.market_ready",
  },
  {
    title: "M. Price",
    key: "deal.market_price",
  },
  {
    title: "P. Price",
    key: "deal.purchase_price",
  },
  {
    title: "Interior Color",
    key: "interior_color.color",
  },
  {
    title: "Exterior Color",
    key: "exterior_color.color",
  },
  {
    title: "Purchased Date",
    key: "deal.date_purchased",
  },
  {
    title: "VIN",
    key: "deal.vin",
  },
  {
    title: "Dealer",
    key: "deal.dealer.name",
  },
  {
    title: "Auction Company",
    key: "auction.auction_company",
  },
  // {
  //   title: "Designation Code",
  //   key: "age",
  // },
  // {
  //   title: "Buyer Code",
  //   key: "address",
  // },
  {
    title: "Grade",
    key: "deal.grade",
  },

  // {
  //   title: "BCF",
  //   key: "address",
  // },
  // {
  //   title: "Car Notes",
  //   key: "name",
  // },
  // {
  //   title: "Inv. ID",
  //   key: "age",
  // },
  // {
  //   title: "Enable OVE",
  //   key: "address",
  // },
  // {
  //   title: "T. Notes",
  //   key: "notes",
  // },
  // {
  //   title: "W",
  //   key: "W",
  // },
  // {
  //   title: "V",
  //   key: "V",
  // },
]);

const handleSortChange = (sorters) => {
  console.log({ sorters });
  sortStatesRef.value = [].concat(sorters);
};
const handlePageChange = (current_page) => {
  filter.value.page = current_page;
};
const OnFilterTrigger = (obj) => {
  queryClient.cancelQueries(["lanes"]);
  filter.value = {
    ...filter.value,
    ...obj,
  };
};
</script>

<template>
  <!-- Main Tabs App Content -->
  <div
    class="flex h-screen w-[calc(100vw-60px)] gap-x-5 overflow-auto bg-white dark:bg-background_dark"
  >
    <!-- Main Body Content-->

    <!-- Body Content -->
    <aside
      class="h-full w-full max-w-[350px] pt-5 pl-5 pr-5 dark:bg-foreground_dark"
    >
      <h3 class="mb-3 text-lg font-bold">Lane Filters</h3>
      <Filter @filter="OnFilterTrigger" />
    </aside>
    <main
      class="h-full w-[calc(100vw-410px)] overflow-y-auto overflow-x-hidden overscroll-contain pr-5 pt-5"
    >
      <div class="mb-3">
        <h1 class="text-xl font-bold uppercase">Lane Numberings</h1>
      </div>
      <div>
        <n-data-table
          remote
          ref="table"
          :columns="columns"
          :data="lanes?.data"
          :pagination="pagination"
          :max-height="900"
          :scroll-x="3000"
          :loading="isLanesLoading"
          @update:page="handlePageChange"
          @update:sorter="handleSortChange"
        />
      </div>
    </main>
  </div>
</template>
