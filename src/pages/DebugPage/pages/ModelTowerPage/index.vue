<script>
  import WrapperView from '@components/WrapperView'
  import LoadingModels from '@scene/loading/LoadingModels'
  import Engine from '@scene/Engine'
  import Unit from '@scene/units/Unit'
  import Ground from '@scene/objects/Ground'
  import { Vector3 } from 'three'

  let engine = null

  export default {
    name: 'ModelTowerPage',
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
      const loader = new LoadingModels()
        .enableItem(LoadingModels.MODEL_TOWER, true)

      loader.presetModels().then(() => {
        engine.preset().then(() => {
          const lightPosition = new Vector3(70, 70, 70)
          const cameraLookAt = new Vector3(0, 0, 0)
          const cameraPosition = new Vector3(-600, 0, 600)

          const ground = new Ground()
            .setGridHelper()
            .setVertexHelper()
            .render()

          const rawModel = loader.getRawModel(LoadingModels.MODEL_TOWER)
          const unit = new Unit(rawModel)
            .setScale(20)
            .setPosition(new Vector3(0, 60, 500))
            .setRigidBody(engine.physicsWorld)
            .showRigidBodyHelper()

          engine
            .setDirLight(lightPosition)
            .setHemiLight(lightPosition)
            .setPointLight(lightPosition)
            .setAxesHelper()
            .setCamera(cameraPosition, cameraLookAt)
            .setPhysicsGround({ size: [ground.options.width, 1, ground.options.height] })
            .enablePhysics(true)
            .add('tower', unit)
            .add('ground', ground)
            .render(document.getElementById('model-tower-page-canvas'))
            .registerEvents()
            .animate()

          engine.updates.push((delta) => {

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