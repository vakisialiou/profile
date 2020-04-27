import { GridHelper } from 'three'

export default class HelperGridSegments extends GridHelper {
  /**
   *
   * @param {Ground} ground
   */
  constructor(ground) {
    super(ground.options.height, ground.options.heightSegments)
    this.position.setY(1)
  }
}