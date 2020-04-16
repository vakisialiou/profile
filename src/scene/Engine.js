import {
  Fog,
  Color,
  Clock,
  Scene,
  PerspectiveCamera,
  Vector3,
  MOUSE,
  Math as _Math,
  AudioListener,
  PositionalAudio,
} from 'three'
import { HemisphereLight, DirectionalLight, PointLight } from 'three'
import { HemisphereLightHelper, DirectionalLightHelper, PointLightHelper, GridHelper, AxesHelper } from 'three'
import { EventDispatcher } from 'three'

import Stats from 'three/examples/jsm/libs/stats.module'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
import EngineRenderer from './EngineRenderer'
import { World } from 'oimo'
import Unit from './units/Unit'

class Engine {
  constructor() {

    /**
     *
     * @type {Element|?}
     */
    this.container = null

    /**
     *
     * @type {Stats}
     */
    this.stats = new Stats()
    this.stats.dom.style.cssText = 'position:absolute;bottom:64px;right:0;cursor:pointer;opacity:0.9;z-index:10000'

    /**
     *
     * @type {Clock}
     */
    this.clock = new Clock()

    /**
     *
     * @type {Scene}
     */
    this.scene = new Scene()

    /**
     *
     * @type {PerspectiveCamera}
     */
    this.camera = new PerspectiveCamera(50, this.width / this.height, 1, 5000)

    /**
     *
     * @type {EngineRenderer}
     */
    this.renderer = new EngineRenderer(this.scene, this.camera)

    /**
     *
     * @type {MapControls}
     */
    this.mapControls = new MapControls(this.camera, this.renderer.domElement)
    this.mapControls.enableDamping = true
    this.mapControls.enableKeys = false
    this.mapControls.dampingFactor = 0.05
    this.mapControls.maxPolarAngle = _Math.degToRad(70)
    this.mapControls.minPolarAngle = _Math.degToRad(10)
    this.mapControls.minDistance = 120
    this.mapControls.maxDistance = 620
    this.mapControls.keys = {}
    this.mapControls.enablePan = true
    this.mapControls.enableRotate = true
    this.mapControls.mouseButtons = {
      RIGHT: MOUSE.ROTATE,
      LEFT: MOUSE.PAN,
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
     * @type {World}
     */
    this.physicsWorld = new World()

    /**
     * List of units that must work with physics engine.
     *
     * @type {{[Engine.CATEGORY_PHYSICS]: Array.<Unit>, [string]: Array}}
     */
    this.units = {}

    /**
     *
     * @type {Object}
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
     * @type {boolean}
     */
    this.stopped = false

    /**
     *
     * @type {EventDispatcher}
     */
    this.events = new EventDispatcher()

    /**
     *
     * @type {AudioListener}
     */
    this.audioListener = new AudioListener()
  }

  /**
   *
   * @type {string}
   */
  static CATEGORY_PHYSICS = 'physics'

  /**
   *
   * @param {string} [name]
   * @returns {Engine}
   */
  static create(name) {
    name = name || 'default'
    if (!window.__engine__) {
      window.__engine__ = {}
    }
    if (window.__engine__.hasOwnProperty(name)) {
      window.__engine__[name].destroy()
    }
    const engine = new Engine()
    window.__engine__[name] = engine
    return engine
  }

  /**
   *
   * @returns {number}
   */
  get width() {
    return window.innerWidth
  }

  /**
   *
   * @returns {number}
   */
  get height() {
    return window.innerHeight
  }

  /**
   *
   * @param {AudioBuffer} audioBuffer
   */
  createPositionalAudio(audioBuffer) {
    const audio = new PositionalAudio(this.audioListener)
    audio.setBuffer(audioBuffer)
    return audio
  }

  /**
   *
   * @returns {Promise}
   */
  preset() {
    return new Promise((resolve) => {
      resolve()
    })
  }

  /**
   *
   * @param {Object} [options]
   * @returns {Engine}
   */
  setPhysicsGround(options = {}) {
    this.physicsWorld.add({ size: [1000, 1, 1000], pos: [0, 0, 0], density: 1000, ...options })
    return this
  }

  /**
   *
   * @param {(Mesh|Group|Object3D|Unit)} mesh
   * @returns {boolean}
   */
  has(mesh) {
    for (const createdCategory in this.units) {
      if (!this.units.hasOwnProperty(createdCategory)) {
        continue
      }
      const itemIndex = this.units[createdCategory].indexOf(mesh)
      if (itemIndex !== -1) {
        return true
      }
    }
    return false
  }

  /**
   * Add element to scene and distribute to different category to quick search.
   *
   * @param {string} category
   * @param {(Mesh|Group|Object3D|Unit)} mesh
   * @returns {Engine}
   */
  add(category, mesh) {
    if (!this.units.hasOwnProperty(category)) {
      this.units[category] = []
    }

    for (const createdCategory in this.units) {
      if (!this.units.hasOwnProperty(createdCategory)) {
        continue
      }
      const itemIndex = this.units[createdCategory].indexOf(mesh)
      if (itemIndex !== -1) {
        throw Error(`Model has already added to scene and relate to ${createdCategory} category`)
      }
    }

    if (mesh instanceof Unit) {
      if (!this.units.hasOwnProperty(Engine.CATEGORY_PHYSICS)) {
        this.units[Engine.CATEGORY_PHYSICS] = []
      }
      this.units[Engine.CATEGORY_PHYSICS].push(mesh)
    }

    this.scene.add(mesh)
    this.units[category].push(mesh)
    return this
  }

  /**
   *
   * @param {Function|UpdateCallback} callback
   * @returns {Engine}
   */
  addUpdate(callback) {
    this.updates.push(callback)
    return this
  }

  /**
   *
   * @param {Function|UpdateCallback} callback
   * @returns {Engine}
   */
  removeUpdate(callback) {
    const index = this.updates.indexOf(callback)
    if (index !== -1) {
      this.updates.splice(index, 1)
    }
    return this
  }

  /**
   *
   * @param {Array.<string>} categories
   * @returns {Array.<(Mesh|Group|Object3D|Unit)>}
   */
  getUnits(categories) {
    let units = []
    for (const category of categories) {
      if (this.units.hasOwnProperty(category)) {
        units = units.concat(this.units[category])
      }
    }
    return units
  }

  /**
   *
   * @param {(Object3D|Mesh|Group|Unit)} mesh
   * @returns {Engine}
   */
  remove(mesh) {
    for (const category in this.units) {
      if (!this.units.hasOwnProperty(category)) {
        continue
      }
      const itemIndex = this.units[category].indexOf(mesh)
      if (itemIndex !== -1) {
        this.units[category].splice(itemIndex, 1)
      }
      if (category !== Engine.CATEGORY_PHYSICS && this.units[category].length === 0) {
        delete this.units[category]
      }
    }

    this.scene.remove(mesh)
    return this
  }

  /**
   *
   * @param {Color} [color]
   * @returns {Engine}
   */
  setFog(color) {
    this.scene.background = color || new Color().setHSL(0.6, 0, 1)
    this.scene.fog = new Fog(this.scene.background, 1, 3000)
    return this
  }

  /**
   *
   * @param {boolean} [value]
   * @param {number} [speed]
   * @returns {Engine}
   */
  enableAutoRotate(value = true, speed = 0.2) {
    this.mapControls.autoRotate = value
    this.mapControls.autoRotateSpeed = speed
    return this
  }

  /**
   *
   * @param {boolean} [value]
   * @param {number} [speed]
   * @returns {Engine}
   */
  enableMousePan(value = true, speed = 1.0) {
    this.mapControls.enablePan = value
    this.mapControls.panSpeed = speed
    return this
  }

  /**
   *
   * @param {boolean} [value]
   * @param {number} [speed]
   * @returns {Engine}
   */
  enableMouseRotate(value = true, speed = 1.0) {
    this.mapControls.enableRotate = value
    this.mapControls.rotateSpeed = speed
    return this
  }

  /**
   *
   * @param {boolean} [value]
   * @param {number} [speed]
   * @returns {Engine}
   */
  enableMouseZoom(value = true, speed = 1.0) {
    this.mapControls.enableZoom = value
    this.mapControls.zoomSpeed = speed
    return this
  }

  /**
   *
   * @returns {Engine}
   */
  enableOutline() {
    this.renderer.enableOutline()
    return this
  }

  /**
   *
   * @param {Array.<(Object3D|Mesh)>} objectsArray
   * @param {Color} visibleColor
   * @returns {OutlinePass}
   */
  createOutline(objectsArray, visibleColor) {
    return this.renderer.createOutline(objectsArray, visibleColor)
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
  setGridHelper(size = 4000, divisions = 10, color1, color2) {
    const grid = new GridHelper(size, divisions, color1, color2)
    this.scene.add(grid)
    return this
  }

  /**
   *
   * @param {number} [size]
   * @returns {Engine}
   */
  setAxesHelper(size = 100) {
    const grid = new AxesHelper(size)
    this.scene.add(grid)
    return this
  }

  /**
   *
   * @param {Vector3} [position]
   * @returns {Engine}
   */
  setHemiLight(position = new Vector3()) {
    this.hemiLight.position.copy(position)
    this.scene.add(this.hemiLight)
    return this
  }

  /**
   *
   * @param {Vector3} [position]
   * @returns {Engine}
   */
  setDirLight(position = new Vector3()) {
    this.dirLight.position.copy(position)
    this.scene.add(this.dirLight)
    return this
  }

  /**
   *
   * @param {Vector3} [position]
   * @returns {Engine}
   */
  setPointLight(position = new Vector3()) {
    this.pointLight.position.copy(position)
    this.scene.add(this.pointLight)
    return this
  }

  /**
   *
   * @param {Vector3} [position]
   * @param {Vector3} [lookAt]
   * @returns {Engine}
   */
  setCamera(position = new Vector3(100, 50, 100), lookAt = new Vector3()) {
    this.camera.position.copy(position)
    this.mapControls.target.copy(lookAt)
    this.camera.lookAt(lookAt)
    return this
  }

  static EVENT_MOUSE_DOWN = 'EVENT_MOUSE_DOWN'
  static EVENT_MOUSE_MOVE = 'EVENT_MOUSE_MOVE'
  static EVENT_KEY_DOWN = 'EVENT_KEY_DOWN'
  static EVENT_KEY_UP = 'EVENT_KEY_UP'

  /**
   *
   * @param {string} type
   * @param {Function} callback
   * @returns {Engine}
   */
  addEventListener(type, callback) {
    this.events.addEventListener(type, callback)
    return this
  }

  /**
   *
   * @param {MouseEvent} event
   * @returns {void}
   * @private
   */
  _onMouseMove(event) {
    if (!this._isDomElementEvent(event)) {
      return
    }
    this.events.dispatchEvent({ type: Engine.EVENT_MOUSE_MOVE, event })
  }

  /**
   *
   * @param {MouseEvent} event
   * @returns {void}
   * @private
   */
  _onMouseDown(event) {
    if (!this._isDomElementEvent(event)) {
      return
    }
    this.events.dispatchEvent({ type: Engine.EVENT_MOUSE_DOWN, event })
  }

  /**
   *
   * @param {MouseEvent} event
   * @returns {boolean}
   * @private
   */
  _isDomElementEvent(event) {
    const path = event.path || (event.composedPath && event.composedPath()) || []
    return (path && path[0] === this.renderer.domElement)
  }

  /**
   *
   * @param {KeyboardEvent} event
   * @private
   */
  _boardKeyDown(event) {
    this.register.activeKeyCode = event.keyCode
    this.events.dispatchEvent({ type: Engine.EVENT_KEY_DOWN, event })
  }

  /**
   *
   * @param {KeyboardEvent} event
   * @private
   */
  _boardKeyUp(event) {
    this.register.activeKeyCode = null
    this.events.dispatchEvent({ type: Engine.EVENT_KEY_UP, event })
  }

  /**
   *
   * @returns {Engine}
   */
  registerEvents() {
    this.renderer.registerEvents()
    this.register.activeKeyCode = null
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
    this.renderer.unregisterEvents()
    this.register.activeKeyCode = null
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
    this.renderer.preset()
    this.container = container
    this.container.appendChild(this.renderer.domElement)
    this.camera.add(this.audioListener)
    return this
  }

  /**
   *
   * @param {Element} container
   * @returns {Engine}
   */
  renderStats(container) {
    container.appendChild(this.stats.dom)
    return this
  }

  /**
   *
   * @param {boolean} value
   * @returns {Engine}
   */
  pause(value) {
    this.stopped = value
    return this
  }

  /**
   *
   * @returns {Engine}
   */
  animate() {
    this.stats.update()
    this.register.requestAnimationId = requestAnimationFrame(() => this.animate())
    const delta = this.clock.getDelta()
    if (this.stopped) {
      return this
    }

    this.mapControls.update()
    this.physicsWorld.step()

    for (const updateCallback of this.updates) {
      updateCallback(delta)
    }

    this.renderer.update()
    return this
  }

  /**
   *
   * @returns {Engine}
   */
  destroy() {
    this.unregisterEvents()
    if (this.register.requestAnimationId) {
      cancelAnimationFrame(this.register.requestAnimationId)
    }

    while(this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0])
    }

    const units = this.units[Engine.CATEGORY_PHYSICS] || []
    for (const unit of units) {
      if (unit.rigidBody) {
        this.physicsWorld.remove(unit.rigidBody)
      }
    }

    this.mapControls.dispose()
    return this
  }
}

export default Engine