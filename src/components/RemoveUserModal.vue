<template>
  <div class="modal" v-if="visible">
    <div class="modal-content">
      <h3>Убрать пользователей</h3>

      <div v-if="loading">Загрузка пользователей...</div>

      <multiselect
          v-model="selectedEmails"
          :options="userEmails"
          :multiple="true"
          placeholder="Выберите пользователей"
          class="multiselect"
          :searchable="true"
          :close-on-select="false"
      />

      <p v-if="selectedEmails.length === 0 && !loading" class="hint">Ничего не выбрано</p>

      <button @click="remove">Сохранить</button>
      <button @click="close">Закрыть</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import Multiselect from "vue-multiselect";

const props = defineProps( {
    visible: { type: Boolean, required: true },
    authorizedUsers:{ type: Array, default: () => [] }
})

const emit = defineEmits(['update:visible', 'remove']);

const userEmails = ref([]);
const selectedEmails = ref([]);
const loading = ref(false);

const availableEmails = computed(() => {
  return userEmails.value.filter(email => props.authorizedUsers.includes(email));
});

function remove() {
  emit('remove', selectedEmails.value);
  emit('update:visible', false);
  selectedEmails.value = [];
}

function close() {
  emit('update:visible', false);
  selectedEmails.value = [];
}

watch(
    () => props.visible,
    (newVal) => {
      if(newVal) {
        userEmails.value = [...props.authorizedUsers];
        selectedEmails.value = []
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