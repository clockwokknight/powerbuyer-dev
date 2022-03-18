<template>
  <Combobox
    as="div"
    v-model="selected"
    class="transition-allbg-gray-200 mx-auto max-w-2xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 dark:bg-[#444]"
  >
    <!-- Render children directly instead of an `input` -->
    <div class="relative">
      <SearchIcon
        class="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
      />
      <ComboboxInput
        as="template"
        @change="query = $event.target.value"
        :displayValue="(value) => value.vin || value.name || value.company"
        class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 sm:text-sm"
        placeholder="Search..."
      >
        <input />
      </ComboboxInput>
    </div>
    <TransitionRoot
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      @after-leave="query = ''"
    >
      <div class="max-h-96 overflow-y-auto overflow-x-hidden text-sm">
        <div v-for="result in globalSearchResults" :key="result.key" :value="result">
          <ComboboxOptions>
            <div class="__gs_title">
              <h3 class="mt-4 mb-2 px-3 text-xs font-semibold text-gray-500">
                {{ result.key }}
              </h3>
            </div>
            <div
              v-if="result.values.length === 0 && query !== ''"
              class="__gs_result relative cursor-default select-none py-2 px-4 text-lg font-bold text-gray-400"
            >
              Sorry, No Results...
            </div>
            <ComboboxOption
              v-for="value in result.values"
              :key="value.id"
              :value="value"
              class="__gs_result relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-[#f1f1f1]"
            >
              <div>{{ value.vin || value.name || value.company }}</div>
            </ComboboxOption>
          </ComboboxOptions>
        </div>
      </div>
    </TransitionRoot>
  </Combobox>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuery } from "vue-query";
import axios from "axios";
import { useDebounce } from "@vueuse/core";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from "@headlessui/vue";
import SearchIcon from "@/components/global_search/SearchIcon.vue";

const query = ref("");
const debouncedSearchText = useDebounce(query, 200);
const { data: globalSearchResults, isFetching: isGlobalSearchFetching } = useQuery(
  ["globalSearch", debouncedSearchText],
  ({ queryKey }) => {
    if (queryKey[1] === "") return null;
    else
      return axios
        .get(`/app/search/${queryKey[1]}`)
        .then((res) => {
          if (res.data?.debug) {
            return [];
          }
          return res.data;
        })
        .then((data) => {
          return Object.keys(data).map((key) => {
            let values = data[key];
            return {
              key,
              values,
            };
          });
        });
  }
);

const selected = ref();
</script>
