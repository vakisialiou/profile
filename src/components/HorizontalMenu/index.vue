<script>
  import {
    BNavbarNav, BNavItem, BNavItemDropdown, BDropdownItemButton, BIcon
  } from 'bootstrap-vue'
  import Vue from 'vue'
  import VueRouter from 'vue-router'

  Vue.use(VueRouter)

  export default {
    name: 'HorizontalMenu',
    props: {
      /**
       * @type RouteItem
       */
      routes: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    components: {
      BNavbarNav, BNavItemDropdown, BDropdownItemButton, BIcon, BNavItem,
    }
  }
</script>

<template>
  <BNavbarNav>
    <template v-for="(route, index) in routes">
      <BNavItemDropdown :key="index" :text="route.title" v-if="route.children && route.children.length > 0">
        <template v-for="(subRoute, subIndex) in route.children">

          <RouterLink :to="subRoute.to" :key="subIndex" v-slot="{ href, navigate, isActive }">
            <BDropdownItemButton :active="isActive" :href="href" @click="navigate">
              <BIcon :icon="subRoute.icon" aria-hidden="true" v-if="subRoute.icon" />
              {{ subRoute.title }}
              <span class="sr-only">(Not selected)</span>
            </BDropdownItemButton>
          </RouterLink>

        </template>
      </BNavItemDropdown>

      <RouterLink :to="route.to" :key="index" v-slot="{ href, navigate, isActive }" v-if="route.children.length === 0">
        <BNavItem :active="isActive" :href="href" @click="navigate">
          <BIcon :icon="route.icon" aria-hidden="true" v-if="route.icon" />
          {{ route.title }}
          <span class="sr-only">(Not selected)</span>
        </BNavItem>
      </RouterLink>

    </template>
  </BNavbarNav>
</template>
