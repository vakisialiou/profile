<script>
  import './index.less'
  import { BFormGroup, BFormRadioGroup, BFormCheckbox, BPopover, BIcon } from 'bootstrap-vue'
  import WrapperView from '@components/WrapperView'
  import GitHubIcon from '@components/GitHubIcon'
  import Loading from '@scene/loading/Loading'
  import Engine from '@scene/Engine'
  import Bot from '@scene/units/Bot'
  import { Vector3, Math as _Math, Mesh, MeshStandardMaterial, CylinderGeometry, MOUSE } from 'three'
  import { loading as loadingBot, ControllerBot } from '@scene/controllers/ControllerBot'
  import HelperMouseClick from '@scene/objects/Ground/Helpers/HelperMouseClick'
  import Ground from '@scene/objects/Ground'

  let engine = null
  let userBotController = null

  const TEXTURE_GROUND = 'TEXTURE_GROUND'

  const loader = new Loading()
    .addLoading(loadingBot)
    .addItem(Loading.TYPE_TEXTURE, TEXTURE_GROUND, '/models/ground/grass/1.jpg')

  export default {
    name: 'BotUserControlPage',
    components: { WrapperView, GitHubIcon, BFormGroup, BFormRadioGroup, BFormCheckbox, BPopover, BIcon },
    data() {
      return {

      }
    },
    methods: {

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
      engine = Engine.create('bot-user-control-canvas')
      const container = document.getElementById('bot-user-control-canvas')

      loader.preset().then(() => {
        engine.preset().then(() => {
          switchMouseControls(engine, 'bot-controller-rotation')

          const ground = new Ground().setTexture(loader.getTexture(TEXTURE_GROUND), 6, 6)
          const helperMouseClick = new HelperMouseClick(ground)
          helperMouseClick.position.set(100000, 0, 100000)

          engine
            .add('ground', ground)
            .add('ground-helper', helperMouseClick)

          const enemies = []
          for (let i = -4; i < 5; i++) {
            if (i === 0) {
              continue
            }
            const geometry = new CylinderGeometry(10, 10, 40, 16, 16)
            const material = new MeshStandardMaterial({ color: 0x666666 })
            const cube = new Mesh(geometry, material)
            cube.renderOrder = - 1000

            let t = i * 100
            cube.position.setX(t)
            cube.position.setZ(t)
            cube.position.setY(15)
            engine.add('cube', cube)
            enemies.push(cube)
          }

          userBotController = new ControllerBot(loader)
            .setEnemies(enemies)
            .preset(engine)

          userBotController.bot.animation.mixer.addEventListener('finished', () => {
            if (userBotController.bot.isActiveAnimation(Bot.ANIMATION_KEY_SHOOTING)) {
              userBotController.bot.shootingAnimation()
            }
          })

          const lightPosition = new Vector3(70, 70, 70)
          const cameraLookAt = new Vector3(0, 0, 0)
          const cameraPosition = new Vector3(-100, 0, 100)

          engine
            .setDirLight(lightPosition)
            .setHemiLight(lightPosition)
            .setPointLight(lightPosition)
            .setCamera(cameraPosition, cameraLookAt)
            .render(container)
            .renderStats(container)
            .registerEvents()
            .enableOutline(true)
            .animate()

          let activeKeyCode = null

          engine
            .addEventListener(Engine.EVENT_KEY_DOWN, ({event}) => {
              activeKeyCode = event.keyCode
              if (event.keyCode === 17) {
                switchMouseControls(engine, 'bot-controller-pan')
              }
            })
            .addEventListener(Engine.EVENT_KEY_UP, ({event}) => {
              activeKeyCode = null
              switchMouseControls(engine, 'bot-controller-rotation')
            })
            .addEventListener(Engine.EVENT_MOUSE_DOWN, ({event}) => {
              if (event.buttons !== 1) {
                return
              }

              // This page has top menu. Need set mouse offset on height it menu.
              ground.setMouseOffset(event.target.offsetParent.offsetTop, event.target.offsetParent.offsetLeft)

              const intersection = ground.findIntersection(event, engine.camera, enemies, true)
              if (!intersection) {
                return
              }

              const mousePosition = ground.extractMouse3DPosition(intersection)
              const faceDirection = ground.extractFaceDirection(intersection)
              helperMouseClick.update(mousePosition, faceDirection)

              if (activeKeyCode === 17 && enemies.includes(intersection.object)) {
                userBotController.setTarget(intersection.object)
              } else {
                userBotController.clearTarget().followTo(mousePosition)
              }
            })
        })
      })
    },
  }

  /**
   *
   * @param {Engine} engine
   * @param {string} type
   * @returns {void}
   */
  function switchMouseControls(engine, type) {
    switch (type) {
      case 'bot-controller-rotation':
        engine.enableMousePan(false).enableMouseRotate(true)
        engine.mapControls.mouseButtons = {
          RIGHT: MOUSE.ROTATE,
        }
      break
      case 'bot-controller-pan':
        engine.enableMousePan(true, 2.4).enableMouseRotate(false)
        engine.mapControls.mouseButtons = {
          RIGHT: MOUSE.PAN
        }
        break
    }
  }

</script>

<template>
  <WrapperView :autofill="true">
    <WrapperView id="bot-user-control-canvas" :autofill="true" class="bot-user-control-page">
      <div class="bot-user-control-page__controls mx-2 my-2">
        <BIcon icon="question" id="controls-helper" aria-hidden="true" variant="info" font-scale="2" />
        <b-popover ref="popover" target="controls-helper" title="Control" triggers="focus">
          Bot:
          <br/>
          1. <b>Left Click</b> - moving to click position.
          <br/>
          2. <b>Ctrl + Left Click</b> (click on any object) - moving to object's direction and attack.
          Camera:
          <br/>
          1. <b>Right Click</b> - rotate camera.
          <br/>
          2. <b>Ctrl + Right Click</b> - displace camera.
        </b-popover>
      </div>

      <GitHubIcon path="/src/pages/ExamplesPage/pages/BotUserControlPage" class="m-2" />
    </WrapperView>
  </WrapperView>
</template>