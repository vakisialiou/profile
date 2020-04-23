<script>
  import './index.less'
  import { BFormGroup, BFormRadioGroup, BFormCheckbox, BPopover, BIcon, BButton } from 'bootstrap-vue'
  import WrapperView from '@components/WrapperView'
  import GitHubIcon from '@components/GitHubIcon'
  import Loading from '@scene/loading/Loading'
  import Engine from '@scene/Engine'
  import { Vector3, Color } from 'three'
  import { loading as loadingBot, MODEL_BOT } from '@scene/controllers/ControllerBot'
  import { loading as loadingTower, MODEL_TOWER } from '@scene/controllers/ControllerTower'
  import HelperMouseClick from '@scene/objects/Ground/Helpers/HelperMouseClick'
  import Ground from '@scene/objects/Ground'
  import Shape from '@scene/objects/Shape'
  import Unit from '@scene/units/Unit'
  import Bot from '@scene/units/Bot'
  import Tower from '@scene/units/Tower'

  let engine = null
  let userTarget = new Vector3()

  const TEXTURE_GROUND = 'TEXTURE_GROUND'

  const loader = new Loading()
    .addLoading(loadingBot)
    .addLoading(loadingTower)
    .addItem(Loading.TYPE_TEXTURE, TEXTURE_GROUND, '/models/ground/grass/1.jpg')

  export default {
    name: 'OutlinePage',
    components: { WrapperView, GitHubIcon, BFormGroup, BFormRadioGroup, BFormCheckbox, BPopover, BIcon, BButton },
    data() {
      return {

      }
    },
    methods: {
      saveImage: function () {
        engine.screenshot()
      }
    },
    destroyed() {
      engine.destroy()
    },
    mounted() {
      engine = Engine.create('outline-canvas')
      const container = document.getElementById('outline-canvas')

      loader.preset().then(() => {
        const ground = new Ground().setTexture(loader.getTexture(TEXTURE_GROUND), 6, 6)
        const helperMouseClick = new HelperMouseClick(ground)
        helperMouseClick.position.set(100000, 0, 100000)

        const rawBotModel = loader.getRawModel(MODEL_BOT)
        const bot = new Bot(rawBotModel)
        bot.idleAnimation()
        engine.addUpdate((delta) => bot.update(delta))

        const rawTowerModel = loader.getRawModel(MODEL_TOWER)
        const tower = new Tower(rawTowerModel)

        engine.add('shapes', new Shape(0x222222).createBox().setPosition(new Vector3(- 100, 0, 0)))
        engine.add('shapes', new Shape(0xB17200).createCylinder().setPosition(new Vector3(- 50, 0, 0)))
        engine.add('shapes', new Shape(0x0E2C20).createSphere().setPosition(new Vector3(0, 0, 0)))
        engine.add('shapes', new Shape(0xB17200).createCone().setPosition(new Vector3(50, 0, 0)))
        engine.add('shapes', new Shape(0x222222).createRing().setPosition(new Vector3(100, 0, 0)))
        engine.add('shapes', bot.setScale(0.2).setPosition(new Vector3(0, 0, -100)))
        engine.add('shapes', tower.setScale(20).setPosition(new Vector3(0, 0, 100)))

        const lightPosition = new Vector3(70, 70, 70)
        const cameraLookAt = new Vector3(0, 0, 0)
        const cameraPosition = new Vector3(-100, 0, 100)

        engine
          .add('ground', ground)
          .add('ground-helper', helperMouseClick)
          .setDirLight(lightPosition)
          .setHemiLight(lightPosition)
          .setPointLight(lightPosition)
          .setCamera(cameraPosition, cameraLookAt)
          .preset(container)
          .renderStats(container)
          .registerEvents()
          .enableOutline(true)
          .animate()

        let outlinePass = engine.createOutline({ visibleEdgeColor: new Color(0xC4A900), edgeGlow: 0, edgeThickness: 1.3, edgeStrength: 2.1 })

        engine
          .addEventListener(Engine.EVENT_MOUSE_DOWN, ({event}) => {
            if (event.buttons !== 1) {
              return
            }

            // This page has top menu. Need set mouse offset on height it menu.
            ground.setMouseOffset(event.target.offsetParent.offsetTop, event.target.offsetParent.offsetLeft)

            const enemies = engine.getUnits('shapes')
            const intersection = ground.findIntersection(event, engine.camera, enemies, true)
            if (!intersection) {
              return
            }

            if (intersection.object === ground.cover) {
              const mousePosition = ground.extractMouse3DPosition(intersection)
              const faceDirection = ground.extractFaceDirection(intersection)
              helperMouseClick.update(mousePosition, faceDirection)
              userTarget.copy(mousePosition)
              return
            }

            let unit = enemies.find((item) => item.getObjectById(intersection.object.id))

            if (intersection.object.parent instanceof Unit) {
              const skinnedMeshes = intersection.object.parent.getSkinnedMeshes()
              if (skinnedMeshes.length > 0) {
                outlinePass.setMeshes(skinnedMeshes, true)
              } else {
                outlinePass.setMeshes([intersection.object.parent], false)
              }
              return
            }

            if (unit) {
              userTarget.set(0, 0, 0)
              outlinePass.setMeshes([unit], false)
            }
        })
      })
    },
  }

</script>

<template>
  <WrapperView :autofill="true">
    <WrapperView id="outline-canvas" :autofill="true" class="outline-page">
      <div class="outline-page__controls mx-2 my-2">
        <BButton size="sm" @click="saveImage">
          <BIcon icon="image" />
        </BButton>
      </div>

      <GitHubIcon path="/src/pages/ExamplesPage/pages/OutlinePage" class="m-2" />
    </WrapperView>
  </WrapperView>
</template>