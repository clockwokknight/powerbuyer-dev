<script setup>
import { useMutation, useQuery, useQueryClient } from "vue-query";
import { useRoute } from "vue-router";
import { computed, reactive, ref, watch } from "vue";
import vendors from "@/api/vendors";
import payments from "@/api/paymentterms";
import states from "@/api/states";
import { onClickOutside, useDebounceFn } from "@vueuse/core";
import UpdatableButtonWrapper from "@/components/common/UpdatableButtonWrapper.vue";
import MaskedInput from "@/components/common/MaskedInput.vue";
import VendorExpensesItems from "@/components/vendor/VendorExpensesItems.vue";
import VendorExpenses from "@/components/vendor/VendorExpenses.vue";
import VendorPayments from "@/components/vendor/VendorPayments.vue";
import VendorContacts from "@/components/vendor/VendorContacts.vue";
import CurrencyInput from "@/components/common/CurrencyInput.vue";
import { useVendors } from "@/store/vendors";
import setup from "naive-ui/lib/radio/src/use-radio";
import { getVendorById, useVendorCategories } from "@/hooks/vendor";
import axios from "axios";
import { pick } from "@/lib/helper";
import compare from "just-compare";
import { useMessage } from "naive-ui";

const route = useRoute();
const store = useVendors();
const message = useMessage();

const currentActiveField = ref(null);

const routeParamId = ref(route.params?.id);

watch(
  () => route.params?.id,

  () => {
    routeParamId.value = route.params?.id;
  }
);

// let vendor = ref({});

const { data: vendorCategory } = useVendorCategories();
const vendorCategoryOptions = computed(() =>
  vendorCategory.value?.pages.reduce(
    (prev, current) =>
      prev.concat(
        current.data.map((category) => ({
          value: category.id,
          label: category.name,
        }))
      ),
    []
  )
);
const vendorWrapper = ref(null);
const { data: paymentTerms } = useQuery("paymentTerms", () =>
  axios.get("/payment_terms").then((res) => res.data)
);
const paymentTermOptions = computed(() =>
  paymentTerms.value?.map((payment) => ({
    label: payment.name,
    value: payment.name,
  }))
);

const { data: statesList } = useQuery("states", () =>
  axios
    .get("/states")
    .then((res) => res.data?.map((el) => ({ label: el.name, value: el.name })))
);
const { data: vendor } = getVendorById(routeParamId);
const queryClient = useQueryClient();
const { isLoading, mutateAsync } = useMutation(
  (data) => axios.put(`/vendors/${vendor.value.id}`, data),
  {
    onSuccess() {
      queryClient.invalidateQueries(["vendor", routeParamId.value]);
    },
  }
);
let form = reactive({});
let dataFromServer = reactive({});

watch(
  vendor,

  (newValue) => {
    if (newValue) {
      const obj = pick(newValue, [
        "name",
        "payment_terms",
        "din",
        "vendor_category_id",
        "vendor_type",
        "tax_id_number",
        "address_one",
        "address_two",
        "city",
        "state",
        "country",
        "zip",
        "phone",
        "email",
        "comments",
        "accounting_code",
      ]);
      Object.keys(obj).forEach((key) => {
        form[key] = obj[key];
      });
    }
  }
);

const resetValue = (key) => {
  form[key] = vendor.value[key];
  currentActiveField.value = null;
};
const submitValue = (key) => {
  if (!compare(vendor.value[key], form[key])) {
    mutateAsync({ [key]: form[key] }).then(() => {
      currentActiveField.value = null;
    });
  }
};

// LOAD TABLE DATA
</script>

