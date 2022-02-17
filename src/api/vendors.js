import { api } from "@/api/config";

export default {
  all() {
    return api.get("/vendors");
  },
  allContacts() {
    return api.get("/vendor_contacts");
  },
  retrieveContacts(id) {
    return api.get(`/vendor_contacts/by_vendor/${id}`);
  },
  addContacts(data) {
    console.log(data);
    return api.post("/vendor_contacts", data);
  },
  updateContacts(data, id) {
    return api.put(`/vendor_contacts/${id}`, data);
  },
  retrieve(id) {
    return api.get(`/vendors/${id}`);
  },
  create(data) {
    return api.post(`/vendors/update/${data.id}`, data);
  },
  add(data) {
    console.log(data);
    //console.log(api.post( '/vendors/store', data ))
    return api.post("/vendors/store", data);
  },
  allCategories() {
    return api.get("/vendor_categories");
  },
};
