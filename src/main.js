import * as THREE from 'three';
import * as LocAR from 'locar';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Inicialização básica
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

// Fake GPS (simulando sua posição)
const initialLat = -0.720000;
const initialLng = 51.050000;
locar.fakeGps(initialLat, initialLng);

// Variáveis da posição do objeto
let objLat = initialLat + 0.000018; // ~2 metros ao norte
let objLng = initialLng;

let currentModel = null;

// Carregar modelo GLTF
const loader = new GLTFLoader();
loader.load(
  'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(50, 50, 50);
    model.rotation.y = Math.PI;

    currentModel = model;
    locar.add(model, objLat, objLng);
  }
);

// Atualização de coordenadas ao clicar nos botões
function moveObject(latOffset, lngOffset) {
  if (!currentModel) return;
  
  objLat += latOffset;
  objLng += lngOffset;

  locar.remove(currentModel);
  locar.add(currentModel, objLat, objLng);
}

// Criar controles de movimentação
const controlsDiv = document.createElement("div");
controlsDiv.style.position = "fixed";
controlsDiv.style.bottom = "10px";
controlsDiv.style.left = "50%";
controlsDiv.style.transform = "translateX(-50%)";
controlsDiv.style.display = "flex";
controlsDiv.style.gap = "10px";
controlsDiv.style.zIndex = "999";

["Cima", "Baixo", "Esquerda", "Direita"].forEach((dir) => {
  const btn = document.createElement("button");
  btn.innerText = dir;
  btn.style.padding = "10px";
  btn.style.fontSize = "16px";
  btn.style.cursor = "pointer";

  btn.onclick = () => {
    const delta = 0.00001; // ~1 metro
    if (dir === "Cima") moveObject(delta, 0);
    if (dir === "Baixo") moveObject(-delta, 0);
    if (dir === "Esquerda") moveObject(0, -delta);
    if (dir === "Direita") moveObject(0, delta);
  };

  controlsDiv.appendChild(btn);
});

document.body.appendChild(controlsDiv);

// Loop de renderização
renderer.setAnimationLoop(() => {
  deviceOrientationControls.update();
  cam.update();
  renderer.render(scene, camera);
});
