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

  const geometry = new CylinderGeometry(10, 10, 30, 16, 16)
  const material = new MeshStandardMaterial({ color: 0x666666 })
  const cube = new Mesh(geometry, material)

  let engine = null
  let botController = null

  const TEXTURE_GROUND = 'TEXTURE_GROUND'

  const loader = new Loading()
    .addLoading(loadingBot)
    .addItem(Loading.TYPE_TEXTURE, TEXTURE_GROUND, '/models/ground/grass/1.jpg')

  export default {
    name: 'UnitBotPage',
    components: { WrapperView, GitHubIcon, BFormGroup, BFormRadioGroup, BFormCheckbox, BPopover, BIcon },
    data() {
      return {
        selectedAnimation: Bot.ANIMATION_KEY_IDLE,
        animations: [
          { text: Bot.ANIMATION_KEY_IDLE , value: Bot.ANIMATION_KEY_IDLE },
          { text: Bot.ANIMATION_KEY_DYING, value: Bot.ANIMATION_KEY_DYING },
          { text: Bot.ANIMATION_KEY_WALKING, value: Bot.ANIMATION_KEY_WALKING },
          { text: Bot.ANIMATION_KEY_RUNNING, value: Bot.ANIMATION_KEY_RUNNING },
          { text: Bot.ANIMATION_KEY_RUNNING_FORWARD, value: Bot.ANIMATION_KEY_RUNNING_FORWARD },
          { text: Bot.ANIMATION_KEY_RUNNING_BACKWARD, value: Bot.ANIMATION_KEY_RUNNING_BACKWARD },
          { text: Bot.ANIMATION_KEY_SHOOTING, value: Bot.ANIMATION_KEY_SHOOTING }
        ],
        selectedAnimationAction: 'Active',
        animationActions: [
          { text: 'Active', value: 'Active' },
          { text: 'Pause', value: 'Pause' },
        ],
        botMouseControlEnabled: false
      }
    },
    methods: {
      toggleAnimation: function () {
        this.selectedAnimationAction = 'Active'
        botController.bot.enableAnimation(this.selectedAnimation)
      },
      toggleAnimationAction: function () {
        switch (this.selectedAnimationAction) {
          case 'Pause':
            botController.bot.pauseAnimation()
            break
          case 'Active':
          default:
            botController.bot.unpauseAnimation()
        }
      },
      toggleMouseControl: function () {
        if (this.botMouseControlEnabled) {
          switchMouseControls(engine, 'bot-controller-rotation')
          botController.enable(true)
        } else {
          switchMouseControls(engine, 'example-animations')
          botController.enable(false)
          this.toggleAnimation()
        }
      }
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
          switchMouseControls(engine, 'example-animations')

          const lightPosition = new Vector3(70, 70, 70)
          const cameraLookAt = new Vector3(0, 0, 0)
          const cameraPosition = new Vector3(-100, 0, 100)

          const captureObjects = []
          for (let i = 0; i < 10; i++) {
            const item = cube.clone()
            item.position.setX(_Math.randInt(-500, 500))
            item.position.setZ(_Math.randInt(-500, 500))
            item.position.setY(15)
            engine.add('cube', item)
            captureObjects.push(item)
          }

          const ground = new Ground().setTexture(loader.getTexture(TEXTURE_GROUND), 6, 6)
          const helperMouseClick = new HelperMouseClick(ground)
          helperMouseClick.position.set(100000, 0, 100000)

          botController = new ControllerBot(loader).preset(engine)
            // .captureObjects(captureObjects)

          botController.bot.animation.mixer.addEventListener('loop', () => {
            // console.log('loop', event)
          })

          botController.bot.animation.mixer.addEventListener('finished', () => {
            if (this.botMouseControlEnabled) {
              return
            }

            if (botController.bot.isActiveAnimation(Bot.ANIMATION_KEY_SHOOTING)) {
              botController.bot.shootingAnimation()
            }
          })

          engine
            .add('ground', ground)
            .add('ground-helper', helperMouseClick)
            .setDirLight(lightPosition)
            .setHemiLight(lightPosition)
            .setPointLight(lightPosition)
            .setCamera(cameraPosition, cameraLookAt)
            .setPhysicsGround({ size: [ground.width, 1, ground.height] })
            .render(container)
            .renderStats(container)
            .registerEvents()
            .animate()

          let activeKeyCode = null

          engine
            .addEventListener(Engine.EVENT_KEY_DOWN, ({event}) => {
              if (!this.botMouseControlEnabled) {
                return
              }

              activeKeyCode = event.keyCode
              if (event.keyCode === 17) {
                switchMouseControls(engine, 'bot-controller-pan')
              }
            })
            .addEventListener(Engine.EVENT_KEY_UP, ({event}) => {
              if (!this.botMouseControlEnabled) {
                return
              }

              activeKeyCode = null
              switchMouseControls(engine, 'bot-controller-rotation')
            })
            .addEventListener(Engine.EVENT_MOUSE_DOWN, ({event}) => {
              if (!this.botMouseControlEnabled) {
                return
              }

              if (event.buttons !== 1) {
                return
              }

              // This page has top menu. Need set mouse offset on height it menu.
              ground.setMouseOffset(event.target.offsetParent.offsetTop, event.target.offsetParent.offsetLeft)

              const intersection = ground.findIntersection(event, engine.camera, captureObjects)
              if (!intersection) {
                return
              }

              const mousePosition = ground.extractMouse3DPosition(intersection)
              const faceDirection = ground.extractFaceDirection(intersection)
              helperMouseClick.update(mousePosition, faceDirection)

              if (activeKeyCode === 17 && captureObjects.includes(intersection.object)) {
                botController.setTarget(intersection.object)
              } else {
                botController.captureTarget().followTo(mousePosition)
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
      case 'example-animations':
        engine.enableAutoRotate(true).enableMousePan(false).enableMouseRotate(false)
      break
      case 'bot-controller-rotation':
        engine.enableAutoRotate(false).enableMousePan(false).enableMouseRotate(true)
        engine.mapControls.mouseButtons = {
          RIGHT: MOUSE.ROTATE,
        }
      break
      case 'bot-controller-pan':
        engine.enableAutoRotate(false).enableMousePan(true).enableMouseRotate(false)
        engine.mapControls.mouseButtons = {
          RIGHT: MOUSE.PAN
        }
        break
    }
  }

</script>

<template>
  <WrapperView :autofill="true">
    <WrapperView id="model-bot-page-canvas" :autofill="true" class="unit-bot-page">
      <div class="unit-bot-page__controls mx-4 my-2">
        <BFormGroup label="Examples animation">
          <BFormRadioGroup
            id="bot-animations"
            v-on:input="toggleAnimation"
            v-model="selectedAnimation"
            :options="animations"
            buttons
            name="radios-btn-default"
            :disabled="botMouseControlEnabled"
          />

          <BFormRadioGroup
            class="mx-2"
            id="bot-animation-actions"
            v-on:input="toggleAnimationAction"
            v-model="selectedAnimationAction"
            :options="animationActions"
            buttons
            name="checkbox-btn-default"
            :disabled="botMouseControlEnabled"
          />

        </BFormGroup>

        <div class="d-flex">

          <BFormCheckbox
            v-model="botMouseControlEnabled"
            v-on:input="toggleMouseControl"
            switch
          >
            <span>Enable bot controller.</span>
          </BFormCheckbox>

          <div class="mx-2">
            <BIcon icon="question" id="controls-helper" aria-hidden="true" variant="info" />
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
        </div>

      </div>

      <GitHubIcon path="/src/pages/ExamplesPage/pages/UnitBotPage" class="m-2" />
    </WrapperView>
  </WrapperView>
</template>