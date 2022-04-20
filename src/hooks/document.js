import { useInfiniteQuery, useQuery } from "vue-query";
import axios from "axios";

export const getDocuments = (dealId) =>
    useQuery(["documents", dealId], ({ queryKey }) =>
        queryKey[1] ?
        axios.get(`documents/deal/${queryKey[1]}`).then((res) => res.data) :
        []
    );

export const getDealIdByVin = (vin) =>
    useQuery(["dealsByVin", vin], ({ queryKey }) =>
        axios.get(`deals/search_by_vin/${queryKey[1]}`).then((res) => {
            if (res.data.length > 0) return res.data[0].id;
            return null;
        })
    );

export const getDocumentTypeOptions = () =>
    useQuery(["documentTypeOptions"], () =>
        axios.get("document_type").then((res) =>
            res.data.map((opt) => {
                return {
                    label: opt.name,
                    value: `${opt.id}`,
                };
            })
        )
    );