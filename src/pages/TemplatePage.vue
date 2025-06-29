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
      <tr v-for="(template, index) in filteredTemplates" :key="index"
          @contextmenu.prevent="showContextMenu($event, template)">
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

    <context-menu
        v-if="contextMenu.visible"
        :position="contextMenu"
        @action="handleMenuAction"
    />

    <add-users-modal
        v-model:visible="modals.add"
        :authorized-users = "authorizedUsers"
        @save="handleAddUsers"
    />

    <remove-user-modal
        v-model:visible="modals.remove"
        :authorized-users = "authorizedUsers"
        @remove="handleRemoveUsers"
    />
  </div>
</template>

<script>
import api from '../api/api.js';
import router from "../../router/index.js";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import ContextMenu from '@/components/ContextMenu.vue';
import AddUsersModal from '@/components/AddUserModal.vue';
import RemoveUserModal from '@/components/RemoveUserModal.vue';

dayjs.extend(utc);
dayjs.extend(timezone);
export default {
  components: {
    ContextMenu,
    AddUsersModal,
    RemoveUserModal,
  },
  data() {
    return {
      templates: [],
      filterText: '',
      role: sessionStorage.getItem('role'),
      userId: sessionStorage.getItem('userId'),
      authorizedUsers: [],
      contextMenu: {
        visible: false,
        x: 0,
        y: 0
      },
      selectedTemplate: null,
      modals: {
        add: false,
        remove: false
      }
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
    showContextMenu(event, template) {
      this.selectedTemplate = template;
      if(this.role ==='Admin' || this.userId === this.selectedTemplate.authorId.toString()) {
        const {clientX: x, clientY: y} = event;
        this.contextMenu = {visible: true, x, y};
      }
    },
    handleMenuAction(action) {
      switch (action) {
        case 'delete':
          this.deleteTemplate();
          break;
        case 'add':
          this.openAddModal();
          break;
        case 'remove':
          this.openRemoveModal();
          break;
        default:
          console.warn(`Unknown action: ${action}`);
      }
    },
    async deleteTemplate() {
      if (!this.selectedTemplate) return;

      const index = this.selectedTemplate.id;
      if (index !== -1) {
        await api.deleteTemplates(index);
        await this.fetchTemplates()
        this.contextMenu.visible = false;
        alert(`Шаблон "${this.selectedTemplate.title}" удален`);
      }
    },
    openAddModal() {
      this.contextMenu.visible = false;
      this.authorizedUsers = this.selectedTemplate.authorisedEmails;
      this.modals.add = true;
    },
    async handleAddUsers(emails) {
      console.log('Выбранные email:', emails);
      console.log('Template id:', this.selectedTemplate.id);
      const emailsDto = {
        emails: emails
      }
      await api.addAuthorizedUsers(this.selectedTemplate.id, emailsDto);
      await this.fetchTemplates()
    },
    openRemoveModal() {
      this.contextMenu.visible = false;
      this.authorizedUsers = this.selectedTemplate.authorisedEmails;
      this.modals.remove = true;
    },
    async handleRemoveUsers(emails) {
      console.log('Выбранные email:', emails);
      console.log('Template id:', this.selectedTemplate.id);
      const emailsDto = {
        emails: emails
      }
      await api.deleteAuthorizedUsers(this.selectedTemplate.id, emailsDto);
      await this.fetchTemplates()
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
  width: 300px;
  max-width: 300px;
  word-wrap: break-word;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>