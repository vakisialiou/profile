<script>
  import { BBadge } from 'bootstrap-vue'
  import WrapperView from '@components/WrapperView'
  import Ground from '@scene/objects/Ground'
  import Engine from '@scene/Engine'
  import { Vector3 } from 'three'

  let engine = null

  export default {
    name: 'UnitGroundPage',
    data: () => {
      return {
        click: JSON.stringify(new Vector3()),
      }
    },
    computed: {

    },
    components: {
      WrapperView,
      BBadge
    },
    activated() {
      engine.pause(false)
    },
    deactivated() {
      engine.pause(true)
    },
    destroyed() {
      engine.destroy()
    },
    mounted() {
      engine = Engine.create('model-ground-page-canvas')
      engine.preset().then(() => {
        const ground = new Ground()
          .setGridHelper()
          .setVertexHelper()
          .setClickHelper()
          .render()

        const lightPosition = new Vector3(70, 70, 70)
        const cameraLookAt = new Vector3(0, 0, 0)
        const cameraPosition = new Vector3(-600, 0, 600)

        engine
          .add('ground', ground)
          .setDirLight(lightPosition)
          .setHemiLight(lightPosition)
          .setAxesHelper()
          .setCamera(cameraPosition, cameraLookAt)
          .render(document.getElementById('model-ground-page-canvas'))
          .registerEvents()
          .animate()
          .addEventListener(Engine.EVENT_MOUSE_DOWN, ({ event }) => {
            ground
              // This page has top menu. Need set mouse offset on height it menu.
              .setMouseOffset(event.target.offsetParent.offsetTop, event.target.offsetParent.offsetLeft)
              .mouseUpdate(event, engine.camera, ({ click }) => {
                this.click = JSON.stringify(new Vector3().copy(click).round())
              })
          })
      })
    }
  }
</script>

<template>
  <WrapperView :autofill="true">
    <WrapperView id="model-ground-page-canvas" :autofill="true" />
    <WrapperView class="px-2 py-1">
      <BBadge>Click: {{click}}</BBadge>
    </WrapperView>
  </WrapperView>
</template>