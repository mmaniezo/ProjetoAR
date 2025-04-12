import * as THREE from 'three';
import * as LocAR from 'locar';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.001, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Atualiza tela ao redimensionar
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// 💡 Luz uniforme suave
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // luz branca e forte
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 10, 10); // direção da luz
scene.add(directionalLight);

// 📷 AR + câmera
const cam = new LocAR.WebcamRenderer(renderer);
const deviceOrientationControls = new LocAR.DeviceOrientationControls(camera);

// 📦 Carrega modelo e posiciona fixo à frente da câmera
const loader = new GLTFLoader();
loader.load(
  'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(2, 2, 2); // ajuste de tamanho
    model.position.set(0, 0, -10); // 10 metros na frente da câmera
    model.rotation.y = Math.PI; // rotação opcional
    camera.add(model); // fixa o modelo à frente da câmera
    scene.add(camera); // adiciona a câmera à cena
  }
);

// 🌀 Loop de renderização
renderer.setAnimationLoop(() => {
  deviceOrientationControls.update();
  cam.update();
  renderer.render(scene, camera);
});
