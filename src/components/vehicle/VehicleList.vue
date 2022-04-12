<script setup>
import axios from "axios";
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { utils, log } from "@/lib/utils";
import { useGlobalState } from "@/store/global";

const global = useGlobalState();
const route = useRoute();

const props = defineProps(["vendors"]);

defineEmits(["click:tab"]);

function filterVehicles(data) {
  console.log("filtering ", data);
  return data.filter(
    (v) =>
      v.vehicle?.vehicle_make?.vehicle_make_year &&
      v.vehicle?.vehicle_make?.description &&
      v.vehicle?.exterior_color?.color
  );
}
</script>

<template>
  <li
    v-for="(vendor, index) in filterVehicles(vendors)"
    :key="index"
    class="relative px-3 py-2 mb-[12px] ml-[13px] mr-[13px] rounded-round duration-100 border-b-[1px] border-b-transparent odd:bg-[#ffffff] hover:bg-background_light dark:border-b-transparent dark:odd:bg-foreground_dark dark:even:bg-foreground_dark dark:hover:bg-background_dark"
    @click="$emit('click:tab', vendor)"
  >
    <!-- v-if router-links with param options -->
    <router-link
      v-if="vendor?.vin"
      :to="{ name: 'Vehicle', params: { id: vendor?.vin } }"
      active-class="text-primary dark:text-white"
      class="block"
    >
      <div>
        <h2
          class="max-w-[250px] truncate whitespace-nowrap mb-1 text-sm font-bold"
          :class="
            vendor?.vin == route.params?.id
              ? 'text-primary !font-bold'
              : 'text-black dark:text-white'
          "
        >
          {{ vendor?.vin }}
        </h2>
      </div>
      <div class="__subtext text-[10px] mb-1 flex">
        <span>
          {{
            `${vendor?.vehicle.vehicle_make?.vehicle_make_year} - ${vendor?.vehicle.vehicle_make?.description} (${vendor?.vehicle.exterior_color?.color})`
          }}
        </span>
      </div>
    </router-link>
    <div
      id="mask"
      class="absolute inset-0 rounded-round cursor-pointer"
      :class="
        vendor?.vin == route.params?.id
          ? 'bg-accent dark:border-[0px] dark:border-primary'
          : 'bg-transparent'
      "
    ></div>
  </li>
</template>

<style scoped>
.__subtext {
  @apply text-black/[0.6] dark:text-white/[0.4] flex uppercase;
}
.__subtext-icon {
  @apply opacity-50;
}
</style>
