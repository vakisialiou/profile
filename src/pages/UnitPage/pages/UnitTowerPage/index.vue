<script>
  import WrapperView from '@components/WrapperView'
  import Loading from '@scene/loading/Loading'
  import Engine from '@scene/Engine'
  import Bullet from '@scene/units/Bullet'
  import Tower from '@scene/units/Tower'
  import TowerEffect from '@scene/effects/TowerEffect'
  import BulletEffect from '@scene/effects/BulletEffect'
  import Ground from '@scene/objects/Ground'
  import { Vector3, AudioListener, PositionalAudio } from 'three'

  let engine = null

  const MODEL_TOWER = 'MODEL_TOWER'
  const AUDIO_TOWER_SHOT = 'AUDIO_TOWER_SHOT'
  const AUDIO_BULLET_COLLISION = 'AUDIO_BULLET_COLLISION'
  const TEXTURE_SMOKE_PARTICLE = 'TEXTURE_SMOKE_PARTICLE'

  const loader = new Loading()
    .addItem(Loading.TYPE_MODEL, MODEL_TOWER, '/models/tower/tower.glb')
    .addItem(Loading.TYPE_AUDIO, AUDIO_TOWER_SHOT, '/mp3/tower-shot.mp3')
    .addItem(Loading.TYPE_AUDIO, AUDIO_BULLET_COLLISION, '/mp3/bullet-collision.mp3')
    .addItem(Loading.TYPE_TEXTURE, TEXTURE_SMOKE_PARTICLE, '/images/spe/smokeparticle.png')

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
            .setGridHelper()
            .setClickHelper()
            .setVertexHelper()
            .render()

          const listener = new AudioListener()
          engine.camera.add(listener)

          const towersMap = [ new Vector3(-420, 10, 420), new Vector3(420, 10, 420), new Vector3(420, 10, -420), new Vector3(-420, 10, -420) ]

          for (let i = 0; i < towersMap.length; i++) {
            const EFFECT_TEXTURE = loader.getTexture(TEXTURE_SMOKE_PARTICLE)
            const towerEffect = new TowerEffect().createShootEffect(EFFECT_TEXTURE)

            const rawModelTower = loader.getRawModel(MODEL_TOWER)
            const tower = new Tower(rawModelTower)
              .setScale(20)
              .setPosition(towersMap[i])
              .setRigidBody(engine.physicsWorld)
              .showRigidBodyHelper()

            const bulletEffect = new BulletEffect().createShockWaveEffect(EFFECT_TEXTURE)

            engine
              .add('tower', tower) // Добавить на сцену баню.
              .add('tower-effect', towerEffect.getShootEffectMesh()) // Добавить на сцену эффекты
              .add('bullet-effect', bulletEffect.getShockWaveMesh()) // Добавить на сцену эффекты

            const towerShotAudio = new PositionalAudio(listener)
            towerShotAudio.setBuffer(loader.getAudioBuffer(AUDIO_TOWER_SHOT))
            tower.add(towerShotAudio)

            tower.addEventListener(Tower.EVENT_ADD_BULLET, (event) => {
              const direction = event.gunOptions.model.getWorldDirection(new Vector3()).multiplyScalar(-1)
              const position = event.gunOptions.model.getWorldPosition(new Vector3())
              const bullet = new Bullet(position, direction)
              bullet.setCollisionObjects([ ground.clickHelperMesh ])
              bullet.addEventListener(Bullet.EVENT_DESTROY, () => engine.remove(bullet))

              const bulletCollisionAudio = new PositionalAudio(listener)
              bulletCollisionAudio.setBuffer(loader.getAudioBuffer(AUDIO_BULLET_COLLISION))
              bullet.add(bulletCollisionAudio)

              bullet.addEventListener(Bullet.EVENT_COLLISION, () => {
                // Провацировать эффек взрывной волны.
                bulletEffect.emmitShockWaveEffect(bullet.position)
                engine.remove(bullet)
                // Добавить звук попадания
                if (!bulletCollisionAudio.isPlaying) {
                  bulletCollisionAudio.setVolume(50)
                  bulletCollisionAudio.play()
                }
              })

              engine.add('tower-bullet', bullet) // Добавить на сцену снаряд
              // Провацировать эффек выстрела.
              towerEffect.emmitShootEffect(bullet.position)

              // Добавить звук выстрела
              if (!towerShotAudio.isPlaying) {
                towerShotAudio.setVolume(50)
                towerShotAudio.play()
              }
            })

            engine.updates.push((delta) => {
              towerEffect.update(delta)
              bulletEffect.update(delta)
            })

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