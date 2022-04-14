import axios from "axios";
import { useInfiniteQuery, useQuery } from "vue-query";
import { useMessage } from "naive-ui";
import { log } from "@/lib/utils";


function queryName(path, context) {
  return path.substring(1, path.length) + context;
}

// --- GET ---

export function fetchPaginatedData(path) {
  return useInfiniteQuery(queryName(path, 'Paginated'), ({ pageParam = 1 }) => 
    axios.get(`${path}?limit=10&page=${pageParam}`).then((r) => r.data), {
      getNextPageParam: (lastPage, pages) => lastPage.current_page < lastPage.last_page ? lastPage.current_page + 1 : null
    }
  )
}

export function fetchById(path, paramId) {
  return useQuery([queryName(path, 'ById'), paramId], () => axios.get(`${path}/${paramId.value}`).then((res) => {
    return res.data;
  }));
}

export function search(path, query) {
  return useQuery(
    [queryName(path, 'Search'), debouncedSearchText],
    ({ queryKey }) => {
      if (queryKey[1] === "") {
        return null;
      } else {
        return axios.get(`${path}/${queryKey[1]}`).then((res) => {
          console.clear();
          console.log("fetching data... ", res);
          if (res.data?.debug) return [];
          return res.data;
        });
      }
    }
  );
}

// --- POST ---

function submitValue(key, form) {
  mutateAsync({
    [key]:
      key === "phone"
        ? utils.parsePhoneNumber(form?.value[key])
        : form?.value[key],
  })
    .then((data) => {
      message.success("Saved");
      console.clear();
      log.green('data submitted from @/hooks/index.js', data);
      currentActiveField.value = null; // TODO : 👇
    })
    .catch((err) => {
      message.error("An error ocurred");
      console.log("uh oh...", err);
    });
  currentActiveField.value = null; // TODO : Send promise back to calling component
}