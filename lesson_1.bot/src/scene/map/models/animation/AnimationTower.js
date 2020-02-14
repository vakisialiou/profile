import { AnimationMixer, AnimationAction } from 'three'

class AnimationTower {
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
    this.actionFollowing = this.mixer.clipAction(AnimationTower.findAction(gltf.animations, 'Following'))

    /**
     *
     * @type {(AnimationAction|?)}
     */
    this.activeAction = null
  }

  /**
   *
   * @param {Array.<AnimationClip>} animations
   * @param {string} name
   * @returns {AnimationClip}
   */
  static findAction(animations, name) {
    return animations.find((item) => item.name === name)
  }

  /**
   *
   * @returns {AnimationTower}
   */
  pauseAction(action) {
    action.paused = true
    return this
  }

  /**
   *
   * @returns {AnimationTower}
   */
  clearActiveAction() {
    if (this.activeAction) {
      this.pauseAction(this.activeAction)
      this.activeAction = null
    }
    return this
  }

  /**
   *
   * @param {AnimationAction} action
   * @param {number} [duration]
   * @returns {AnimationTower}
   */
  enableAction(action, duration = 0.4) {
    if (this.activeAction === action) {
      return this
    }
    if (this.activeAction) {
      this.activeAction.paused = false
    }
    action.paused = false
    action.enabled = true
    action.setEffectiveTimeScale(1)
    action.setEffectiveWeight(1)
    action.time = 0
    if (this.activeAction) {
      this.activeAction.crossFadeTo(action, duration, true)
    }
    action.play()
    this.activeAction = action
    return this
  }

  /**
   *
   * @returns {AnimationTower}
   */
  followingAnimation() {
    this.enableAction(this.actionFollowing)
    return this
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

export default AnimationTower