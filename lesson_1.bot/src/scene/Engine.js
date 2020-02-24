import {
  Fog,
  Color,
  Clock,
  Scene,
  HemisphereLight,
  HemisphereLightHelper,
  DirectionalLight,
  PerspectiveCamera,
  DirectionalLightHelper,
  PointLight,
  PointLightHelper,
  Vector3,
  GridHelper,
  AxesHelper,
  Math as _Math,
  MOUSE, Matrix4, Mesh, Shape, ShapeBufferGeometry, MeshPhongMaterial, DoubleSide, Triangle, Geometry, Face3, Box3, Box3Helper, Quaternion
} from 'three'

import Stats from 'three/examples/jsm/libs/stats.module'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
import EngineRenderer from './EngineRenderer'
import DebugPanel from './DebugPanel'
import PlayController from './PlayController'
import Bot from './map/units/Bot'
import Team from "./map/Team";
import LoadingModels from "./LoadingModels";
import Charge from "./map/units/Charge";
import Tower from "./map/units/Tower";
import ShapeHelper from './lib/ShapeHelper'

class Engine {
  constructor() {

    /**
     *
     * @type {Stats}
     */
    this.stats = new Stats()

    /**
     *
     * @type {Clock}
     */
    this.clock = new Clock()

    /**
     *
     * @type {EngineRenderer}
     */
    this.renderer = new EngineRenderer()

    /**
     *
     * @type {Scene}
     */
    this.scene = new Scene()
    this.scene.background = new Color().setHSL(0.6, 0, 1)
    this.scene.fog = new Fog(this.scene.background, 1, 3000)

    /**
     *
     * @type {PerspectiveCamera}
     */
    this.camera = new PerspectiveCamera(60, this.renderer.width / this.renderer.height, 1, 5000)

    /**
     *
     * @type {MapControls}
     */
    this.mapControls = new MapControls(this.camera, this.renderer.domElement)
    this.mapControls.enableDamping = true
    this.mapControls.enableKeys = false
    this.mapControls.dampingFactor = 0.15
    this.mapControls.maxPolarAngle = _Math.degToRad(70)
    this.mapControls.minPolarAngle = _Math.degToRad(10)
    this.mapControls.minDistance = 120
    this.mapControls.maxDistance = 620
    this.mapControls.keys = {}
    this.mapControls.mouseButtons = {
      LEFT: MOUSE.PAN,
      RIGHT: MOUSE.ROTATE,
    }

    /**
     *
     * @type {HemisphereLight}
     */
    this.hemiLight = new HemisphereLight(0xffffff, 0x444444)

    /**
     *
     * @type {HemisphereLightHelper}
     */
    this.hemiLightHelper = new HemisphereLightHelper(this.hemiLight, 6, 0x9999FF)

    /**
     *
     * @type {DirectionalLight}
     */
    this.dirLight = new DirectionalLight(0xffffff)

    /**
     *
     * @type {DirectionalLightHelper}
     */
    this.dirLightHelper = new DirectionalLightHelper(this.dirLight, 6, 0xFF00FF)

    /**
     *
     * @type {PointLight}
     */
    this.pointLight = new PointLight(0xFFFFFF, 1, 100)

    /**
     *
     * @type {PointLightHelper}
     */
    this.pointLightHelper = new PointLightHelper(this.pointLight, 6, 0xFF0000)

    /**
     *
     * @type {{boardKeyUp: Function|?, boardKeyDown: Function|?, mouseMoveEvent: Function|?, mouseDownEvent: Function|?, requestAnimationId: number|?, activeKeyCode: number|?}}
     */
    this.register = {
      boardKeyUp: null,
      boardKeyDown: null,
      mouseMoveEvent: null,
      mouseDownEvent: null,
      requestAnimationId: null,
      activeKeyCode: null,
    }

    /**
     * @param {number} delta
     * @callback UpdateCallback
     */

    /**
     *
     * @type {*[]}
     */
    this.updates = []

    /**
     *
     * @type {PlayController}
     */
    this.playController = new PlayController(this.scene)
  }

