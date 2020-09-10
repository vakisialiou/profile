import { mat4 } from 'gl-matrix'
import vertexShaderText from './shader/shader-vertex.vert'
import fragmentShaderText from './shader/shader-fragment.frag'
import * as constants from './constants'
// import {PerspectiveCamera, BoxGeometry, BoxBufferGeometry, Mesh, Material, Face3, Scene, Object3D,
//   // Renderer,
// } from 'three'
//
// import sss from './../lib/#primitives'



// console.log(sss.createCubeWithVertexColorsBufferInfo(null, 50))
// const d = sss.createCubeWithVertexColorsBufferInfo(null, 50)
// const d = sss.createSphereWithVertexColorsBufferInfo(null, 10, 6, 6)
// const d = sss.createTruncatedConeWithVertexColorsBufferInfo(null, 10, 0, 20, 12, 1, true, false)
// const arr = []
// const pr = 'color'
// for (const f in d[pr]) {
//   // console.log(typeof f)
//   if (typeof d[pr][f] === 'number') {
//     arr.push(d[pr][f])
//   }
// }
// console.log(d, JSON.stringify(arr))
// console.log(arr, sss.createCubeVertices(100), JSON.stringify(sss.createCubeVertices(100)))
// console.log(new Mesh(new BoxGeometry(), new Material()))
// console.log({
//   BoxBufferGeometry: new BoxBufferGeometry(50, 50, 50),
//   BoxGeometry: new BoxGeometry(50, 50, 50),
//   m1: new Mesh(new BoxGeometry(), new Material()),
//   m2: new Mesh(new BoxBufferGeometry(), new Material())
// })

// import * as shapeLetter from './shapes/letter'
// import * as shapeCube from './shapes/cube'
// import * as shapeSphere from './shapes/sphere'
// import * as shapeCone from './shapes/cone'
// import * as shapePlane from './shapes/plane'

// function radToDeg(r) {
//   return r * 180 / Math.PI
// }

function degToRad(d) {
  return d * Math.PI / 180
}

const fieldOfViewRadians = degToRad(55)
const cameraRotation = [degToRad(0), degToRad(0), degToRad(0)]
const cameraPosition = [0, 80, 200]
const cameraUp = [0, 1, 0]
const cameraTarget = [0, 0, 0] // Plane position

