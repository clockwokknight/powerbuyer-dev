<template>
    <div class="flex flex-row">
        <nav>
            <ul class="flex flex-col items-center w-full menu-items text-[#fff] max-w-[55px] overflow-hidden">
                <router-link to="/">
                    <li class="w-[40px] h-[40px] bg-[#027bff] text-center font-bold rounded-md pt-[7px] mt-3 text-lg">PB</li>
                </router-link>
                <router-link to="/">
                    <li>Dashboard</li>
                </router-link>
                <router-link to="/deals">
                    <li>Deals</li>
                </router-link>
                <router-link to="/inventory">
                    <li>Inventory</li>
                </router-link>
            </ul>
        </nav>
    </div>
</template>

<script>
</script>
