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
  Object3D,
  Group,
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
  GridHelper,
  AxesHelper,
  LineBasicMaterial,
  Line,
  Geometry,
  Math as _Math,
  MOUSE,
} from 'three'

import Stats from 'three/examples/jsm/libs/stats.module'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
import EngineRenderer from './EngineRenderer'
import DebugPanel from './DebugPanel'
import Ground from './Ground'
import Bot from "./Bot";

class Engine {
  constructor() {

    this.r = Math.floor(Math.random() * Math.floor(100000))

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
     * @type {Ground}
     */
    this.ground = new Ground()
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
   * @returns {Engine}
   */
  setGround() {
    this.ground.render()
    this.scene.add(this.ground)
    return this
  }

  /**
   *
   * @returns {Engine}
   */
  renderDebugPanel() {
    DebugPanel.folderDirLight(this.dirLight)
    DebugPanel.folderHemiLight(this.hemiLight)
    DebugPanel.folderPointLight(this.pointLight)
    DebugPanel.folderGround(this.ground)
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
          this.ground.onDocumentMouseDown(event, this.camera)
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
   * @param {Object3D|Mesh|Group} model
   * @returns {Engine}
   */
  removeModel(model) {
    this.scene.remove(model)
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

  renderMap(map) {
    const store = { bases: [], towers: [], lines: [] }
    for (const point of map.builds) {
      let baseMeshGeometry = null
      switch (point.type) {
        case 'base':
          baseMeshGeometry = new BoxGeometry(60, 10, 60)
          break
        case 'tower':
          baseMeshGeometry = new BoxGeometry(10, 30, 10)
          break
        default:
          continue
      }

      const baseMeshMaterial = new MeshBasicMaterial({ color: point.color })
      const baseMesh = new Mesh(baseMeshGeometry, baseMeshMaterial)
      baseMesh.name = point.name
      baseMesh.userData = point
      baseMesh.position.copy(point.position)
      switch (point.type) {
        case 'base':
          store.bases.push(baseMesh)
          break
        case 'tower':
          store.towers.push(baseMesh)
          break
      }
      this.scene.add(baseMesh)
    }

    for (const road of map.roads) {
      const roadLineGeometry = new Geometry()
      for (const point of road.points) {
        roadLineGeometry.vertices.push(new Vector3().copy(point))
      }
      const roadLineMaterial = new LineBasicMaterial({color: road.color})
      const line = new Line(roadLineGeometry, roadLineMaterial)
      line.name = road.name
      this.ground.add(line)
      store.lines.push(line)
    }

    const bots = []
    // const path = [
    //   // {"x":-115,"y":5,"z":85}
    //   new Vector3(-115, 0, 85),
    //   new Vector3(355, 0, 155),
    //   new Vector3(200, 0, 255)
    // ]
    // const bot = new Bot({color: 0xffffff}).setPath(path).render()
    // this.scene.add(bot)
    // bots.push(bot)

    setInterval(() => {
      for (const base of store.bases) {
        for (const line of store.lines) {

          let path = Array.from(line.geometry.vertices)
          if (path.length > 1) {
            const distanceToFirstVector = base.position.distanceTo(path[0])
            const distanceToLastVector = base.position.distanceTo(path[path.length - 1])
            if (distanceToFirstVector > distanceToLastVector) {
              path = path.reverse()
            }
          }

          const bot = new Bot({color: base.userData.color}).setPath(path).render()
          bot.position.copy(base.position)
          this.scene.add(bot)
          bots.push(bot)
        }
      }
    }, 30000)

    this.updates.push((delta) => {
      for (const bot of bots) {
        bot.update(delta)
      }
    })

    console.log(map, store)

    return this
  }

  /**
   *
   * @returns {Engine}
   */
  animate() {
    this.register.requestAnimationId = requestAnimationFrame(() => this.animate())
    const delta = this.clock.getDelta()
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