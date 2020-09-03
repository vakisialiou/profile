import Color from './Color'

export default class Material {
  constructor(options = {}) {
    this.color = options.color instanceof Color ? options.color : new Color(options.color)
  }
}