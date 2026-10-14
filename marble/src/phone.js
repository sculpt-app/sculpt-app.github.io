import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import phoneBinary from '../assets/iphone.glb';
import screenImage from '../assets/home-screen.webp';

(async () => {
const container = document.getElementById('phone-stage');
const sceneElement = document.querySelector('.phone-scene');
const control = document.getElementById('motion-toggle');
const preference = matchMedia('(prefers-reduced-motion: reduce)');
const motionOff = new URLSearchParams(location.search).get('motion') === 'off';
let userPaused = motionOff, inView = true, frame = 0, disposed = false;
let renderer, phone, environment, observer, resizeObserver;
let rotationTime = 0, previousTime = 0, lastDraw = 0;
let scene, camera;

function canAnimate() { return !userPaused && !preference.matches && inView && !document.hidden && !disposed; }
function updateControl() {
  const playing = !userPaused && !preference.matches;
  control.hidden = false;
  control.disabled = preference.matches;
  control.setAttribute('aria-pressed', String(playing));
  control.setAttribute('aria-label', playing ? 'Pause phone rotation' : 'Play phone rotation');
  control.querySelector('.motion-label').textContent = playing ? 'Motion on' : 'Motion off';
  control.querySelector('.motion-symbol').textContent = playing ? 'Ⅱ' : '▷';
  sceneElement.dataset.motion = playing ? 'on' : 'paused';
  document.dispatchEvent(new CustomEvent('sculptmotionchange', { detail: { paused: !playing } }));
}
function render() {
  if (!phone || disposed) return;
  phone.rotation.set(0.065 + Math.sin(rotationTime * 0.23) * 0.025,
    -0.25 + Math.sin(rotationTime * 0.34) * 0.32, -0.095);
  renderer.render(scene, camera);
}
function tick(time) {
  frame = 0;
  if (!canAnimate()) return;
  if (!previousTime) previousTime = time;
  rotationTime += Math.min((time - previousTime) / 1000, 0.1);
  previousTime = time;
  if (time - lastDraw >= 1000 / 30) { render(); lastDraw = time; }
  frame = requestAnimationFrame(tick);
}
function sync() {
  if (!renderer || !phone || disposed) return;
  updateControl();
  if (canAnimate()) { if (!frame) { previousTime = 0; frame = requestAnimationFrame(tick); } }
  else { cancelAnimationFrame(frame); frame = 0; previousTime = 0; render(); }
}
function resize() {
  if (!renderer) return;
  const { width, height } = container.getBoundingClientRect();
  const aspect = width / height;
  const vertical = Math.max(6.5, 3.5 / aspect);
  camera.left = -vertical * aspect / 2; camera.right = vertical * aspect / 2;
  camera.top = vertical / 2; camera.bottom = -vertical / 2;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setSize(width, height, false); render();
}
function showFallback() {
  sceneElement.dataset.render = 'fallback';
  control.hidden = true;
  cancelAnimationFrame(frame); frame = 0;
  renderer?.dispose();
}
try {
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.appendChild(renderer.domElement);
  scene = new THREE.Scene(); camera = new THREE.OrthographicCamera(-3, 3, 3.25, -3.25, 0.1, 50);
  camera.position.set(0, 0, 12);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const studio = new RoomEnvironment();
  environment = pmrem.fromScene(studio, 0.04); scene.environment = environment.texture;
  studio.dispose(); pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff, 0xc5c1b8, 2));
  const key = new THREE.DirectionalLight(0xffffff, 3); key.position.set(-4, 6, 7); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 2); rim.position.set(4, 2, -2); scene.add(rim);
  const [model, texture] = await Promise.all([
    new GLTFLoader().parseAsync(phoneBinary.buffer, ''),
    new THREE.TextureLoader().loadAsync(screenImage),
  ]);
  phone = model.scene;
  texture.colorSpace = THREE.SRGBColorSpace; texture.flipY = false;
  texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
  const display = phone.getObjectByName('SculptDisplay');
  // The captured iPhone screen already contains its Dynamic Island.
  phone.getObjectByName('DynamicIsland').visible = false;
  display.material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
  scene.add(phone); resize();
  sceneElement.dataset.render = 'ready';
  control.addEventListener('click', () => { userPaused = !userPaused; sync(); });
  preference.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  observer = new IntersectionObserver(entries => { inView = entries[0].isIntersecting; sync(); }); observer.observe(sceneElement);
  resizeObserver = new ResizeObserver(resize); resizeObserver.observe(container);
  renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); showFallback(); });
  sync();
} catch { showFallback(); }
window.addEventListener('pagehide', event => {
  cancelAnimationFrame(frame); frame = 0;
  if (event.persisted) return;
  disposed = true;
  observer?.disconnect(); resizeObserver?.disconnect();
  preference.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync);
  scene?.traverse(object => {
    if (object.isMesh) { object.geometry.dispose(); for (const m of [object.material].flat()) { m.map?.dispose(); m.dispose(); } }
  });
  environment?.dispose(); renderer?.dispose();
});
window.addEventListener('pageshow', sync);

})();
