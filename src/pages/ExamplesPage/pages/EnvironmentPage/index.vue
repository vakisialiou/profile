<script>
  import { BFormGroup, BFormRadioGroup, BFormCheckboxGroup, BButton, BIcon } from 'bootstrap-vue'
  import WrapperView from '@components/WrapperView'
  import WrapperCorner from '@components/WrapperCorner'
  import GitHubIcon from '@components/GitHubIcon'
  import Ground from '@scene/objects/Ground'
  import Loading from '@scene/loading/Loading'
  import Engine from '@scene/Engine'
  import { BoxGeometry, Math as _Math, Mesh, MeshPhongMaterial, Vector3,
    RingBufferGeometry, CubeCamera, LinearMipmapLinearFilter } from 'three'
  import SkyBox from '@scene/objects/SkyBox'
  import WaterPieces from '@scene/objects/WaterPieces'

  let engine = null
  const TEXTURE_GROUND = 'TEXTURE_GROUND'
  const TEXTURE_WATER = 'TEXTURE_WATER'
  const loader = new Loading()
    .addItem(Loading.TYPE_TEXTURE, TEXTURE_GROUND, '/models/ground/grass/1.jpg')
    .addItem(Loading.TYPE_TEXTURE, TEXTURE_WATER, '/textures/water/waternormals.jpg')

  const ground = new Ground()

  export default {
    name: 'EnvironmentPage',
    data: () => {
      return {
        offsetTop: 0,
        offsetLeft: 0,
        containerId: 'environment-page',
      }
    },
    methods: {
      screenshot: function () {
        engine.screenshot()
      },
    },
    components: { WrapperCorner, WrapperView, GitHubIcon, BFormGroup, BFormRadioGroup, BFormCheckboxGroup, BButton, BIcon },
    destroyed() {
      engine.destroy()
    },
    mounted() {
      this.offsetTop = this.$el.offsetTop
      this.offsetLeft = this.$el.offsetLeft

      loader.preset().then(() => {
        engine = Engine.create(this.containerId)

        const sky = new SkyBox().preset()
        engine.add('sky', sky)

        const waterPieces = new WaterPieces()
        const waterGeometry = new RingBufferGeometry(700, 10000, 4)
        const water = waterPieces.renderWater(waterGeometry, loader.getTexture(TEXTURE_WATER), sky.sunPosition.clone().normalize())
        water.rotation.z = water.rotation.y - Math.PI / 4
        water.position.setY(-1)
        engine.add('water', waterPieces)
        engine.addUpdate(() => waterPieces.update())

        const cubeCamera = new CubeCamera( 0.1, 1, 512 )
        cubeCamera.renderTarget.texture.generateMipmaps = true
        cubeCamera.renderTarget.texture.minFilter = LinearMipmapLinearFilter
        engine.scene.background = cubeCamera.renderTarget
        cubeCamera.update( engine.renderer, engine.scene )

        ground
          .setTexture(loader.getTexture(TEXTURE_GROUND))
          // This page has top menu. Need set mouse offset on height it menu.
          .setMouseOffset(this.offsetTop, this.offsetLeft)

        for (let i = 0; i < 5; i++) {
          const geometry = new BoxGeometry(20, 30, 20)
          const material = new MeshPhongMaterial({ color: 0x222222, shininess: 50, specular: 0xffffff })
          const item = new Mesh(geometry, material)
          item.position.setX(_Math.randInt(-500, 500))
          item.position.setZ(_Math.randInt(-500, 500))
          item.position.setY(15)
          engine.add('shapes', item)
        }

        const lightPosition = new Vector3(70, 70, 70)
        const cameraLookAt = new Vector3(0, 0, 0)
        const cameraPosition = new Vector3(-600, 0, 600)

        engine
          .add('ground', ground)
          .setDirLight(lightPosition)
          .setHemiLight(lightPosition)
          .setAxesHelper()
          .setCamera(cameraPosition, cameraLookAt)
          .preset(document.getElementById(this.containerId))
          .renderStats(document.getElementById(this.containerId))
          .registerEvents()
          .animate()
      })
    }
  }
</script>

<template>
  <WrapperView :bgId="containerId" enableEvents="bg">
    <WrapperCorner :topOffset="offsetTop">
      <template slot="top-left" class="m-4">
        <div class="m-2">

          <BButton variant="dark" size="sm" @click="screenshot"  class="mb-2">
            <BIcon icon="image" />
          </BButton>

        </div>
      </template>
      <template slot="bottom-left">
        <GitHubIcon path="/src/pages/ExamplesPage/pages/EnvironmentPage" />
      </template>
    </WrapperCorner>
  </WrapperView>
</template>