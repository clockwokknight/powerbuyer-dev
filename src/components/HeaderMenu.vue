<template>
    <div class="flex items-center justify-between pl-4 pr-4 h-14">
        <div class="flex">
            <div class="mr-2 ">
                <!-- Icon for notifications -->
                <n-badge value="11">
                <div class="bg-[#202124] rounded-full w-[34px] h-[34px] flex justify-center pt-1">
                        <img class="h-[25px]" src="/icons/fire.svg" />
                </div>
                </n-badge>
            </div>
            <div>
                <!-- Profile Link -->
                <n-dropdown :options="userMenu">
                    <n-avatar round size="medium" class="bg-[#202124] cursor-pointer">
                    <!-- User initials -->
                    GL
                    </n-avatar>
                </n-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
import { h, defineComponent } from 'vue'

export default defineComponent({
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
          label: 'PowerBuyer',
          key: 'powerBuyer',
        },
        {
          label: 'Logout',
          key: 'logout',
        }
      ]
    }
  }
})
</script>
