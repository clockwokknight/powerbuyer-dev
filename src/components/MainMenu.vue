<template>
  <section class="w-[60px] text-[#ffffff]">
    <nav>
      <ul class="menu-items flex w-full flex-col items-center">
        <router-link to="/">
          <li
            class="!mt-5 !mb-5 h-[40px] w-[40px] rounded-md !bg-[#027bff] !pt-[8px] text-center text-lg font-bold hover:!bg-[#003874]"
          >
            PB
          </li>
        </router-link>
        <router-link to="/">
          <li
            content="Dashbaord"
            v-tippy="{ placement: 'right', duration: 50 }"
          >
            <img src="/icons/SpaceDashboardRound.svg" />
          </li>
        </router-link>
        <router-link to="/deals">
          <li content="Deals" v-tippy="{ placement: 'right', duration: 50 }">
            <img src="/icons/MdPricetags.svg" />
          </li>
        </router-link>
        <router-link to="/inventory">
          <li
            content="Inventory"
            v-tippy="{ placement: 'right', duration: 50 }"
          >
            <img src="/icons/CarSport.svg" />
          </li>
        </router-link>
        <router-link to="/lanes">
          <li content="Lanes" v-tippy="{ placement: 'right', duration: 50 }">
            <img class="mt-3 h-5" src="/icons/TrafficLight.svg" />
          </li>
        </router-link>
        <router-link to="/buyers">
          <li content="Buyers" v-tippy="{ placement: 'right', duration: 50 }">
            <img src="/icons/GroupsFilled.svg" />
          </li>
        </router-link>
        <router-link to="/vendors">
          <li content="Vendors" v-tippy="{ placement: 'right', duration: 50 }">
            <img class="mt-[15px] h-4" src="/icons/Tools.svg" />
          </li>
        </router-link>
        <router-link to="/dealers">
          <li content="Dealers" v-tippy="{ placement: 'right', duration: 50 }">
            <img class="mt-[15px] h-4" src="/icons/Tools.svg" />
          </li>
        </router-link>
        <router-link to="/auctions">
          <li content="Auctions" v-tippy="{ placement: 'right', duration: 50 }">
            <img src="/icons/GavelRound.svg" />
          </li>
        </router-link>
        <router-link to="/system">
          <li
            content="More Items"
            v-tippy="{ placement: 'right', duration: 50 }"
          >
            <img src="/icons/OverflowMenuVertical.svg" />
          </li>
        </router-link>
      </ul>
    </nav>
  </section>
</template>

<script></script>
