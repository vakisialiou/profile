<script>
  import WrapperView from '@components/WrapperView'
  import LoadingModels from '@scene/loading/LoadingModels'
  import Loading from '@scene/loading/Loading'
  import Engine from '@scene/Engine'
  import Bullet from '@scene/units/Bullet'
  import Tower from '@scene/units/Tower'
  import TowerEffect from '@scene/effects/TowerEffect'
  import Ground from '@scene/objects/Ground'
  import { Vector3 } from 'three'

  let engine = null

  const TEXTURE_SMOKE_PARTICLE = 'TEXTURE_SMOKE_PARTICLE'
  const loader = new Loading()
    .addItem(Loading.TYPE_TEXTURE, TEXTURE_SMOKE_PARTICLE, '/images/spe/smokeparticle.png')
    .enableItem(Loading.TYPE_MODEL, LoadingModels.MODEL_TOWER, true)

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

      loader.preset().then(() => {
        engine.preset().then(() => {
          const lightPosition = new Vector3(70, 70, 70)
          const cameraLookAt = new Vector3(0, 0, 0)
          const cameraPosition = new Vector3(-600, 0, 600)

          const ground = new Ground()
            .setGridHelper()
            .setClickHelper()
            .setVertexHelper()
            .render()

          const towersMap = [ new Vector3(-120, 10, 120), new Vector3(120, 10, 120), new Vector3(120, 10, -120), new Vector3(-120, 10, -120) ]

          for (let i = 0; i < towersMap.length; i++) {
            const EFFECT_TOWER = 'shot'
            const EFFECT_TEXTURE = loader.getTexture(TEXTURE_SMOKE_PARTICLE)
            const towerEffect = new TowerEffect().createShootEffect(EFFECT_TOWER, EFFECT_TEXTURE)

            const rawModelTower = loader.getRawModel(LoadingModels.MODEL_TOWER)
            const tower = new Tower(rawModelTower)
              .setScale(20)
              .setPosition(towersMap[i])
              .setRigidBody(engine.physicsWorld)
              .showRigidBodyHelper()

            engine
              .add('tower', tower) // Добавить на сцену баню.
              .add('tower-effect', towerEffect.getMesh(EFFECT_TOWER)) // Добавить на сцену эффекты

            tower.addEventListener(Tower.EVENT_ADD_BULLET, (event) => {
              const direction = event.gunOptions.model.getWorldDirection(new Vector3()).multiplyScalar(-1)
              const position = event.gunOptions.model.getWorldPosition(new Vector3())
              const bullet = new Bullet(position, direction)
              bullet.setCollisionObjects([ ground.clickHelperMesh ])
              bullet.addEventListener(Bullet.EVENT_DESTROY, () => engine.remove(bullet))
              bullet.addEventListener(Bullet.EVENT_COLLISION, () => engine.remove(bullet))

              engine.add('tower-bullet', bullet) // Добавить на сцену снаряд
              // Провацировать эффек выстрела.
              towerEffect.emmitEffect(EFFECT_TOWER, bullet.position)
            })

            engine.updates.push((delta) => towerEffect.update(delta))

            engine.addEventListener(Engine.EVENT_MOUSE_DOWN, ({ event }) => {
              ground.mouseUpdate(event, engine.camera)
              tower.setTarget(ground.clickHelperMesh)
            })
          }

          engine
            .setDirLight(lightPosition)
            .setHemiLight(lightPosition)
            .setPointLight(lightPosition)
            .setAxesHelper()
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