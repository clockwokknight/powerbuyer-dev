<script setup>
import { useMutation, useQueryClient } from "vue-query";
import { useRoute } from "vue-router";
import { computed, defineAsyncComponent, reactive, ref, watch } from "vue";
import UpdatableButtonWrapper from "@/components/common/UpdatableButtonWrapper.vue";
import MaskedInput from "@/components/common/MaskedInput.vue";
import VendorExpensesItems from "@/components/vendor/VendorExpensesItems.vue";
import VendorExpenses from "@/components/vendor/VendorExpenses.vue";
import VendorPayments from "@/components/vendor/VendorPayments.vue";
import { getVendorById, useVendorCategories } from "@/hooks/vendor";
import axios from "axios";
import { pick } from "@/lib/helper";
import compare from "just-compare";
import { useMessage } from "naive-ui";
import { getPaymentTerms, getStates } from "@/hooks/common_query";

const VendorContacts = defineAsyncComponent({
  loader: () => import("@/components/vendor/VendorContacts.vue"),
});

const route = useRoute();
const message = useMessage();

const currentActiveField = ref(null);

const routeParamId = ref(route.params?.id);

watch(
  () => route.params?.id,

  () => {
    if (route.params?.id) {
      routeParamId.value = route.params?.id;
    }
  },
  {
    immediate: true,
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
const { data: paymentTerms } = getPaymentTerms();
const paymentTermOptions = computed(() =>
  paymentTerms.value?.map((payment) => ({
    label: payment.name,
    value: payment.name,
  }))
);

const { data: statesList } = getStates();
const { data: vendor, isLoading: isVendorLoading } =
  getVendorById(routeParamId);
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
  },
  { immediate: true }
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
  currentActiveField.value = null;
};

// LOAD TABLE DATA
</script>

