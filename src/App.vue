<script setup>
    import MainMenu from '@/components/MainMenu.vue'
</script>

<template>
    <div class="bg-[#fff] h-full min-h-screen max-h-screen">
        <div class="flex">
            <aside class="w-[55px] bg-[#202124] h-full min-h-screen max-h-screen">
                <MainMenu />
            </aside>
            <section class="h-full max-h-screen min-h-screen p-4">
                <router-view />
            </section>
        </div>
    </div>
</template>

<style>
</style>
