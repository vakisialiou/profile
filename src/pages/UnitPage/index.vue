<script>
  import Vue from 'vue'
  import VueRouter from 'vue-router'
  Vue.use(VueRouter)

  export default {
    name: 'UnitPage',
  }
</script>

<template>
  <keep-alive :include="['ModelGroundPage', 'ModelTowerPage']">
    <RouterView />
  </keep-alive>
</template>