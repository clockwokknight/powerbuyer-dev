<script setup>
import { useRoute } from "vue-router";
import { utils, log } from "@/lib/utils";
import { useGlobalState } from "@/store/global";

const global = useGlobalState();

defineProps(["vendors"]);
defineEmits(["click:tab"]);
const route = useRoute();
</script>

<template>
  <li
    v-for="vendor in vendors"
    :key="vendor?.id"
    class="relative mb-[12px] ml-[13px] mr-[13px] rounded-round border-b-[1px] border-b-transparent px-3 py-2 duration-100 odd:bg-white hover:bg-background_light dark:border-b-transparent dark:odd:bg-foreground_dark dark:even:bg-foreground_dark dark:hover:bg-background_dark"
    @click="$emit('click:tab', vendor)"
  >
    <router-link
      :to="{ name: 'Vendor', params: { id: vendor.id } }"
      active-class="text-primary dark:text-white"
      class="block"
    >
      <div>
        <h2
          class="mb-1 max-w-[250px] truncate whitespace-nowrap text-sm font-bold"
          :class="
            vendor.id === route.params.id
              ? '!font-bold text-primary'
              : 'text-black dark:text-white'
          "
        >
          {{ vendor.name }}
        </h2>
      </div>
      <div class="__subtext mb-1 flex text-[10px]">
        <svg
          class="__subtext-icon mr-[6px] mt-[2px] h-[10px] w-[10px]"
          viewBox="0 0 16 16"
        >
          <g fill="gray">
            <path
              d="M9.156 14.544C10.899 13.01 14 9.876 14 7A6 6 0 0 0 2 7c0 2.876 3.1 6.01 4.844 7.544a1.736 1.736 0 0 0 2.312 0zM6 7a2 2 0 1 1 4 0a2 2 0 0 1-4 0z"
            ></path>
          </g>
        </svg>
        <span class="uppercase">
          {{
            vendor.city &&
            vendor.state &&
            vendor.city.length > 0 &&
            vendor.state.length > 0
              ? `${vendor.city}, ${vendor.state}`
              : "No address provided"
          }}
        </span>
      </div>
      <div class="__subtext flex text-[10px]">
        <svg
          class="__subtext-icon mr-[6px] mt-[2px] h-[10px] w-[10px]"
          viewBox="0 0 16 16"
        >
          <g fill="gray">
            <path
              d="M6.756 7.024L7.83 6.04a2 2 0 0 0 .52-2.176l-.458-1.223a1.916 1.916 0 0 0-2.354-1.16c-1.716.525-3.035 2.12-2.629 4.014c.267 1.246.778 2.81 1.746 4.474c.97 1.668 2.078 2.9 3.028 3.766c1.434 1.305 3.484.979 4.803-.251a1.899 1.899 0 0 0 .171-2.596l-.84-1.02A2 2 0 0 0 9.67 9.23l-1.388.437a6.63 6.63 0 0 1-.936-1.223a6.269 6.269 0 0 1-.59-1.421z"
            ></path>
          </g>
        </svg>
        <span class="tracking-wider">
          {{
            vendor.phone && vendor.phone.length > 0
              ? utils.formatPhoneNumber(vendor.phone)
              : "No contact provided"
          }}
        </span>
      </div>
    </router-link>
    <div
      id="mask"
      class="absolute inset-0 cursor-pointer rounded-round"
      :class="
        vendor.id === $route.params.id
          ? 'bg-accent dark:border-[0px] dark:border-primary'
          : 'bg-transparent'
      "
    ></div>
  </li>
</template>

<style scoped>
.__subtext {
  @apply flex uppercase text-black/[0.6] dark:text-white/[0.4];
}
.__subtext-icon {
  @apply opacity-50;
}
</style>
