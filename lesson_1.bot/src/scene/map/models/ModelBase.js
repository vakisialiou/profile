import { BoxGeometry, MeshBasicMaterial } from 'three'
import Model from './base/Model'
import ModelOptionsBase from './base/ModelOptionsBase'
import AnimationBase from './animation/AnimationBase'

export default class ModelBase extends Model {
  /**
   *
   * @param {Team} team
   * @param {GLTF} gltf
   */
  constructor(team, gltf) {
    super(team, new ModelOptionsBase().setHealth(800))

    /**
     *
     * @type {BoxGeometry}
     */
    this.geometry = new BoxGeometry(60, 10, 60)

    /**
     *
     * @type {MeshBasicMaterial}
     */
    this.material = new MeshBasicMaterial({ color: team.color, transparent: true, opacity: 0 })

    /**
     *
     * @type {AnimationBase}
     */
    this.animation = new AnimationBase(gltf)

    gltf.model.scale.set(25, 25, 25)
    gltf.model.material.metalness = 0.2
    gltf.model.position.setY(1.5)
    this.add(gltf.model)
  }

  update(delta) {
    this.animation.update(delta)
  }
}