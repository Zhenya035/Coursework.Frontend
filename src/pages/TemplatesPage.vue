<template>
  <div class="template-list">
    <div class="toolbar">
      <input type="text" placeholder="Filter" v-model="filterText" />
    </div>

    <table class="template-table">
      <thead>
      <tr>
        <th>Title</th>
        <th>Tags</th>
        <th>Author</th>
        <th>Created at</th>
        <th>Update at</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="template in filteredTemplates"
          :key="template.id"
          @click="goToTemplate(template)"
          @contextmenu.prevent="showContextMenu($event, template)"
      >
        <td>{{ template.title }}</td>
        <td class="tags-table">{{ formatTags(template.tags) }}</td>
        <td>{{ template.author }}</td>
        <td class="date">{{ formatDate(template.createdAt) }}</td>
        <td class="date">{{ formatDate(template.updatedAt) }}</td>
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
        :authorized-users="selectedTemplate?.authorisedEmails || []"
        @save="handleAddUsers"
    />

    <remove-user-modal
        v-model:visible="modals.remove"
        :authorized-users="selectedTemplate?.authorisedEmails || []"
        @remove="handleRemoveUsers"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted} from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import api from '../api/api.js';
import ContextMenu from '@/components/ContextMenu.vue';
import AddUsersModal from '@/components/AddUserModal.vue';
import RemoveUserModal from '@/components/RemoveUserModal.vue';

dayjs.extend(utc);
dayjs.extend(timezone);

const router = useRouter();

const templates = ref([]);
const filterText = ref('');
const role = ref(sessionStorage.getItem('role'));
const userId = ref(Number(sessionStorage.getItem('userId')));
const contextMenu = ref({ visible: false, x: 0, y: 0 });
const selectedTemplate = ref(null);
const modals = ref({ add: false, remove: false });

const filteredTemplates = computed(() => {
  const filter = filterText.value.toLowerCase();
  return templates.value.filter(
      (template) =>
          template.title.toLowerCase().includes(filter) ||
          template.tags.some((tag) => tag.toLowerCase().includes(filter))
  );
});

function goToTemplate(template) {
  router.push({ name: 'Template', params: { id: template.id } });
}

function showContextMenu(event, template) {
  selectedTemplate.value = template;
  if (role.value === 'Admin' || userId.value === template.authorId) {
    const { clientX: x, clientY: y } = event;
    contextMenu.value = { visible: true, x, y };
  }
}

function handleMenuAction(action) {
  switch (action) {
    case 'delete':
      deleteTemplate();
      break;
    case 'add':
      openAddModal();
      break;
    case 'remove':
      openRemoveModal();
      break;
    default:
      console.warn(`Unknown action: ${action}`);
  }
}

async function deleteTemplate() {
  if (!selectedTemplate.value) return;

  try {
    await api.deleteTemplates(selectedTemplate.value.id);
    fetchTemplates();
    contextMenu.value.visible = false;
    alert(`Шаблон "${selectedTemplate.value.title}" удален`);
  } catch (error) {
    console.error('Ошибка удаления шаблона:', error);
  }
}

function openAddModal() {
  contextMenu.value.visible = false;
  modals.value.add = true;
}

async function handleAddUsers(emails) {
  try {
    await api.addAuthorizedUsers(selectedTemplate.value.id, { emails });
    fetchTemplates();
    modals.value.add = false;
  } catch (error) {
    console.error('Ошибка добавления пользователей:', error);
  }
}

function openRemoveModal() {
  contextMenu.value.visible = false;
  modals.value.remove = true;
}

async function handleRemoveUsers(emails) {
  try {
    await api.deleteAuthorizedUsers(selectedTemplate.value.id, { emails });
    fetchTemplates();
    modals.value.remove = false;
  } catch (error) {
    console.error('Ошибка удаления пользователей:', error);
  }
}

async function fetchTemplates() {
  try {
    const userResponse = await api.getUserById(userId.value);
    const user = userResponse.data;

    const userInfo = {
      email: user.email,
      role: user.role
    };

    const response = await api.getTemplates(userInfo);
    templates.value = response.data.map((template) => ({
      ...template,
      selected: false,
    }));
  } catch (error) {
    console.error('Ошибка при загрузке шаблонов', error);
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');

    const route = {
      path: '/login',
      query: { error: 'unauthorized' },
    };

    if (error.response?.status === 403) {
      route.query.error = 'blocked';
    }

    await router.push(route);
  }
}

function formatTags(tags) {
  return tags ? tags.join(', ') : '';
}

function formatDate(date) {
  return dayjs.utc(date).local().format('DD.MM.YYYY HH:mm');
}

const handleDocumentClick = (event) => {
  const menuElement = document.querySelector('.context-menu');

  if (contextMenu.value.visible && (!menuElement || !menuElement.contains(event.target))) {
    contextMenu.value.visible = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick);
})

fetchTemplates();
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

.date {
  width: 150px;
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

.tags-table {
  max-width: 500px;
  word-wrap: break-word;
}
</style>