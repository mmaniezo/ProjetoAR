import * as THREE from 'three';
import * as LocAR from 'locar';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.001, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Resize
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Iluminação básica
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(light);

// LocAR setup
const locar = new LocAR.LocationBased(scene, camera);
const cam = new LocAR.WebcamRenderer(renderer);
const deviceOrientationControls = new LocAR.DeviceOrientationControls(camera);

// Fake GPS perto do objeto
locar.fakeGps(-0.72, 51.05); // Simula que você está ali

// Carregar modelo
const loader = new GLTFLoader();
loader.load(
  'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(50, 50, 50);
    model.rotation.y = Math.PI;
    model.position.y = -1; // opcional

    locar.add(model, -0.72, 51.0501); // muito próximo do fakeGps
  }
);

// Loop de renderização
renderer.setAnimationLoop(() => {
  deviceOrientationControls.update();
  cam.update();
  renderer.render(scene, camera);
});
