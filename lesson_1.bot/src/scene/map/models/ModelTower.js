import { BoxGeometry, MeshBasicMaterial } from 'three'
import Model from './base/Model'
import ModelOptionsTower from './base/ModelOptionsTower'
import AnimationTower from './animation/AnimationTower'

export default class ModelTower extends Model {
  /**
   *
   * @param {Team} team
   * @param {GLTF} gltf
   */
  constructor(team, gltf) {
    super(team, new ModelOptionsTower().setHealth(300))

    /**
     *
     * @type {BoxGeometry}
     */
    this.geometry = new BoxGeometry(10, 30, 10)

    /**
     *
     * @type {MeshBasicMaterial}
     */
    this.material = new MeshBasicMaterial({ color: team.color, transparent: true, opacity: 0 })

    /**
     *
     * @type {AnimationTower}
     */
    this.animation = new AnimationTower(gltf)

    gltf.model.scale.set(8, 8, 8)
    gltf.model.material.metalness = 0.2
    this.add(gltf.model)
    this.followingAnimation()
  }

  /**
   *
   * @returns {ModelTower}
   */
  followingAnimation() {
    this.animation.followingAnimation()
    return this
  }

  update(delta) {
    this.animation.update(delta)
  }
}