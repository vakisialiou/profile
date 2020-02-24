import { MeshBasicMaterial, Color, EventDispatcher, Vector3 } from 'three'
import { LightningStorm } from 'three/examples/jsm/objects/LightningStorm'
import Parameters from './Parameters'

class Storm extends LightningStorm {
  constructor(color) {
    super({
      size: 3000,
      minHeight: 90,
      maxHeight: 600,
      maxSlope: 0.6,
      maxLightnings: 8,
      lightningParameters: new Parameters(),
      lightningMaterial: new MeshBasicMaterial({ color: color || new Color(0xB0FFFF) }),
      onLightningDown: (lightning) => {
        const position = new Vector3().copy(lightning.rayParameters.destOffset)
        this.event.dispatchEvent({ type: Storm.LIGHTNING_DOWN, position })
      }
    })

    /**
     *
     * @type {EventDispatcher}
     */
    this.event = new EventDispatcher()

    /**
     *
     * @type {number}
     */
    this.currentTime = 0

    /**
     *
     * @type {number}
     */
    this.timeRate = 1
  }

  /**
   *
   * @type {string}
   */
  static LIGHTNING_DOWN = 'LIGHTNING_DOWN'

  /**
   * @param {Object} options
   * @callback onLightningDown
   */

  /**
   *
   * @param {onLightningDown|Function} onLightningDown
   * @returns {Storm}
   */
  addEventOnLightningDown(onLightningDown) {
    this.event.addEventListener(Storm.LIGHTNING_DOWN, onLightningDown)
    return this
  }

  /**
   *
   * @param delta
   * @returns {void}
   */
  update(delta) {
    this.currentTime += this.timeRate * delta
    if (this.currentTime < 0) {
      this.currentTime = 0
    }
    super.update(this.currentTime)
  }
}

export default Storm