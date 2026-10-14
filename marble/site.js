'use strict';
const tabs = [...document.querySelectorAll('[role="tab"]')];
function select(tab, focus = false) {
  for (const item of tabs) {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
  }
  if (focus) tab.focus();
}
for (const tab of tabs) {
  tab.addEventListener('click', () => select(tab));
  tab.addEventListener('keydown', event => {
    const index = tabs.indexOf(tab);
    let next;
    if (['ArrowDown', 'ArrowRight'].includes(event.key)) next = (index + 1) % tabs.length;
    if (['ArrowUp', 'ArrowLeft'].includes(event.key)) next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); select(tabs[next], true); }
  });
}
for (const year of document.querySelectorAll('[data-year]')) year.textContent = new Date().getFullYear();
// Marble is restricted to the philosophy section and never blocks content.
const motionDisabled = new URLSearchParams(location.search).get('motion') === 'off';
if (!motionDisabled && !matchMedia('(prefers-reduced-motion: reduce)').matches && navigator.gpu) {
  const load = () => {
    const effect = document.createElement('script');
    effect.src = 'assets/effects.js';
    document.head.appendChild(effect);
  };
  const approaching = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    approaching.disconnect();
    if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 1800 });
    else setTimeout(load, 100);
  }, { rootMargin: '300px' });
  approaching.observe(document.querySelector('.philosophy'));
}
