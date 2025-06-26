import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from "@/pages/LoginPage.vue";
import RegistrationPage from "@/pages/RegistrationPage.vue";
import UsersPage from "@/pages/UsersPage.vue";
import TemplatePage from "@/pages/TemplatePage.vue";

const routes = [
    { path: '/login', component: LoginPage},
    { path: '/registration', component: RegistrationPage },
    { path: '/users', component: UsersPage },
    { path: '/templates', component: TemplatePage },
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