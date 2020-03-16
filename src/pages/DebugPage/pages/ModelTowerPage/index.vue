<script>
  import WrapperView from '@components/WrapperView'
  import LoadingModels from '@scene/loading/LoadingModels'
  import Engine from '@scene/Engine'
  import Tower from '@scene/units/Tower'
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
            .setClickHelper()
            .setVertexHelper()
            .render()

          const rawModelTower1 = loader.getRawModel(LoadingModels.MODEL_TOWER)
          const tower1 = new Tower(rawModelTower1)
            .setScale(20)
            .setPosition(new Vector3(-120, 10, 120))
            .setRigidBody(engine.physicsWorld)
            .showRigidBodyHelper()

          tower1.addEventListener(Tower.EVENT_ADD_BULLET, (event) => engine.add('1-tower-bullet', event.bullet))
          tower1.addEventListener(Tower.EVENT_REMOVE_BULLET, (event) => engine.remove(event.bullet))
          tower1.addEventListener(Tower.EVENT_COLLISION_BULLET, (event) => {
            console.log(event)
          })

          const rawModelTower2 = loader.getRawModel(LoadingModels.MODEL_TOWER)
          const tower2 = new Tower(rawModelTower2)
            .setScale(20)
            .setPosition(new Vector3(120, 10, 120))
            .setRigidBody(engine.physicsWorld)
            .showRigidBodyHelper()

          tower2.addEventListener(Tower.EVENT_ADD_BULLET, (event) => engine.add('2-tower-bullet', event.bullet))
          tower2.addEventListener(Tower.EVENT_REMOVE_BULLET, (event) => engine.remove(event.bullet))

          const rawModelTower3 = loader.getRawModel(LoadingModels.MODEL_TOWER)
          const tower3 = new Tower(rawModelTower3)
            .setScale(20)
            .setPosition(new Vector3(120, 10, -120))
            .setRigidBody(engine.physicsWorld)
            .showRigidBodyHelper()

          tower3.addEventListener(Tower.EVENT_ADD_BULLET, (event) => engine.add('3-tower-bullet', event.bullet))
          tower3.addEventListener(Tower.EVENT_REMOVE_BULLET, (event) => engine.remove(event.bullet))

          const rawModelTower4 = loader.getRawModel(LoadingModels.MODEL_TOWER)
          const tower4 = new Tower(rawModelTower4)
            .setScale(20)
            .setPosition(new Vector3(-120, 10, -120))
            .setRigidBody(engine.physicsWorld)
            .showRigidBodyHelper()

          tower4.addEventListener(Tower.EVENT_ADD_BULLET, (event) => engine.add('4-tower-bullet', event.bullet))
          tower4.addEventListener(Tower.EVENT_REMOVE_BULLET, (event) => engine.remove(event.bullet))

          engine
            .setDirLight(lightPosition)
            .setHemiLight(lightPosition)
            .setPointLight(lightPosition)
            .setAxesHelper()
            .setCamera(cameraPosition, cameraLookAt)
            .setPhysicsGround({ size: [ground.options.width, 1, ground.options.height] })
            .enablePhysics(true)
            .add('tower', tower1)
            .add('tower', tower2)
            .add('tower', tower3)
            .add('tower', tower4)
            .add('ground', ground)
            .render(document.getElementById('model-tower-page-canvas'))
            .registerEvents()
            .animate()

          engine
            .addEventListener(Engine.EVENT_MOUSE_DOWN, ({ event }) => {
              ground
                // This page has top menu. Need set mouse offset on height it menu.
                .setMouseOffset(event.target.offsetParent.offsetTop, event.target.offsetParent.offsetLeft)
                .mouseUpdate(event, engine.camera, ({ click }) => {
                  tower1.setTarget(ground.clickHelperMesh)
                  tower2.setTarget(ground.clickHelperMesh)
                  tower3.setTarget(ground.clickHelperMesh)
                  tower4.setTarget(ground.clickHelperMesh)
                  // console.log(click)
                })
            })

          engine.updates.push((delta) => {
            const options = { delta, collisionObjects: [ ground.clickHelperMesh ] }
            tower1.update(options)
            tower2.update(options)
            tower3.update(options)
            tower4.update(options)
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