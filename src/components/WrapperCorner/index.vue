<script>
  import './index.less'

  export default {
    name: 'WrapperCorner',
    props: {
      topOffset: {
        type: [String, Number],
        default: '0px'
      }
    },
    computed: {
      htmlStyles: function () {
        const topOffset = Number.isInteger(this.topOffset) ? `${this.topOffset}px` : this.topOffset
        return {
          'height': `calc(100% - ${topOffset})`
        }
      }
    },
  }
</script>

<template>
  <div class="wrapper-corner">
    <div class="wrapper-corner__container" :style="htmlStyles">
      <div class="wrapper-corner__row">
        <div class="wrapper-corner__section">
          <slot name="top-left" />
        </div>
        <div class="wrapper-corner__section">
          <slot name="top-right" />
        </div>
      </div>
      <div class="wrapper-corner__row">
        <div class="wrapper-corner__section">
          <slot name="bottom-left" />
        </div>
        <div class="wrapper-corner__section">
          <slot name="bottom-right" />
        </div>
      </div>
    </div>
  </div>
</template>
