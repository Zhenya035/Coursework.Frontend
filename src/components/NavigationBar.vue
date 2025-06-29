<template>
  <nav class="navbar">
    <ul class="navbar-menu">
      <li v-if="role === 'Admin'"><router-link to="/users">Пользователи</router-link></li>
      <li><router-link to="/templates">Шаблоны</router-link></li>
    </ul>

    <a href="#" @click.prevent="logout">Выход</a>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {ref, onMounted } from 'vue'

const router = useRouter()
const role = ref(null)

function loadRole()
{
  role.value = sessionStorage.getItem("role")
}

async function logout() {
  sessionStorage.clear();
  await router.push('/login');
}

onMounted(() => {
  loadRole()
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #2c3e50;
  color: white;
  padding: 15px 30px;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.navbar a:hover {
  text-decoration: underline;
}

.navbar-menu {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 20px;
}
</style>