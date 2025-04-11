window.onload = () => {
  const model = document.querySelector('#objeto3d');

  model.addEventListener('model-loaded', () => {
    console.log('Modelo 3D carregado com sucesso!');
  });

  window.addEventListener('gps-camera-update-position', (e) => {
    const { latitude, longitude } = e.detail.position;
    console.log(`Localização atual do usuário: ${latitude}, ${longitude}`);
  });
};
