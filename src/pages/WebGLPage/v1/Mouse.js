
export default class Mouse {
  /**
   *
   * @param {HTMLCanvasElement|HTMLElement} canvas
   */
  constructor(canvas) {
    /**
     *
     * @type {HTMLCanvasElement|HTMLElement}
     */
    this.canvas = canvas

    /**
     * x - can be -1 or + 1
     * y - can be -1 or + 1
     *
     * @type {{x: number, y: number}}
     */
    this.position = { x: 0, y: 0 }

    this._events = {}
  }

  /**
   *
   * @param {HTMLCanvasElement|HTMLElement} canvas
   * @param {MouseEvent} event
   * @returns {{x: number, y: number}}
   */
  getPosition(canvas, event) {
    const clickPosition = { x: event.clientX, y: event.clientY }
    const rect = canvas.getBoundingClientRect()
    return this.normalizePosition(canvas, clickPosition, { x: rect.x, y: rect.y })
  }

  /**
   *
   * @param canvas
   * @param position
   * @param offset
   * @returns {{x: number, y: number}}
   */
  normalizePosition(canvas, position, offset = {x: 0, y: 0}) {
    const canvasCenter = { x: canvas.width / 2, y: canvas.height / 2 }

    return {
      x: ((position.x - offset.x) - canvasCenter.x) / canvasCenter.x,
      y: (canvasCenter.y - (position.y - offset.y)) / canvasCenter.y
    }
  }

  /**
   *
   * @returns {Mouse}
   */
  registrationEvents() {
    this._events.mousedown = (event) => {
      this.position = this.getPosition(this.canvas, event)
    }
    this.canvas.addEventListener('mousedown', this._events.mousedown)

    this._events.mouseup = (event) => {
      this.position = this.getPosition(this.canvas, event)
    }
    this.canvas.addEventListener('mouseup', this._events.mouseup)

    this._events.mousemove = (event) => {
      this.position = this.getPosition(this.canvas, event)
    }
    this.canvas.addEventListener('mousemove', this._events.mousemove)
    return this
  }

  removeEvents() {
    for (const eventName in this._events) {
      this.canvas.removeEventListener(eventName, this._events[eventName])
    }
  }
}