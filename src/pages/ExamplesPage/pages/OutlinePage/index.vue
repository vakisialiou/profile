<script>
  import './index.less'
  import { BFormGroup, BFormRadioGroup, BFormCheckbox, BPopover, BIcon, BButton } from 'bootstrap-vue'
  import WrapperView from '@components/WrapperView'
  import GitHubIcon from '@components/GitHubIcon'
  import Loading from '@scene/loading/Loading'
  import Engine from '@scene/Engine'
  import {
    Vector3, Mesh, MeshPhongMaterial, CylinderGeometry, ConeGeometry, BoxGeometry, SphereGeometry, BufferGeometry,
    LineBasicMaterial, Line, RingGeometry, Color
  } from 'three'
  import { loading as loadingBot, MODEL_BOT } from '@scene/controllers/ControllerBot'
  import { loading as loadingTower, MODEL_TOWER } from '@scene/controllers/ControllerTower'
  import HelperMouseClick from '@scene/objects/Ground/Helpers/HelperMouseClick'
  import Ground from '@scene/objects/Ground'
  import Unit from '@scene/units/Unit'
  import Bot from '@scene/units/Bot'
  import Tower from '@scene/units/Tower'

  let engine = null
  let userTarget = new Vector3()

  const TEXTURE_GROUND = 'TEXTURE_GROUND'

  const loader = new Loading()
    .addLoading(loadingBot)
    .addLoading(loadingTower)
    .addItem(Loading.TYPE_TEXTURE, TEXTURE_GROUND, '/models/ground/grass/1.jpg')

  export default {
    name: 'OutlinePage',
    components: { WrapperView, GitHubIcon, BFormGroup, BFormRadioGroup, BFormCheckbox, BPopover, BIcon, BButton },
    data() {
      return {

      }
    },
    methods: {
      saveImage: function () {
        engine.screenshot()
      }
    },
    destroyed() {
      engine.destroy()
    },
    mounted() {
      engine = Engine.create('outline-canvas')
      const container = document.getElementById('outline-canvas')

      loader.preset().then(() => {
        const ground = new Ground().setTexture(loader.getTexture(TEXTURE_GROUND), 6, 6)
        const helperMouseClick = new HelperMouseClick(ground)
        helperMouseClick.position.set(100000, 0, 100000)

        const rawBotModel = loader.getRawModel(MODEL_BOT)
        const bot = new Bot(rawBotModel)

        const rawTowerModel = loader.getRawModel(MODEL_TOWER)
        const tower = new Tower(rawTowerModel)

        engine.add('shapes', createBox(0xC46900, new Vector3(- 100, 0, 0)))
        engine.add('shapes', createCylinder(0xC46900, new Vector3(- 50, 0, 0)))
        engine.add('shapes', createSphere(0xC46900, new Vector3(0, 0, 0)))
        engine.add('shapes', createCone(0xC46900, new Vector3(50, 0, 0)))
        engine.add('shapes', createRing(0xC46900, new Vector3(100, 0, 0)))
        engine.add('shapes', createLine(0xC46900, [ new Vector3(- 100, 24, 0), new Vector3(100, 24, 0) ]))
        engine.add('shapes', bot.setScale(0.2).setPosition(new Vector3(0, 0, -100)))
        engine.add('shapes', tower.setScale(20).setPosition(new Vector3(0, 0, 100)))

        const lightPosition = new Vector3(70, 70, 70)
        const cameraLookAt = new Vector3(0, 0, 0)
        const cameraPosition = new Vector3(-100, 0, 100)

        engine
          .add('ground', ground)
          .add('ground-helper', helperMouseClick)
          .setDirLight(lightPosition)
          .setHemiLight(lightPosition)
          .setPointLight(lightPosition)
          .setCamera(cameraPosition, cameraLookAt)
          .preset(container)
          .renderStats(container)
          .registerEvents()
          .enableOutline(true)
          .animate()

        let outlinePass = engine.createOutline([], { visibleEdgeColor: new Color(0xC4A900), edgeGlow: 0, edgeThickness: 1.3, edgeStrength: 2.1 })

        engine
          .addEventListener(Engine.EVENT_MOUSE_DOWN, ({event}) => {
            if (event.buttons !== 1) {
              return
            }

            // This page has top menu. Need set mouse offset on height it menu.
            ground.setMouseOffset(event.target.offsetParent.offsetTop, event.target.offsetParent.offsetLeft)

            const enemies = engine.getUnits('shapes')
            const intersection = ground.findIntersection(event, engine.camera, enemies, true)
            if (!intersection) {
              return
            }

            if (intersection.object === ground.cover) {
              const mousePosition = ground.extractMouse3DPosition(intersection)
              const faceDirection = ground.extractFaceDirection(intersection)
              helperMouseClick.update(mousePosition, faceDirection)
              userTarget.copy(mousePosition)
              return
            }

            let unit = enemies.find((item) => item.getObjectById(intersection.object.id))
            console.log(unit, intersection.object)
            // if (intersection.object.parent instanceof Unit) {
            //   unit = intersection.object.parent.model.children[0]['children']
            //   outlinePass.selectedObjects = unit
            //   console.log(unit)
            //   return
            // }

            if (unit) {
              userTarget.set(0, 0, 0)
              // outlinePass.selectedObjects = [intersection.object]
              outlinePass.selectedObjects = [unit]
            }
        })
      })
    },
  }

  /**
   *
   * @param {number} color
   * @param {Vector3} position
   * @returns {Mesh}
   */
  function createCylinder(color, position) {
    const geometry = new CylinderGeometry(10, 10, 40, 16, 16)
    const material = new MeshPhongMaterial({ color })
    const mesh = new Mesh(geometry, material)
    mesh.position.copy(position)
    return mesh
  }

  /**
   *
   * @param {number} color
   * @param {Vector3} position
   * @returns {Mesh}
   */
  function createSphere(color, position) {
    const geometry = new SphereGeometry(10, 32, 32)
    const material = new MeshPhongMaterial({ color })
    const mesh = new Mesh(geometry, material)
    mesh.position.copy(position)
    return mesh
  }

  /**
   *
   * @param {number} color
   * @param {Vector3} position
   * @returns {Mesh}
   */
  function createBox(color, position) {
    const geometry = new BoxGeometry(10, 40, 10)
    const material = new MeshPhongMaterial({ color })
    const mesh = new Mesh(geometry, material)
    mesh.position.copy(position)
    return mesh
  }


  /**
   *
   * @param {number} color
   * @param {Vector3} position
   * @returns {Mesh}
   */
  function createCone(color, position) {
    const geometry = new ConeGeometry(10, 40)
    const material = new MeshPhongMaterial({ color })
    const mesh = new Mesh(geometry, material)
    mesh.position.copy(position)
    return mesh
  }

  /**
   *
   * @param {number} color
   * @param {Vector3} position
   * @returns {Mesh}
   */
  function createRing(color, position) {
    const geometry = new RingGeometry(10, 15, 64)
    const material = new MeshPhongMaterial({ color })
    const mesh = new Mesh(geometry, material)
    mesh.position.copy(position)
    return mesh
  }

  /**
   * @param {number} color
   * @param {Array.<Vector3>} points
   * @returns {Line}
   */
  function createLine(color, points) {
    const lineGeometry = new BufferGeometry().setFromPoints(points)
    const lineMaterial = new LineBasicMaterial({ color, linewidth: 2 })
    return new Line(lineGeometry, lineMaterial)
  }

</script>

<template>
  <WrapperView :autofill="true">
    <WrapperView id="outline-canvas" :autofill="true" class="outline-page">
      <div class="outline-page__controls mx-2 my-2">
        <BButton size="sm" @click="saveImage">
          <BIcon icon="image" />
        </BButton>
      </div>

      <GitHubIcon path="/src/pages/ExamplesPage/pages/OutlinePage" class="m-2" />
    </WrapperView>
  </WrapperView>
</template>