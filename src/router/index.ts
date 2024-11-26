import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PokemonInfoView from '@/views/PokemonInfoView.vue'
import ShopView from '@/views/ShopView.vue'
import CatchLandView from '@/views/CatchLandView.vue'
import PokedexView from '@/views/PokedexView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/pokemon-info',
      name: 'pokemon info',
      component: PokemonInfoView,
    },
    {
      path: '/shop',
      name: 'shop',
      component: ShopView,
    },
    {
      path: '/catch-land',
      name: 'catch land',
      component: CatchLandView,
    },
    {
      path: '/pokedex',
      name: 'pokedex',
      component: PokedexView,
    },
  ],
})

export default router