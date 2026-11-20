import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source = readFileSync(new URL('../analytics.js', import.meta.url), 'utf8');
function browser({id = 'G-TEST000001', host = 'www.sculpt-fit.app'} = {}) {
  const scripts = [], handlers = {};
  const document = {
    referrer: 'https://example.com/ref?private=hidden',
    head: {append: x => scripts.push(x)},
    createElement(tag) { assert.equal(tag, 'script', 'Analytics must not create consent UI'); return {}; },
    addEventListener(name, fn) {handlers[name] = fn;},
  };
  const window = {SCULPT_ANALYTICS_ID:id};
  const location = {hostname:host, href:`https://${host}/?utm_source=instagram&email=private#secret`};
  // No localStorage, cookie-choice APIs or interaction is needed to initialize.
  vm.runInNewContext(source, {window, document, location, URL, Date, Set});
  return {window,scripts,click(url='https://apps.apple.com/app/id6825584822', placement='mobile_hero_logo') {
    let prevented=false;
    handlers.click?.({target:{closest:()=>({href:url,dataset:{analyticsLocation:placement}})},preventDefault(){prevented=true;}});
    return prevented;
  }};
}
const commands = b => (b.window.dataLayer || []).map(x=>Array.from(x));
test('configured production visits initialize immediately, without user interaction or storage', () => {
  for (const host of ['www.sculpt-fit.app','sculpt-fit.app','sculpt-app.github.io']) {
    const b=browser({host}); assert.equal(b.scripts.length,1);
    assert.match(b.scripts[0].src,/googletagmanager\.com\/gtag\/js\?id=G-TEST000001$/);
    const configs=commands(b).filter(x=>x[0]==='config'); assert.equal(configs.length,1);
    assert.equal(configs[0][2].send_page_view,true);
    assert.equal(commands(b).filter(x=>x[0]==='consent').length,0);
  }
});
test('unconfigured and preview hosts never send events', () => {
  for (const options of [{id:''},{id:'not-an-id'},{host:'localhost'},{host:'127.0.0.1'},{host:'evil.example'}]) {
    const b=browser(options); assert.equal(b.scripts.length,0); b.click(); assert.equal(commands(b).length,0);
  }
});
test('advertising remains disabled and URLs exclude arbitrary query data', () => {
  const b=browser(), config=commands(b).find(x=>x[0]==='config')[2];
  assert.equal(config.allow_google_signals,false); assert.equal(config.allow_ad_personalization_signals,false);
  assert.equal(config.page_location,'https://www.sculpt-fit.app/?utm_source=instagram');
  assert.equal(config.page_referrer,'https://example.com/ref');
});
test('only Sculpt download clicks are measured and navigation is never blocked', () => {
  const b=browser(); assert.equal(b.click(),false);
  b.click('https://apps.apple.com/app/id123'); b.click('https://example.com/');
  const events=commands(b).filter(x=>x[0]==='event'); assert.equal(events.length,1);
  assert.equal(events[0][1],'app_store_click'); assert.equal(events[0][2].cta_location,'mobile_hero_logo');
});
