import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { setupARTracking } from 'locar'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const light = new THREE.HemisphereLight(0xffffff, 0x444444, 2)
scene.add(light)

const loader = new GLTFLoader()
loader.load(
  'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
  function (gltf) {
    const model = gltf.scene
    model.scale.set(10, 10, 10)
    model.rotation.y = Math.PI

    setupARTracking({
      object3D: model,
      latitude: -23.7330417,
      longitude: -46.5568916,
      altitude: 0,
      distanceOffsetMeters: 1,
      scene,
      camera
    })
  },
  undefined,
  function (error) {
    console.error('Erro ao carregar modelo:', error)
  }
)

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()