<template>
  <div class="mt-4 px-4 pb-8 antialiased">
    {{ vendor }}
    <div class="rounded-lg border-4 bg-slate-100 bg-gray-50 py-8 px-8">
      <div class="border-10 flex rounded-md border-gray-500">
        <div>
          <div class="w-1/2"><p class="text-2xl font-bold">Vendor</p></div>

          <n-form class="w-full">
            <UpdatableButtonWrapper
              class="py-8"
              @save="submitValue('name')"
              @revert="resetValue('name')"
              :should-visible="
                currentActiveField && currentActiveField === 'name'
              "
            >
              <n-input
                class="
                  rounded-md
                  border-2
                  hover:border-sky-500 hover:ring-0 hover:ring-sky-500
                "
                v-model:value="form.name"
                :loading="isLoading"
                @focus="currentActiveField = 'name'"
                :disabled="
                  (currentActiveField && currentActiveField !== 'name') ||
                  isLoading
                "
              />
            </UpdatableButtonWrapper>
            <n-space>
              <n-form-item label="DIN" class="pr-12">
                <UpdatableButtonWrapper
                  @save="submitValue('name')"
                  @revert="resetValue('name')"
                  :should-visible="
                    currentActiveField && currentActiveField === 'din'
                  "
                >
                  <n-input
                    style="width: 220px"
                    class="
                      rounded-md
                      border-2
                      hover:border-sky-500 hover:ring-0 hover:ring-sky-500
                    "
                    :default-value="vendor?.din"
                    v-model:value="form.din"
                    @focus="currentActiveField = 'din'"
                    :loading="isLoading"
                    :disabled="
                      currentActiveField && currentActiveField !== 'din'
                    "
                  />
                </UpdatableButtonWrapper>
              </n-form-item>
              <n-form-item label="Payment Terms">
                <UpdatableButtonWrapper
                  :should-visible="
                    currentActiveField && currentActiveField === 'payment_terms'
                  "
                  @save="submitValue('payment_terms')"
                  @revert="resetValue('payment_terms')"
                >
                  <n-select
                    style="width: 220px"
                    class="
                      rounded-md
                      border-2
                      hover:border-sky-500 hover:ring-0 hover:ring-sky-500
                    "
                    placeholder="Select Payment Term"
                    :options="paymentTermOptions"
                    v-model:value="form.payment_terms"
                    @focus="currentActiveField = 'payment_terms'"
                    :disabled="
                      currentActiveField &&
                      currentActiveField !== 'payment_terms'
                    "
                    filterable
                  /> </UpdatableButtonWrapper
              ></n-form-item>
            </n-space>
            <!--            <n-space>-->
            <!--              <n-form-item label="Account #">-->
            <!--                <UpdatableButtonWrapper-->
            <!--                  v-model="form.accounting_code"-->
            <!--                  :reset-value="vendor?.accounting_code"-->
            <!--                  :shouldUpdate="show.accounting_code"-->
            <!--                  @revert="handleKeyDown('accounting_code')"-->
            <!--                  @save="(val) => onChange('accounting_code', val)"-->
            <!--                >-->
            <!--                  <n-input-->
            <!--                    style="width: 500px"-->
            <!--                    class="-->
            <!--                      rounded-md-->
            <!--                      border-2-->
            <!--                      hover:border-sky-500 hover:ring-0 hover:ring-sky-500-->
            <!--                    "-->
            <!--                    :default-value="vendor?.accounting_code"-->
            <!--                    v-model:value="form.accounting_code"-->
            <!--                    :loading="isLoading"-->
            <!--                    @keyup="handleKeyUp('accounting_code')"-->
            <!--                  /> </UpdatableButtonWrapper-->
            <!--              ></n-form-item>-->
            <!--            </n-space>-->
            <!--            <n-space>-->
            <!--              <n-form-item label="Vendor Category" class="pr-12">-->
            <!--                <UpdatableButtonWrapper-->
            <!--                  v-model="form.vendor_category"-->
            <!--                  :reset-value="vendor?.vendor_category.name"-->
            <!--                  :shouldUpdate="show.vendor_category"-->
            <!--                  @revert="handleKeyDown('vendor_category')"-->
            <!--                  @save="(val) => onChange('vendor_category', val)"-->
            <!--                >-->
            <!--                  <n-select-->
            <!--                    style="width: 220px"-->
            <!--                    class="-->
            <!--                      rounded-md-->
            <!--                      border-2-->
            <!--                      hover:border-sky-500 hover:ring-0 hover:ring-sky-500-->
            <!--                    "-->
            <!--                    placeholder="Select Vendor Category"-->
            <!--                    :options="vendorCategoryOptions"-->
            <!--                    :loading="isLoading"-->
            <!--                    @update:value="handleKeyUp('vendor_category')"-->
            <!--                    v-model:value="form.vendor_category"-->
            <!--                    filterable-->
            <!--                  />-->
            <!--                </UpdatableButtonWrapper>-->
            <!--              </n-form-item>-->

            <!--              <n-form-item label="Tax ID #">-->
            <!--                <UpdatableButtonWrapper-->
            <!--                  v-model="form.tax_id_number"-->
            <!--                  :reset-value="vendor?.tax_id_number"-->
            <!--                  :shouldUpdate="show.tax_id_number"-->
            <!--                  @revert="handleKeyDown('tax_id_number')"-->
            <!--                  @save="(val) => onChange('tax_id_number', val)"-->
            <!--                >-->
            <!--                  <n-input-->
            <!--                    style="width: 220px"-->
            <!--                    class="-->
            <!--                      rounded-md-->
            <!--                      border-2-->
            <!--                      hover:border-sky-500 hover:ring-0 hover:ring-sky-500-->
            <!--                    "-->
            <!--                    :default-value="vendor?.tax_id_number"-->
            <!--                    v-model:value="form.tax_id_number"-->
            <!--                    :loading="isLoading"-->
            <!--                    @keyup="handleKeyUp('tax_id_number')"-->
            <!--                  /> </UpdatableButtonWrapper-->
            <!--              ></n-form-item>-->
            <!--            </n-space>-->
            <!--            <n-space>-->
            <!--              <n-form-item label="Address" class="pr-12">-->
            <!--                <UpdatableButtonWrapper-->
            <!--                  v-model="form.address_one"-->
            <!--                  :reset-value="vendor?.address_one"-->
            <!--                  :shouldUpdate="show.address_one"-->
            <!--                  @revert="handleKeyDown('address_one')"-->
            <!--                  @save="(val) => onChange('address_one', val)"-->
            <!--                >-->
            <!--                  <n-input-->
            <!--                    style="width: 500px"-->
            <!--                    class="-->
            <!--                      rounded-md-->
            <!--                      border-2-->
            <!--                      hover:border-sky-500 hover:ring-0 hover:ring-sky-500-->
            <!--                    "-->
            <!--                    v-model:value="form.address_one"-->
            <!--                    :loading="isLoading"-->
            <!--                    @keyup="handleKeyUp('address_one')"-->
            <!--                  />-->
            <!--                </UpdatableButtonWrapper>-->
            <!--              </n-form-item>-->
            <!--            </n-space>-->

            <!--            <n-space>-->
            <!--              <n-form-item label="Address Two" class="pr-12">-->
            <!--                <UpdatableButtonWrapper-->
            <!--                  v-model="form.address_two"-->
            <!--                  :reset-value="vendor?.address_two"-->
            <!--                  :shouldUpdate="show.address_two"-->
            <!--                  @revert="handleKeyDown('address_two')"-->
            <!--                  @save="(val) => onChange('address_two', val)"-->
            <!--                >-->
            <!--                  <n-input-->
            <!--                    style="width: 220px"-->
            <!--                    class="-->
            <!--                      rounded-md-->
            <!--                      border-2-->
            <!--                      hover:border-sky-500 hover:ring-0 hover:ring-sky-500-->
            <!--                    "-->
            <!--                    :default-value="vendor?.address_two"-->
            <!--                    v-model:value="form.address_two"-->
            <!--                    :loading="isLoading"-->
            <!--                    @keyup="handleKeyUp('address_two')"-->
            <!--                  /> </UpdatableButtonWrapper-->
            <!--              ></n-form-item>-->
            <!--              <n-form-item label="City" class="pr-12">-->
            <!--                <UpdatableButtonWrapper-->
            <!--                  v-model="form.city"-->
            <!--                  :shouldUpdate="show.city"-->
            <!--                  @revert="handleKeyDown('city')"-->
            <!--                  :reset-value="vendor?.city"-->
            <!--                  @save="(val) => onChange('city', val)"-->
            <!--                >-->
            <!--                  <n-input-->
            <!--                    style="width: 220px"-->
            <!--                    class="-->
            <!--                      rounded-md-->
            <!--                      border-2-->
            <!--                      hover:border-sky-500 hover:ring-0 hover:ring-sky-500-->
            <!--                    "-->
            <!--                    :default-value="vendor?.city"-->
            <!--                    v-model:value="form.city"-->
            <!--                    :loading="isLoading"-->
            <!--                    @keyup="handleKeyUp('city')"-->
            <!--                  /> </UpdatableButtonWrapper-->
            <!--              ></n-form-item>-->

            <!--              <n-form-item label="State" class="pr-12">-->
            <!--                <UpdatableButtonWrapper-->
            <!--                  v-model="form.state"-->
            <!--                  :reset-value="vendor?.state"-->
            <!--                  :shouldUpdate="show.state"-->
            <!--                  @revert="handleKeyDown('state')"-->
            <!--                  @save="(val) => onChange('state', val)"-->
            <!--                >-->
            <!--                  <n-select-->
            <!--                    style="width: 220px"-->
            <!--                    class="-->
            <!--                      rounded-md-->
            <!--                      border-2-->
            <!--                      hover:border-sky-500 hover:ring-0 hover:ring-sky-500-->
            <!--                    "-->
            <!--                    placeholder="Select State"-->
            <!--                    :options="statelist"-->
            <!--                    :loading="isLoading"-->
            <!--                    @update:value="handleKeyUp('state')"-->
            <!--                    v-model:value="form.state"-->
            <!--                    filterable-->
            <!--                  /> </UpdatableButtonWrapper-->
            <!--              ></n-form-item>-->

            <!--              <n-form-item label="Zip" class="pr-12">-->
            <!--                <updatable-button-wrapper-->
            <!--                  v-model="form.zip"-->
            <!--                  :shouldUpdate="show.zip"-->
            <!--                  @revert="handleKeyDown('zip')"-->
            <!--                  :reset-value="vendor?.zip"-->
            <!--                  @save="(val) => onChange('zip', val)"-->
            <!--                >-->
            <!--                  <masked-input-->
            <!--                    class="-->
            <!--                      rounded-md-->
            <!--                      border-2-->
            <!--                      hover:border-sky-500 hover:ring-0 hover:ring-sky-500-->
            <!--                    "-->
            <!--                    :default-value="vendor?.zip"-->
            <!--                    mask="#####"-->
            <!--                    style="width: 220px"-->
            <!--                    :loading="isLoading"-->
            <!--                    @keyup="handleKeyUp('zip')"-->
            <!--                    v-model:value="form.zip"-->
            <!--                  />-->
            <!--                </updatable-button-wrapper>-->
            <!--              </n-form-item>-->
            <!--            </n-space>-->

            <!--            <n-space>-->
            <!--              <n-form-item label="Email" class="pr-12">-->
            <!--                <UpdatableButtonWrapper-->
            <!--                  v-model="form.email"-->
            <!--                  :shouldUpdate="show.email"-->
            <!--                  @revert="handleKeyDown('email')"-->
            <!--                  :reset-value="vendor?.email"-->
            <!--                  @save="(val) => onChange('email', val)"-->
            <!--                >-->
            <!--                  <n-input-->
            <!--                    style="width: 220px"-->
            <!--                    class="-->
            <!--                      rounded-md-->
            <!--                      border-2-->
            <!--                      hover:border-sky-500 hover:ring-0 hover:ring-sky-500-->
            <!--                    "-->
            <!--                    :loading="isLoading"-->
            <!--                    @keyup="handleKeyUp('email')"-->
            <!--                    v-model:value="form.email"-->
            <!--                  />-->
            <!--                </UpdatableButtonWrapper>-->
            <!--              </n-form-item>-->
            <!--              <n-form-item label="Phone" class="pr-12">-->
            <!--                <updatable-button-wrapper-->
            <!--                  v-model="form.phone"-->
            <!--                  :shouldUpdate="show.phone"-->
            <!--                  @revert="handleKeyDown('phone')"-->
            <!--                  :reset-value="vendor?.phone"-->
            <!--                  @save="(val) => onChange('phone', val)"-->
            <!--                >-->
            <!--                  <masked-input-->
            <!--                    style="width: 220px"-->
            <!--                    class="-->
            <!--                      rounded-md-->
            <!--                      border-2-->
            <!--                      hover:border-sky-500 hover:ring-0 hover:ring-sky-500-->
            <!--                    "-->
            <!--                    :default-value="vendor?.phone"-->
            <!--                    mask="(###) ###-####"-->
            <!--                    :loading="isLoading"-->
            <!--                    @keyup="handleKeyUp('phone')"-->
            <!--                    v-model:value="form.phone"-->
            <!--                  />-->
            <!--                </updatable-button-wrapper>-->
            <!--              </n-form-item>-->
            <!--            </n-space>-->
            <!--            <n-space>-->
            <!--              <n-form-item label="Fax">-->
            <!--                <updatable-button-wrapper-->
            <!--                  v-model="form.fax"-->
            <!--                  :reset-value="vendor?.fax"-->
            <!--                  :shouldUpdate="show.fax"-->
            <!--                  @revert="handleKeyDown('fax')"-->
            <!--                  @save="(val) => onChange('fax', val)"-->
            <!--                >-->
            <!--                  <masked-input-->
            <!--                    style="width: 220px"-->
            <!--                    class="-->
            <!--                      rounded-md-->
            <!--                      border-2-->
            <!--                      hover:border-sky-500 hover:ring-0 hover:ring-sky-500-->
            <!--                    "-->
            <!--                    :default-value="vendor?.fax"-->
            <!--                    mask="(###) ###-####"-->
            <!--                    :loading="isLoading"-->
            <!--                    @keyup="handleKeyUp('fax')"-->
            <!--                    v-model:value="form.fax"-->
            <!--                  />-->
            <!--                </updatable-button-wrapper>-->
            <!--              </n-form-item>-->
            <!--            </n-space>-->
            <!--            <n-form-item label="Comments">-->
            <!--              <UpdatableButtonWrapper-->
            <!--                v-model="form.comments"-->
            <!--                :reset-value="vendor?.comments"-->
            <!--                :shouldUpdate="show.comments"-->
            <!--                @revert="handleKeyDown('comments')"-->
            <!--                @save="(val) => onChange('comments', val)"-->
            <!--              >-->
            <!--                <n-input-->
            <!--                  class="-->
            <!--                    rounded-md-->
            <!--                    border-2-->
            <!--                    hover:border-sky-500 hover:ring-0 hover:ring-sky-500-->
            <!--                  "-->
            <!--                  :default-value="vendor?.comments"-->
            <!--                  type="textarea"-->
            <!--                  placeholder="Enter Comments"-->
            <!--                  show-count-->
            <!--                  :loading="isLoading"-->
            <!--                  @keyup="handleKeyUp('comments')"-->
            <!--                  style="width: 500px"-->
            <!--                  v-model:value="form.comments"-->
            <!--                />-->
            <!--              </UpdatableButtonWrapper>-->
            <!--            </n-form-item>-->
          </n-form>
        </div>
        <div class="h-15 w-1/2 place-items-end">
          <div class="flex justify-end">
            <p class="text-sm font-bold">Open Invoices</p>
          </div>
          <div class="flex justify-end pb-20">
            <p class="font-bold" style="font-size: 2.5em">$10,193</p>
          </div>
        </div>
      </div>
      <div class="flex justify-end">
        <n-space>
          <button
            style="height: 140px; max-width: 120px"
            class="
              rounded
              border-2 border-gray-400
              bg-transparent
              py-2
              px-4
              font-semibold
              text-gray-700
              hover:border-transparent hover:bg-blue-500 hover:text-white
            "
          >
            <div>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z"
                    fill="currentColor"
                  ></path>
                </svg>
              </n-icon>
            </div>
            Create Expense
          </button>
          <button
            style="height: 140px; max-width: 120px"
            class="
              rounded
              border-2 border-gray-400
              bg-transparent
              py-2
              px-4
              font-semibold
              text-gray-700
              hover:border-transparent hover:bg-blue-500 hover:text-white
            "
          >
            <div>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z"
                    fill="currentColor"
                  ></path>
                </svg>
              </n-icon>
            </div>
            Create Invoice
          </button>
          <button
            style="height: 140px; max-width: 120px"
            ref="vendorWrapper"
            class="
              min-w-20px
              rounded
              border-2 border-gray-400
              bg-transparent
              py-2
              px-4
              font-semibold
              text-gray-700
              hover:border-transparent hover:bg-blue-500 hover:text-white
            "
          >
            <div>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z"
                    fill="currentColor"
                  ></path>
                </svg>
              </n-icon>
            </div>
            Create Purchase Order
          </button>
        </n-space>
      </div>
    </div>
  </div>

  <VendorContacts />
  <VendorExpensesItems />
  <VendorExpenses />
  <VendorPayments />
</template>
