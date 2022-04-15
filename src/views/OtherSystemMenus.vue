<script setup>
import CommissionTypesModal from "@/components/system/CommissionTypesModal.vue";
import BuyerTypesModal from "@/components/system/BuyerTypesModal.vue";
import ExpenseTypesModal from "@/components/system/ExpenseTypesModal.vue";
import GmtvLocationsModal from "@/components/system/GmtvLocationsModal.vue";
import PaymentTermsModal from "@/components/system/PaymentTermsModal.vue";
import DealStatusModal from "@/components/system/DealStatusModal.vue";
import { useDealers } from "@/store/dealers";
import LaneReport from "@/components/system/LaneReport.vue";
const dealerStore = useDealers();
</script>

<template>
  <main class="w-[calc(100vw-60px)] overflow-auto overscroll-contain p-5">
    <section class="mb-12">
      <div class="mt-24 p-4">
        <h2 class="mb-6 text-xl font-bold uppercase">Other Menu Options</h2>
      </div>
      <div
        class="mx-6 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <router-link class="single-card h-32 pt-5" to="/auctions">
          <span class="px-6 pt-6 pb-8 text-lg font-bold"> Auctions</span>
        </router-link>
        <router-link
          class="single-card h-30 pt-5"
          :to="`/dealers/${dealerStore.latest}`"
        >
          <span class="px-6 pt-6 pb-8 text-lg font-bold"> Dealers</span>
        </router-link>
      </div>
    </section>
    <section class="mb-12">
      <div class="mt-24 p-4">
        <h2 class="mb-6 text-xl font-bold uppercase">System Settings</h2>
      </div>
      <div
        class="mx-6 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <!-- Commission Types -->

        <CommissionTypesModal class="single-card" />
        <!-- Buyer Types -->

        <BuyerTypesModal class="single-card" />
        <!-- Expense Items -->
        <ExpenseTypesModal class="single-card" />
        <!-- GMTV Locations -->
        <GmtvLocationsModal class="single-card" />
        <!-- Payment Terms -->

        <PaymentTermsModal class="single-card" />
        <!-- Deal Status -->

        <DealStatusModal class="single-card" />

        <lane-report class="single-card" />
      </div>
    </section>

    <section class="mb-12">
      <div class="mt-24 p-4">
        <h2 class="mb-6 text-xl font-bold uppercase">System Permissions</h2>
      </div>
    </section>
  </main>
</template>

<style scoped>
.single-card {
  @apply cursor-pointer rounded-md border-2 border-gray-200 bg-foreground_light shadow-sm transition-shadow hover:shadow-lg dark:border-dark_border dark:bg-foreground_dark dark:shadow-gray-900;
}
</style>
