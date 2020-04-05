import { AnimationMixer, AnimationClip } from 'three'

class UnitAnimation {
  /**
   *
   * @param {RawModel} rawModel
   */
  constructor(rawModel) {
    /**
     *
     * @type {AnimationMixer}
     */
    this.mixer = new AnimationMixer(rawModel.model)

    /**
     *
     * @type {AnimationClip[]}
     */
    this.animations = rawModel.animations || []

    /**
     *
     * @type {(AnimationAction|?)}
     */
    this.activeAction = null
  }

  /**
   *
   * @param {string} name
   * @returns {AnimationAction|null}
   */
  findAction(name) {
    return this.mixer.clipAction(AnimationClip.findByName(this.animations, name)) || null
  }

  /**
   */
  pause() {
    if (this.activeAction) {
      this.activeAction.paused = true
    }
    return this
  }

  /**
   * @returns {UnitAnimation}
   */
  unpause() {
    if (this.activeAction) {
      this.activeAction.paused = false
    }
    return this
  }

  /**
   *
   * @param {AnimationAction} action
   * @param {number} [duration]
   * @returns {UnitAnimation}
   */
  enableAction(action, duration = 0.4) {
    if (this.activeAction === action && !this.activeAction.isRunning()) {
      // Restart completed action
      this.activeAction.reset().play()
      return this
    }

    for (const animation of this.animations) {
      const anyAction = this.findAction(animation.name)
      anyAction.paused = false
    }

    if (this.activeAction === action) {
      return this
    }

    if (this.activeAction) {
      this.activeAction.fadeOut(duration)
    }

    action
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .fadeIn(duration)
      .play()

    this.activeAction = action
    return this
  }

  /**
   *
   * @param {number} delta
   * @returns {void}
   */
  update(delta) {
    if (this.animations.length > 0) {
      this.mixer.update(delta)
    }
  }
}

export default UnitAnimation