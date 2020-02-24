<script>
  import './App.css'
  import Vue from 'vue'
  import VueRouter from 'vue-router'
  import HorizontalMenu from './components/HorizontalMenu'
  import { routes } from './routes'
  import {
    BNavbar, BNavbarBrand, BNavbarToggle, BCollapse, BNavbarNav,
    BNavForm, BFormInput, BButton, BImg
  } from 'bootstrap-vue'

  Vue.use(VueRouter)

  export default {
    name: 'App',
    router: new VueRouter({ routes }),
    computed: {
      horizontalMenuRoutes: () => {
        return routes.filter((route) => route.types.includes('horizontal'))
      },
      homePageRouter: () => {
        return routes.find((route) => route.types.includes('home'))
      }
    },
    components: {
      HorizontalMenu,
      BNavbar, BNavbarBrand, BNavbarToggle, BCollapse, BNavbarNav,
      BNavForm, BFormInput, BButton, BImg
    }
  }
</script>

<template>
  <div>
    <BNavbar toggleable="lg" type="dark" variant="dark">
      <RouterLink :to="{ name: homePageRouter.name }" v-slot="{ href, navigate }">
        <BNavbarBrand :href="href" @click="navigate">
          <BImg v-bind="{ width: 40, height: 40, class: 'm1', src: '/images/me.jpeg' }" rounded="circle" alt="Circle image" />
        </BNavbarBrand>
      </RouterLink>

      <BNavbarToggle target="nav-collapse" />

      <BCollapse id="nav-collapse" is-nav>
        <HorizontalMenu :routes="horizontalMenuRoutes" />

        <!-- Right aligned nav items -->
        <BNavbarNav class="ml-auto">
          <BNavForm>
            <BFormInput size="sm" class="mr-sm-2" placeholder="Search" />
            <BButton size="sm" class="my-2 my-sm-0" type="submit">Search</BButton>
          </BNavForm>
        </BNavbarNav>
      </BCollapse>
    </BNavbar>

    <RouterView />

  </div>
</template>