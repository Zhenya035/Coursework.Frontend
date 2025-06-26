<template>
  <div class="user-list">
    <div class="toolbar">
      <div class="left-side">
        <button @click="blockUsers" class="btn btn-block">
          <img src="../assets/block.png" class="bi bi-block" title="block">
          Block
        </button>

        <button @click="unblockUsers" class="btn btn-unblock" title="Unblock">
          <img src="../assets/unblock.png" class="bi bi-unlock-fill">
          Unblock
        </button>

        <button @click="makeAdmin" class="btn btn-makeAdmin" title="make admin">
          <img src="../assets/makeAdmin.png" class="bi bi-admin-fill">
          Make admin
        </button>

        <button @click="makeUser" class="btn btn-makeUser" title="Make user">
          <img src="../assets/makeUser.png" class="bi bi-user-fill">
          Make user
        </button>

        <button @click="deleteUsers" class="btn btn-delete" title="Delete">
          <img src="../assets/delete.png" class="bi bi-trash-fill">
          Delete
        </button>

        <input type="text" placeholder="Filter" v-model="filterText" />
      </div>
      <div class="right-side">
        <button @click="logout" class="btn btn-logout">Logout</button>
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

<script>
import api from '../api/api.js';
import router from "../../router/index.js";

export default {
  data() {
    return {
      users: [],
      filterText: '',
      selectAll: false,
    };
  },
  computed: {
    filteredUsers() {
      const filter = this.filterText.toLowerCase();
      return this.users.filter(user => user.email.toLowerCase().includes(filter));
    }
  },
  methods: {
    toggleAllSelection() {
      this.users.forEach(user => user.selected = this.selectAll);
    },
    async fetchUsers() {
      try {
        const userId = sessionStorage.getItem('userId');
        const response = await api.getUsers(userId)
        this.users = response.data.map(user => ({
          ...user,
          selected: false,
        }));
      } catch (error) {
        console.error('Error for get users', error);

        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');

        if(error.response.status === 401) {
          await router.push({path: '/login',
            query: {error: 'unauthorized'}});
        }
        else if(error.response.status === 403) {
          await router.push({path: '/login',
            query: {error: 'blocked'}});
        }

        await router.push('/login');
      }
    },
    logout() {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('role');

      router.push('/login');
    },
    getSelectedUserIds() {
      return this.users
          .filter(user => user.selected)
          .map(user => user.id);
    },
    async blockUsers() {
      const selectedIds = this.getSelectedUserIds();
      if (selectedIds.length === 0) {
        alert('No users selected.');
        return;
      }

      try {
        await api.blockUsers(selectedIds);
        await this.fetchUsers();
        this.selectAll = false;
      } catch (error) {
        console.error('Error blocking users:', error);
        if(error.response.status === 403) {
          await router.push({path: '/login',
            query: {error: 'incorrect status'}});
        }
        else{
          alert('Failed to block users');
        }
      }
    },
    async unblockUsers() {
      const selectedIds = this.getSelectedUserIds();
      if (selectedIds.length === 0) {
        alert('No users selected.');
        return;
      }

      try {
        await api.unblockUsers(selectedIds);
        await this.fetchUsers();
        this.selectAll = false;
      } catch (error) {
        console.error('Error unblocking users:', error);
        if(error.response.status === 403) {
          await router.push({path: '/login',
            query: {error: 'incorrect status'}});
        }
        else{
          alert('Failed to unblock users');
        }
      }
    },
    async deleteUsers() {
      const selectedIds = this.getSelectedUserIds();
      if (selectedIds.length === 0) {
        alert('No users selected.');
        return;
      }

      try {
        await api.deleteUsers(selectedIds);
        await this.fetchUsers();
        this.selectAll = false;
      } catch (error) {
        console.error('Error deleting users:', error);
        if(error.response.status === 403) {
          await router.push({path: '/login',
            query: {error: 'incorrect status'}});
        }
        else{
          alert('Failed to delete users');
        }
      }
    },
    async makeAdmin() {
      const selectedIds = this.getSelectedUserIds();
      if (selectedIds.length === 0) {
        alert('No users selected.');
        return;
      }

      try {
        await api.makeAdmin(selectedIds);
        await this.fetchUsers();
        this.selectAll = false;
      }
      catch (error) {
        console.error('Error making admin users:', error);
        if(error.response.status === 403) {
          await router.push({path: '/login',
            query: {error: 'incorrect status'}});
        }
        else{
          alert('Failed to make admin for users');
        }
      }
    },
    async makeUser() {
      const selectedIds = this.getSelectedUserIds();
      if (selectedIds.length === 0) {
        alert('No users selected.');
        return;
      }

      try {
        await api.makeUser(selectedIds);
        await this.fetchUsers();
        this.selectAll = false;
      }
      catch (error) {
        console.error('Error making user this users:', error);
        if(error.response.status === 403) {
          await router.push({path: '/login',
            query: {error: 'incorrect status'}});
        }
        else{
          alert('Failed to make user for users');
        }
      }
    }
  },
  mounted() {
    this.fetchUsers();
  }
};
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

.btn-block, .btn-unblock,  .btn-makeAdmin, .btn-makeUser{
  background-color: #e3f2fd;
  color: #0d47a1;
}

.btn-delete {
  background-color: #ffcccc;
  color: #c62828;
}

.btn-logout{
  background-color: #e3f2fd;
  color: #0d47a1;
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

.bi{
  height: 20px;
  width: 20px;
}
</style>