export default class WebGLRenderer {
  constructor(canvas) {
    /**
     *
     * @type {number}
     */
    this.devicePixelRatio = 1

    /**
     *
     * @type {CanvasRenderingContext2D | ImageBitmapRenderingContext | WebGLRenderingContext | WebGL2RenderingContext | RenderingContext}
     */
    this.gl = canvas.getContext('webgl')

    if (!this.gl) {
      throw new Error('Browser doesn\'t support webgl.')
    }

    this.defaultProgram = this.createProgram(vertexShaderText, fragmentShaderText)

    // this.children = []

    // // Добавить элемент 'F' на сцену
    // this.add({
    //   name: 'F1',
    //   geometry: { vertices: shapeLetter.vertices },
    //   material: { colors: shapeLetter.colors, size: 3, side: constants.SIDE_BACK },
    //   position: [25, 60, -100],
    //   rotation: [degToRad(190), degToRad(0), degToRad(0)],
    //   scale: [0.1, 0.1, 0.1],
    //   hidden: false,
    //   children: []
    // })
    //
    // // Добавить элемент 'F' на сцену
    // this.add({
    //   name: 'F2',
    //   geometry: { vertices: shapeLetter.vertices },
    //   material: { colors: shapeLetter.colors, size: 3, side: constants.SIDE_BACK },
    //   position: [-25, 60, -100],
    //   rotation: [degToRad(190), degToRad(0), degToRad(0)],
    //   scale: [0.1, 0.1, 0.1],
    //   hidden: false,
    //   children: []
    // })
    //
    // // // Добавить элемент 'Cube' на сцену
    // this.add({
    //   name: 'CUBE1',
    //   geometry: { vertices: shapeCube.vertices },
    //   material: { colors: shapeCube.colors, size: 3, side: constants.SIDE_FRONT },
    //   position: [35, 15, 100],
    //   rotation: [degToRad(180), degToRad(120), degToRad(50)],
    //   scale: [0.3, 0.3, 0.3],
    //   hidden: false,
    //   children: []
    // })
    //
    // // Добавить элемент 'Cube' на сцену
    // this.add({
    //   name: 'CUBE2',
    //   geometry: { vertices: shapeCube.vertices },
    //   material: { colors: shapeCube.colors, size: 3, side: constants.SIDE_BACK },
    //   position: [55, 15, 100],
    //   rotation: [degToRad(180), degToRad(120), degToRad(50)],
    //   scale: [0.3, 0.3, 0.3],
    //   hidden: false,
    //   children: [
    //     {
    //       name: 'CUBE2-CUBE1',
    //       geometry: { vertices: shapeCube.vertices },
    //       material: { colors: shapeCube.colors, size: 3, side: constants.SIDE_BACK },
    //       position: [55, 15, 100],
    //       rotation: [degToRad(180), degToRad(120), degToRad(50)],
    //       scale: [0.3, 0.3, 0.3],
    //       hidden: false,
    //       children: []
    //     }
    //   ]
    // })
    //
    // // Добавить элемент 'Sphere' на сцену
    // this.add({
    //   name: 'SPHERE1',
    //   geometry: { vertices: shapeSphere.vertices },
    //   material: { colors: shapeSphere.colors, size: 4, side: constants.SIDE_BACK },
    //   position: [-35, 15, -100],
    //   rotation: [degToRad(180), degToRad(120), degToRad(50)],
    //   scale: [1, 1, 1],
    //   hidden: false,
    //   children: []
    // })
    //
    // // Добавить элемент 'Cone' на сцену
    // this.add({
    //   name: 'CONE1',
    //   geometry: { vertices: shapeCone.vertices },
    //   material: { colors: shapeCone.colors, size: 4, side: constants.SIDE_BACK },
    //   position: [0, 10, 0],
    //   rotation: [degToRad(180), degToRad(120), degToRad(50)],
    //   scale: [1, 1, 1],
    //   hidden: false,
    //   children: []
    // })
    //
    // // Добавить элемент 'Plane' на сцену
    // this.add({
    //   name: 'PLANE1',
    //   geometry: { vertices: shapePlane.vertices },
    //   material: { colors: shapePlane.colors, size: 3, side: constants.SIDE_DOUBLE },
    //   position: [0, 0, 0],
    //   rotation: [degToRad(90), degToRad(0), degToRad(0)],
    //   scale: [3, 3, 3],
    //   hidden: false,
    //   children: []
    // })

    this._cache = {}
  }

  /**
   *
   * @param {Object|Mesh} mesh
   */
  getAttributes(mesh) {
    const { uuid, geometry, material } = mesh
    if (this._cache.hasOwnProperty(uuid)) {
      return this._cache[uuid]
    }

    const program = this.defaultProgram
    this._cache[uuid] = {
      program: this.defaultProgram,
      matrixLocation: this.gl.getUniformLocation(program, 'u_matrix'),
      uUseVertexColors: this.gl.getUniformLocation(program, 'u_use_vertex_colors'),
      uColorLocation: this.gl.getUniformLocation(program, 'u_color'),
      positionLocation: null,
      positionBuffer: null,
      vColorLocation: null,
      colorBuffer: null
    }

    const position = geometry.getAttribute('position')
    if (position) {
      const positionLocation = this.gl.getAttribLocation(program, 'a_position')
      const positionBuffer = this.gl.createBuffer()
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)
      this.gl.bufferData(this.gl.ARRAY_BUFFER, position.vertices, this.gl.STATIC_DRAW)
      this._cache[uuid]['positionLocation'] = positionLocation
      this._cache[uuid]['positionBuffer'] = positionBuffer
    }

