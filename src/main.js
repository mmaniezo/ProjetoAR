import * as THREE from 'three';
import * as LocAR from 'locar';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.001, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// LocAR setup
const locar = new LocAR.LocationBased(scene, camera);
const cam = new LocAR.WebcamRenderer(renderer);
const deviceOrientationControls = new LocAR.DeviceOrientationControls(camera);

// 🎯 Simula a posição do usuário (ex: -0.72, 51.05)
locar.fakeGps(-0.720000, 51.050000);

// Carrega modelo 3D (abacate de exemplo ou outro objeto maior)
const loader = new GLTFLoader();
loader.load(
  'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/Avocado/glTF-Binary/Avocado.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(100, 100, 100); // bem maior para facilitar visualização

    // Posiciona o modelo a cerca de 10 metros de distância (0.0001 em longitude)
    locar.add(model, -0.720000, 51.050100);
  },
  undefined,
  (error) => {
    console.error('Erro ao carregar modelo:', error);
  }
);

// Render loop
renderer.setAnimationLoop(() => {
  deviceOrientationControls.update(); // atualiza rotação do dispositivo
  cam.update(); // atualiza câmera
  renderer.render(scene, camera);
});
