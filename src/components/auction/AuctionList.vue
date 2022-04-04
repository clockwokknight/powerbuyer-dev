<script setup>
import { useRoute } from "vue-router";
import { useGlobalState } from "@/store/global";
import { utils, log } from "@/lib/utils";
const global = useGlobalState();

defineProps(["auctions"]);
defineEmits(["click:tab"]);
const route = useRoute();
</script>

<template>
  <li
    v-for="auction in auctions"
    :key="auction?.id"
    class="relative px-3 py-2 mb-[12px] ml-[13px] mr-[13px] rounded-round duration-100 border-b-[1px] border-b-transparent odd:bg-[#ffffff] hover:bg-background_light dark:border-b-transparent dark:odd:bg-foreground_dark dark:even:bg-foreground_dark dark:hover:bg-background_dark"
    @click="$emit('click:tab', auction)"
  >
    <router-link
      :to="{ name: 'SingleAuction', params: { id: auction?.id } }"
      active-class="text-primary dark:text-white"
      class="block"
    >
      <div>
        <h2
          class="max-w-[250px] truncate whitespace-nowrap mb-1 text-sm font-bold"
          :class="
            auction.id == route.params.id
              ? 'text-primary !font-bold'
              : 'text-black dark:text-white'
          "
        >
          {{ auction?.auction_company }}
        </h2>
      </div>
      <div class="__subtext text-[10px] mb-1 flex">
        <svg
          class="__subtext-icon w-[10px] h-[10px] mr-[6px] mt-[2px]"
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
            auction.city &&
            auction.state &&
            auction.city.length > 0 &&
            auction.state.length > 0
              ? `${auction.city}, ${auction.state}`
              : "No address provided"
          }}
        </span>
      </div>
      <div class="__subtext text-[10px] flex">
        <svg
          class="__subtext-icon w-[10px] h-[10px] mr-[6px] mt-[2px]"
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
            auction.phone && auction.phone.length > 0
              ? utils.formatPhoneNumber(auction.phone)
              : "No contact provided"
          }}
        </span>
      </div>
    </router-link>
  </li>
</template>
