<template>
  <div class="modal" v-if="visible">
    <div class="modal-content" @click.stop>
      <h3>Добавить пользователей</h3>

      <div v-if="loading">Загрузка пользователей...</div>

      <multiselect
          v-model="selectedEmails"
          :options="availableEmails"
          :multiple="true"
          placeholder="Выберите пользователей"
          class="multiselect"
          :searchable="true"
          :close-on-select="false"
      />

      <p v-if="selectedEmails.length === 0 && !loading" class="hint">Ничего не выбрано</p>

      <div class="actions">
        <button @click="save" class="btn save">Сохранить</button>
        <button @click="close" class="btn cancel">Отмена</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import api from '@/api/api.js';
import Multiselect from 'vue-multiselect';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  authorizedUsers: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['save', 'update:visible']);

const userEmails = ref([]);
const selectedEmails = ref([]);
const loading = ref(false);
const userId = ref(sessionStorage.getItem("userId"));

const availableEmails = computed(() => {
  return userEmails.value.filter(email => !props.authorizedUsers.includes(email));
});

async function fetchUsers() {
  if (!userId.value) return;

  loading.value = true;
  try {
    const response = await api.getUsers(userId.value);
    userEmails.value = response.data.map(user => user.email);
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error);
    alert('Не удалось загрузить список пользователей');
  } finally {
    loading.value = false;
  }
}

function save() {
  emit('save', selectedEmails.value);
  emit('update:visible', false);
  selectedEmails.value = [];
}

function close() {
  emit('update:visible', false);
  selectedEmails.value = [];
}

watch(
    () => props.visible,
    async (newVal) => {
      if (newVal) {
        selectedEmails.value = [];
        await fetchUsers();
      }
    }
);
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.modal-content {
  background: white;
  padding: 25px;
  border-radius: 10px;
  width: 450px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  font-family: Arial, sans-serif;
}

.multiselect {
  margin-bottom: 20px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s ease;
}

.save {
  background-color: #42b983;
  color: white;
}

.save:hover {
  background-color: #36976a;
}

.cancel {
  background-color: #ccc;
  color: #333;
}

.cancel:hover {
  background-color: #bbb;
}

.hint {
  font-size: 0.9em;
  color: #888;
  margin-top: -10px;
  margin-bottom: 15px;
}
</style>