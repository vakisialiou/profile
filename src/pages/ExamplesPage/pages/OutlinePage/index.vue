<script>
  import './index.less'
  import { BFormGroup, BFormRadioGroup, BFormCheckbox, BPopover, BIcon } from 'bootstrap-vue'
  import WrapperView from '@components/WrapperView'
  import GitHubIcon from '@components/GitHubIcon'
  import Loading from '@scene/loading/Loading'
  import Engine from '@scene/Engine'
  import DisplacementFollow from '@scene/steering/modifiers/DisplacementFollow'
  import {
    Vector3,
    Mesh,
    MeshStandardMaterial,
    CylinderGeometry,
    BoxGeometry,
    SphereGeometry,
    BufferGeometry, LineBasicMaterial, Line, Raycaster, RingGeometry, Color, Group
  } from 'three'
  import { loading as loadingBot } from '@scene/controllers/ControllerBot'
  import HelperMouseClick from '@scene/objects/Ground/Helpers/HelperMouseClick'
  import Ground from '@scene/objects/Ground'
  import Path from '@scene/steering/Path'

  let engine = null
  let userTarget = new Vector3()

  const TEXTURE_GROUND = 'TEXTURE_GROUND'

  const loader = new Loading()
    .addLoading(loadingBot)
    .addItem(Loading.TYPE_TEXTURE, TEXTURE_GROUND, '/models/ground/grass/1.jpg')

  export default {
    name: 'OutlinePage',
    components: { WrapperView, GitHubIcon, BFormGroup, BFormRadioGroup, BFormCheckbox, BPopover, BIcon },
    data() {
      return {

      }
    },
    methods: {

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
      engine = Engine.create('outline-canvas')
      const container = document.getElementById('outline-canvas')

      loader.preset().then(() => {
        engine.preset().then(() => {
          const ground = new Ground().setTexture(loader.getTexture(TEXTURE_GROUND), 6, 6)
          const helperMouseClick = new HelperMouseClick(ground)
          helperMouseClick.position.set(100000, 0, 100000)

          const shapes = [
            {
              path: new Path().type(Path.TYPE_LOOP_BACKWARD).add(new Vector3(100, 0, 100)).add(new Vector3(- 50, 0, - 200)),
              shape: new Group(),
              type: 'box',
              color: 0xFFD300,
              speed: 0.5,
              enableUserControls: false
            },
            {
              path: new Path().type(Path.TYPE_LOOP_BACKWARD).add(new Vector3(-180, 0, 200)).add(new Vector3(150, 0, - 300)),
              shape: new Group(),
              type: 'sphere',
              color: 0xA600FF,
              speed: 1,
              enableUserControls: false
            },
            {
              path: new Path().type(Path.TYPE_LOOP_BACKWARD).add(new Vector3(-100, 0, -60)).add(new Vector3(250, 0, 20)),
              shape: new Group(),
              type: 'cylinder',
              color: 0x222222,
              speed: 1.5,
              enableUserControls: false
            }
          ]

          for (const item of shapes) {
            switch (item.type) {
              case 'box':
                item.shape.add(createBox(item.color))
                break
              case 'cylinder':
                item.shape.add(createCylinder(item.color))
                break
              case 'sphere':
                item.shape.add(createSphere(item.color))
                break
            }

            item.shape.position.copy(item.path.current())

            const ring = createRing(item.color)
            ring.position.setY(1)
            ring.quaternion.setFromAxisAngle(new Vector3(1, 0, 0), - Math.PI / 2)
            item.shape.add(ring)


            engine.add('path', linePath(item.color, item.path.getPoints()))
            engine.add('shapes', item.shape)
          }

          const rayCaster = new Raycaster()

          const displacement = new DisplacementFollow()
          engine.addUpdate((delta) => {
            const target = new Vector3()
            for (const item of shapes) {
              if (item.enableUserControls && userTarget.length() > 0) {
                target.copy(userTarget)
              } else {
                target.copy(item.path.current())
              }

              const desiredVelocity = displacement.setMaxSpeed(item.speed).calculate(item.shape.position, target)
              if (desiredVelocity.length() > 0) {
                item.shape.position.add(desiredVelocity)
              } else {
                if (item.enableUserControls && userTarget.length() > 0) {
                  userTarget.set(0, 0, 0)
                  helperMouseClick.position.set(100000, 0, 100000)
                } else {
                  item.path.advance()
                }
              }
            }
          })

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
            .render(container)
            .renderStats(container)
            .registerEvents()
            .enableOutline()
            .setFog(0xFFFFFF)
            .animate()

          let outlinePass = engine.createOutline([], { visibleEdgeColor: new Color(0xFFFFFF), edgeGlow: 1.4, edgeThickness: 2, edgeStrength: 1.2 })

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

              const unit = enemies.find((item) => item.getObjectById(intersection.object.id))
              if (unit) {
                userTarget.set(0, 0, 0)
                outlinePass.selectedObjects = [intersection.object]
                for (const shape of shapes) {
                  shape.enableUserControls = shape.shape === unit
                }
              }
            })
        })
      })
    },
  }

  /**
   *
   * @param {number} color
   * @returns {Mesh}
   */
  function createCylinder(color) {
    const geometry = new CylinderGeometry(10, 10, 40, 16, 16)
    const material = new MeshStandardMaterial({ color })
    return new Mesh(geometry, material)
  }

  /**
   *
   * @param {number} color
   * @returns {Mesh}
   */
  function createSphere(color) {
    const geometry = new SphereGeometry(10, 32, 32)
    const material = new MeshStandardMaterial({ color })
    return new Mesh(geometry, material)
  }

  /**
   *
   * @param {number} color
   * @returns {Mesh}
   */
  function createBox(color) {
    const geometry = new BoxGeometry(10, 40, 10)
    const material = new MeshStandardMaterial({ color })
    return new Mesh(geometry, material)
  }

  /**
   *
   * @param {number} color
   * @returns {Mesh}
   */
  function createRing(color) {
    const geometry = new RingGeometry(49.8 * 2, 50 * 2, 64)
    const material = new MeshStandardMaterial({ color })
    return new Mesh(geometry, material)
  }

  /**
   * @param {number} color
   * @param {Array.<Vector3>} points
   * @returns {Line}
   */
  function linePath(color, points) {
    const lineGeometry = new BufferGeometry().setFromPoints(points)
    const lineMaterial = new LineBasicMaterial({ color })
    return new Line(lineGeometry, lineMaterial)
  }

</script>

<template>
  <WrapperView :autofill="true">
    <WrapperView id="outline-canvas" :autofill="true" class="outline-page">
      <div class="outline-page__controls mx-2 my-2">

      </div>

      <GitHubIcon path="/src/pages/ExamplesPage/pages/OutlinePage" class="m-2" />
    </WrapperView>
  </WrapperView>
</template>