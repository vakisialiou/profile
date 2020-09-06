<script>
  import './index.less'
  import WrapperView from '@components/WrapperView'
  import WrapperCorner from '@components/WrapperCorner'
  import WrapperSidebar from '@components/WrapperSidebar'
  import FormRangeVector3 from '@components/FormRangeVector3'
  import {
    BSidebar, BButton, BNav, BNavItem, BIcon, BFormGroup, BFormRadioGroup,
    BFormInput, BFormCheckbox, BFormSpinbutton, BFormSelect,
    BCard, BCardHeader, BCollapse, BCardBody
  } from 'bootstrap-vue'
  import { decodeStorageItem, encodeStorageItem, getStorageItem } from './lib/storage'
  import { degToRad } from './lib/math'
  import { SIDE_FRONT, SIDE_BACK, SIDE_DOUBLE } from './v3/constants'
  import { FrontSide, BackSide, DoubleSide } from 'three'

  import { renderThreeScene } from './v3/examples/three-scene'
  import { renderWebGlScene } from './v3/examples/webgl-scene'

  const defaultOptions = {
    saveCounter: 0,
    scene: {
      background: '#00FFFF'
    },
    objects: {
      visible: true,
    },
    baseMaterial: {
      color: '#FFFFFF',
      wireframe: false,
      vertexColors: true,
      side: 'front',
    },
    camera: {
      position: [0, 0, 200],
      rotation: [0, 0, 0]
    }
  }

  let storedOptions = decodeStorageItem('webgl') || JSON.parse(JSON.stringify(defaultOptions))

  const render = (canvasIdWebGl, canvasIdThree, offsetTop) => {
    const canvasWebGL = document.getElementById(canvasIdWebGl)
    const canvasThree = document.getElementById(canvasIdThree)

    renderWebGlScene(canvasWebGL, offsetTop, ({ scene, camera, cubeMaterial }) => {
      scene.background.set(storedOptions.scene.background)

      camera.position = Array.from(storedOptions.camera.position)
      camera.rotation = Array.from(storedOptions.camera.rotation)

      cubeMaterial.useWireframe(storedOptions.baseMaterial.wireframe)
      cubeMaterial.useVertexColors(storedOptions.baseMaterial.vertexColors)
      cubeMaterial.setColor(storedOptions.baseMaterial.color)
      switch (storedOptions.baseMaterial.side) {
        case 'front':
          cubeMaterial.side = SIDE_FRONT
          break
        case 'back':
          cubeMaterial.side = SIDE_BACK
          break
        case 'double':
          cubeMaterial.side = SIDE_DOUBLE
          break
      }
    })

    renderThreeScene(canvasThree, offsetTop, ({ scene, camera, cubeMaterial }) => {
      scene.background.set(storedOptions.scene.background)

      camera.position.fromArray(storedOptions.camera.position)
      camera.rotation.fromArray(storedOptions.camera.rotation)

      cubeMaterial.wireframe = storedOptions.baseMaterial.wireframe

      cubeMaterial.color.set(storedOptions.baseMaterial.color)
      cubeMaterial.vertexColors = storedOptions.baseMaterial.vertexColors
      switch (storedOptions.baseMaterial.side) {
        case 'front':
          cubeMaterial.side = FrontSide
          break
        case 'back':
          cubeMaterial.side = BackSide
          break
        case 'double':
          cubeMaterial.side = DoubleSide
          break
      }
    })
  }

  let isRendered = false

  export default {
    name: 'WebGlPage',
    components: {
      WrapperView, WrapperCorner, WrapperSidebar, FormRangeVector3,
      BCard, BCardHeader, BCollapse, BCardBody, BFormSelect,
      BFormGroup, BFormRadioGroup, BSidebar, BButton, BNav, BNavItem, BIcon,
      BFormInput, BFormCheckbox, BFormSpinbutton,
    },
    data() {
      return {
        offsetTop: 0,
        canvasIdWebGl: 'canvas-container-webgl',
        canvasIdThree: 'canvas-container-three',
        options: storedOptions,
        renderCounter: 1,
        materialSideOptions: [
          { value: 'front', text: 'Front' },
          { value: 'back', text: 'Back' },
          { value: 'Double', text: 'Double' },
        ]
      }
    },
    computed: {
      settingsStatus: function () {
        const savedConfig = getStorageItem('webgl') || JSON.stringify(defaultOptions)
        return JSON.stringify(this.options) === savedConfig ? 'saved' : 'changed'
      },
    },
    mounted: function () {
      this.offsetTop = this.$el.offsetTop
      if (!isRendered) {
        isRendered = true
        render(this.canvasIdWebGl, this.canvasIdThree, this.offsetTop)
      }
    },
    methods: {
      saveOptions() {
        this.renderCounter += 1
        this.options.saveCounter += 1
        encodeStorageItem('webgl', this.options)
      },
      resetOptionsToDefault() {
        storedOptions = JSON.parse(JSON.stringify(defaultOptions))
        this.options = storedOptions
      },
      resetOptionsToSaved() {
        storedOptions = decodeStorageItem('webgl') || JSON.parse(JSON.stringify(defaultOptions))
        this.options = storedOptions
      },
      key(value) {
        return String(this.renderCounter) + value
      },
      degToRad: degToRad
    }
  }
