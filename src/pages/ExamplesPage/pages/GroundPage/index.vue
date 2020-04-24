<script>
  import { BFormGroup, BFormRadioGroup, BFormCheckboxGroup, BButton, BIcon } from 'bootstrap-vue'
  import WrapperView from '@components/WrapperView'
  import WrapperCorner from '@components/WrapperCorner'
  import GitHubIcon from '@components/GitHubIcon'
  import Ground from '@scene/objects/Ground'
  import HelperMouseSegment from '@scene/objects/Ground/Helpers/HelperMouseSegment'
  import HelperMouseVertex from '@scene/objects/Ground/Helpers/HelperMouseVertex'
  import HelperMouseClick from '@scene/objects/Ground/Helpers/HelperMouseClick'
  import HelperMouseFace from '@scene/objects/Ground/Helpers/HelperMouseFace'
  import HelperGridVertices from '@scene/objects/Ground/Helpers/HelperGridVertices'
  import HelperGridSegments from '@scene/objects/Ground/Helpers/HelperGridSegments'
  import Loading from '@scene/loading/Loading'
  import Engine from '@scene/Engine'
  import { BoxGeometry, Math as _Math, Mesh, MeshStandardMaterial, Vector3, FaceColors } from 'three'

  let engine = null
  const TEXTURE_GROUND = 'TEXTURE_GROUND'
  const loader = new Loading().addItem(Loading.TYPE_TEXTURE, TEXTURE_GROUND, '/models/ground/grass/1.jpg')

  const ground = new Ground()
  const helperMouseSegment = new HelperMouseSegment(ground)
  const helperMouseVertex = new HelperMouseVertex(ground)
  const helperMouseClick = new HelperMouseClick(ground)
  const helperMouseFace = new HelperMouseFace(ground)
  const helperGridVertices = new HelperGridVertices(ground)
  const helperGridSegments = new HelperGridSegments(ground)

  export default {
    name: 'GroundPage',
    data: () => {
      return {
        offsetTop: 0,
        offsetLeft: 0,
        containerId: 'ground-page',
        selectedMouseHelper: 'Click',
        mouseHelpers: [
          { text: 'Segment' , value: 'Segment', helper: helperMouseSegment },
          { text: 'Vertex', value: 'Vertex', helper: helperMouseVertex },
          { text: 'Click', value: 'Click', helper: helperMouseClick },
          { text: 'Face', value: 'Face', helper: helperMouseFace },
        ],
        selectedGridHelpers: [],
        gridHelpers: [
          { text: 'Vertices' , value: 'Vertices', helper: helperGridVertices },
          { text: 'Segments', value: 'Segments', helper: helperGridSegments },
        ],
      }
    },
    methods: {
      screenshot: function () {
        engine.screenshot()
      },
      toggleMouseHelper: function () {
        for (const item of this.mouseHelpers) {
          if (this.selectedMouseHelper === item.value) {
            engine.add('helpers', item.helper)
          } else {
            engine.remove(item.helper)
          }
        }
      },
      toggleGridHelper: function (values) {
        for (const item of this.gridHelpers) {
          if (!engine.has(item.helper) && values.includes(item.value)) {
            engine.add('helpers', item.helper)
          }
          if (engine.has(item.helper) && !values.includes(item.value)) {
            engine.remove(item.helper)
          }
        }
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

        ground
          .setTexture(loader.getTexture(TEXTURE_GROUND))
          // This page has top menu. Need set mouse offset on height it menu.
          .setMouseOffset(this.offsetTop, this.offsetLeft)

        const intersectionObjects = []
        for (let i = 0; i < 5; i++) {
          const geometry = new BoxGeometry(20, 30, 20)
          const material = new MeshStandardMaterial({ color: 0x666666, vertexColors: FaceColors })
          const item = new Mesh(geometry, material)
          item.position.setX(_Math.randInt(-500, 500))
          item.position.setZ(_Math.randInt(-500, 500))
          item.position.setY(15)
          engine.add('shapes', item)
          intersectionObjects.push(item)
        }

        const lightPosition = new Vector3(70, 70, 70)
        const cameraLookAt = new Vector3(0, 0, 0)
        const cameraPosition = new Vector3(-600, 0, 600)

        engine
          .add('ground', ground)
          .add('helpers', helperMouseClick)
          .setDirLight(lightPosition)
          .setHemiLight(lightPosition)
          .setAxesHelper()
          .setCamera(cameraPosition, cameraLookAt)
          .preset(document.getElementById(this.containerId))
          .registerEvents()
          .animate()
          .addEventListener(Engine.EVENT_MOUSE_DOWN, ({event}) => {
            const intersection = ground.findIntersection(event, engine.camera, intersectionObjects)
            if (!intersection) {
              return
            }

            const faceDirection = ground.extractFaceDirection(intersection)

            switch (this.selectedMouseHelper) {
              case 'Segment':
                const segmentPosition = ground.extractSegmentPosition(intersection)
                helperMouseSegment.position.copy(segmentPosition)
                break
              case 'Vertex':
                const vertexPosition = ground.extractVertexPosition(intersection)
                helperMouseVertex.position.copy(vertexPosition)
                break
              case 'Click':
                const mousePosition = ground.extractMouse3DPosition(intersection)
                helperMouseClick.update(mousePosition, faceDirection)
                break
              case 'Face':
                const facePosition = ground.extractFacePosition(intersection)
                helperMouseFace.update(facePosition, faceDirection, 30)
                break
            }
          })
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

          <BFormGroup label="Выбрать для получения позиции">
            <BFormRadioGroup
              id="mouse-helpers"
              v-on:input="toggleMouseHelper"
              v-model="selectedMouseHelper"
              :options="mouseHelpers"
              switches
              name="radios-btn-default"
            />
          </BFormGroup>

          <BFormGroup label="Включить помощник на плоскости">
            <BFormCheckboxGroup
              id="grid-helpers"
              v-on:input="toggleGridHelper"
              v-model="selectedGridHelpers"
              :options="gridHelpers"
              switches
            />
          </BFormGroup>
        </div>
      </template>
      <template slot="bottom-left">
        <GitHubIcon path="/src/pages/ExamplesPage/pages/UnitGroundPage" />
      </template>
    </WrapperCorner>
  </WrapperView>
</template>