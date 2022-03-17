<script setup>
import { ref, reactive } from "vue";
import CustomInput from "@/components/common/CustomInput.vue";
import CommissionTypesModal from "@/components/modals/CommissionTypesModal.vue";
import BuyerTypesModal from "@/components/modals/BuyerTypesModal.vue";
import ExpenseItemsModal from "@/components/modals/ExpenseItemsModal.vue";
import GmtvLocationsModal from "@/components/modals/GmtvLocationsModal.vue";
import PaymentTermsModal from "@/components/modals/PaymentTermsModal.vue";
import DealStatusModal from "@/components/modals/DealStatusModal.vue";

const showCommissionTypesModal = ref(false);
const showBuyerTypesModal = ref(false);
const showExpenseItemsModal = ref(false);
const showGmtvLocationsModal = ref(false);
const showPaymentTermsModal = ref(false);
const showDealStatusModal = ref(false);

const onClickCommissionTypes = () => {
  showCommissionTypesModal.value = true;
};

const onClickBuyerTypes = () => {
  showBuyerTypesModal.value = true;
};

const onClickExpenseItems = () => {
  showExpenseItemsModal.value = true;
};

const onClickGmtvLocations = () => {
  showGmtvLocationsModal.value = true;
};

const onClickPaymentTerms = () => {
  showPaymentTermsModal.value = true;
};
const onClickDealStatus = () => {
  showDealStatusModal.value = true;
};
</script>

<template>
  <main class="overflow-auto overscroll-contain p-5">
    <section class="mb-12">
      <div class="mt-24 p-4">
        <h2 class="mb-6 text-xl font-bold uppercase">Other Menu Options</h2>
      </div>
      <div class="mx-6 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
        <!-- Commission Types -->

        <CommissionTypesModal
          class="cursor-pointer rounded-md border-2 border-gray-200 bg-foreground_light shadow-sm transition-shadow hover:shadow-lg dark:border-dark_border dark:bg-foreground_dark dark:shadow-gray-900"
        />
        <!-- Buyer Types -->
        <div
          class="cursor-pointer rounded-md border-2 border-gray-200 bg-foreground_light shadow-sm transition-shadow hover:shadow-lg dark:border-dark_border dark:bg-foreground_dark"
          @click="onClickBuyerTypes"
        >
          <div class="py-6 px-6">
            <div class="mb-2 text-lg font-bold">Buyer Types</div>
            <div class="pb-2 text-sm">Click to edit commission types.</div>
          </div>
        </div>
        <BuyerTypesModal
          :show="showBuyerTypesModal"
          @onReturn="showBuyerTypesModal = false"
        />
        <!-- Expense Items -->
        <div
          class="cursor-pointer rounded-md border-2 border-gray-200 bg-foreground_light shadow-sm transition-shadow hover:shadow-lg dark:border-dark_border dark:bg-foreground_dark"
          @click="onClickExpenseItems"
        >
          <div class="py-6 px-6">
            <div class="mb-2 text-lg font-bold">Expense Items</div>
            <div class="pb-2 text-sm">Click to edit commission types.</div>
          </div>
        </div>
        <ExpenseItemsModal
          :show="showExpenseItemsModal"
          @onReturn="showExpenseItemsModal = false"
        />
        <!-- GMTV Locations -->
        <div
          class="cursor-pointer rounded-md border-2 border-gray-200 bg-foreground_light shadow-sm transition-shadow hover:shadow-lg dark:border-dark_border dark:bg-foreground_dark"
          @click="onClickGmtvLocations"
        >
          <div class="py-6 px-6">
            <div class="mb-2 h-11 text-lg font-bold">GMTV Locations</div>
            <div class="h-10 pb-2 text-sm">Click to edit commission types.</div>
          </div>
        </div>
        <GmtvLocationsModal
          :show="showGmtvLocationsModal"
          @onReturn="showGmtvLocationsModal = false"
        />
        <!-- Payment Terms -->
        <div
          class="cursor-pointer rounded-md border-2 border-gray-200 bg-foreground_light shadow-sm transition-shadow hover:shadow-lg dark:border-dark_border dark:bg-foreground_dark"
          @click="onClickPaymentTerms"
        >
          <div class="py-6 px-6">
            <div class="mb-2 h-11 text-lg font-bold">Payment Terms</div>
            <div class="h-10 pb-2 text-sm">Click to edit commission types.</div>
          </div>
        </div>
        <PaymentTermsModal
          :show="showPaymentTermsModal"
          @onReturn="showPaymentTermsModal = false"
        />
        <!-- Deal Status -->
        <div
          class="cursor-pointer rounded-md border-2 border-gray-200 bg-foreground_light shadow-sm transition-shadow hover:shadow-lg dark:border-dark_border dark:bg-foreground_dark"
          @click="onClickDealStatus"
        >
          <div class="py-6 px-6">
            <div class="mb-2 h-11 text-lg font-bold">Deal Status</div>
            <div class="h-10 pb-2 text-sm">Click to edit commission types.</div>
          </div>
        </div>
        <DealStatusModal
          :show="showDealStatusModal"
          @onReturn="showDealStatusModal = false"
        />
      </div>
    </section>

    <section class="mb-12">
      <div class="mt-24 p-4">
        <h2 class="mb-6 text-xl font-bold uppercase">System Permissions</h2>
      </div>
      <div class="grid grid-cols-3">
        <div
          class="mx-4 mb-6 cursor-pointer rounded-md border-2 border-gray-200 bg-gray-100 shadow-sm hover:shadow-md"
        >
          <div class="px-6 pt-6 pb-8">
            <div class="mb-2 text-lg font-bold">Block title</div>
            <div class="pb-2 text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi
              unde ea quam enim velit mollitia ut dolores doloribus reiciendis
              magni?
            </div>
          </div>
        </div>
        <div
          class="mx-4 mb-6 cursor-pointer rounded-md border-2 border-gray-200 bg-gray-100 shadow-sm hover:shadow-md"
        >
          <div class="py-6 px-6">
            <div class="mb-2 text-lg font-bold">Block title</div>
            <div class="pb-2 text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi
              unde ea quam enim velit mollitia ut dolores doloribus reiciendis
              magni?
            </div>
          </div>
        </div>
        <div
          class="mx-4 mb-6 cursor-pointer rounded-md border-2 border-gray-200 bg-gray-100 shadow-sm hover:shadow-md"
        >
          <div class="py-6 px-6">
            <div class="mb-2 text-lg font-bold"></div>
            <div class="pb-2 text-sm"></div>
          </div>
        </div>
        <div
          class="mx-4 mb-6 cursor-pointer rounded-md border-2 border-gray-200 bg-gray-100 shadow-sm hover:shadow-md"
        >
          <div class="py-6 px-6">
            <div class="mb-2 h-11 text-lg font-bold"></div>
            <div class="h-10 pb-2 text-sm"></div>
          </div>
        </div>
        <div
          class="mx-4 mb-6 cursor-pointer rounded-md border-2 border-gray-200 bg-gray-100 shadow-sm hover:shadow-md"
        >
          <div class="py-6 px-6">
            <div class="mb-2 h-11 text-lg font-bold"></div>
            <div class="h-10 pb-2 text-sm"></div>
          </div>
        </div>
        <div
          class="mx-4 mb-6 cursor-pointer rounded-md border-2 border-gray-200 bg-gray-100 shadow-sm hover:shadow-md"
        >
          <div class="py-6 px-6">
            <div class="mb-2 h-11 text-lg font-bold"></div>
            <div class="h-10 pb-2 text-sm"></div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