</script>

<template>
  <WrapperView class="webgl-container">
    <WrapperCorner :topOffset="offsetTop">
      <template slot="top-left">
        <div class="text-secondary m-2 ml-5">
          <span class="ml-3">Scene custom WebGL</span>
        </div>
      </template>

      <template slot="top-right">
        <div class="text-secondary m-2">Scene Three.js framework</div>
      </template>
    </WrapperCorner>

    <WrapperSidebar title="Settings" :backdrop="false">
      <template slot="title">
        Settings: <small :class="settingsStatus === 'changed' ? 'text-warning' : 'text-success'">{{ settingsStatus }}</small>
      </template>
      <div role="tablist" class="m-2 text-muted">
        <BCard no-body class="mb-1">
          <BCardHeader header-tag="header" class="p-0" role="tab">
            <BButton block v-b-toggle.accordion-1 variant="info" size="sm">Scene</BButton>
          </BCardHeader>
          <BCollapse id="accordion-1" accordion="my-accordion" role="tabpanel">
            <BCardBody>
              <div>
                <label for="scene-background">Background:</label>
                <BFormInput type="color" size="sm" id="scene-background" :key="key('scene-background')" v-model="options.scene.background"/>
              </div>
            </BCardBody>
          </BCollapse>
        </BCard>

        <BCard no-body class="mb-1">
          <BCardHeader header-tag="header" class="p-0" role="tab">
            <BButton block v-b-toggle.accordion-2 variant="info" size="sm">WebGLRenderer</BButton>
          </BCardHeader>
          <BCollapse id="accordion-2" accordion="my-accordion" role="tabpanel">
            <BCardBody>
              <i>In process</i>
            </BCardBody>
          </BCollapse>
        </BCard>

        <BCard no-body class="mb-1">
          <BCardHeader header-tag="header" class="p-0" role="tab">
            <BButton block v-b-toggle.accordion-3 variant="info" size="sm">Material</BButton>
          </BCardHeader>
          <BCollapse id="accordion-3" accordion="my-accordion" role="tabpanel">
            <BCardBody>
              <div>
                <BFormCheckbox id="base-material-wireframe" :key="key('base-material-wireframe')" v-model="options.baseMaterial.wireframe">Use wire frame</BFormCheckbox>
                <BFormCheckbox id="base-material-vertex-colors" :key="key('base-material-vertex-colors')" v-model="options.baseMaterial.vertexColors">Use vertex colors</BFormCheckbox>
              </div>

              <label for="base-material-color">Base material color:</label>
              <BFormInput type="color" size="sm" id="base-material-color" :key="key('base-material-color')" v-model="options.baseMaterial.color"/>

              <label for="base-material-side">Base material side:</label>
              <BFormSelect size="sm" id="base-material-side" v-model="options.baseMaterial.side" :options="materialSideOptions" />
            </BCardBody>
          </BCollapse>
        </BCard>

        <BCard no-body class="mb-1">
          <BCardHeader header-tag="header" class="p-0" role="tab">
            <BButton block v-b-toggle.accordion-4 variant="info" size="sm">Light</BButton>
          </BCardHeader>
          <BCollapse id="accordion-4" accordion="my-accordion" role="tabpanel">
            <BCard>
              <i>In process</i>
            </BCard>
          </BCollapse>
        </BCard>

        <BCard no-body class="mb-1">
          <BCardHeader header-tag="header" class="p-0" role="tab">
            <BButton block v-b-toggle.accordion-5 variant="info" size="sm">Camera</BButton>
          </BCardHeader>
          <BCollapse id="accordion-5" accordion="my-accordion" role="tabpanel">
            <BCard>
              <FormRangeVector3 label="Position:" id="camera-position" :key="key('camera-position')" v-model="options.camera.position"/>

              <FormRangeVector3 label="Rotation:" id="camera-rotation" :key="key('camera-rotation')" v-model="options.camera.rotation" :min="degToRad(0)" :max="degToRad(360)" :step="degToRad(2)"/>
            </BCard>
          </BCollapse>
        </BCard>

        <div class="mb-1 d-flex justify-content-between">
          <BButton size="sm" variant="success" @click="saveOptions">Save</BButton>
          <BButton size="sm" variant="warning" @click="resetOptionsToDefault">Reset to default</BButton>
          <BButton size="sm" variant="warning" @click="resetOptionsToSaved">Reset to saved</BButton>
        </div>
      </div>

    </WrapperSidebar>

    <template slot="bg">
     <div class="row m-0">
       <div class="col-6 p-0 border border-secondary">
         <canvas :id="canvasIdWebGl" style="width: 100%; height: 100%" />
       </div>
       <div class="col-6 p-0 border border-secondary">
         <canvas :id="canvasIdThree" style="width: 100%; height: 100%" />
       </div>
     </div>
    </template>
  </WrapperView>
</template>