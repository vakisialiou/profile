<script>
  import './index.less'
  import WrapperView from '@components/WrapperView'
  import { BSidebar, BButton, BNav, BNavItem, BIcon } from 'bootstrap-vue'

  export default {
    name: 'WrapperSidebar',
    components: { WrapperView, BSidebar, BButton, BNav, BNavItem, BIcon },
    props: {
      title: {
        type: String,
        required: true,
      },
      bgVariant: {
        type: String,
        default: 'dark'
      },
      textVariant: {
        type: String,
        default: 'light'
      },
      backdrop: {
        type: Boolean,
        default: true
      }
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
      :backdrop="backdrop && visibleSidebar"
    >
      <slot />
    </BSidebar>
  </WrapperView>
</template>