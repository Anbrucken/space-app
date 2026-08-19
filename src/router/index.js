import {createRouter, createWebHistory} from 'vue-router'
import CalendarPage from '../pages/CalendarPage.vue'
import GamePage from '../pages/GamePage.vue'
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
        }
    ]
})

export default router;