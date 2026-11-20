'use strict';
(() => {
  const id = window.SCULPT_ANALYTICS_ID;
  const productionHosts = ['www.sculpt-fit.app', 'sculpt-fit.app', 'sculpt-app.github.io'];
  if (!/^G-[A-Z0-9]+$/.test(id || '') || !productionHosts.includes(location.hostname)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  const gtag = window.gtag;
  gtag('js', new Date());
  const page = new URL(location.href);
  // Preserve campaign attribution, omit arbitrary query strings and fragments.
  const campaignKeys = new Set(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']);
  for (const name of [...page.searchParams.keys()]) if (!campaignKeys.has(name)) page.searchParams.delete(name);
  page.hash = '';
  let referrer = '';
  try { const ref = new URL(document.referrer); referrer = ref.origin + ref.pathname; } catch { /* Direct visit. */ }
  gtag('config', id, {
    send_page_view: true,
    page_location: page.href,
    page_referrer: referrer,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_prefix: 'sculpt',
    cookie_domain: location.hostname,
    cookie_expires: 180 * 24 * 60 * 60,
  });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.append(script);

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (url.hostname !== 'apps.apple.com' || !url.pathname.includes('id6825584822')) return;
    gtag('event', 'app_store_click', {
      cta_location: link.dataset.analyticsLocation || 'other',
      link_url: 'https://apps.apple.com/app/id6825584822',
      transport_type: 'beacon',
    });
    // Ordinary link navigation is never blocked or delayed by analytics.
  });
})();
