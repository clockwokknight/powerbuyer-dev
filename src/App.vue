<template>
    <div class="bg-[#fff] h-full min-h-screen max-h-screen overflow-hidden w-full">
        <div class="flex w-full">
            <aside class="w-[60px] bg-[#202124] h-full min-h-screen max-h-screen fixed">
                <MainMenu />
            </aside>
            <section class="flex h-full max-h-screen min-h-screen ml-[60px] relative w-full bg-[#F8F8FA]">
                <router-view />
            </section>
        </div>
    </div>
</template>

<script>
    import { defineComponent } from "vue";
    import MainMenu from '@/components/MainMenu.vue'

    export default defineComponent({
    components: {
    MainMenu
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
