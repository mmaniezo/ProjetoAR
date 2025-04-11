import * as THREE from 'three';
import * as LocAR from 'locar';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Setup da cena, câmera e renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.001, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Responsividade
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Inicia LocAR
const locar = new LocAR.LocationBased(scene, camera);
const cam = new LocAR.WebcamRenderer(renderer);

// Coordenadas reais do seu projeto
const latitude = -23.732778;
const longitude = -46.556667;

// Adiciona luz
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(light);

// Carrega o modelo 3D (modelo do abacate como teste)
const loader = new GLTFLoader();
loader.load(
  'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/Avocado/glTF-Binary/Avocado.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(2, 2, 2);
    model.rotation.y = Math.PI;
    model.position.set(0, 0, -3);
    locar.add(model, modelLng, modelLat);
  }
);

// Ativa localização real
navigator.geolocation.getCurrentPosition(
  (position) => {
    locar.fakeGps(position.coords.longitude, position.coords.latitude); // usa a localização real
  },
  (err) => {
    console.warn('Erro com localização real, usando fake GPS.');
    locar.fakeGps(longitude, latitude); // fallback
  }
);

// Loop de animação
renderer.setAnimationLoop(() => {
  cam.update();
  renderer.render(scene, camera);
});
