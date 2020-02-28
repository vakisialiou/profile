<script>
  import WrapperFreeArea from '@components/WrapperFreeArea'
  import LoadingModels from '@scene/loading/LoadingModels'
  import Engine from '@scene/Engine'
  import Unit from '@scene/units/Unit'
  import { Vector3, BoxGeometry, Mesh, MeshBasicMaterial } from 'three'

  const engine = Engine.get('model-tower-page-canvas')

  export default {
    name: 'ModelTowerPage',
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
      const loader = new LoadingModels()
        .enable(LoadingModels.MODEL_TOWER, true)

      loader.presetModels().then(() => {
        engine.preset().then(() => {
          const lightPosition = new Vector3(70, 70, 70)
          const cameraLookAt = new Vector3(0, 0, 0)
          const cameraPosition = new Vector3(-600, 0, 600)

          const rawModel = loader.getRawModel(LoadingModels.MODEL_TOWER)
          const unit = new Unit(rawModel)
            .setScale(10)
            .setPosition(new Vector3(0, 60, 100))
            .setRigidBody(engine.physicsWorld)
            .showRigidBodyHelper()

          engine
            .setDirLight(lightPosition)
            .setHemiLight(lightPosition)
            .setPointLight(lightPosition)
            .setAxesHelper()
            .setGridHelper(1000)
            .setCamera(cameraPosition, cameraLookAt)
            .setPhysicsGround()
            .enablePhysics(true)
            .addPhysicsUnit(unit)
            .render(document.getElementById('model-tower-page-canvas'))

          engine.updates.push((delta) => {

          })
        })
      })
    }
  }
</script>

<template>
  <WrapperFreeArea>
    <WrapperFreeArea id="model-tower-page-canvas" />
  </WrapperFreeArea>
</template>