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

const light = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
scene.add(light);

const locar = new LocAR.LocationBased(scene, camera);
const cam = new LocAR.WebcamRenderer(renderer);
const deviceOrientationControls = new LocAR.DeviceOrientationControls(camera);

// Iniciar GPS
locar.startGps();

// Carregar modelo
const loader = new GLTFLoader();
loader.load(
  'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(50, 50, 50);
    model.rotation.y = Math.PI;

    // Pega coordenadas do usuário
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Função para calcular novo ponto a 10 metros de distância na direção norte
      function offsetCoordinates(lat, lng, distanceMeters) {
        const earthRadius = 6378137;
        const dLat = distanceMeters / earthRadius;
        const newLat = lat + (dLat * (180 / Math.PI));
        return { lat: newLat, lng }; // Apenas deslocando para o norte
      }

      const { lat: targetLat, lng: targetLng } = offsetCoordinates(lat, lng, 10);

      // Adiciona modelo nas coordenadas calculadas
      locar.add(model, targetLat, targetLng);
    });
  }
);

renderer.setAnimationLoop(() => {
  deviceOrientationControls.update();
  cam.update();
  renderer.render(scene, camera);
});
