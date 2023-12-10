<template>
  <div class="fixed flex justify-center flex-shrink-0 w-full bg-white">
    <nav class="flex items-center flex-shrink-0 h-20 m-0">
      <NavBarBrand />
      <NavBarTabs />
      <NavBarButtons />
    </nav>
  </div>
</template>

<script setup lang="ts">
import NavBarBrand from "@/components/navigation/desktop/nav-bar-brand.vue";
import NavBarButtons from "@/components/navigation/desktop/nav-bar-buttons.vue";
import NavBarTabs from "@/components/navigation/desktop/nav-bar-tabs.vue";
</script>
