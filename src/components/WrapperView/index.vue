<script>
  import './index.css'

  export default {
    name: 'WrapperView',
    props: {
      autofill: {
        type: Boolean,
        default: false
      },
      disableEvents: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      htmlClass: function () {
        return {
          'wrapper-view__lock': this.disableEvents,
          'wrapper-view__fill': this.autofill
        }
      }
    },
  }
</script>

<template>
  <div class="wrapper-view" :class="htmlClass">
    <slot />
  </div>
</template>
