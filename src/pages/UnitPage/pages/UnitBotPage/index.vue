<script>
  import WrapperView from '@components/WrapperView'
  import Loading from '@scene/loading/Loading'
  import Engine from '@scene/Engine'
  import { Vector3 } from 'three'
  import { loading as loadingBot, ControllerBot } from '@scene/controllers/ControllerBot'
  import { loading as loadingGround, ControllerGround } from '@scene/controllers/ControllerGround'

  let engine = null

  const loader = new Loading()
    .addLoading(loadingBot)
    .addLoading(loadingGround)

  export default {
    name: 'UnitBotPage',
    components: {
      WrapperView
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
      engine = Engine.create('model-bot-page-canvas')
      const container = document.getElementById('model-bot-page-canvas')

      loader.preset().then(() => {
        engine.preset().then(() => {
          const lightPosition = new Vector3(70, 70, 70)
          const cameraLookAt = new Vector3(0, 0, 0)
          const cameraPosition = new Vector3(-600, 0, 600)

          const ground = new ControllerGround(loader)
            .preset(engine, container.offsetTop, container.offsetLeft)

          const bot = new ControllerBot(loader)
            .preset(engine, [ ground.clickHelperMesh ])

          engine
            .setDirLight(lightPosition)
            .setHemiLight(lightPosition)
            .setPointLight(lightPosition)
            .setCamera(cameraPosition, cameraLookAt)
            .setPhysicsGround({ size: [ground.width, 1, ground.height] })
            .render(container)
            .renderStats(container)
            .registerEvents()
            .animate()
        })
      })
    },
  }
</script>

<template>
  <WrapperView :autofill="true">
    <WrapperView id="model-bot-page-canvas" :autofill="true" />
  </WrapperView>
</template>