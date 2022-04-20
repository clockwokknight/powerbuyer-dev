import { useInfiniteQuery, useQuery } from "vue-query";
import axios from "axios";

export const getDocuments = (dealId) =>
    useQuery(["documents", dealId], ({ queryKey }) =>
        axios.get(`documents/deal/${queryKey[1]}`).then((res) => res.data)
    );

export const getDocumentTypeOptions = () =>
    useQuery(["documentTypeOptions"], () =>
        axios.get("document_type").then((res) =>
            res.data.map((opt) => {
                return {
                    label: opt.name,
                    value: opt.id,
                };
            })
        )
    );