  /**
   *
   * @returns {Engine}
   */
  static get() {
    if (window.__engine__) {
      window.__engine__.destroy()
    }
    const engine = new Engine()
    window.__engine__ = engine
    return engine
  }

  /**
   *
   * @param onSuccess
   * @param onError
   */
  preset(onSuccess, onError) {
    this.playController.preset().then(onSuccess).catch(onError)
  }

  /**
   *
   * @returns {Engine}
   */
  renderDebugPanel() {
    DebugPanel.folderDirLight(this.dirLight)
    DebugPanel.folderHemiLight(this.hemiLight)
    DebugPanel.folderPointLight(this.pointLight)
    DebugPanel.folderGround(this.playController.map.ground)
    DebugPanel.folderControls()
    return this
  }

  /**
   *
   * @returns {Engine}
   */
  setLightHelper() {
    this.scene.add(this.dirLightHelper)
    this.scene.add(this.pointLightHelper)
    this.scene.add(this.hemiLightHelper)
    return this
  }

  /**
   *
   * @param {number} size
   * @param {number} divisions
   * @param {number} [color1]
   * @param {number} [color2]
   * @returns {Engine}
   */
  setGridHelper(size, divisions, color1, color2) {
    const grid = new GridHelper(size, divisions, color1, color2)
    this.scene.add(grid)
    return this
  }

  /**
   *
   * @param {number} size
   * @returns {Engine}
   */
  setAxesHelper(size) {
    const grid = new AxesHelper(size)
    this.scene.add(grid)
    return this
  }

  /**
   *
   * @param {Vector3} position
   * @returns {Engine}
   */
  setHemiLight(position) {
    this.hemiLight.position.copy(position)
    this.scene.add(this.hemiLight)
    return this
  }

  /**
   *
   * @param {Vector3} position
   * @returns {Engine}
   */
  setDirLight(position) {
    this.dirLight.position.copy(position)
    this.scene.add(this.dirLight)
    return this
  }

  /**
   *
   * @param {Vector3} position
   * @returns {Engine}
   */
  setPointLight(position) {
    this.pointLight.position.copy(position)
    this.scene.add(this.pointLight)
    return this
  }

  /**
   *
   * @param {Vector3} position
   * @param {Vector3} lookAt
   * @returns {Engine}
   */
  setCamera(position, lookAt) {
    this.camera.position.copy(position)
    this.camera.lookAt(lookAt)
    return this
  }

  /**
   *
   * @param {MouseEvent} event
   * @returns {void}
   * @private
   */
  _onMouseMove(event) {

  }

  /**
   *
   * @param {MouseEvent} event
   * @returns {void}
   * @private
   */
  _onMouseDown(event) {
    if (event.path[0] !== this.renderer.domElement) {
      return
    }
    switch (event.button) {
      case 0:
        if (this.register.activeKeyCode === 17) { // Control
          this.playController.map.ground.onDocumentMouseDown(event, this.camera)
        }
        break
    }
  }

  /**
   *
   * @param {KeyboardEvent} event
   * @private
   */
  _boardKeyDown(event) {
    this.register.activeKeyCode = event.keyCode
  }

  /**
   *
   * @param {KeyboardEvent} event
   * @private
   */
  _boardKeyUp(event) {
    this.register.activeKeyCode = null
  }

  /**
   *
   * @returns {Engine}
   */
  registerEvents() {
    this.register.mouseMoveEvent = (event) => this._onMouseMove(event)
    document.addEventListener('mousemove', this.register.mouseMoveEvent, false)
    this.register.mouseDownEvent = (event) => this._onMouseDown(event)
    document.addEventListener('mousedown', this.register.mouseDownEvent, false)
    this.register.boardKeyDown = (event) => this._boardKeyDown(event)
    this.renderer.domElement.addEventListener('keydown', this.register.boardKeyDown, false)
    this.register.boardKeyUp = (event) => this._boardKeyUp(event)
    this.renderer.domElement.addEventListener('keyup', this.register.boardKeyUp, false)
    return this
  }

