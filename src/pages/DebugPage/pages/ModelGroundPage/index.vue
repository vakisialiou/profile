<script>
  import WrapperFreeArea from '@components/WrapperFreeArea'
  import LoadingTextures from '@scene/loading/LoadingTextures'
  import Ground from '@scene/objects/Ground'
  import Engine from '@scene/Engine'
  import { Vector3, Vector2 } from 'three'

  const engine = Engine.get('model-ground-page-canvas')

  export default {
    name: 'ModelGroundPage',
    components: {
      WrapperFreeArea
    },
    activated() {
      engine.registerEvents().animate()
    },
    deactivated() {
      engine.destroy()
    },
    destroyed() {
      engine.destroy()
    },
    mounted() {
      const loader = new LoadingTextures()
      loader.addItem('ground-grass', '/textures/grass/1.jpg')

      loader.presetTextures().then(() => {

        engine.preset().then(() => {
          const ground = new Ground()
            .setTexture(loader.get('ground-grass'), new Vector2(4, 4))
            .setGridPointsHelper()
            .setGridHelper()
            .setCellHelper()
            .render()
          engine.scene.add(ground)

          const lightPosition = new Vector3(70, 70, 70)
          const cameraLookAt = new Vector3(0, 0, 0)
          const cameraPosition = new Vector3(-600, 0, 600)

          engine
            .setDirLight(lightPosition)
            .setHemiLight(lightPosition)
            .setPointLight(lightPosition)
            .setAxesHelper()
            .setCamera(cameraPosition, cameraLookAt)
            .render(document.getElementById('model-ground-page-canvas'))
            .addEventListener(Engine.EVENT_MOUSE_DOWN, ({ event }) => {
              ground
                // This page has top menu. Need set mouse offset on height it menu.
                .setMouseOffset(event.target.offsetParent.offsetTop, event.target.offsetParent.offsetLeft)
                .onMouseEvent(event, engine.camera)
            })
        })
      })
    }
  }
</script>

<template>
  <WrapperFreeArea>
    <WrapperFreeArea id="model-ground-page-canvas" />
  </WrapperFreeArea>
</template>