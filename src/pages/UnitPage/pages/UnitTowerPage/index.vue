<script>
  import WrapperView from '@components/WrapperView'
  import Loading from '@scene/loading/Loading'
  import Engine from '@scene/Engine'
  import { Vector3 } from 'three'
  import { loading as loadingTower, ControllerTower } from '@scene/controllers/ControllerTower'
  import { loading as loadingGround, ControllerGround } from '@scene/controllers/ControllerGround'

  let engine = null

  const loader = new Loading()
    .addLoading(loadingTower)
    .addLoading(loadingGround)

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
      const container = document.getElementById('model-tower-page-canvas')

      loader.preset().then(() => {
        engine.preset().then(() => {
          const lightPosition = new Vector3(70, 70, 70)
          const cameraLookAt = new Vector3(0, 0, 0)
          const cameraPosition = new Vector3(-600, 0, 600)

          const ground = new ControllerGround(loader)
            .preset(engine, container.offsetTop, container.offsetLeft)

          const towersMap = [ new Vector3(-420, 0, 420), new Vector3(420, 0, 420), new Vector3(420, 0, -420), new Vector3(-420, 0, -420) ]

          for (let i = 0; i < towersMap.length; i++) {
            const tower = new ControllerTower(loader)
            tower.setPosition(towersMap[i])
            tower.preset(engine, [ ground.clickHelperMesh ])

            ground.onMouseDown(() => {
              tower.setTarget(ground.clickHelperMesh)
            })
          }

          engine
            .setDirLight(lightPosition)
            .setHemiLight(lightPosition)
            .setPointLight(lightPosition)
            .setCamera(cameraPosition, cameraLookAt)
            .setPhysicsGround({ size: [ground.width, 1, ground.height] })
            .render(container)
            .registerEvents()
            .animate()
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