import * as THREE from 'three';
import * as LocAR from 'locar';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.001, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Redimensiona com a tela
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// LocAR setup
const locar = new LocAR.LocationBased(scene, camera);
const cam = new LocAR.WebcamRenderer(renderer);
const deviceOrientationControls = new LocAR.DeviceOrientationControls(camera);

// Simula GPS do usuário
locar.fakeGps(-0.720000, 51.050000); // sua posição simulada

// Carregar modelo GLB
const loader = new GLTFLoader();
loader.load(
  'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(50, 50, 50);
    model.rotation.y = Math.PI;

    // Posiciona objeto 10 metros à frente (~0.0001 na longitude)
    locar.add(model, -0.720000, 51.050100);
  }
);

renderer.setAnimationLoop(() => {
  deviceOrientationControls.update();
  cam.update();
  renderer.render(scene, camera);
});
