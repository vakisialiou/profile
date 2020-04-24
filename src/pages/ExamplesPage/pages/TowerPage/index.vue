<script>
  import WrapperView from '@components/WrapperView'
  import WrapperCorner from '@components/WrapperCorner'
  import GitHubIcon from '@components/GitHubIcon'
  import Loading from '@scene/loading/Loading'
  import Engine from '@scene/Engine'
  import { Vector3 } from 'three'
  import HelperMouseSegment from '@scene/objects/Ground/Helpers/HelperMouseSegment'
  import { loading as loadingTower, ControllerTower } from '@scene/controllers/ControllerTower'
  import Ground from '@scene/objects/Ground'
  import { BButton, BIcon } from 'bootstrap-vue'

  let engine = null
  const TEXTURE_GROUND = 'TEXTURE_GROUND'

  const loader = new Loading()
    .addLoading(loadingTower)
    .addItem(Loading.TYPE_TEXTURE, TEXTURE_GROUND, '/models/ground/grass/1.jpg')

  export default {
    name: 'TowerPage',
    components: {
      WrapperView, WrapperCorner, GitHubIcon, BButton, BIcon
    },
    data: () => {
      return {
        offsetTop: 0,
        offsetLeft: 0,
        containerId: 'tower-page',
      }
    },
    methods: {
      screenshot: function () {
        engine.screenshot()
      }
    },
    destroyed() {
      engine.destroy()
    },
    mounted() {
      this.offsetTop = this.$el.offsetTop
      this.offsetLeft = this.$el.offsetLeft

      engine = Engine.create(this.containerId)
      const container = document.getElementById(this.containerId)

      loader.preset().then(() => {
        const lightPosition = new Vector3(70, 70, 70)
        const cameraLookAt = new Vector3(0, 0, 0)
        const cameraPosition = new Vector3(-600, 0, 600)

        const ground = new Ground()
          .setTexture(loader.getTexture(TEXTURE_GROUND), 6, 6)
          // This page has top menu. Need set mouse offset on height it menu.
          .setMouseOffset(this.offsetTop, this.offsetLeft)

        const helperMouseSegment = new HelperMouseSegment(ground)
        helperMouseSegment.position.set(1000000, 0, 1000000)

        const towers = []
        const towersMap = [ new Vector3(-420, 0, 420), new Vector3(420, 0, 420), new Vector3(420, 0, -420), new Vector3(-420, 0, -420) ]
        for (let i = 0; i < towersMap.length; i++) {
          const tower = new ControllerTower(loader)
          tower.setPosition(towersMap[i])
          tower.preset(engine, [ helperMouseSegment ])
          towers.push(tower)
        }

        engine
          .add('ground', ground)
          .add('ground-helper', helperMouseSegment)
          .setDirLight(lightPosition)
          .setHemiLight(lightPosition)
          .setPointLight(lightPosition)
          .setCamera(cameraPosition, cameraLookAt)
          .preset(container)
          .renderStats(container)
          .registerEvents()
          .animate()
          .addEventListener(Engine.EVENT_MOUSE_DOWN, ({event}) => {
            // Ground intersection only
            const intersection = ground.findIntersection(event, engine.camera)
            if (!intersection) {
              return
            }

            const segmentPosition = ground.extractSegmentPosition(intersection)
            helperMouseSegment.position.copy(segmentPosition)
            for (const tower of towers) {
              tower.setTarget(helperMouseSegment)
            }
          })
      })
    },
  }
</script>

<template>
  <WrapperView :bgId="containerId" enableEvents="bg">
    <WrapperCorner :topOffset="offsetTop">
      <template slot="top-left">
        <div class="m-2">
          <BButton variant="dark" size="sm" @click="screenshot"  class="mb-2">
            <BIcon icon="image" />
          </BButton>
        </div>
      </template>

      <template slot="bottom-left">
        <GitHubIcon path="/src/pages/ExamplesPage/pages/TowerPage" />
      </template>
    </WrapperCorner>
  </WrapperView>
</template>