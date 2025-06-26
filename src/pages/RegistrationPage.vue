<script setup>
import userRegistration from "@/composables/userRegistration.js";

const {formData, submitForm, error} = userRegistration();

</script>

<template>
  <main class="form-signin">
    <form @submit.prevent="submitForm">
      <h1 class="h3 mb-3 fw-normal">Sign in</h1>

      <div class="form-floating">
        <input type="text" class="form-control" id="floatingInput" placeholder="name" v-model="formData.name" required>
        <label for="floatingInput">Name</label>
      </div>

      <div class="form-floating">
        <input type="email" class="form-control" id="floatingEmail" placeholder="name@example.com" v-model="formData.email" required>
        <label for="floatingEmail">Email</label>
      </div>

      <div class="form-floating">
        <input type="password" class="form-control" id="floatingPassword" placeholder="Password" v-model="formData.password" required>
        <label for="floatingPassword">Password</label>
      </div>

      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>

      <p class="mt-3 text-center">
        Are there already account?
        <router-link to="/login">Sign on</router-link>
      </p>
    </form>
  </main>
</template>

<style scoped>
.form-signin {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 450px;
  padding: 15px;
  margin: auto;
  min-height: 100vh;
}

.form-signin form{
  width: 100%;
  background-color: #f5f5f5;
  padding: 30px;
  border-radius: 25px;
}

.form-signin div{
  margin-bottom: 10px;
}

.form-group select{
  height: 58px;
  border-radius: 5px;
  border-style: hidden;
  padding: 16px 12px;
}


.form-group select{
  height: 58px;
  border-radius: 5px;
  border-style: hidden;
}
</style>