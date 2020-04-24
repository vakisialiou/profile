<script>
  import './index.less'

  export default {
    name: 'WrapperView',
    props: {
      bgId: {
        type: String,
        default: null
      },
      containerId: {
        type: String,
        default: null
      },
      enableEvents: {
        type: String,
        default: 'container'
      }
    },
    computed: {
      htmlClassBg: function () {
        return { 'wrapper-view__bg--active': this.enableEvents === 'bg' }
      },
      htmlClassContainer: function () {
        return { 'wrapper-view__container--active': this.enableEvents === 'container' }
      }
    }
  }
</script>

<template>
  <div class="wrapper-view">
    <div class="wrapper-view wrapper-view__bg" :class="htmlClassBg" :id="bgId">
      <slot name="bg" />
    </div>
    <div class="wrapper-view wrapper-view__container" :class="htmlClassContainer" :id="containerId">
      <slot />
    </div>
  </div>
</template>
