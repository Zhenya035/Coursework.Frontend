<template>
  <div class="context-menu" :style="{ top: position.y + 'px', left: position.x + 'px' }">
    <div class="menu-item" @click="handleAction('delete')">Удалить</div>
    <div class="menu-item" @click="handleAction('add')">Добавить пользователей</div>
    <div class="menu-item" @click="handleAction('remove')">Убрать пользователей</div>
  </div>
</template>

<script>
export default {
  props: {
    position: {
      type: Object,
      required: true,
      default: () => ({ x: 0, y: 0 })
    }
  },
  methods: {
    handleAction(action) {
      this.$emit('action', action);
    }
  }
};
</script>

<style scoped>
.context-menu {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 160px;
}

.menu-item {
  padding: 10px 15px;
  cursor: pointer;
}

.menu-item:hover {
  background-color: #f0f0f0;
}
</style>