import * as THREE from 'three';
import { MindARThree } from 'https://cdn.jsdelivr.net/npm/mind-ar@1.1.7/dist/mindar-image-three.prod.js';

const init = async () => {
  const { renderer, scene, camera } = new MindARThree({
    container: document.body,
    uiLoading: false,
    uiError: false,
    uiScanning: false,
  });

  const modelUrl = 'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/Avocado/glTF-Binary/Avocado.glb';

  const loader = new THREE.GLTFLoader();
  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  // Define a coordenada geográfica fixa para renderizar
  const targetLatitude = -23.732778;
  const targetLongitude = -46.556667;

  // Obter a localização do usuário
  navigator.geolocation.getCurrentPosition(async (position) => {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    // Calcular distância (simples, para teste)
    const distance = Math.sqrt(
      Math.pow(userLat - targetLatitude, 2) + Math.pow(userLng - targetLongitude, 2)
    );

    // Se estiver perto o suficiente, mostra o objeto
    if (distance < 0.01) {
      loader.load(modelUrl, (gltf) => {
        const model = gltf.scene;
        model.scale.set(15, 15, 15);
        model.position.set(0, 0, -2);
        scene.add(model);
      });
    } else {
      console.warn('Você está longe da coordenada definida.');
    }
  });

  await renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
};

init();