    const color = geometry.getAttribute('color')
    if (color) {
      const vColorLocation = this.gl.getAttribLocation(program, 'a_color')
      const colorBuffer = this.gl.createBuffer()
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer)
      this.gl.bufferData(this.gl.ARRAY_BUFFER, color.vertices, this.gl.STATIC_DRAW)
      this._cache[uuid]['vColorLocation'] = vColorLocation
      this._cache[uuid]['colorBuffer'] = colorBuffer
    }

    return this._cache[uuid]
  }

  /**
   *
   * @param {GLenum} type
   * @param {string} shaderString
   * @returns {WebGLShader}
   */
  createShader(type, shaderString) {
    const shader = this.gl.createShader(type)
    this.gl.shaderSource(shader, shaderString)
    this.gl.compileShader(shader)
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error(`Error compiling shader! Info: ${this.gl.getShaderInfoLog(shaderString)}`)
    }

    return shader
  }

  /**
   *
   * @param {string} vertexShaderSource
   * @param {string} fragmentShaderSource
   * @returns {WebGLProgram}
   */
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

  resize(width, height) {
    // Берём заданный браузером размер canvas в CSS-пикселях и вычисляем нужный
    // нам размер, чтобы буфер отрисовки совпадал с ним в действительных пикселях
    const displayWidth  = Math.floor(width  * this.devicePixelRatio)
    const displayHeight = Math.floor(height * this.devicePixelRatio)

    this.gl.canvas.style.width = width + 'px'
    this.gl.canvas.style.height = height + 'px'

    //  проверяем, отличается ли размер canvas
    if (this.gl.canvas.width !== displayWidth || this.gl.canvas.height !== displayHeight) {
      // подгоняем размер буфера отрисовки под размер HTML-элемента
      this.gl.canvas.width  = displayWidth
      this.gl.canvas.height = displayHeight
    }

    // Tell WebGL how to convert from clip space to pixels
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    return this
  }

  createMeshBuffer(mesh) {
    if (mesh.hasOwnProperty('__buffer')) {
      return mesh['__buffer']
    }

    const meshBuffer = {
      /** @type {Function|?} */
      bindBufferVertexPosition: null,
      /** @type {Function|?} */
      bindBufferVertexColor: null,
      /** @type {Function|?} */
      setUniformMatrix4: null,
      /** @type {Function|?} */
      drawArrays: null
    }

    const { geometry } = mesh

    // Attribute vertex position
    const attributePosition = geometry.getAttribute('position')
    const attributePositionLocation = this.gl.getAttribLocation(this.defaultProgram, 'a_position')
    const attributePositionBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attributePositionBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, attributePosition.vertices, this.gl.STATIC_DRAW)

    meshBuffer.bindBufferVertexPosition = () => {
      // Bind buffer vertex position
      this.gl.enableVertexAttribArray(attributePositionLocation)
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attributePositionBuffer)
      this.gl.vertexAttribPointer(attributePositionLocation, 3, this.gl.FLOAT, false, 0, 0)
    }

    // Attribute vertex color
    const attributeColor = geometry.getAttribute('color')
    if (attributeColor && attributeColor.vertices.length > 0) {
      const attributeColorLocation = this.gl.getAttribLocation(this.defaultProgram, 'a_color')
      const attributeColorBuffer = this.gl.createBuffer()
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attributeColorBuffer)
      this.gl.bufferData(this.gl.ARRAY_BUFFER, attributeColor.vertices, this.gl.STATIC_DRAW)

      meshBuffer.bindBufferVertexColor = () => {
        // Bind buffer vertex color
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attributeColorBuffer)
        this.gl.vertexAttribPointer(attributeColorLocation, 3, this.gl.UNSIGNED_BYTE, true, 0, 0)
        this.gl.enableVertexAttribArray(attributeColorLocation)
      }
    }

    const uniformMatrixLocation = this.gl.getUniformLocation(this.defaultProgram, 'u_matrix')
    meshBuffer.setUniformMatrix4 = (matrix) => {
      this.gl.uniformMatrix4fv(uniformMatrixLocation, false, matrix)
    }

    const uniformUseVertexColors = this.gl.getUniformLocation(this.defaultProgram, 'u_use_vertex_colors')
    const uniformColorLocation = this.gl.getUniformLocation(this.defaultProgram, 'u_color')

    meshBuffer.drawArrays = (material, group) => {
      this.gl.uniform1i(uniformUseVertexColors, Number(material.vertexColors))
      this.gl.uniform3fv(uniformColorLocation, material.color.toNormalizedArray())

      if (material.wireframe === true) {
        this.gl.drawArrays(this.gl.LINE_STRIP, group.start, group.count)
      } else {
        this.gl.drawArrays(this.gl.TRIANGLES, group.start, group.count)
      }
    }

    mesh['__buffer'] = meshBuffer
    return mesh['__buffer']
  }

  update(scene, camera) {
    // BG color
    const bgColor = scene.background.toNormalizedArray()
    this.gl.clearColor(bgColor[0], bgColor[1], bgColor[2], 1)

    // this.gl.clearDepth(1.0)
    // Clear the canvas AND the depth buffer.
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    // Turn on culling. By default backfacing triangles will be culled.
    this.gl.enable(this.gl.CULL_FACE)

    // Enable the depth buffer
    this.gl.enable(this.gl.DEPTH_TEST)


    // this.gl.enable(this.gl.CULL_FACE)
    // this.gl.cullFace(this.gl.FRONT_AND_BACK)


    // =========================================== Camera start ==================================================

    // TODO: need create auto updating camera matrix
    // camera.updateProjectionMatrix()
    // camera.updateCameraMatrix()
    // camera.lookAt([0, 0, 0])
    // camera.updateViewProjectionMatrix()
    // let viewProjectionMatrix = camera.update()


    // const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight
    let viewProjectionMatrix = camera.update()

    // let projectionMatrix = mat4.create()
    // projectionMatrix = mat4.perspective(projectionMatrix, fieldOfViewRadians, aspect, 1, 2000)
    //
    // let cameraMatrix = mat4.create()
    // cameraMatrix = mat4.rotate(cameraMatrix, cameraMatrix, cameraRotation[0], [1, 0, 0])
    // cameraMatrix = mat4.rotate(cameraMatrix, cameraMatrix, cameraRotation[1], [0, 1, 0])
    // cameraMatrix = mat4.rotate(cameraMatrix, cameraMatrix, cameraRotation[2], [0, 0, 1])
    // cameraMatrix = mat4.translate(cameraMatrix, cameraMatrix, cameraPosition)
    //
    // const cameraPosition2 = [
    //   cameraMatrix[12],
    //   cameraMatrix[13],
    //   cameraMatrix[14],
    // ];
    //
    // const viewMatrix = mat4.lookAt(cameraMatrix, cameraPosition2, cameraTarget, cameraUp)
    //
    // let viewProjectionMatrix = mat4.create()
    // viewProjectionMatrix = mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix)

    // =========================================== Camera end ==================================================

    scene.traverse((node) => {
      node.localMatrix = mat4.create()
      mat4.translate(node.localMatrix, node.localMatrix, node.position.toArray())
      mat4.rotate(node.localMatrix, node.localMatrix, node.rotation.x, [1, 0, 0])
      mat4.rotate(node.localMatrix, node.localMatrix, node.rotation.y, [0, 1, 0])
      mat4.rotate(node.localMatrix, node.localMatrix, node.rotation.z, [0, 0, 1])
      mat4.scale(node.localMatrix, node.localMatrix, node.scale.toArray())
      node.updateWorldMatrix(false)
    })

    scene.traverse((mesh) => {
      if (!mesh.hasOwnProperty('geometry') || !mesh.hasOwnProperty('material')) {
        return
      }

      let matrix = mat4.create()
      matrix = mat4.multiply(matrix, viewProjectionMatrix, mesh.worldMatrix)

      this.gl.useProgram(this.defaultProgram)

      const buffer = this.createMeshBuffer(mesh)
      if (buffer.bindBufferVertexPosition) {
        buffer.bindBufferVertexPosition()
      }

      if (buffer.bindBufferVertexColor) {
        buffer.bindBufferVertexColor()
      }

      if (buffer.setUniformMatrix4) {
        buffer.setUniformMatrix4(matrix)
      }

      if (Array.isArray(mesh.material) === false) {
        const attributePosition = mesh.geometry.getAttribute('position')
        buffer.drawArrays(mesh.material, { start: 0, count: attributePosition.vertices.length / 3 })
      } else {
        for (let group of mesh.geometry.groups) {
          const material = mesh.material[group.materialIndex]
          buffer.drawArrays(material, group)
        }
      }

     /* // ============================================== Mesh start ==============================================
      const attributes = this.getAttributes(mesh)
      const { program, positionLocation, positionBuffer, colorBuffer, matrixLocation, vColorLocation, uColorLocation, uUseVertexColors } = attributes

      if (!positionLocation && !positionBuffer) {
        return
      }

      // TODO before cycle
      let matrix = mat4.create()
      matrix = mat4.multiply(matrix, viewProjectionMatrix, mesh.worldMatrix)

      // Tell it to use mesh program (pair of shaders)
      this.gl.useProgram(program)

      // TODO: uniform function inside cycle - inside material cycle
      // Set the matrix.
      this.gl.uniformMatrix4fv(matrixLocation, false,  matrix)

      // TODO start material cycle
      // ----------------------- POSITION START --------------------------

      // TODO: position function - inside material cycle
      // Turn on the position attribute
      this.gl.enableVertexAttribArray(positionLocation)

      // Bind the position buffer.
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)

      // 0. Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
      // 1. 3 components per iteration
      // 2. the data is 32bit floats
      // 3. don't normalize the data
      // 4. 0 = move forward size * sizeof(type) each iteration to get the next position
      // 5. start at the beginning of the buffer
      this.gl.vertexAttribPointer(positionLocation, 3, this.gl.FLOAT, false, 0, 0)
      // ----------------------- POSITION END --------------------------

      // ----------------------- COLOR START --------------------------

      // TODO: color function - inside material cycle
      if (vColorLocation && colorBuffer) {
        // Bind the color buffer.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer)
        // 0. Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
        // 1. 3 components per iteration
        // 2. the data is 8bit unsigned values
        // 3. normalize the data (convert from 0-255 to 0-1)
        // 4. 0 = move forward size * sizeof(type) each iteration to get the next position
        // 5. start at the beginning of the buffer
        this.gl.vertexAttribPointer(vColorLocation, 3, this.gl.UNSIGNED_BYTE, true, 0, 0)
        // Turn on the color attribute
        this.gl.enableVertexAttribArray(vColorLocation)
      }
      this.gl.uniform1i(uUseVertexColors, Number(mesh.material.vertexColors))
      this.gl.uniform3fv(uColorLocation, mesh.material.color.toNormalizedArray())
      // ----------------------- COLOR END --------------------------

      switch (mesh.material.side) {
        case constants.SIDE_DOUBLE:
          this.gl.disable(this.gl.CULL_FACE)
          break
        case constants.SIDE_BACK:
          this.gl.cullFace(this.gl.FRONT)
          break
      }

      if (mesh.visible === false) {
        this.gl.cullFace(this.gl.FRONT_AND_BACK)
      }

      const position = mesh.geometry.getAttribute('position')
      // Draw the geometry.
      // const primitiveType = this.gl.TRIANGLES
      // const primitiveType = this.gl.TRIANGLE_STRIP
      // const primitiveType = this.gl.POINTS
      // const primitiveType = this.gl.LINES
      // const primitiveType = this.gl.LINE_LOOP
      // const primitiveType = this.gl.LINE_STRIP

      // TODO position.vertices.length / 3 - calculate by group (start, count)
      if (mesh.material.wireframe === true) {
        this.gl.drawArrays(this.gl.LINES, 0, position.vertices.length / 3)
      } else {
        this.gl.drawArrays(this.gl.TRIANGLES, 0, position.vertices.length / 3)
      }
      this.gl.enable(this.gl.CULL_FACE)
      this.gl.cullFace(this.gl.BACK)

      // TODO end material cycle

      // ============================================== Mesh end ==============================================*/
    })
  }
}