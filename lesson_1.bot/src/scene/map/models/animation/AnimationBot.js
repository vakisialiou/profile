import { AnimationMixer } from 'three'

class AnimationBot {
  /**
   *
   * @param {GLTF} gltf
   */
  constructor(gltf) {
    /**
     *
     * @type {AnimationMixer}
     */
    this.mixer = new AnimationMixer(gltf.model)

    /**
     *
     * @type {AnimationAction}
     */
    this.actionWalk = this.mixer.clipAction(gltf.animations[0])

    /**
     *
     * @type {AnimationAction}
     */
    this.actionShot = this.mixer.clipAction(gltf.animations[1])

    /**
     *
     * @type {AnimationAction}
     */
    this.actionDying = this.mixer.clipAction(gltf.animations[2])
  }

  /**
   *
   * @param {number} delta
   * @returns {void}
   */
  update(delta) {
    this.mixer.update(delta)
  }
}

export default AnimationBot