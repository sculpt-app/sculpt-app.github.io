import { createShader } from 'shaders/js';
(async () => {
const canvas = document.getElementById('marble-canvas');
const section = document.querySelector('.philosophy');
const preference = matchMedia('(prefers-reduced-motion: reduce)');
let instance, visible = false, userPaused = document.getElementById('motion-toggle').getAttribute('aria-pressed') === 'false';
function sync() {
  if (!instance) return;
  if (visible && !document.hidden && !preference.matches && !userPaused) instance.resume();
  else instance.pause();
  section.dataset.effect = preference.matches ? 'fallback' : 'ready';
}
function motion(event) { userPaused = event.detail.paused; sync(); }
const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); });
observer.observe(section);
try {
  instance = await createShader(canvas, { components: [{
    type: 'FilmGrain', props: { strength: 0.025, bias: 0, animated: false },
    children: [{ type: 'Marble', props: { colorA: '#fbfbf8', colorB: '#d8dad0', colorC: '#9b9f91', scale: 1.65, turbulence: 17, speed: 0.012, seed: 21 } }],
  }] }, { disableTelemetry: true, enablePerformanceTracking: false,
    onError: () => { section.dataset.effect = 'fallback'; } });
  if (!instance.getFailureReason()) { section.dataset.effect = 'ready'; sync(); }
} catch { section.dataset.effect = 'fallback'; }
preference.addEventListener('change', sync);
document.addEventListener('visibilitychange', sync);
document.addEventListener('sculptmotionchange', motion);
window.addEventListener('pagehide', event => {
  if (event.persisted) { instance?.pause(); return; }
  instance?.destroy(); observer.disconnect();
  preference.removeEventListener('change', sync);
  document.removeEventListener('visibilitychange', sync);
  document.removeEventListener('sculptmotionchange', motion);
});
window.addEventListener('pageshow', sync);

})();
