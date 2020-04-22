<script>
  import './index.less'
  import { BFormGroup, BFormRadioGroup, BFormCheckbox, BPopover, BIcon } from 'bootstrap-vue'
  import WrapperView from '@components/WrapperView'
  import GitHubIcon from '@components/GitHubIcon'
  import Loading from '@scene/loading/Loading'
  import Engine from '@scene/Engine'
  import Bot from '@scene/units/Bot'
  import { Vector3 } from 'three'
  import { loading as loadingBot, ControllerBot } from '@scene/controllers/ControllerBot'
  import HelperMouseClick from '@scene/objects/Ground/Helpers/HelperMouseClick'
  import Ground from '@scene/objects/Ground'

  let engine = null
  let botController = null

  const TEXTURE_GROUND = 'TEXTURE_GROUND'

  const loader = new Loading()
    .addLoading(loadingBot)
    .addItem(Loading.TYPE_TEXTURE, TEXTURE_GROUND, '/models/ground/grass/1.jpg')

  export default {
    name: 'BotAnimationPage',
    components: { WrapperView, GitHubIcon, BFormGroup, BFormRadioGroup, BFormCheckbox, BPopover, BIcon },
    data() {
      return {
        selectedAnimation: Bot.ANIMATION_KEY_IDLE,
        animations: [
          { text: Bot.ANIMATION_KEY_IDLE , value: Bot.ANIMATION_KEY_IDLE },
          { text: Bot.ANIMATION_KEY_DYING, value: Bot.ANIMATION_KEY_DYING },
          { text: Bot.ANIMATION_KEY_SHOOTING, value: Bot.ANIMATION_KEY_SHOOTING },
        ],
        animationsMoving: [
          { text: Bot.ANIMATION_KEY_WALKING, value: Bot.ANIMATION_KEY_WALKING },
          { text: Bot.ANIMATION_KEY_RUNNING, value: Bot.ANIMATION_KEY_RUNNING },
          { text: Bot.ANIMATION_KEY_RUNNING_FORWARD, value: Bot.ANIMATION_KEY_RUNNING_FORWARD },
          { text: Bot.ANIMATION_KEY_RUNNING_BACKWARD, value: Bot.ANIMATION_KEY_RUNNING_BACKWARD },
        ],
        animationsJumping: [
          { text: Bot.ANIMATION_KEY_JUMPING_UP, value: Bot.ANIMATION_KEY_JUMPING_UP, disabled: true },
          { text: Bot.ANIMATION_KEY_JUMPING_FORWARD, value: Bot.ANIMATION_KEY_JUMPING_FORWARD, disabled: true },
          { text: Bot.ANIMATION_KEY_JUMPING_BACKWARD, value: Bot.ANIMATION_KEY_JUMPING_BACKWARD, disabled: true },
        ],
        pauseAnimationAction: false,
      }
    },
    methods: {
      toggleAnimation: function () {
        this.pauseAnimationAction = false
        botController.bot.enableAnimation(this.selectedAnimation)
      },
      toggleAnimationAction: function () {
        if (this.pauseAnimationAction) {
          botController.bot.pauseAnimation()
        } else {
          botController.bot.unpauseAnimation()
        }
      },
    },
    destroyed() {
      engine.destroy()
    },
    mounted() {
      engine = Engine.create('bot-animation-canvas')
      const container = document.getElementById('bot-animation-canvas')

      loader.preset().then(() => {
        engine.preset().then(() => {
          const ground = new Ground().setTexture(loader.getTexture(TEXTURE_GROUND), 6, 6)
          const helperMouseClick = new HelperMouseClick(ground)
          helperMouseClick.position.set(100000, 0, 100000)

          botController = new ControllerBot(loader).preset(engine)

          botController.bot.animation.mixer.addEventListener('loop', () => {
            // console.log('loop', event)
          })

          botController.bot.animation.mixer.addEventListener('finished', () => {
            if (botController.bot.isActiveAnimation(Bot.ANIMATION_KEY_SHOOTING)) {
              botController.bot.shootingAnimation()
            }
          })

          const lightPosition = new Vector3(70, 70, 70)
          const cameraLookAt = new Vector3(0, 0, 0)
          const cameraPosition = new Vector3(-100, 0, 100)

          engine
            .enableMousePan(false)
            .enableMouseRotate(true)
            .add('ground', ground)
            .add('ground-helper', helperMouseClick)
            .setDirLight(lightPosition)
            .setHemiLight(lightPosition)
            .setPointLight(lightPosition)
            .setCamera(cameraPosition, cameraLookAt)
            .render(container)
            .renderStats(container)
            .registerEvents()
            .animate()
        })
      })
    },
  }
</script>

<template>
  <WrapperView :autofill="true">
    <WrapperView id="bot-animation-canvas" :autofill="true" class="bot-animation-page">
      <div class="bot-animation-page__controls px-4 py-2">
        <BFormGroup label="Toggle animation">
          <BFormRadioGroup
            id="bot-animations"
            v-on:input="toggleAnimation"
            v-model="selectedAnimation"
            :options="animations"
            buttons
          />
        </BFormGroup>

        <BFormGroup label="Toggle animation moving">
          <BFormRadioGroup
            id="bot-animations-moving"
            v-on:input="toggleAnimation"
            v-model="selectedAnimation"
            :options="animationsMoving"
            buttons
          />
        </BFormGroup>

        <BFormGroup label="Toggle animation jumping">
          <BFormRadioGroup
            id="bot-animations-jumping"
            v-on:input="toggleAnimation"
            v-model="selectedAnimation"
            :options="animationsJumping"
            buttons
          />
        </BFormGroup>


        <BFormCheckbox
          class="mx-2"
          id="bot-animation-pause"
          v-on:input="toggleAnimationAction"
          v-model="pauseAnimationAction"
          switch
        >Pause animation</BFormCheckbox>
      </div>

      <GitHubIcon path="/src/pages/ExamplesPage/pages/BotAnimationPage" class="m-2" />
    </WrapperView>
  </WrapperView>
</template>