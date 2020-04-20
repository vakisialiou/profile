<script>
  import WrapperView from '@components/WrapperView'
  import GitHubIcon from '@components/GitHubIcon'
  import Loading from '@scene/loading/Loading'
  import Engine from '@scene/Engine'
  import { Vector3 } from 'three'
  import HelperMouseSegment from '@scene/objects/Ground/Helpers/HelperMouseSegment'
  import { loading as loadingTower, ControllerTower } from '@scene/controllers/ControllerTower'
  import Ground from '@scene/objects/Ground'

  let engine = null
  const TEXTURE_GROUND = 'TEXTURE_GROUND'

  const loader = new Loading()
    .addLoading(loadingTower)
    .addItem(Loading.TYPE_TEXTURE, TEXTURE_GROUND, '/models/ground/grass/1.jpg')

  export default {
    name: 'TowerPage',
    components: {
      WrapperView, GitHubIcon
    },
    destroyed() {
      engine.destroy()
    },
    mounted() {
      engine = Engine.create('tower-page-canvas')
      const container = document.getElementById('tower-page-canvas')

      loader.preset().then(() => {
        engine.preset().then(() => {
          const lightPosition = new Vector3(70, 70, 70)
          const cameraLookAt = new Vector3(0, 0, 0)
          const cameraPosition = new Vector3(-600, 0, 600)

          const ground = new Ground().setTexture(loader.getTexture(TEXTURE_GROUND), 6, 6)
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
            .render(container)
            .renderStats(container)
            .registerEvents()
            // .setFog(0xFFFFFF)
            .enableOutline(true)
            .animate()
            .addEventListener(Engine.EVENT_MOUSE_DOWN, ({event}) => {
              // This page has top menu. Need set mouse offset on height it menu.
              ground.setMouseOffset(event.target.offsetParent.offsetTop, event.target.offsetParent.offsetLeft)

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
      })
    },
  }
</script>

<template>
  <WrapperView :autofill="true">
    <WrapperView id="tower-page-canvas" :autofill="true">
      <GitHubIcon path="/src/pages/ExamplesPage/pages/TowerPage" class="m-2" />
    </WrapperView>
  </WrapperView>
</template>