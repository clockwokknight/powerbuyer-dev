<script setup>
import CommissionTypesModal from "@/components/modals/CommissionTypesModal.vue";
import BuyerTypesModal from "@/components/modals/BuyerTypesModal.vue";
import ExpenseTypesModal from "@/components/modals/ExpenseTypesModal.vue";
import GmtvLocationsModal from "@/components/modals/GmtvLocationsModal.vue";
import PaymentTermsModal from "@/components/modals/PaymentTermsModal.vue";
import DealStatusModal from "@/components/modals/DealStatusModal.vue";
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
        <router-link class="single-card h-30 pt-5" to="/dealers">
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
  @apply bg-foreground_light dark:border-dark_border dark:bg-foreground_dark cursor-pointer rounded-md border-2 border-gray-200 shadow-sm transition-shadow hover:shadow-lg dark:shadow-gray-900;
}
</style>
