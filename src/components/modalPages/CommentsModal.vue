<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h3>Все комментарии</h3>

      <div class="modal-comment-list">
        <div class="toolbar">
          <div class="left-side">
            <button @click="deleteSelected" class="btn btn-delete" title="Delete">
              <img src="../../assets/delete.png" class="bi bi-trash-fill" />
              Удалить
            </button>
          </div>
        </div>

        <div v-for="comment in sortedComments" :key="comment.id" class="modal-comment-item">
          <input type="checkbox" v-model="comment.selected" />
          <p class="comment-header">
            <span class="comment-author"><strong>{{ comment.author }}</strong></span>
            <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
          </p>
          <p>{{ comment.content }}</p>
        </div>
      </div>

      <button class="close-button" @click="close">Закрыть</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const props = defineProps({
  comments: {
    type: Array,
    required: true,
    default: () => []
  },
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'delete-selected']);

const formatDate = (date) => {
  const newDate = date + "Z";
  return dayjs(newDate).local().format('DD.MM.YYYY HH:mm');
};

const sortedComments = computed(() => {
  if (!props.comments) return [];
  return [...props.comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

const close = () => {
  emit('update:modelValue', false);
};

const deleteSelected = () => {
  emit('delete-selected');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  position: relative;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-delete {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #ffcccc;
  color: #c62828;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.bi {
  height: 20px;
  width: 20px;
  margin-right: 6px;
}

.modal-comment-list {
  margin-top: 10px;
}

.modal-comment-item {
  border-bottom: 1px solid #eee;
  padding: 12px 0;
}

.close-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #ccc;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.close-button:hover {
  background-color: #bbb;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.comment-author {
  font-size: 15px;
}

.comment-date {
  font-size: 13px;
  color: #888;
  white-space: nowrap;
}
</style>