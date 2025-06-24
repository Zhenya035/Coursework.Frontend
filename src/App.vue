<script setup>
import { useRoute} from "vue-router";
const route = useRoute();
</script>

<template>
  <main :class="{'page-container': !['/login', '/registration'].includes(route.path)}">
    <router-view/>
  </main>
</template>

<style scoped>

</style>
