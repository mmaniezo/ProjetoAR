import * as THREE from 'three';
import * as LocAR from 'locar';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.001, 500); // maior distância visível
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Redimensionar
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Luz básica
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
scene.add(light);

// LocAR setup
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

    // Coordenadas do usuário
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Calcular ponto 3 metros ao norte
      function offsetCoordinates(lat, lng, distanceMeters) {
        const earthRadius = 6378137;
        const dLat = distanceMeters / earthRadius;
        const newLat = lat + (dLat * (180 / Math.PI));
        return { lat: newLat, lng };
      }

      const { lat: targetLat, lng: targetLng } = offsetCoordinates(lat, lng, 3);

      // Adiciona o modelo na posição
      locar.add(model, targetLat, targetLng);

      // Opcional: helper para visualização
      const axes = new THREE.AxesHelper(2);
      model.add(axes);
    });
  }
);

renderer.setAnimationLoop(() => {
  deviceOrientationControls.update();
  cam.update();
  renderer.render(scene, camera);
});
