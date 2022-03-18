<script setup>
import CommissionTypesModal from "@/components/modals/CommissionTypesModal.vue";
import BuyerTypesModal from "@/components/modals/BuyerTypesModal.vue";
import ExpenseItemsModal from "@/components/modals/ExpenseItemsModal.vue";
import GmtvLocationsModal from "@/components/modals/GmtvLocationsModal.vue";
import PaymentTermsModal from "@/components/modals/PaymentTermsModal.vue";
import DealStatusModal from "@/components/modals/DealStatusModal.vue";
</script>

<template>
  <main class="w-[calc(100vw-60px)] overflow-auto overscroll-contain p-5">
    <section class="mb-12">
      <div class="mt-24 p-4">
        <h2 class="mb-6 text-xl font-bold uppercase">System Settings</h2>
      </div>
      <div
        class="mx-6 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <!-- Commission Types -->

        <CommissionTypesModal
          class="bg-foreground_light dark:border-dark_border dark:bg-foreground_dark cursor-pointer rounded-md border-2 border-gray-200 shadow-sm transition-shadow hover:shadow-lg dark:shadow-gray-900"
        />
        <!-- Buyer Types -->

        <BuyerTypesModal
          class="bg-foreground_light dark:border-dark_border dark:bg-foreground_dark cursor-pointer rounded-md border-2 border-gray-200 shadow-sm transition-shadow hover:shadow-lg dark:shadow-gray-900"
        />
        <!-- Expense Items -->
        <ExpenseItemsModal
          class="bg-foreground_light dark:border-dark_border dark:bg-foreground_dark cursor-pointer rounded-md border-2 border-gray-200 shadow-sm transition-shadow hover:shadow-lg dark:shadow-gray-900"
        />
        <!-- GMTV Locations -->
        <GmtvLocationsModal
          class="bg-foreground_light dark:border-dark_border dark:bg-foreground_dark cursor-pointer rounded-md border-2 border-gray-200 shadow-sm transition-shadow hover:shadow-lg dark:shadow-gray-900"
        />
        <!-- Payment Terms -->

        <PaymentTermsModal
          class="bg-foreground_light dark:border-dark_border dark:bg-foreground_dark cursor-pointer rounded-md border-2 border-gray-200 shadow-sm transition-shadow hover:shadow-lg dark:shadow-gray-900"
        />
        <!-- Deal Status -->

        <DealStatusModal
          class="bg-foreground_light dark:border-dark_border dark:bg-foreground_dark cursor-pointer rounded-md border-2 border-gray-200 shadow-sm transition-shadow hover:shadow-lg dark:shadow-gray-900"
        />
      </div>
    </section>

    <section class="mb-12">
      <div class="mt-24 p-4">
        <h2 class="mb-6 text-xl font-bold uppercase">System Permissions</h2>
      </div>
    </section>
  </main>
</template>
