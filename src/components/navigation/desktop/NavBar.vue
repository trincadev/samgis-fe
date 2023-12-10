<template>
  <div class="fixed flex flex-shrink-0 w-full">
    <nav class="flex items-center flex-shrink-0 h-20 m-0">
      <NavBarBrand />
      <NavBarTabs />
      <NavBarButtons />
    </nav>
  </div>
</template>

<script setup lang="ts">
import NavBarBrand from "@/components/navigation/desktop/NavBarBrand.vue";
import NavBarButtons from "@/components/navigation/desktop/NavBarButtons.vue";
import NavBarTabs from "@/components/navigation/desktop/NavBarTabs.vue";
</script>
