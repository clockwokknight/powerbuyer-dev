import { useMutation, useQuery } from "vue-query";
import axios from "axios";

export const getPageTabs = ({ pageName, enabled = true, userId = 1 } = {}) =>
  useQuery(
    ["pageTabs", pageName],
    ({ queryKey }) =>
      axios
        .get(`/user_ui_tabs/${userId}/${queryKey[1]}`)
        .then((res) => res.data),
    {
      enabled,
      refetchOnMount: false,
    }
  );
