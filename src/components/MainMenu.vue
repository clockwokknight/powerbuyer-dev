<template>
    <section class="w-[60px] text-[#ffffff]">
        <nav>
            <ul class="flex flex-col items-center w-full menu-items">
                <router-link to="/">
                    <li class="w-[40px] h-[40px] bg-[#027bff] text-center font-bold rounded-md pt-[7px] mt-3 text-lg mb-5">PB</li>
                </router-link>
                <router-link to="/">
                    <li content="Dashbaord" v-tippy='{ placement : "right" }'><img src="/icons/SpaceDashboardRound.svg" /></li>
                </router-link>
                <router-link to="/deals">
                    <li content="Deals" v-tippy='{ placement : "right" }'><img src="/icons/MdPricetags.svg" /></li>
                </router-link>
                <router-link to="/inventory">
                    <li content="Inventory" v-tippy='{ placement : "right" }'><img src="/icons/CarSport.svg" /></li>
                </router-link>
            </ul>
        </nav>
    </section>
</template>

<script>
</script>
