import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import SuperheroManagement from './views/SuperManagement.vue'
import PentatlonSimulation from './views/PentatlonSimulation.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/superheros',
    name: 'SuperheroManagement',
    component: SuperheroManagement
  },
  {
    path: '/pentatlon',
    name: 'PentatlonSimulation',
    component: PentatlonSimulation
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router