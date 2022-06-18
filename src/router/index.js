import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import TableGenerator from '../views/TableGenerator.vue';
import ClockSlide from '../views/ClockSlide.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/tablegenerator',
    name: 'TableGenerator',
    component: TableGenerator
  },
  {
    path: '/clockslide',
    name: 'ClockSlide',
    component: ClockSlide
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
