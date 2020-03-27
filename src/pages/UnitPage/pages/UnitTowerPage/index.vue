<script>
  import WrapperView from '@components/WrapperView'
  import Loading from '@scene/loading/Loading'
  import Engine from '@scene/Engine'
  import Ground from '@scene/objects/Ground'
  import { Vector3 } from 'three'
  import { loading, ControllerTower } from '@scene/controllers/ControllerTower'

  let engine = null

  const loader = new Loading().addLoading(loading)

  export default {
    name: 'UnitTowerPage',
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
      engine = Engine.create('model-tower-page-canvas')

      loader.preset().then(() => {
        engine.preset().then(() => {
          const lightPosition = new Vector3(70, 70, 70)
          const cameraLookAt = new Vector3(0, 0, 0)
          const cameraPosition = new Vector3(-600, 0, 600)

          const ground = new Ground()
            .setClickHelper()
            .setVertexHelper()
            .render()

          const towersMap = [ new Vector3(-420, 0, 420), new Vector3(420, 0, 420), new Vector3(420, 0, -420), new Vector3(-420, 0, -420) ]

          for (let i = 0; i < towersMap.length; i++) {
            const tower = new ControllerTower(loader)
            tower.setPosition(towersMap[i])
            tower.preset(engine, [ ground.clickHelperMesh ])

            engine.addEventListener(Engine.EVENT_MOUSE_DOWN, ({ event }) => {
              ground.mouseUpdate(event, engine.camera)
              tower.setTarget(ground.clickHelperMesh)
            })
          }

          engine
            .setDirLight(lightPosition)
            .setHemiLight(lightPosition)
            .setPointLight(lightPosition)
            .setCamera(cameraPosition, cameraLookAt)
            .setPhysicsGround({ size: [ground.options.width, 1, ground.options.height] })
            .add('ground', ground)
            .render(document.getElementById('model-tower-page-canvas'))
            .registerEvents()
            .animate()

          engine.addEventListener(Engine.EVENT_MOUSE_DOWN, ({ event }) => {
            // This page has top menu. Need set mouse offset on height it menu.
            ground.setMouseOffset(event.target.offsetParent.offsetTop, event.target.offsetParent.offsetLeft)
          })
        })
      })
    },
  }
</script>

<template>
  <WrapperView :autofill="true">
    <WrapperView id="model-tower-page-canvas" :autofill="true" />
  </WrapperView>
</template>