<script>
  import './index.less'
  import {
    BFormGroup, BFormRadioGroup, BFormCheckbox
  } from 'bootstrap-vue'
  import WrapperView from '@components/WrapperView'
  import GitHubIcon from '@components/GitHubIcon'
  import Loading from '@scene/loading/Loading'
  import Engine from '@scene/Engine'
  import Bot from '@scene/units/Bot'
  import { Vector3 } from 'three'
  import { loading as loadingBot, ControllerBot } from '@scene/controllers/ControllerBot'
  import { loading as loadingGround, ControllerGround } from '@scene/controllers/ControllerGround'

  let engine = null
  let botController = null

  const loader = new Loading()
    .addLoading(loadingBot)
    .addLoading(loadingGround)

  export default {
    name: 'UnitBotPage',
    components: {
      WrapperView, GitHubIcon, BFormGroup, BFormRadioGroup, BFormCheckbox
    },
    data() {
      return {
        selectedAnimation: Bot.ANIMATION_KEY_IDLE,
        animations: [
          { text: Bot.ANIMATION_KEY_IDLE , value: Bot.ANIMATION_KEY_IDLE },
          { text: Bot.ANIMATION_KEY_DYING, value: Bot.ANIMATION_KEY_DYING },
          { text: Bot.ANIMATION_KEY_WALKING, value: Bot.ANIMATION_KEY_WALKING },
          { text: Bot.ANIMATION_KEY_RUNNING, value: Bot.ANIMATION_KEY_RUNNING },
          { text: Bot.ANIMATION_KEY_RUNNING_BACKWARDS, value: Bot.ANIMATION_KEY_RUNNING_BACKWARDS },
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
          botController.enable(true)
        } else {
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
          const lightPosition = new Vector3(70, 70, 70)
          const cameraLookAt = new Vector3(0, 0, 0)
          const cameraPosition = new Vector3(-100, 0, 100)

          const ground = new ControllerGround(loader)
            .preset(engine, container.offsetTop, container.offsetLeft)

          botController = new ControllerBot(loader)
            .preset(engine)
            .captureObjects([ ground.clickHelperMesh ])

          botController.bot.animation.mixer.addEventListener('loop', () => {
            // console.log('loop', event)
          })

          botController.bot.animation.mixer.addEventListener('finished', () => {
            if (botController.bot.isActiveAnimation(Bot.ANIMATION_KEY_SHOOTING)) {
              botController.bot.shootingAnimation()
            }
          })

          engine
            .setDirLight(lightPosition)
            .setHemiLight(lightPosition)
            .setPointLight(lightPosition)
            .setCamera(cameraPosition, cameraLookAt)
            .setPhysicsGround({ size: [ground.width, 1, ground.height] })
            .render(container)
            .renderStats(container)
            .registerEvents()
            .animate()

          ground.onMouseDown(() => {
            if (this.botMouseControlEnabled) {
              botController.followTo(ground.clickHelperMesh.position)
            }
          })
        })
      })
    },
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

        <BFormCheckbox
          v-model="botMouseControlEnabled"
          v-on:input="toggleMouseControl"
          size="lg"
          switch
        >
          Enable bot controls by mouse.
        </BFormCheckbox>
      </div>
      <GitHubIcon path="/src/pages/UnitPage/pages/UnitBotPage" class="m-2" />
    </WrapperView>
  </WrapperView>
</template>