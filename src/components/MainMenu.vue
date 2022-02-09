<template>
    <section class="w-[60px] text-[#ffffff]">
        <nav>
            <ul class="flex flex-col items-center w-full menu-items">
                <router-link to="/">
                    <li class="w-[40px] h-[40px] bg-[#027bff] hover:!bg-[#003874] text-center font-bold rounded-md !pt-[8px] !mt-5 text-lg !mb-5">PB</li>
                </router-link>
                <router-link to="/">
                    <li content="Dashbaord" v-tippy='{ placement : "right", duration: 50 }'><img src="/icons/SpaceDashboardRound.svg" /></li>
                </router-link>
                <router-link to="/deals">
                    <li content="Deals" v-tippy='{ placement : "right", duration: 50  }'><img src="/icons/MdPricetags.svg" /></li>
                </router-link>
                <router-link to="/inventory">
                    <li content="Inventory" v-tippy='{ placement : "right", duration: 50  }'><img src="/icons/CarSport.svg" /></li>
                </router-link>
                <router-link to="/lanes">
                    <li content="Lanes" v-tippy='{ placement : "right", duration: 50  }'><img class="h-5 mt-3" src="/icons/TrafficLight.svg" /></li>
                </router-link>
                <router-link to="/buyers">
                    <li content="Buyers" v-tippy='{ placement : "right", duration: 50  }'><img src="/icons/GroupsFilled.svg" /></li>
                </router-link>
                <router-link to="/vendors">
                    <li content="Vendors" v-tippy='{ placement : "right", duration: 50  }'><img class="h-4 mt-[15px]" src="/icons/Tools.svg" /></li>
                </router-link>
                <router-link to="/auctions">
                    <li content="Auctions" v-tippy='{ placement : "right", duration: 50  }'><img src="/icons/GavelRound.svg" /></li>
                </router-link>
            </ul>
        </nav>
    </section>
</template>

<script>

</script>
