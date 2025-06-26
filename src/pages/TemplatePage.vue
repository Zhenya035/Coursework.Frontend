<template>
  <div class="template-list">
    <div class="toolbar">
      <input type="text" placeholder="Filter" v-model="filterText" />
    </div>

    <table class="template-table">
      <thead>
      <tr>
        <th>Title</th>
        <th>Description</th>
        <th>Tags</th>
        <th>Likes</th>
        <th>Comment</th>
        <th>Author</th>
        <th>Created at</th>
        <th>Update at</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(template, index) in filteredTemplates" :key="index">
        <td>{{ template.title }}</td>
        <td class="description-table">{{ template.description }}</td>
        <td class="tags-table">{{ formatTags(template.tags) }}</td>
        <td>{{ template.likesCount }}</td>
        <td>{{ template.comments.length }}</td>
        <td>{{ template.author }}</td>
        <td>{{ formatDate(template.createdAt) }}</td>
        <td>{{ formatDate(template.updatedAt) }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from '../api/api.js';
import router from "../../router/index.js";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
export default {
  data() {
    return {
      templates: [],
      filterText: '',
      selectAll: false,
      role: sessionStorage.getItem('role'),
    };
  },
  computed:{
    filteredTemplates() {
      const filter = this.filterText.toLowerCase();
      return this.templates.filter(template => template.tags.some(tag => tag.toLowerCase().includes(filter)) ||
          template.title.toLowerCase().includes(filter));
    }
  },
  methods: {
    toggleAllSelection() {
      this.templates.forEach(template => template.selected = this.selectAll);
    },
    async fetchTemplates() {
      try {
        const userId = sessionStorage.getItem('userId');

        const userResponse = await api.getUserById(userId);
        const user = userResponse.data;

        const userInfo = {
          email: user.email,
          role: user.role
        }

        const templateResponse = await api.getTemplates(userInfo)

        this.templates = templateResponse.data.map(template => ({
          ...template,
          selected: false,
        }));
      } catch (error) {
        console.error('Error for get templates', error);

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
    formatTags(tags) {
      return tags ? tags.join(', ') : '';
    },
    formatDate(date) {
      const newDate = date + "Z";
      return dayjs(newDate).local().format('DD:MM:YYYY HH:mm');
    },
  },
  mounted() {
    this.fetchTemplates();
  }
}
</script>

<style scoped>
.template-list {
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

input[type="text"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
}

.template-table {
  width: 100%;
  border-collapse: collapse;
}

.template-table th,
.template-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.template-table th {
  font-weight: bold;
}

.template-table td input[type="checkbox"] {
  margin-right: 10px;
}

.description-table, .tags-table{
  width: 250px;
  word-wrap: break-word;
}
</style>