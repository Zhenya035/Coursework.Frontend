import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from "@/Pages/LoginPage.vue";
import RegistrationPage from "@/Pages/RegistrationPage.vue";
import UsersPage from "@/Pages/UsersPage.vue";


const routes = [
    { path: '/login', component: LoginPage},
    { path: '/registration', component: RegistrationPage },
    { path: '/users', component: UsersPage },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/login'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router