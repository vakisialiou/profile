import Mouse from './Mouse'
import { m3 } from './../lib/m3'
import vertexShaderText from './shader/shader-vertex.vert'
import fragmentShaderText from './shader/shader-fragment.frag'

export default class Scene {
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
     *
     * @type {CanvasRenderingContext2D | ImageBitmapRenderingContext | WebGLRenderingContext | WebGL2RenderingContext | RenderingContext}
     */
    this.gl = canvas.getContext('webgl')

    if (!this.gl) {
      throw new Error('Browser doesn\'t support webgl.')
    }

    /**
     *
     * @type {Mesh[]}
     */
    this.children = []

    /**
     *
     * @type {Mouse}
     */
    this.mouse = new Mouse(canvas)

    this.vertexShaderText = vertexShaderText
    this.fragmentShaderText = fragmentShaderText
  }

  add(mesh) {
    this.children.push(mesh)
    return this
  }

  createShader(type, source) {
    const shader = this.gl.createShader(type)
    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error(`Error compiling shader! Info: ${this.gl.getShaderInfoLog(vertexShader)}`)
    }

    return shader
  }

  createProgram(vertexShaderSource, fragmentShaderSource) {
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = this.gl.createProgram()

    this.gl.attachShader(program, vertexShader)
    this.gl.attachShader(program, fragmentShader)
    this.gl.linkProgram(program)
    this.gl.validateProgram(program)

    if (!this.gl.getProgramParameter(program, this.gl.VALIDATE_STATUS)) {
      throw new Error(`Error validation program! Info: ${this.gl.getProgramInfoLog(program)}`)
    }
    return program
  }

  /**
   *
   * @param {WebGLProgram} program
   * @param {Mesh} mesh
   */
  draw(program, mesh) {
    const positionBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(mesh.geometry.vertices), this.gl.STATIC_DRAW)
    this.gl.useProgram(program)

    // Позиция вершин
    const positionAttribLocation = this.gl.getAttribLocation(program, 'a_position')
    this.gl.enableVertexAttribArray(positionAttribLocation)
    this.gl.vertexAttribPointer(
      positionAttribLocation, // ссылка на атрибут в нутри vertexShaderText
      2, // Количество элементов на итерацию
      this.gl.FLOAT, // Тип данных в буфере positionBuffer
      this.gl.FALSE, //  Нормализация данных
      0 * Float32Array.BYTES_PER_ELEMENT,  // элементов массива на одну вершину
      0 * Float32Array.BYTES_PER_ELEMENT   // отступ для каждой вершины.
    )

    const matrixLocation = this.gl.getUniformLocation(program, 'u_matrix')

    const rect = this.canvas.getBoundingClientRect()

    const canvasCenter = { x: (this.canvas.width - rect.x) / 2, y: (this.canvas.height - rect.y) / 2 }

    let matrix = m3.projection(this.canvas.clientWidth, this.canvas.clientHeight)

    matrix = m3.translate(matrix, mesh.position.x + canvasCenter.x, mesh.position.y + canvasCenter.y)
    matrix = m3.rotate(matrix, mesh.rotationAngle)
    matrix = m3.scale(matrix, mesh.scale.x, mesh.scale.y)

    // Матрица преобразования
    this.gl.uniformMatrix3fv(matrixLocation, false, matrix)

    // Цвет материала для всех пикселей
    const colorLocation = this.gl.getUniformLocation(program, 'u_color')
    this.gl.uniform4fv(colorLocation, new Float32Array(mesh.material.color.toArray()))

    this.gl.drawArrays(this.gl.TRIANGLES, 0, mesh.geometry.vertices.length / 2)
  }

  /**
   *
   * @returns {Scene}
   */
  resize() {
    if (!this.gl) {
      throw new Error('Browser doesn\'t support webgl.')
    }

    this.canvas.height = this.gl.canvas.clientHeight
    this.canvas.width = this.gl.canvas.clientWidth
    return this
  }

  /**
   *
   * @returns {Scene}
   */
  render() {
    this.resize()
    this.mouse.registrationEvents()
    return this
  }

  update() {
    const program = this.createProgram(this.vertexShaderText, this.fragmentShaderText)

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.clearColor(0.0, 1.0, 1.0, 1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    for (const mesh of this.children) {
      this.draw(program, mesh)
    }
  }

  destroy() {
    this.mouse.removeEvents()
    return this
  }
}