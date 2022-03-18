<template>
  <Combobox v-model="selected">
    <!-- Render children directly instead of an `input` -->
    <div class="flex items-center">
      <SearchIcon class="h-6 w-6 text-gray-500" />
      <ComboboxInput
        as="template"
        @change="query = $event.target.value"
        :displayValue="(value) => value.vin || value.name || value.company"
        class="text-gray-8000 text-md h-14 w-full border-0 bg-transparent placeholder-gray-400 focus:ring-0"
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
        <div
          v-for="result in globalSearchResults"
          :key="result.key"
          :value="result"
        >
          <hr class="my-2" />
          <ComboboxOptions>
            <div class="__gs_title">
              <h3 class="my-2 translate-x-2 font-bold">{{ result.key }}</h3>
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
const { data: globalSearchResults, isFetching: isGlobalSearchFetching } =
  useQuery(["globalSearch", debouncedSearchText], ({ queryKey }) => {
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
  });

const selected = ref();
</script>
