<template>
  <div class="modal" v-if="visible">
    <div class="modal-content">
      <h3>Добавить пользователей</h3>

      <multiselect
          v-model="selectedEmails"
          :options="userEmails"
          :multiple="true"
          placeholder="Выберите пользователей"
          class="multiselect"
      />

      <button @click="save">Сохранить</button>
      <button @click="close">Закрыть</button>
    </div>
  </div>
</template>

<script>
import api from '@/api/api.js';
import Multiselect from 'vue-multiselect';

export default {
  components: {
    Multiselect
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    authorizedUsers:{
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      userEmails: [],
      selectedEmails: [],
      userId : sessionStorage.getItem("userId"),
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await api.getUsers(this.userId)
        this.userEmails = response.data.map(user => user.email);
        this.userEmails = this.userEmails.filter(email => !this.authorizedUsers.includes(email));
      } catch (error) {
        console.error('Ошибка загрузки пользователей', error);
      }
    },
    save() {
      this.$emit('save', this.selectedEmails);

      this.$emit('update:visible', false);
      this.selectedEmails = [];
    },
    close() {
      this.$emit('update:visible', false);
      this.selectedEmails = [];
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.fetchUsers();
      }
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style scoped>
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
  width: 400px;
}

.multiselect {
  margin-bottom: 20px;
}
</style>