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

    /**
     *
     * @type {Function|?}
     * @private
     */
    this._pause = null
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
   * Stop action immediately.
   */
  stop() {
    if (this.activeAction) {
      this.activeAction.paused = true
    }
    return this
  }

  /**
   * Stop action after execution.
   *
   * @param {Function} [callback]
   * @returns {UnitAnimation}
   */
  pause(callback) {
    if (!this.activeAction) {
      // action is not selected
      return this
    }
    if (this.activeAction.paused) {
      // action has already passed
      return this
    }
    if (this._pause) {
      // action in pause process
      return this
    }
    this._pause = (event) => {
      this.stop()
      this.mixer.removeEventListener('loop', this._pause)
      this._pause = null
      if (callback) {
        callback(event)
      }
    }
    this.mixer.addEventListener('loop', this._pause)
    return this
  }

  /**
   * @returns {UnitAnimation}
   */
  play() {
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
    for (const animation of this.animations) {
      const anyAction = this.findAction(animation.name)
      anyAction.paused = false
    }
    if (this.activeAction === action) {
      return this
    }

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