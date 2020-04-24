<script>
  import { BFormGroup, BFormRadioGroup, BFormCheckbox, BPopover, BButton, BIcon } from 'bootstrap-vue'
  import WrapperView from '@components/WrapperView'
  import WrapperCorner from '@components/WrapperCorner'
  import GitHubIcon from '@components/GitHubIcon'
  import Loading from '@scene/loading/Loading'
  import Engine from '@scene/Engine'
  import DisplacementFollow from '@scene/steering/modifiers/DisplacementFollow'
  import {
    Vector3,
    Mesh,
    MeshPhongMaterial,
    CylinderGeometry,
    ConeGeometry,
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
    name: 'SteeringPage',
    components: {WrapperCorner, WrapperView, GitHubIcon, BFormGroup, BFormRadioGroup, BFormCheckbox, BPopover, BButton, BIcon },
    data() {
      return {
        offsetTop: 0,
        offsetLeft: 0,
        containerId: 'steering-page',
      }
    },
    methods: {
      screenshot: function () {
        engine.screenshot()
      },
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
        const ground = new Ground()
          .setTexture(loader.getTexture(TEXTURE_GROUND), 6, 6)
          // This page has top menu. Need set mouse offset on height it menu.
          .setMouseOffset(this.offsetTop, this.offsetLeft)

        const helperMouseClick = new HelperMouseClick(ground)
        helperMouseClick.position.set(100000, 0, 100000)

        const shapes = [
          {
            path: new Path().type(Path.TYPE_LOOP_BACKWARD).add(new Vector3(320, 0, 320)).add(new Vector3(320, 0, -320)),
            shape: new Group(),
            type: 'box',
            color: 0x307102,
            speed: 0.5,
            enableUserControls: false
          },
          {
            path: new Path().type(Path.TYPE_LOOP_BACKWARD).add(new Vector3(360, 0, 360)).add(new Vector3(-360, 0, 360)),
            shape: new Group(),
            type: 'sphere',
            color: 0x8E3E00,
            speed: 1,
            enableUserControls: false
          },
          {
            path: new Path().type(Path.TYPE_LOOP_BACKWARD).add(new Vector3(-250, 0, -250)).add(new Vector3(250, 0, -250)),
            shape: new Group(),
            type: 'cylinder',
            color: 0x222222,
            speed: 1.5,
            enableUserControls: false
          },
          {
            path: new Path().type(Path.TYPE_LOOP_BACKWARD).add(new Vector3(180, 0, -180)).add(new Vector3(-180, 0, 180)),
            shape: new Group(),
            type: 'cone',
            color: 0x0004C4,
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
            case 'cone':
              item.shape.add(createCone(item.color))
              break
          }

          item.shape.position.copy(item.path.current())

          const ring = createRing(item.color)
          ring.position.setY(2)
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
          .preset(container)
          .renderStats(container)
          .registerEvents()
          .enableOutline(true)
          .animate()

        let outlinePass = engine.createOutline({ visibleEdgeColor: new Color(0xC4A900), edgeGlow: 0, edgeThickness: 2, edgeStrength: 2 })

        engine
          .addEventListener(Engine.EVENT_MOUSE_DOWN, ({event}) => {
            if (event.buttons !== 1) {
              return
            }

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
              outlinePass.setMeshes([intersection.object])
              for (const shape of shapes) {
                shape.enableUserControls = shape.shape === unit
              }
            }
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
    const material = new MeshPhongMaterial({ color })
    return new Mesh(geometry, material)
  }

  /**
   *
   * @param {number} color
   * @returns {Mesh}
   */
  function createSphere(color) {
    const geometry = new SphereGeometry(10, 32, 32)
    const material = new MeshPhongMaterial({ color })
    return new Mesh(geometry, material)
  }

  /**
   *
   * @param {number} color
   * @returns {Mesh}
   */
  function createBox(color) {
    const geometry = new BoxGeometry(10, 40, 10)
    const material = new MeshPhongMaterial({ color })
    return new Mesh(geometry, material)
  }


  /**
   *
   * @param {number} color
   * @returns {Mesh}
   */
  function createCone(color) {
    const geometry = new ConeGeometry(10, 40)
    const material = new MeshPhongMaterial({ color })
    return new Mesh(geometry, material)
  }

  /**
   *
   * @param {number} color
   * @returns {Mesh}
   */
  function createRing(color) {
    const geometry = new RingGeometry(49, 50, 64)
    const material = new MeshPhongMaterial({ color })
    return new Mesh(geometry, material)
  }

  /**
   * @param {number} color
   * @param {Array.<Vector3>} points
   * @returns {Line}
   */
  function linePath(color, points) {
    const lineGeometry = new BufferGeometry().setFromPoints(points)
    const lineMaterial = new LineBasicMaterial({ color, linewidth: 2 })
    return new Line(lineGeometry, lineMaterial)
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
        <GitHubIcon path="/src/pages/ExamplesPage/pages/SteeringPage" />
      </template>
    </WrapperCorner>
  </WrapperView>
</template>