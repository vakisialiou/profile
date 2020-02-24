import { Fog, Color, Clock, Scene, PerspectiveCamera, Vector3, MOUSE, Math as _Math } from 'three'
import { HemisphereLight, DirectionalLight, PointLight } from 'three'
import { HemisphereLightHelper, DirectionalLightHelper, PointLightHelper, GridHelper, AxesHelper } from 'three'

import Stats from 'three/examples/jsm/libs/stats.module'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
import EngineRenderer from './EngineRenderer'

class Engine {
  constructor() {

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
    this.scene.background = new Color(0x050505)
    this.scene.fog = new Fog(this.scene.background, 1, 3000)

    /**
     *
     * @type {PerspectiveCamera}
     */
    this.camera = new PerspectiveCamera(60, this.width / this.height, 1, 5000)

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
    this.hemiLight = new HemisphereLight(0xffffff, 0xffffff)

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
   * @returns {Promise}
   */
  preset() {
    return new Promise((resolve) => {
      resolve()
    })
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
    this.mapControls.enablePan = false
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
  setGridHelper(size = 1000, divisions = 40, color1, color2) {
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
    // this.mapControls.target.copy(position)
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
    this.renderer.registerEvents()
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
    container.appendChild(this.stats.dom)
    container.appendChild(this.renderer.domElement)
    return this
  }

  /**
   *
   * @returns {Engine}
   */
  animate() {
    this.register.requestAnimationId = requestAnimationFrame(() => this.animate())
    const delta = this.clock.getDelta()
    this.mapControls.update()
    for (const updateCallback of this.updates) {
      updateCallback(delta)
    }
    this.renderer.update()
    this.stats.update()
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
    this.mapControls.dispose()
    return this
  }
}

export default Engine