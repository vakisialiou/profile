<script>
  import './index.less'
  import WrapperView from '@components/WrapperView'
  import WrapperCorner from '@components/WrapperCorner'
  import { BSidebar, BButton, BNav, BNavItem, BIcon, BFormGroup, BFormRadioGroup } from 'bootstrap-vue'

  import { renderThreeScene, clearRenderThreeScene } from './v3/examples/three-scene'
  import { renderWebGlScene, clearRenderWebGLScene } from './v3/examples/webgl-scene'

  export default {
    name: 'WebGlPage',
    components: { WrapperView, WrapperCorner, BFormGroup, BFormRadioGroup, BSidebar, BButton, BNav, BNavItem, BIcon },
    computed: {
      id: function () {
        return this.$route.params.id
      }
    },
    updated: function () {
      this.render()
    },
    mounted: function () {
      this.offsetTop = this.$el.offsetTop
    },
    data() {
      return {
        offsetTop: 0,
        canvasId: 'canvas-container',
        selectedExample: 'custom',
        examples: [
          { text: 'Custom', value: 'custom' },
          { text: 'Three.js', value: 'three' }
        ],
      }
    },
    methods: {
      render: function () {
        const canvas = document.getElementById(this.canvasId)
        switch (this.selectedExample) {
          case 'three':
            clearRenderWebGLScene()
            renderThreeScene(canvas, this.offsetTop)
            break
          case 'custom':
            clearRenderThreeScene()
            renderWebGlScene(canvas, this.offsetTop)
            break
        }
      },
    }
  }
</script>

<template>
  <WrapperView class="webgl-container">
    <WrapperCorner :topOffset="offsetTop">
      <template slot="top-left">
        <BFormGroup class="m-2">
          <BFormRadioGroup v-model="selectedExample" :options="examples" />
        </BFormGroup>
      </template>
    </WrapperCorner>
    <canvas :id="canvasId" />
  </WrapperView>
</template>