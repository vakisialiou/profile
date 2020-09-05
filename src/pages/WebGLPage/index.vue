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
        canvasIdWebGl: 'canvas-container-webgl',
        canvasIdThree: 'canvas-container-three',
      }
    },
    methods: {
      render: function () {
        const canvasWebGL = document.getElementById(this.canvasIdWebGl)
        const canvasThree = document.getElementById(this.canvasIdThree)
        console.log(canvasWebGL.offsetLeft, canvasWebGL.offsetTop)
        console.log(canvasThree.offsetLeft, canvasThree.offsetTop)
        renderThreeScene(canvasThree, this.offsetTop)
        renderWebGlScene(canvasWebGL, this.offsetTop)
      },
    }
  }
</script>

<template>
  <WrapperView class="webgl-container">
    <WrapperCorner :topOffset="offsetTop">
      <template slot="top-left">
        <div class="text-secondary m-2">Custom WebGL</div>
      </template>
      <template slot="top-right">
        <div class="text-secondary m-2">Three.js framework</div>
      </template>
    </WrapperCorner>
   <template slot="bg">
     <div class="row m-0">
       <div class="col-6 p-0 border border-secondary">
         <canvas :id="canvasIdWebGl" />
       </div>
       <div class="col-6 p-0 border border-secondary">
         <canvas :id="canvasIdThree" />
       </div>
     </div>
   </template>
  </WrapperView>
</template>