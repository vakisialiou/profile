<script>
  import { BSidebar, BButton, BNav, BNavItem, BIcon } from 'bootstrap-vue'
  import Vue from 'vue'
  import VueRouter from 'vue-router'

  Vue.use(VueRouter)

  export default {
    name: 'VerticalMenu',
    components: { BSidebar, BButton, BNav, BNavItem, BIcon },
    props: {
      routes: {
        type: Array,
        required: true,
        default: () => []
      },
    },
  }
</script>

<template>
  <BNav vertical>
    <template v-for="(route, index) in routes">
      <RouterLink :to="route.to" :key="index" v-slot="{ href, navigate, isActive }" v-if="route.children.length === 0">
        <BNavItem :active="isActive" :href="href" @click="navigate">
          <BIcon :icon="route.icon" aria-hidden="true" v-if="route.icon" />
          {{ route.title }}
        </BNavItem>
      </RouterLink>
    </template>
  </BNav>
</template>