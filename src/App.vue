<script setup>
import { useRoute} from "vue-router";
import NavBar from "/src/components/NavigationBar.vue";

const route = useRoute();
</script>

<template>
  <NavBar v-if="!['/login', '/registration'].includes(route.path)"/>

  <main :class="{'content-with-navbar': !['/login', '/registration'].includes(route.path),
  'page-container': true
  }">
    <router-view/>
  </main>
</template>

<style scoped>
.content-with-navbar {
  margin-top: 60px;
}
</style>
