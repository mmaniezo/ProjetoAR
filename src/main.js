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

// Iluminação para modelos GLB
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(light);

// Inicializando LocAR
const locar = new LocAR.LocationBased(scene, camera);
const cam = new LocAR.WebcamRenderer(renderer);
const deviceOrientationControls = new LocAR.DeviceOrientationControls(camera);

// Coordenadas do objeto (exemplo: São Paulo, pode ajustar)
const modelLat = -23.732778;
const modelLng = -46.556667;

// Começa a ler GPS real
locar.startGps();

// Carrega o modelo GLB
const loader = new GLTFLoader();
loader.load(
  'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/Avocado/glTF-Binary/Avocado.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(10, 10, 10); // Ajuste de escala
    model.rotation.y = Math.PI;  // Rotaciona o modelo (opcional)

    // Adiciona nas coordenadas desejadas
    locar.add(model, modelLng, modelLat);
  },
  undefined,
  (error) => {
    console.error('Erro ao carregar modelo:', error);
  }
);

renderer.setAnimationLoop(() => {
  deviceOrientationControls.update();
  cam.update();
  renderer.render(scene, camera);
});
