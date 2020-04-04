<script>
  import './index.less'
  import {
    BFormGroup, BFormRadioGroup
  } from 'bootstrap-vue'
  import WrapperView from '@components/WrapperView'
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
      WrapperView, BFormGroup, BFormRadioGroup
    },
    data() {
      return {
        selectedAnimation: Bot.ANIMATION_KEY_IDLE,
        animations: [
          { text: Bot.ANIMATION_KEY_IDLE , value: Bot.ANIMATION_KEY_IDLE },
          { text: Bot.ANIMATION_KEY_DYING, value: Bot.ANIMATION_KEY_DYING },
          { text: Bot.ANIMATION_KEY_WALKING, value: Bot.ANIMATION_KEY_WALKING },
          { text: Bot.ANIMATION_KEY_RUNNING, value: Bot.ANIMATION_KEY_RUNNING, disabled: true },
          { text: Bot.ANIMATION_KEY_SHOOTING, value: Bot.ANIMATION_KEY_SHOOTING }
        ]
      }
    },
    methods: {
      toggleAnimation: function () {
        botController.bot.enableAnimation(this.selectedAnimation)
      },
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
            .preset(engine, [ ground.clickHelperMesh ])

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
        })
      })
    },
  }
</script>

<template>
  <WrapperView :autofill="true">
    <WrapperView id="model-bot-page-canvas" :autofill="true" class="unit-bot-page">
      <div class="unit-bot-page__controls mx-4 my-2">
        <BFormGroup label="Animations">
          <BFormRadioGroup
            id="bot-animations"
            v-on:input="toggleAnimation"
            v-model="selectedAnimation"
            :options="animations"
            buttons
            name="radios-btn-default"
          />
        </BFormGroup>
      </div>
    </WrapperView>
  </WrapperView>
</template>