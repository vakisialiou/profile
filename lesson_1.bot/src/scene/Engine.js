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
  MOUSE,
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
    this.hemiLight = new HemisphereLight(0xffffff, 0xffffff, 0.6)

    /**
     *
     * @type {HemisphereLightHelper}
     */
    this.hemiLightHelper = new HemisphereLightHelper(this.hemiLight, 6, 0x9999FF)

    /**
     *
     * @type {DirectionalLight}
     */
    this.dirLight = new DirectionalLight(0x000000, 2)

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

  debugMD2Character(){

  }

  debugGltfCharacter() {
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