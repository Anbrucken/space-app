import {createRouter, createWebHistory} from 'vue-router'
import CalendarPage from '../pages/CalendarPage.vue'
import GamePage from '../pages/GamePage.vue'
import NotFoundPage from '../pages/NotFoundPage.vue'
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Calendar',
            component: CalendarPage
        },
        {
            path: '/game',
            name: 'Game',
            component: GamePage
        },
        {
            path: '/:catchAll(.*)*',
            name: 'NotFound',
            component: NotFoundPage
        }
    ]
})

export default router;