  /**
   *
   * @returns {Engine}
   */
  unregisterEvents() {
    if (this.register.mouseMoveEvent) {
      document.removeEventListener('mousemove', this.register.mouseMoveEvent, false)
      this.register.mouseMoveEvent = null
    }
    if (this.register.mouseDownEvent) {
      document.removeEventListener('mousedown', this.register.mouseDownEvent, false)
      this.register.mouseDownEvent = null
    }
    if (this.register.boardKeyDown) {
      this.renderer.domElement.removeEventListener('keydown', this.register.boardKeyDown, false)
    }
    if (this.register.boardKeyUp) {
      this.renderer.domElement.removeEventListener('keydown', this.register.boardKeyUp, false)
    }
    return this
  }

  /**
   *
   * @param {Element} container
   * @returns {Engine}
   */
  render(container) {
    this.renderer.start(this.camera)
    container.appendChild(this.stats.dom)
    container.appendChild(this.renderer.domElement)
    return this
  }

  debugGltfTower() {
    const teamA = new Team(this.scene, 'team-A', '#FF0000')


    // Add bot
    const gltfBotA = this.playController.loadingModels.getGLTF(LoadingModels.MODEL_BOT)
    const botPath = [
      new Vector3(-50, 1, -50),
      new Vector3(-20, 1, 40),
      new Vector3(50, 1, -10),
      new Vector3(40, 1, -50),
      new Vector3(150, 1, -150),
    ]
    const botA = new Bot(teamA, gltfBotA, botPath, new Vector3(0, 1, 0))
    botA.destroyEvent(() => {
      botA.restoreHealth()
    })

    const box = new Box3()
    const boxHelper = new Box3Helper(box, 0xff00ff)

    this.scene.add(botA)
    this.scene.add(boxHelper)


    // Add tower
    const gltfTowerA = this.playController.loadingModels.getGLTF(LoadingModels.MODEL_TOWER)
    const tower = new Tower(teamA, gltfTowerA, 'Tower - A')
    tower.position.set(10, 1, 15)

    tower.shotEvent((shotOptions) => {
      const charge = new Charge(shotOptions.targetObject, shotOptions.position, shotOptions.direction)
      charge.collisionEvent((options) => {
        const hitBot = options.intersections[0]['object']
        hitBot.hit(charge)
        charge.dispatchDestroyEvent()
      })
      charge.destroyEvent(() => this.scene.remove(charge))

      this.scene.add(charge)
      this.updates.push((delta) => {
        charge.update(delta, [botA])
      })
    })


    // debug
    const tmp = new Vector3()
    const shapeWTL = new ShapeHelper().renderSphere(0.2)
    const shapeWTR = new ShapeHelper().renderSphere(0.2)
    const shapeWBL = new ShapeHelper().renderSphere(0.2)
    const shapeWBR = new ShapeHelper().renderSphere(0.2)
    const shapeHead = new ShapeHelper().renderSphere(0.2)
    const shapeHead1 = new ShapeHelper({ color: 0xFF00FF }).renderSphere(0.9)
    const shapeHead2 = new ShapeHelper({ color: 0x0000FF }).renderSphere(0.9)

    this.scene.add(shapeWTL)
    this.scene.add(shapeWTR)
    this.scene.add(shapeWBL)
    this.scene.add(shapeWBR)
    this.scene.add(shapeHead)
    this.scene.add(shapeHead1)
    this.scene.add(shapeHead2)

    const nextPosition = (objA, objB, len) => {
      const p = objA.getWorldPosition(tmp).clone()
      const step = objB.getWorldDirection(tmp).clone().setLength(len).setY(1)
      return p.add(step).clone()
    }

    this.updates.push((delta) => {



      // tower
      tower
        .tryCaptureTarget([botA])
        .update(delta)

      // Debug
      shapeWTL.position.copy(nextPosition(tower.weaponTopLeftTrap, tower.head, -80))
      shapeWTR.position.copy(nextPosition(tower.weaponTopRightTrap, tower.head, -80))
      shapeWBL.position.copy(nextPosition(tower.weaponBottomLeftTrap, tower.head, -80))
      shapeWBR.position.copy(nextPosition(tower.weaponBottomRightTrap, tower.head, -80))
      shapeHead.position.copy(nextPosition(tower.head, tower.head, -60))

      const d = tower.head.getWorldDirection(tmp).clone()
      const p = tower.head.getWorldPosition(tmp).clone()

      // const rr = _Math.radToDeg(Math.PI) - _Math.radToDeg(tower.head.quaternion.angleTo(new Quaternion(0, 1, 0, 0)))
      // const r = tower.head.rotation.y < 0 ? 180 + _Math.radToDeg(tower.head.quaternion.angleTo(new Quaternion(0, 1, 0, 0))) : rr
      // console.log(r, r * 0.06944444444444445, tower.getQuaternionY360Deg(tower.head), tower.getHeadAnimationTime())

      const a1 = new Vector3().copy(d)
        .applyAxisAngle(new Vector3(0, 1, 0), _Math.degToRad(19))
        .setLength(-60)
        .setY(1)

      const b1 = new Vector3().copy(p).add(a1)
      shapeHead1.position.copy(b1)

      const a2 = new Vector3().copy(d)
        .applyAxisAngle(new Vector3(0, 1, 0), _Math.degToRad(- 19))
        .setLength(- 60)
        .setY(1)

      const b2 = new Vector3().copy(p).add(a2)
      shapeHead2.position.copy(b2)

      // Bot
      botA.update(delta)
      box.setFromObject(botA)
    })

    this.scene.add(tower)
    return this
  }

