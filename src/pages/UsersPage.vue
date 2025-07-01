<template>
  <div class="user-list">
    <div class="toolbar">
      <div class="left-side">
        <button @click="blockUsers" class="btn btn-block">
          <img src="../assets/block.png" class="bi bi-block" title="block">
          Block
        </button>

        <button @click="unblockUsers" class="btn btn-unblock">
          <img src="../assets/unblock.png" class="bi bi-unlock-fill" title="Unblock">
          Unblock
        </button>

        <button @click="makeAdmin" class="btn btn-makeAdmin">
          <img src="../assets/makeAdmin.png" class="bi bi-admin-fill" title="make admin">
          Make admin
        </button>

        <button @click="makeUser" class="btn btn-makeUser">
          <img src="../assets/makeUser.png" class="bi bi-user-fill" title="Make user">
          Make user
        </button>

        <button @click="deleteUsers" class="btn btn-delete">
          <img src="../assets/delete.png" class="bi bi-trash-fill" title="Delete">
          Delete
        </button>

        <input type="text" placeholder="Filter" v-model="filterText" />
      </div>
    </div>

    <table class="user-table">
      <thead>
      <tr>
        <th><input type="checkbox" v-model="selectAll" @change="toggleAllSelection" /></th>
        <th>Name</th>
        <th>Email</th>
        <th>Status</th>
        <th>Role</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(user, index) in filteredUsers" :key="index">
        <td><input type="checkbox" v-model="user.selected" /></td>
        <td>{{ user.name }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.status }}</td>
        <td>{{ user.role }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../api/api.js';
import router from '../../router/index.js';

const users = ref([]);
const filterText = ref('');
const selectAll = ref(false);

const filteredUsers = computed(() => {
  const filter = filterText.value.toLowerCase();
  return users.value.filter(user => user.email.toLowerCase().includes(filter));
});

function toggleAllSelection() {
  users.value.forEach(user => user.selected = selectAll.value);
}

async function fetchUsers() {
  try {
    const userId = sessionStorage.getItem('userId');
    const response = await api.getUsers(userId);
    users.value = response.data.map(user => ({
      ...user,
      selected: false,
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    clearSessionAndRedirect(error);
  }
}

function getSelectedUserIds() {
  return users.value
      .filter(user => user.selected)
      .map(user => user.id);
}

async function blockUsers() {
  const selectedIds = getSelectedUserIds();
  if (!selectedIds.length) {
    alert('No users selected.');
    return;
  }

  try {
    await api.blockUsers(selectedIds);
    await fetchUsers();
    selectAll.value = false;
  } catch (error) {
    handleError(error, 'Failed to block users');
  }
}

async function unblockUsers() {
  const selectedIds = getSelectedUserIds();
  if (!selectedIds.length) {
    alert('No users selected.');
    return;
  }

  try {
    await api.unblockUsers(selectedIds);
    await fetchUsers();
    selectAll.value = false;
  } catch (error) {
    handleError(error, 'Failed to unblock users');
  }
}

async function deleteUsers() {
  const selectedIds = getSelectedUserIds();
  if (!selectedIds.length) {
    alert('No users selected.');
    return;
  }

  try {
    await api.deleteUsers(selectedIds);
    await fetchUsers();
    selectAll.value = false;
  } catch (error) {
    handleError(error, 'Failed to delete users');
  }
}

async function makeAdmin() {
  const selectedIds = getSelectedUserIds();
  if (!selectedIds.length) {
    alert('No users selected.');
    return;
  }

  try {
    await api.makeAdmin(selectedIds);
    await fetchUsers();
    selectAll.value = false;
  } catch (error) {
    handleError(error, 'Failed to make users admin');
  }
}

async function makeUser() {
  const selectedIds = getSelectedUserIds();
  if (!selectedIds.length) {
    alert('No users selected.');
    return;
  }

  try {
    await api.makeUser(selectedIds);
    await fetchUsers();
    selectAll.value = false;
  } catch (error) {
    handleError(error, 'Failed to make users regular');
  }
}

function handleError(error, defaultMessage) {
  console.error(defaultMessage + ':', error);
  if (error.response?.status === 403) {
    router.push({ path: '/login', query: { error: 'incorrect status' } });
  } else {
    alert(defaultMessage);
  }
}

function clearSessionAndRedirect(error) {
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('role');

  if (error.response?.status === 401) {
    router.push({ path: '/login', query: { error: 'unauthorized' } });
  } else if (error.response?.status === 403) {
    router.push({ path: '/login', query: { error: 'blocked' } });
  } else {
    router.push('/login');
  }
}

onMounted(fetchUsers);
</script>

<style scoped>
.user-list {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn {
  padding: 8px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

.btn-block,
.btn-unblock,
.btn-makeAdmin,
.btn-makeUser {
  background-color: #e3f2fd;
  color: #0d47a1;
}

.btn-delete {
  background-color: #ffcccc;
  color: #c62828;
}

input[type="text"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th,
.user-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.user-table th {
  font-weight: bold;
}

.user-table td input[type="checkbox"] {
  margin-right: 10px;
}

.bi {
  height: 20px;
  width: 20px;
}
</style>