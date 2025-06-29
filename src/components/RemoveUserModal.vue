<template>
  <div class="modal" v-if="visible">
    <div class="modal-content">
      <h3>Убрать пользователей</h3>
      <multiselect
          v-model="selectedEmails"
          :options="userEmails"
          :multiple="true"
          placeholder="Выберите пользователей"
          class="multiselect"
      />

      <button @click="remove">Сохранить</button>
      <button @click="close">Закрыть</button>
    </div>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";

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
      selectedEmails: []
    };
  },
  methods: {
    remove() {
      this.$emit('remove', this.selectedEmails);

      this.$emit('update:visible', false);
      this.selectedEmails = [];
    },
    close() {
      this.$emit('update:visible', false);
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.userEmails = [...this.authorizedUsers];
        this.selectedEmails = []
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