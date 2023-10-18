import * as THREE from 'three'
import { three } from './core/Three'
import fragmentShader from './shader/fragmentShader.glsl'
import vertexShader from './shader/vertexShader.glsl'
import { Simulator } from './Simulator'

export class Canvas {
  private readonly POINT_AMOUNT = { x: 800, y: 800 }

  private points: THREE.Points<THREE.BufferGeometry, THREE.RawShaderMaterial>
  private simulator: Simulator

  constructor(canvas: HTMLCanvasElement) {
    this.init(canvas)
    this.simulator = this.craeteSimurator()
    this.points = this.createPoints()
    three.animation(this.anime)
  }

  private init(canvas: HTMLCanvasElement) {
    three.setup(canvas)
    three.scene.background = new THREE.Color('#000')
  }

  private craeteSimurator() {
    return new Simulator(this.POINT_AMOUNT.x, this.POINT_AMOUNT.y)
  }

  private createPoints() {
    const count = this.POINT_AMOUNT.x * this.POINT_AMOUNT.y

    const points: number[] = []
    const uvs: number[] = []
    const [dx, dy] = [1 / this.POINT_AMOUNT.x, 1 / this.POINT_AMOUNT.y]

    for (let i = 0; i < count; i++) {
      points.push(0, 0, 0)

      const u = (i % this.POINT_AMOUNT.x) / this.POINT_AMOUNT.x + dx * 0.5
      const v = ~~(i / this.POINT_AMOUNT.y) / this.POINT_AMOUNT.y + dy * 0.5
      uvs.push(u, v)
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    geometry.setAttribute('simUv', new THREE.Float32BufferAttribute(uvs, 2))

    const material = new THREE.RawShaderMaterial({
      defines: {},
      uniforms: {
        tSim: { value: this.simulator.texture },
        uTime: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    })
    const mesh = new THREE.Points(geometry, material)
    three.scene.add(mesh)
    return mesh
  }

  private anime = () => {
    this.simulator.render()

    this.points.material.uniforms.uTime.value += three.time.delta
    three.render()
  }

  dispose() {
    three.dispose()
  }
}
