<script>
  import './index.less'
  import WrapperView from '@components/WrapperView'
  import WrapperCorner from '@components/WrapperCorner'
  import WrapperSidebar from '@components/WrapperSidebar'
  import FormRangeVector3 from '@components/FormRangeVector3'
  import {
    BSidebar, BButton, BNav, BNavItem, BIcon, BFormGroup, BFormRadioGroup,
    BFormInput, BFormCheckbox, BFormSpinbutton,
    BCard, BCardHeader, BCollapse, BCardBody
  } from 'bootstrap-vue'
  import { hexToNormalizedRgb, rgbToArrayRgba } from './lib/color'
  import { decodeStorageItem, encodeStorageItem } from './lib/storage'
  import { degToRad } from './lib/math'

  import { renderThreeScene } from './v3/examples/three-scene'
  import { renderWebGlScene } from './v3/examples/webgl-scene'

  const defaultOptions = {
    scene: {
      background: '#00ffff'
    },
    objects: {
      wireframe: false
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
      scene.background = rgbToArrayRgba(hexToNormalizedRgb(storedOptions.scene.background))
      cubeMaterial.wireframe = storedOptions.objects.wireframe
      camera.position = Array.from(storedOptions.camera.position)
      camera.rotation = Array.from(storedOptions.camera.rotation)
    })

    renderThreeScene(canvasThree, offsetTop, ({ scene, camera, cubeMaterial }) => {
      scene.background.set(storedOptions.scene.background)
      cubeMaterial.wireframe = storedOptions.objects.wireframe
      camera.position.fromArray(storedOptions.camera.position)
      camera.rotation.fromArray(storedOptions.camera.rotation)
    })
  }

  let isRendered = false

  export default {
    name: 'WebGlPage',
    components: {
      WrapperView, WrapperCorner, WrapperSidebar, FormRangeVector3,
      BCard, BCardHeader, BCollapse, BCardBody,
      BFormGroup, BFormRadioGroup, BSidebar, BButton, BNav, BNavItem, BIcon,
      BFormInput, BFormCheckbox, BFormSpinbutton,
    },
    data() {
      return {
        offsetTop: 0,
        canvasIdWebGl: 'canvas-container-webgl',
        canvasIdThree: 'canvas-container-three',
        options: storedOptions,
        iteration: 1,
      }
    },
    computed: {

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
        setTimeout(() => {
          encodeStorageItem('webgl', this.options)
        }, 200)
      },
      resetOptions() {
        storedOptions = JSON.parse(JSON.stringify(defaultOptions))
        this.options = storedOptions
        this.saveOptions()
        this.iteration += 1
      },
      key(value) {
        return String(this.iteration) + value
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

    <WrapperSidebar title="Настройки" :backdrop="false">
      <div role="tablist" class="m-2 text-muted">
        <BCard no-body class="mb-1">
          <BCardHeader header-tag="header" class="p-0" role="tab">
            <BButton block v-b-toggle.accordion-1 variant="info">Настройки сцены</BButton>
          </BCardHeader>
          <BCollapse id="accordion-1" accordion="my-accordion" role="tabpanel">
            <BCardBody>
              <div>
                <label for="scene-background">Цвет сцены:</label>
                <BFormInput
                  type="color"
                  id="scene-background"
                  :key="key('scene-background')"
                  v-model="options.scene.background"
                  @change="saveOptions" />
              </div>
            </BCardBody>
          </BCollapse>
        </BCard>

        <BCard no-body class="mb-1">
          <BCardHeader header-tag="header" class="p-0" role="tab">
            <BButton block v-b-toggle.accordion-2 variant="info">Настройки WebGL</BButton>
          </BCardHeader>
          <BCollapse id="accordion-2" accordion="my-accordion" role="tabpanel">
            <BCardBody>
              <i>Настроить</i>
            </BCardBody>
          </BCollapse>
        </BCard>

        <BCard no-body class="mb-1">
          <BCardHeader header-tag="header" class="p-0" role="tab">
            <BButton block v-b-toggle.accordion-3 variant="info">Настройки объектов</BButton>
          </BCardHeader>
          <BCollapse id="accordion-3" accordion="my-accordion" role="tabpanel">
            <BCardBody>
              <div>
                <BFormCheckbox
                  id="object-wireframe"
                  :key="key('object-wireframe')"
                  v-model="options.objects.wireframe"
                  @change="saveOptions"
                >
                  Показать каркас объекта
                </BFormCheckbox>
              </div>
            </BCardBody>
          </BCollapse>
        </BCard>

        <BCard no-body class="mb-1">
          <BCardHeader header-tag="header" class="p-0" role="tab">
            <BButton block v-b-toggle.accordion-4 variant="info">Настройки освещения</BButton>
          </BCardHeader>
          <BCollapse id="accordion-4" accordion="my-accordion" role="tabpanel">
            <BCard>
              <i>Настроить</i>
            </BCard>
          </BCollapse>
        </BCard>

        <BCard no-body class="mb-1">
          <BCardHeader header-tag="header" class="p-0" role="tab">
            <BButton block v-b-toggle.accordion-5 variant="info">Настройки камеры</BButton>
          </BCardHeader>
          <BCollapse id="accordion-5" accordion="my-accordion" role="tabpanel">
            <BCard>
              <FormRangeVector3
                label="Позиция камеры:"
                id="camera-position"
                :key="key('camera-position')"
                v-model="options.camera.position"
                @change="saveOptions"
              />

              <FormRangeVector3
                label="Вращение камеры:"
                id="camera-rotation"
                :key="key('camera-rotation')"
                v-model="options.camera.rotation"
                :min="degToRad(0)"
                :max="degToRad(360)"
                :step="degToRad(2)"
                @change="saveOptions"
              />
            </BCard>
          </BCollapse>
        </BCard>

        <BButton class="mb-1" @click="resetOptions">Сбросить настройки</BButton>
      </div>

    </WrapperSidebar>

    <template slot="bg">
     <div class="row m-0">
       <div class="col-6 p-0 border border-secondary">
         <canvas :id="canvasIdWebGl" />
       </div>
       <div class="col-6 p-0 border border-secondary">
         <canvas :id="canvasIdThree" />
       </div>
     </div>
    </template>
  </WrapperView>
</template>