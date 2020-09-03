
export default class Color {
  constructor(color) {
    this.r = color && color.r ? color.r : 0.0
    this.g = color && color.g ? color.g : 0.0
    this.b = color && color.b ? color.b : 0.0
    this.a = color && color.a ? color.a : 0.0
  }

  toArray() {
    return [this.r, this.g, this.b, this.a]
  }
}