<template>
    <div class="bg-[#fff] h-full min-h-screen max-h-screen">
        <div class="flex">
            <aside class="w-[60px] bg-[#202124] h-full min-h-screen max-h-screen">
                <MainMenu />
            </aside>
            <section class="h-full max-h-screen min-h-screen p-4">
                <HeaderMenu />
                <router-view />
            </section>
        </div>
    </div>
</template>

<script>
    import { defineComponent } from "vue";
    import MainMenu from '@/components/MainMenu.vue'
    import HeaderMenu from '@/components/HeaderMenu.vue'

    export default defineComponent({
    components: {
    MainMenu,
    HeaderMenu
    },
});
</script>
<style>
</style>
