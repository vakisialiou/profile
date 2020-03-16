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
   *
   * @returns {UnitAnimation}
   */
  pauseAction(action) {
    action.paused = true
    return this
  }

  /**
   *
   * @returns {UnitAnimation}
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
   * @returns {UnitAnimation}
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