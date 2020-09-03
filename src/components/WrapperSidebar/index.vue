<script>
  import './index.less'
  import WrapperView from '@components/WrapperView'
  import { BSidebar, BButton, BNav, BNavItem, BIcon } from 'bootstrap-vue'
  import Vue from 'vue'
  import VueRouter from 'vue-router'

  Vue.use(VueRouter)

  export default {
    name: 'WebGlPage',
    components: { WrapperView, BSidebar, BButton, BNav, BNavItem, BIcon },
    props: {
      title: {
        type: String,
        required: true,
      },
      routes: {
        type: Array,
        required: true,
        default: () => []
      },
      bgVariant: {
        type: String,
        default: 'dark'
      },
      textVariant: {
        type: String,
        default: 'light'
      },
    },
    data() {
      return {
        visibleSidebar: false
      }
    },
    methods: {
      toggleSidebar() {
        this.visibleSidebar = !this.visibleSidebar
      },
      changeSidebar(visible) {
        this.visibleSidebar = visible
      }
    },
  }
</script>

<template>
  <WrapperView :disableScrolling="true" class="wrapper-sidebar">
    <BButton @click="toggleSidebar" :variant="bgVariant" class="wrapper-sidebar--button" size="sm">
      <BIcon icon="arrow-bar-right" />
    </BButton>
    <BSidebar
      @change="changeSidebar"
      shadow
      sidebar-class="wrapper-sidebar--outer"
      class="wrapper-sidebar--bar"
      :title="title"
      :bg-variant="bgVariant"
      :text-variant="textVariant"
      :visible="visibleSidebar"
      :backdrop="visibleSidebar"
    >
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
    </BSidebar>
    <slot />
  </WrapperView>
</template>