  debugGltfBot() {
    const teamA = new Team(this.scene, 'team-A', '#FF0000')
    const teamB = new Team(this.scene, 'team-B', '#0000FF')

    const gltfBotA = this.playController.loadingModels.getGLTF(LoadingModels.MODEL_BOT)
    const botA = new Bot(teamA, gltfBotA, [new Vector3(0, 0, 100)], new Vector3(0, 0, 0))

    const gltfBotB = this.playController.loadingModels.getGLTF(LoadingModels.MODEL_BOT)
    const botB = new Bot(teamB, gltfBotB, [new Vector3(0, 0, 100)], new Vector3(0, 0, 100))

    botA.shotEvent((shotOptions) => {
      // console.log(bot.weaponPosition, bot.position)
      const charge = new Charge(botA, botA.weaponPosition, shotOptions.direction)
      charge.collisionEvent((options) => {
        const hitBot = options.intersections[0]['object']
        hitBot.hit(charge)
        charge.dispatchDestroyEvent()
      })
      charge.destroyEvent(() => this.scene.remove(charge))

      this.scene.add(charge)
      this.updates.push((delta) => {
        charge.update(delta, [botB])
      })
    })
    teamA.addBot(botA)
    this.scene.add(botA)
    this.updates.push((delta) => {
      botA.tryCaptureTarget(teamB.bots).update(delta)
    })



    teamB.addBot(botB)
    this.scene.add(botB)
    this.updates.push((delta) => {
      botB.update(delta)
    })
    botB.destroyEvent(() => this.scene.remove(botB))


    return this
  }

  /**
   *
   * @param {Object} rawMap
   * @returns {Engine}
   */
  startPlay(rawMap) {
    this.playController
      .renderMap(rawMap)
      .renderWaveBots()
      .startRenderWaveBots()
    return this
  }

  /**
   *
   * @returns {Engine}
   */
  animate() {
    this.register.requestAnimationId = requestAnimationFrame(() => this.animate())
    const delta = this.clock.getDelta()
    this.playController.update(delta)
    for (const updateCallback of this.updates) {
      updateCallback(delta)
    }
    this.mapControls.update()
    this.renderer.update(this.scene, this.camera)
    this.stats.update()
    return this
  }

  /**
   *
   * @returns {Engine}
   */
  destroy() {
    DebugPanel.clear()
    this.unregisterEvents()
    if (this.register.requestAnimationId) {
      cancelAnimationFrame(this.register.requestAnimationId)
    }
    this.mapControls.dispose()
    return this
  }
}

export default Engine