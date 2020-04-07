import Ground from '@scene/objects/Ground'
import Engine from '@scene/Engine'
import Loading from '@scene/loading/Loading'

export const loading = new Loading()

export class ControllerGround {
  /**
   *
   * @param {Loading} loader
   */
  constructor(loader) {
    /**
     *
     * @type {Loading}
     */
    this.loader = loader

    /**
     *
     * @type {Ground}
     */
    this.ground = new Ground().setClickHelper().setVertexHelper()
  }

  static EVENT_MOUSE_DOWN = 'EVENT_MOUSE_DOWN'

  /**
   *
   * @param {Function} callback
   * @returns {ControllerGround}
   */
  onMouseDown(callback) {
    this.ground.addEventListener(ControllerGround.EVENT_MOUSE_DOWN, callback)
    return this
  }

  /**
   *
   * @returns {number}
   */
  get width() {
    return this.ground.options.width
  }

  /**
   *
   * @returns {number}
   */
  get height() {
    return this.ground.options.height
  }

  /**
   * 
   * @returns {Mesh}
   */
  get clickHelperMesh() {
    return this.ground.clickHelperMesh
  }

  /**
   * @param {Engine} engine
   * @param {number} [offsetTop]
   * @param {number} [offsetLeft]
   * @returns {ControllerGround}
   */
  preset(engine, offsetTop = 0, offsetLeft = 0) {
    engine.add('ground', this.ground)
    this.ground.setMouseOffset(offsetTop, offsetLeft)
    this.ground.render()
    engine.addEventListener(Engine.EVENT_MOUSE_DOWN, ({ event }) => {
      this.ground.mouseUpdate(event, engine.camera)
      this.ground.dispatchEvent({ type: ControllerGround.EVENT_MOUSE_DOWN, event })
    })
    return this
  }
}