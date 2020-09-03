import Node from './Node'

export default class Scene extends Node {
  constructor() {
    super()

    this.background = [0.0, 0.0, 0.0, 1.0]
  }
}