<template>
  <n-spin size="large" :show="isVendorLoading">
    <div class="mt-4 px-4 pb-8">
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
                  class="rounded-md border-2 hover:border-sky-500 hover:ring-0 hover:ring-sky-500"
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
                    @save="submitValue('din')"
                    @revert="resetValue('din')"
                    :should-visible="
                      currentActiveField && currentActiveField === 'din'
                    "
                  >
                    <n-input
                      style="width: 220px"
                      class="rounded-md border-2 hover:border-sky-500 hover:ring-0 hover:ring-sky-500"
                      :default-value="vendor?.din"
                      v-model:value="form.din"
                      @focus="currentActiveField = 'din'"
                      :loading="isLoading"
                      :disabled="
                        (currentActiveField && currentActiveField !== 'din') ||
                        isLoading
                      "
                    />
                  </UpdatableButtonWrapper>
                </n-form-item>
                <n-form-item label="Payment Terms">
                  <UpdatableButtonWrapper
                    :should-visible="
                      currentActiveField &&
                      currentActiveField === 'payment_terms'
                    "
                    @save="submitValue('payment_terms')"
                    @revert="resetValue('payment_terms')"
                  >
                    <n-select
                      style="width: 220px"
                      class="rounded-md border-2 hover:border-sky-500 hover:ring-0 hover:ring-sky-500"
                      placeholder="Select Payment Term"
                      :options="paymentTermOptions"
                      v-model:value="form.payment_terms"
                      @focus="currentActiveField = 'payment_terms'"
                      :disabled="
                        (currentActiveField &&
                          currentActiveField !== 'payment_terms') ||
                        isLoading
                      "
                      filterable
                    /> </UpdatableButtonWrapper
                ></n-form-item>
              </n-space>
              <n-space>
                <n-form-item label="Account #">
                  <UpdatableButtonWrapper
                    @save="submitValue('accounting_code')"
                    @revert="resetValue('accounting_code')"
                    :should-visible="
                      currentActiveField &&
                      currentActiveField === 'accounting_code'
                    "
                  >
                    <n-input
                      style="width: 500px"
                      class="rounded-md border-2 hover:border-sky-500 hover:ring-0 hover:ring-sky-500"
                      v-model:value="form.accounting_code"
                      @focus="currentActiveField = 'accounting_code'"
                      :loading="isLoading"
                      :disabled="
                        (currentActiveField &&
                          currentActiveField !== 'accounting_code') ||
                        isLoading
                      "
                    />
                  </UpdatableButtonWrapper>
                </n-form-item>
              </n-space>
              <n-space>
                <n-form-item label="Vendor Category" class="pr-12">
                  <UpdatableButtonWrapper
                    :should-visible="
                      currentActiveField &&
                      currentActiveField === 'vendor_category_id'
                    "
                    @save="submitValue('vendor_category_id')"
                    @revert="resetValue('vendor_category_id')"
                  >
                    <n-select
                      style="width: 220px"
                      class="rounded-md border-2 hover:border-sky-500 hover:ring-0 hover:ring-sky-500"
                      placeholder="Select Vendor Category"
                      :options="vendorCategoryOptions"
                      v-model:value="form.vendor_category_id"
                      @focus="currentActiveField = 'vendor_category_id'"
                      :disabled="
                        (currentActiveField &&
                          currentActiveField !== 'vendor_category_id') ||
                        isLoading
                      "
                      filterable
                    /> </UpdatableButtonWrapper
                ></n-form-item>
                <n-form-item label="Tax ID #">
                  <UpdatableButtonWrapper
                    @save="submitValue('tax_id_number')"
                    @revert="resetValue('tax_id_number')"
                    :should-visible="
                      currentActiveField &&
                      currentActiveField === 'tax_id_number'
                    "
                  >
                    <n-input
                      style="width: 500px"
                      class="rounded-md border-2 hover:border-sky-500 hover:ring-0 hover:ring-sky-500"
                      v-model:value="form.tax_id_number"
                      @focus="currentActiveField = 'tax_id_number'"
                      :loading="isLoading"
                      :disabled="
                        (currentActiveField &&
                          currentActiveField !== 'tax_id_number') ||
                        isLoading
                      "
                    />
                  </UpdatableButtonWrapper>
                </n-form-item>
              </n-space>
              <n-space>
                <n-form-item label="Address 1" class="pr-12">
                  <UpdatableButtonWrapper
                    @save="submitValue('address_one')"
                    @revert="resetValue('address_one')"
                    :should-visible="
                      currentActiveField && currentActiveField === 'address_one'
                    "
                  >
                    <n-input
                      style="width: 500px"
                      class="rounded-md border-2 hover:border-sky-500 hover:ring-0 hover:ring-sky-500"
                      v-model:value="form.address_one"
                      @focus="currentActiveField = 'address_one'"
                      :loading="isLoading"
                      :disabled="
                        (currentActiveField &&
                          currentActiveField !== 'address_one') ||
                        isLoading
                      "
                    />
                  </UpdatableButtonWrapper>
                </n-form-item>
              </n-space>
              <n-space>
                <n-form-item label="Address 2" class="pr-12">
                  <UpdatableButtonWrapper
                    @save="submitValue('address_two')"
                    @revert="resetValue('address_two')"
                    :should-visible="
                      currentActiveField && currentActiveField === 'address_two'
                    "
                  >
                    <n-input
                      style="width: 220px"
                      class="rounded-md border-2 hover:border-sky-500 hover:ring-0 hover:ring-sky-500"
                      v-model:value="form.address_two"
                      @focus="currentActiveField = 'address_two'"
                      :loading="isLoading"
                      :disabled="
                        (currentActiveField &&
                          currentActiveField !== 'address_two') ||
                        isLoading
                      "
                    />
                  </UpdatableButtonWrapper>
                </n-form-item>

                <n-form-item label="City" class="pr-12">
                  <UpdatableButtonWrapper
                    @save="submitValue('city')"
                    @revert="resetValue('city')"
                    :should-visible="
                      currentActiveField && currentActiveField === 'city'
                    "
                  >
                    <n-input
                      style="width: 220px"
                      class="rounded-md border-2 hover:border-sky-500 hover:ring-0 hover:ring-sky-500"
                      v-model:value="form.city"
                      @focus="currentActiveField = 'city'"
                      :loading="isLoading"
                      :disabled="
                        (currentActiveField && currentActiveField !== 'city') ||
                        isLoading
                      "
                    />
                  </UpdatableButtonWrapper>
                </n-form-item>

                <n-form-item label="State" class="pr-12">
                  <UpdatableButtonWrapper
                    @save="submitValue('state')"
                    @revert="resetValue('state')"
                    :should-visible="
                      currentActiveField && currentActiveField === 'state'
                    "
                  >
                    <n-select
                      style="width: 220px"
                      class="rounded-md border-2 hover:border-sky-500 hover:ring-0 hover:ring-sky-500"
                      placeholder="Select State"
                      :options="statesList"
                      v-model:value="form.state"
                      @focus="currentActiveField = 'state'"
                      :loading="isLoading"
                      :disabled="
                        (currentActiveField &&
                          currentActiveField !== 'state') ||
                        isLoading
                      "
                      filterable
                    /> </UpdatableButtonWrapper
                ></n-form-item>

                <n-form-item label="Zip" class="pr-12">
                  <updatable-button-wrapper
                    @save="submitValue('zip')"
                    @revert="resetValue('zip')"
                    :should-visible="
                      currentActiveField && currentActiveField === 'zip'
                    "
                  >
                    <masked-input
                      class="rounded-md border-2 hover:border-sky-500 hover:ring-0 hover:ring-sky-500"
                      mask="#####"
                      style="width: 220px"
                      v-model:value="form.zip"
                      @focus="currentActiveField = 'zip'"
                      :loading="isLoading"
                      :disabled="
                        (currentActiveField && currentActiveField !== 'zip') ||
                        isLoading
                      "
                    />
                  </updatable-button-wrapper>
                </n-form-item>
              </n-space>

              <n-space>
                <n-form-item label="Email" class="pr-12">
                  <UpdatableButtonWrapper
                    @save="submitValue('email')"
                    @revert="resetValue('email')"
                    :should-visible="
                      currentActiveField && currentActiveField === 'email'
                    "
                  >
                    <n-input
                      type="email"
                      style="width: 220px"
                      class="rounded-md border-2 hover:border-sky-500 hover:ring-0 hover:ring-sky-500"
                      v-model:value="form.email"
                      @focus="currentActiveField = 'email'"
                      :loading="isLoading"
                      :disabled="
                        (currentActiveField &&
                          currentActiveField !== 'email') ||
                        isLoading
                      "
                    />
                  </UpdatableButtonWrapper>
                </n-form-item>
                <n-form-item label="Phone" class="pr-12">
                  <updatable-button-wrapper
                    @save="submitValue('phone')"
                    @revert="resetValue('phone')"
                    :should-visible="
                      currentActiveField && currentActiveField === 'phone'
                    "
                  >
                    <masked-input
                      style="width: 220px"
                      class="rounded-md border-2 hover:border-sky-500 hover:ring-0 hover:ring-sky-500"
                      mask="(###) ###-####"
                      @focus="currentActiveField = 'phone'"
                      :loading="isLoading"
                      :disabled="
                        (currentActiveField &&
                          currentActiveField !== 'phone') ||
                        isLoading
                      "
                      v-model:value="form.phone"
                    />
                  </updatable-button-wrapper>
                </n-form-item>
              </n-space>
              <n-space>
                <n-form-item label="Fax">
                  <updatable-button-wrapper
                    @save="submitValue('fax')"
                    @revert="resetValue('fax')"
                    :should-visible="
                      currentActiveField && currentActiveField === 'fax'
                    "
                  >
                    <masked-input
                      style="width: 220px"
                      class="rounded-md border-2 hover:border-sky-500 hover:ring-0 hover:ring-sky-500"
                      mask="(###) ###-####"
                      @focus="currentActiveField = 'fax'"
                      :loading="isLoading"
                      :disabled="
                        (currentActiveField && currentActiveField !== 'fax') ||
                        isLoading
                      "
                      v-model:value="form.fax"
                    />
                  </updatable-button-wrapper>
                </n-form-item>
              </n-space>
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
              class="rounded border-2 border-gray-400 bg-transparent py-2 px-4 font-semibold text-gray-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
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
              class="rounded border-2 border-gray-400 bg-transparent py-2 px-4 font-semibold text-gray-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
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
              class="min-w-20px rounded border-2 border-gray-400 bg-transparent py-2 px-4 font-semibold text-gray-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
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
  </n-spin>

  <VendorContacts />
  <VendorExpensesItems />
  <VendorExpenses />
  <VendorPayments />
</template>
