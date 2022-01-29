<template>
    <div class="bg-[#fff] h-full min-h-screen max-h-screen overflow-hidden w-full">
        <div class="flex w-full">
            <aside class="w-[60px] bg-[#202124] h-full min-h-screen max-h-screen fixed">
                <MainMenu />
            </aside>
            <section class="flex h-full max-h-screen min-h-screen ml-[60px] relative w-full bg-[#F8F8FA]">
                <!-- Don't show PageItemsList on dashboard  | Current Page List -->
                <div>
                    <PageItemsList class="z-10"/>
                </div>
                <!-- Main Tabs App Content -->
                <div class="relative w-full">
                    <div class="flex justify-between w-full">
                        <PageTabs />
                        <HeaderMenu />
                    </div>
                    <router-view class="h-screen overflow-auto overflow-x-hidden bg-white" />
                </div>
            </section>
        </div>
    </div>
</template>

<script>
    import { defineComponent } from "vue";
    import MainMenu from '@/components/MainMenu.vue'
    import HeaderMenu from '@/components/HeaderMenu.vue'
    import PageItemsList from '@/components/PageItemsList.vue';
    import PageTabs from '@/components/PageTabs.vue';

    export default defineComponent({
    components: {
    MainMenu,
    HeaderMenu,
    PageItemsList,
    PageTabs
},
setup () {
    return {
      userMenu: [
        {
          label: 'Profile',
          key: 'profile',
        },
        {
          label: 'Edit Profile',
          key: 'editProfile',
        },
        {
          label: 'Logout',
          key: 'logout',
        }
      ]
    }
  }
});
</script>
<style>
</style>
