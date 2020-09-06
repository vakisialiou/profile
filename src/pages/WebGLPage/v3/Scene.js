import Node from './Node'
import Color from './Color'

export default class Scene extends Node {
  constructor() {
    super()

    this.background = new Color()
  }
}