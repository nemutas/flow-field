import * as THREE from 'three'
import vertexShader from './shader/simVs.glsl'
import fragmentShader from './shader/simFs.glsl'
import { three } from './core/Three'

export class Simulator {
  private rt_1: THREE.WebGLRenderTarget
  private rt_2: THREE.WebGLRenderTarget
  private current: THREE.WebGLRenderTarget
  private next: THREE.WebGLRenderTarget

  private scene = new THREE.Scene()
  private camera = new THREE.OrthographicCamera()
  private plane: THREE.Mesh<THREE.PlaneGeometry, THREE.RawShaderMaterial>

  constructor(width: number, height: number) {
    const data = this.createData(width, height)
    this.rt_1 = this.createRenderTarget(width, height, data)
    this.rt_2 = this.createRenderTarget(width, height, data)
    this.current = this.rt_1
    this.next = this.rt_2

    this.plane = this.createMesh()
  }

  private createData(width: number, height: number) {
    const data: number[] = []
    const rand = (scale = 1) => (Math.random() * 2 - 1) * scale

    for (let i = 0; i < width * height; i++) {
      data.push(rand(0.5), rand(0.5), 0, 0)
    }
    return Float32Array.from(data)
  }

  private createRenderTarget(width: number, height: number, data: Float32Array) {
    const rt = new THREE.WebGLRenderTarget(width, height, {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
    })

    const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat, THREE.FloatType)
    texture.needsUpdate = true
    rt.texture = texture

    return rt
  }

  private createMesh() {
    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        tPrev: { value: null },
        uTime: { value: 0 },
      },
      vertexShader,
      fragmentShader,
    })
    const mesh = new THREE.Mesh(geometry, material)
    this.scene.add(mesh)
    return mesh
  }

  get texture() {
    return this.current.texture
  }

  private swap() {
    this.current = this.current === this.rt_1 ? this.rt_2 : this.rt_1
    this.next = this.current === this.rt_1 ? this.rt_2 : this.rt_1
  }

  render() {
    this.swap()

    this.plane.material.uniforms.tPrev.value = this.texture
    this.plane.material.uniforms.uTime.value += three.time.delta

    three.renderer.setRenderTarget(this.next)
    three.renderer.render(this.scene, this.camera)
    three.renderer.setRenderTarget(null)
  }
}
