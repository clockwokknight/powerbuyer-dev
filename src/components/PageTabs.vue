<template>
  <div class="pageTabs">
    <div>
      <!-- Page tabs -->
      <div class="p-8">
        <ul class="flex border-b list-reset">
          <li
            class="mr-1 -mb-px"
            v-if="GET_TABS"
            v-for="tab in GET_TABS"
            :key="tab.id"
          >
            <a
              @click="SET_ACTIVE_TAB(tab)"
              :class="`inline-block bg-white ${
                GET_ACTIVE_TAB.id === tab.id
                  ? 'rounded-t border-l border-t border-r text-blue-800'
                  : 'text-blue-400 hover:text-blue-600'
              } py-2 px-4 font-semibold`"
              href="#"
              >{{ tab.name }}</a
            >
            <button @click="CLOSE_TAB(tab.id)" class="font-bold text-red-600">
              X
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { useVendors } from "@/store/vendors";
import { mapActions, mapState } from "pinia";

export default {
  computed: {
    ...mapState(useVendors, ["GET_TABS", "GET_ACTIVE_TAB"]),
  },
  methods: {
    ...mapActions(useVendors, ["CLOSE_TAB", "SET_ACTIVE_TAB"]),
  },
};
</script>
