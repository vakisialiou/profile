<script>
  import './index.less'
  import { BFormGroup, BFormRadioGroup, BFormCheckbox, BPopover, BIcon } from 'bootstrap-vue'
  import WrapperView from '@components/WrapperView'
  import GitHubIcon from '@components/GitHubIcon'
  import Loading from '@scene/loading/Loading'
  import Engine from '@scene/Engine'
  import { Vector3, Line, BufferGeometry, LineBasicMaterial } from 'three'
  import { loading as loadingBot, ControllerBot } from '@scene/controllers/ControllerBot'
  import HelperMouseClick from '@scene/objects/Ground/Helpers/HelperMouseClick'
  import Ground from '@scene/objects/Ground'
  import Bot from '@scene/units/Bot'
  import Path from '@scene/steering/Path'

  const botPath = [new Vector3(0, 1, 30), new Vector3(0, 1, 300), new Vector3(- 350, 1, 100)]

  const lineGeometry = new BufferGeometry().setFromPoints(botPath)
  const lineMaterial = new LineBasicMaterial({ color: 0x222222, linewidth: 1 })
  const linePath = new Line(lineGeometry, lineMaterial)

  let engine = null
  let botController = null
  const TEXTURE_GROUND = 'TEXTURE_GROUND'

  const loader = new Loading()
    .addLoading(loadingBot)
    .addItem(Loading.TYPE_TEXTURE, TEXTURE_GROUND, '/models/ground/grass/1.jpg')

  export default {
    name: 'BotAutoControlPage',
    components: { WrapperView, GitHubIcon, BFormGroup, BFormRadioGroup, BFormCheckbox, BPopover, BIcon },
    data() {
      return {
        selectedAnimation: Bot.ANIMATION_KEY_RUNNING,
        animations: [
          { text: Bot.ANIMATION_KEY_WALKING, value: Bot.ANIMATION_KEY_WALKING },
          { text: Bot.ANIMATION_KEY_RUNNING, value: Bot.ANIMATION_KEY_RUNNING },
          { text: Bot.ANIMATION_KEY_RUNNING_FORWARD, value: Bot.ANIMATION_KEY_RUNNING_FORWARD },
          { text: Bot.ANIMATION_KEY_RUNNING_BACKWARD, value: Bot.ANIMATION_KEY_RUNNING_BACKWARD },
        ],
        selectedPathType: Path.TYPE_LAZY,
        pathTypes: [
          { text: 'Lazy', value: Path.TYPE_LAZY },
          { text: 'Loop forward', value: Path.TYPE_LOOP_FORWARD },
          { text: 'Loop backward', value: Path.TYPE_LOOP_BACKWARD },
        ]
      }
    },
    methods: {
      toggleAnimation: function () {
        botController.useMovingAnimation(this.selectedAnimation)
      },
      togglePathType: function () {
        switch (this.selectedPathType) {
          case Path.TYPE_LAZY:
            botController.setPosition(botPath[0]).setPathType(Path.TYPE_LAZY).clearPath().setPath(botPath)
            break
          case Path.TYPE_LOOP_FORWARD:
            botController.setPosition(botPath[0]).setPathType(Path.TYPE_LOOP_FORWARD).clearPath().setPath(botPath)
            break
          case Path.TYPE_LOOP_BACKWARD:
            botController.setPosition(botPath[0]).setPathType(Path.TYPE_LOOP_BACKWARD).clearPath().setPath(botPath)
            break
        }

      }
    },
    destroyed() {
      engine.destroy()
    },
    mounted() {
      engine = Engine.create('bot-auto-control-canvas')
      const container = document.getElementById('bot-auto-control-canvas')

      loader.preset().then(() => {
        engine.preset().then(() => {
          const ground = new Ground().setTexture(loader.getTexture(TEXTURE_GROUND), 6, 6)
          const helperMouseClick = new HelperMouseClick(ground)
          helperMouseClick.position.set(100000, 0, 100000)

          botController = new ControllerBot(loader)
          botController
            .setPathType(this.selectedPathType)
            .setPosition(botPath[0])
            .setPath(botPath)
            .preset(engine)

          const lightPosition = new Vector3(70, 70, 70)
          const cameraLookAt = new Vector3().copy(botPath[0])
          const cameraPosition = new Vector3(0, 0, 0)

          engine
            .add('ground', ground)
            .add('ground-helper', helperMouseClick)
            .add('line-path-helper', linePath)
            .setDirLight(lightPosition)
            .setHemiLight(lightPosition)
            .setPointLight(lightPosition)
            .setCamera(cameraPosition, cameraLookAt)
            .render(container)
            .renderStats(container)
            .registerEvents()
            .enableOutline(true)
            .animate()
        })
      })
    },
  }

</script>

<template>
  <WrapperView :autofill="true">
    <WrapperView id="bot-auto-control-canvas" :autofill="true" class="bot-auto-control-page">
      <div class="bot-auto-control-page__controls mx-2 my-2">

        <BFormGroup label="Toggle animation moving">
          <BFormRadioGroup
            id="bot-animations-running"
            v-on:input="toggleAnimation"
            v-model="selectedAnimation"
            :options="animations"
            buttons
          />
        </BFormGroup>

        <BFormGroup label="Path type">
          <BFormRadioGroup
            id="bot-path-type"
            v-on:input="togglePathType"
            v-model="selectedPathType"
            :options="pathTypes"
            buttons
          />
        </BFormGroup>

      </div>

      <GitHubIcon path="/src/pages/ExamplesPage/pages/BotAutoControlPage" class="m-2" />
    </WrapperView>
  </WrapperView>
</template>