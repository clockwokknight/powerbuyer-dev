import { api } from "@/api/config";

export default {
  all() {
    return api.get("/vehicles");
  },
  retrieve(id) {
    return api.get(`/vehicles/${id}`);
  },
  create(data) {
    return api.post(`/vehicles/update/${data.id}`, data);
  },
  add(data) {
    console.log(data);
    return api.post("/vehicles/store", data);
  },
};
