<template>
  <div class="template-details">
    <div v-if="loading" class="loader">Загрузка...</div>

    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else class="content">
      <h1>{{ template.title }}</h1>
      <p class="description">{{ template.description }}</p>

      <div class="tags">
        <strong>Теги:</strong>
        <span v-for="(tag, index) in template.tags" :key="index" class="tag">{{ tag }}</span>
      </div>

      <div class="author">
        <strong>Автор:</strong> {{ template.author }} (ID: {{ template.authorId }})
      </div>

      <div class="dates">
        <p><strong>Создан:</strong> {{ formatDate(template.createdAt) }}</p>
        <p><strong>Обновлён:</strong> {{ formatDate(template.updatedAt) }}</p>
      </div>

      <div class="stats">
        <button
            v-if="isLiked"
           @click="deleteLike"
           class="like-button liked">
          <strong>Лайки:</strong> {{ template.likesCount }}
        </button>
        <button v-else
           @click="addLike"
           class="like-button">
          <strong>Лайки:</strong> {{ template.likesCount }}
        </button>

        <p v-if="template.comments.length > 0" @click="showCommentsModal" class="p-click">
          <strong>Комментарии:</strong> {{ template.comments.length }}
        </p>
        <p v-else>
          <strong>Комментарии:</strong> {{ template.comments.length }}
        </p>
        <p><strong>Формы:</strong> {{ template.formsCount }}</p>
        <p><strong>Вопросов:</strong> {{ template.questionsCount }}</p>
      </div>

      <div class="authorized-users" v-if="template.authorisedEmails.length > 0">
        <strong>Доступ разрешён:</strong>
        <ul>
          <li v-for="(email, idx) in template.authorisedEmails" :key="idx">{{ email }}</li>
        </ul>
      </div>

      <button @click="$router.back()" class="back-button">Назад</button>
    </div>
  </div>

  <CommentsModal
      v-show="showCommentsModalVisible"
      v-model="showCommentsModalVisible"
      :comments="commentsWithSelected"
      :is-admin-or-owner="isAdminOrOwner"
      @comments-updated="handleCommentsUpdated"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api/api';
import CommentsModal from '@/components/modalPages/CommentsModal.vue';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const route = useRoute();

const loading = ref(true);
const error = ref(null);
const template = ref(null);
const showCommentsModalVisible = ref(false);
const isLiked = ref(false);
const userId = sessionStorage.getItem('userId');

const commentsWithSelected = computed(() => {
  if (!Array.isArray(template.value?.comments)) return [];

  return template.value.comments.map(comment => ({
    ...comment,
    selected: false
  }));
});

const isAdminOrOwner = computed(() => {
  if (!template.value) return false;

  const role = sessionStorage.getItem('role');
  const userId = sessionStorage.getItem('userId');
  return role === "Admin" || userId === template.value.authorId.toString()
});

const fetchTemplate = async (id) => {
  loading.value = true;
  try {
    const templateResponse = await api.getTemplateById(id);
    template.value = templateResponse.data;
    const likeResponse = await api.checkLike(template.value.id, userId)
    isLiked.value = likeResponse.data;
    console.log(isLiked.value);
  } catch (err) {
    console.error('Ошибка загрузки шаблона:', err);
    error.value = 'Не удалось загрузить шаблон';
  } finally {
    loading.value = false;
  }
};

const formatDate = (date) => {
  const newDate = date + 'Z';
  return dayjs(newDate).local().format('DD.MM.YYYY HH:mm');
};

const showCommentsModal = () => {
  showCommentsModalVisible.value = true;
};

const handleCommentsUpdated = () => {
  template.value = fetchTemplate(route.params.id);
};

const addLike = async () => {
  await api.addLike(template.value.id, userId);
  await fetchTemplate(route.params.id);
}

const deleteLike = async () => {
  await api.deleteLike(template.value.id, userId);
  await fetchTemplate(route.params.id);
}

onMounted(() => {
  const id = route.params.id;
  if (id) {
    fetchTemplate(id);
  } else {
    error.value = 'Шаблон не найден';
    loading.value = false;
  }
});
</script>

<style scoped>
.template-details {
  padding: 40px 20px;
  max-width: 1000px;
  margin: auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.loader {
  text-align: center;
  font-size: 20px;
  color: #666;
  font-style: italic;
}

.error {
  text-align: center;
  color: #e74c3c;
  font-size: 20px;
  font-weight: bold;
  margin-top: 40px;
}

.content {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 30px;
  animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

h1 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.description {
  white-space: pre-wrap;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 20px;
  color: #555;
}

.tags {
  margin-bottom: 20px;
}
.tag {
  display: inline-block;
  background: #ecf0f1;
  color: #2c3e50;
  padding: 6px 12px;
  margin-right: 8px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.author, .dates {
  margin-bottom: 16px;
  font-size: 15px;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.stats p {
  background: #f8f9fa;
  padding: 10px 16px;
  border-radius: 8px;
  margin: 0;
  font-size: 14px;
  color: #555;
  transition: background-color 0.3s ease;
}

.like-button {
  background: #f8f9fa;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.like-button:hover {
  background-color: #e9ecef;
}

.liked {
  background-color: #3498db;
  color: white;
}

.liked:hover {
  background-color: #2573a6;
}

.like-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.p-click{
  cursor: pointer;
}

.p-click:hover {
  background-color: #e9ecef;
}

.authorized-users ul {
  list-style-type: none;
  padding-left: 0;
}
.authorized-users li {
  display: inline-block;
  background: #dfeff9;
  padding: 6px 12px;
  margin: 4px;
  border-radius: 6px;
  font-size: 14px;
}

.comments h3 {
  font-size: 20px;
  margin-top: 30px;
  color: #333;
}

.comment-item p {
  margin: 4px 0;
}

.back-button {
  margin-top: 30px;
  padding: 12px 24px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  transition: background-color 0.3s ease;
}
.back-button:hover {
  background-color: #2980b9;
}
</style>