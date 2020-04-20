<script>
  import './App.css'
  import Vue from 'vue'
  import VueRouter from 'vue-router'
  import HorizontalMenu from './components/HorizontalMenu'
  import AppRoutes from './routes/AppRoutes'
  import { BNavbar, BNavbarBrand, BNavbarToggle, BCollapse, BNavbarNav, BImg } from 'bootstrap-vue'

  Vue.use(VueRouter)

  const appRoutes = new AppRoutes()

  export default {
    name: 'App',
    router: new VueRouter({ routes: appRoutes.fullRoutes }),
    computed: {
      horizontalMenuRoutes: () => {
        return appRoutes.horizontalMenuRoutes()
      },
      homePageRouter: () => {
        return appRoutes.homePageRouter()
      },
      keepAliveRoutes: () => {
        return appRoutes.keepAliveRoutes()
      }
    },
    methods: {

    },
    components: {
      HorizontalMenu,
      BNavbar, BNavbarBrand, BNavbarToggle, BCollapse, BNavbarNav, BImg
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
          <a href="/cv/Valery_Kiseliou_CV.pdf" target="_blank" class="text-light">
            <BImg src="/images/pages/home-page/pdf.svg" />
          </a>
        </BNavbarNav>
      </BCollapse>
    </BNavbar>

    <keep-alive :include="keepAliveRoutes">
      <RouterView />
    </keep-alive>

  </div>
</template>