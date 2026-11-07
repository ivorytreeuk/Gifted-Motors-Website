/* site.js = builds the page from site-data.js and sends booking requests. */
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ICONS = {
  key: '<path d="M7 14a4 4 0 1 1 3.9-5H21v3h-2v2h-3v-2h-5.1A4 4 0 0 1 7 14Zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>',
  ship: '<path d="M3 17l2 3h14l2-3-9-3-9 3Zm4-5V7h4V4h2v3h4v5l-5-1.5L7 12Z"/>',
  box: '<path d="M12 2 3 6.5v11L12 22l9-4.5v-11L12 2Zm0 2.2 6.3 3.1L12 10.4 5.7 7.3 12 4.2ZM5 9l6 3v7.2l-6-3V9Zm14 0v7.2l-6 3V12l6-3Z"/>',
  flag: '<path d="M5 2h2v20H5V2Zm3 1h11l-2.5 4.5L19 12H8V3Z"/>',
  card: '<path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1 4v8h16V9H4Zm2 5h5v2H6v-2Z"/>',
  plane: '<path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z"/>',
  wrench: '<path d="M22 6.3a5 5 0 0 1-6.6 4.7L7 19.4a2 2 0 0 1-2.8-2.8L12.6 8.2A5 5 0 0 1 17.7 1.7l-3 3 .6 2.7 2.7.6 3-3c.2.5.3 1 .3 1.3Z"/>',
  tag: '<path d="M2 12 12 2h9a1 1 0 0 1 1 1v9L12 22 2 12Zm15-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>'
};
const svg = (n) => `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">${ICONS[n] || ICONS.key}</svg>`;
const uid = () => (window.crypto && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
const isoDate = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

function socialLinks() {
  const names = { facebook: 'Facebook', instagram: 'Instagram', tiktok: 'TikTok', whatsappChannel: 'WhatsApp channel', youtube: 'YouTube', x: 'X' };
  return Object.keys(names).filter((k) => /^https?:\/\//.test(SITE.social[k] || '')).map((k) => [names[k], SITE.social[k]]);
}
const stars = (n) => '<span class="stars" role="img" aria-label="' + n + ' out of 5 stars">' + '★'.repeat(n) + '☆'.repeat(5 - n) + '</span>';

function chrome() {
  const page = (document.querySelector('[data-page]') || {}).dataset ? document.querySelector('[data-page]').dataset.page : '';
  const L = [['home', 'index.html', 'Home'], ['cars', 'cars.html', 'Our cars'], ['services', 'services.html', 'Services'], ['gallery', 'gallery.html', 'Gallery'], ['reviews', 'reviews.html', 'Reviews'], ['pay', 'pay.html', 'Make a payment'], ['contact', 'contact.html', 'Contact']];
  $('site-header').outerHTML = `<header class="nav"><div class="wrap nav-in">
    <a href="index.html" class="brand" aria-label="Gifted Motors home"><img src="logo.png" alt="Gifted Motors"></a>
    <nav class="links" id="links" aria-label="Main">${L.map((l) => `<a href="${l[1]}" ${page === l[0] ? 'aria-current="page"' : ''}>${l[2]}</a>`).join('')}</nav>
    <a class="btn small" href="book.html">Book now</a>
    <button class="burger" id="burger" aria-label="Menu" aria-expanded="false" aria-controls="links"><span></span><span></span><span></span></button>
  </div></header>`;
  $('site-footer').outerHTML = `<footer class="foot"><div class="wrap foot-in"><div><img src="logo.png" alt="Gifted Motors"><p>&copy; ${new Date().getFullYear()} Gifted Motors Limited<br>${esc(SITE.address)}</p></div>
    <div><p><b>Call</b><br><a href="tel:+${SITE.phoneLink}">${esc(SITE.phone)}</a></p>${SITE.email ? `<p><a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></p>` : ''}</div>
    <div><p><b>Open</b><br>${SITE.hours.map((h) => esc(h[0]) + ': ' + esc(h[1])).join('<br>')}</p><p class="foot-social">${socialLinks().map((l) => `<a href="${esc(l[1])}" target="_blank" rel="noopener">${l[0]}</a>`).join('')}</p></div></div></footer>`;
  const nav = $('links'), b = $('burger');
  b.addEventListener('click', () => { const o = nav.classList.toggle('open'); b.setAttribute('aria-expanded', o); });
}

function put(id, html) { const el = $(id); if (el) el.innerHTML = html; }

function build() {
  const lim = $('fleet') && $('fleet').dataset.limit ? +$('fleet').dataset.limit : FLEET.length;
  put('fleet', FLEET.slice(0, lim).map((c) => `<article class="card car">
      <div class="ph ${c.photo ? '' : 'none'}">${c.photo ? `<img src="${esc(c.photo)}" alt="${esc(c.name)}" loading="lazy">` : '<span>Photo coming soon</span>'}</div>
      <div class="car-b"><span class="chip">${esc(c.kind)}</span><h3>${esc(c.name)}</h3>
        <p>${esc(c.note)}</p>
        <div class="meta"><span>${esc(c.seats)}</span><b>${c.rate ? 'K' + esc(c.rate) + ' per day' : 'Ask for the rate'}</b></div>
        <a class="btn full" href="book.html?car=${encodeURIComponent(c.name)}">Book this car</a></div></article>`).join(''));
  put('sold', SOLD.map((s) => `<figure class="soldcard"><div class="soldph"><img src="${esc(s.photo)}" alt="${esc(s.name)} sold by Gifted Motors" loading="lazy">${s.baked ? '' : '<span class="soldtag">Sold</span>'}</div></figure>`).join(''));
  put('accolades', ACCOLADES.map((a) => `<article class="award">
      <header class="award-head"><span class="award-by">Awarded by</span><span class="award-from">${esc(a.from)}</span><h3>${esc(a.title)}</h3><p class="when">${esc(a.date)}</p></header>
      <div class="award-photos"><figure class="ap cert"><img src="${esc(a.photos[0].src)}" alt="${esc(a.photos[0].alt)}" loading="lazy"></figure>${a.photos.slice(1).map((p) => `<figure class="ap"><img src="${esc(p.src)}" alt="${esc(p.alt)}" loading="lazy"></figure>`).join('')}</div>
      <div class="award-text">${a.text.split('\n\n').map((t, i, all) => `<p${i === all.length - 1 ? ' class="sign"' : ''}>${esc(t)}</p>`).join('')}<p class="fine">${esc(a.source)}</p></div></article>`).join(''));
  put('deals-list', DEALS.map((d) => `<div class="card tile"><h3>${esc(d.title)}</h3><p>${esc(d.text)}</p></div>`).join(''));
  if (!DEALS.length && $('deals')) $('deals').hidden = true;
  put('svc', SERVICES.map((s) => `<div class="card tile"><div class="ic">${svg(s.icon)}</div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join(''));
  put('svc-short', SERVICES.map((s) => `<li><span class="ic sm">${svg(s.icon)}</span>${esc(s.title)}</li>`).join(''));
  put('soonlist', SOON.map((s) => `<div class="card tile soon"><span class="badge">Coming soon</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join(''));
  put('vehicle', '<option value="">Choose a vehicle</option>' + FLEET.map((c) => `<option>${esc(c.name)}</option>`).join(''));
  put('paynum', esc(SITE.phone));
  const tel = 'tel:+' + SITE.phoneLink, wa = 'https://wa.me/' + SITE.phoneLink;
  put('callbtns', `<a class="btn" href="${tel}">Call ${esc(SITE.phone)}</a>${SITE.whatsapp ? `<a class="btn dark" href="${wa}" target="_blank" rel="noopener">WhatsApp us</a>` : ''}`);
  put('facts', `<li><span>Phone</span><a href="${tel}">${esc(SITE.phone)}</a></li><li><span>Location</span>${esc(SITE.address)}</li>${SITE.hours.map((h, i) => `<li><span>${i ? '' : 'Opening hours'}</span>${esc(h[0])}: <b>${esc(h[1])}</b></li>`).join('')}<li><span>24 hours</span>${esc(SITE.assistance)}</li>${SITE.email ? `<li><span>Email</span><a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></li>` : ''}`);
  const names = { facebook: 'Facebook', instagram: 'Instagram', tiktok: 'TikTok', whatsappChannel: 'WhatsApp channel', youtube: 'YouTube', x: 'X' };
  const links = socialLinks().map((l) => l[0] === l[0] ? Object.keys(names).find((k) => names[k] === l[0]) : '');
  put('social', links.length ? links.map((k) => `<a class="pill" href="${esc(SITE.social[k])}" target="_blank" rel="noopener">${names[k]}</a>`).join('') : '<p class="sub light">Our social media pages are coming soon.</p>');
  put('paybox', SITE.airtelNumber
    ? `<h3>Paying by Airtel Money</h3><p>Once we confirm your booking, send the amount to <b>${esc(SITE.airtelNumber)}</b>${SITE.airtelName ? ' (' + esc(SITE.airtelName) + ')' : ''}. Use your booking reference as the payment reference, then tell us when it is sent.</p>`
    : `<h3>Paying</h3><p>When we confirm your booking we will send you the <b>Airtel Money</b> payment details. You can also choose to pay before you collect the vehicle. We never ask you to pay before we have confirmed with you.</p>`);
}

function wire() {
  if (!$('bf')) return;
  const t = isoDate(new Date());
  $('from').min = t; $('to').min = t;
  let car = ''; try { car = new URLSearchParams(location.search).get('car') || ''; } catch (e) { /* ignore */ }
  if (car && FLEET.some((c) => c.name === car)) $('vehicle').value = car;
  $('from').addEventListener('change', () => { $('to').min = $('from').value || t; if ($('to').value && $('to').value < $('from').value) $('to').value = $('from').value; });
  let clientId = uid(), sending = false;
  $('bf').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    const v = (id) => $(id).value.trim();
    const bk = { vehicle: v('vehicle'), from: v('from'), to: v('to'), place: v('place'), name: v('name'), phone: v('phone'), email: v('email'), driver: v('driver'), pay: v('pay'), notes: v('notes'), website: v('website') };
    const err = (m) => { $('bmsg').innerHTML = `<div class="errbox" role="alert">${esc(m)}</div>`; };
    if (!bk.vehicle) return err('Please choose a vehicle.');
    if (!bk.from || !bk.to) return err('Please choose your pick-up and return dates.');
    if (bk.from < t) return err('The pick-up date cannot be in the past.');
    if (bk.to < bk.from) return err('The return date cannot be before the pick-up date.');
    if (bk.place.length < 2) return err('Please tell us where you will pick up the vehicle.');
    if (bk.name.length < 2) return err('Please type your name.');
    if (!/^[+0-9 ()-]+$/.test(bk.phone) || (bk.phone.match(/\d/g) || []).length < 7) return err('Please type a phone number we can call, using numbers only.');
    if (bk.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(bk.email)) return err('Please check the email address.');
    if (!API_URL) return err('Online booking is not switched on yet. Please call us on ' + SITE.phone + '.');
    sending = true; $('bsend').disabled = true; $('bsend').textContent = 'Sending…'; $('bmsg').innerHTML = '';
    try {
      let res;
      try { res = await fetch(API_URL, { method: 'POST', body: JSON.stringify({ action: 'bookingRequest', clientId, booking: bk }), redirect: 'follow' }); }
      catch (x) { throw new Error('We could not send your request. Please check your internet and try again, or call us on ' + SITE.phone + '.'); }
      let j; try { j = await res.json(); } catch (x) { throw new Error('Something went wrong. Please try again, or call us on ' + SITE.phone + '.'); }
      if (!j.ok) throw new Error(j.error || 'Something went wrong. Please try again.');
      $('bf').innerHTML = `<div class="done"><div class="tick">✓</div><h3>Request sent</h3><p>Your reference is <b>${esc(j.id)}</b>.</p>
        <p>We will call <b>${esc(bk.phone)}</b> soon to confirm your ${esc(bk.vehicle)} for ${j.days} day${j.days === 1 ? '' : 's'}. You do not need to pay yet.</p>
        <p class="fine">Need us sooner? Call <a href="tel:+${SITE.phoneLink}">${esc(SITE.phone)}</a>.</p></div>`;
    } catch (x) {
      err(x.message); sending = false; $('bsend').disabled = false; $('bsend').textContent = 'Send booking request';
    }
  });
}
async function reviews() {
  const box = $('reviews');
  if (!box) return;
  const none = '<div class="empty">No reviews yet. Be the first to share your experience below.</div>';
  if (!API_URL) { box.innerHTML = none; return; }
  try {
    const res = await fetch(API_URL, { method: 'POST', body: JSON.stringify({ action: 'publicReviews' }), redirect: 'follow' });
    const j = await res.json();
    if (!j.ok) throw new Error('x');
    box.innerHTML = j.reviews.length ? j.reviews.map((r) => `<figure class="card rv">${stars(r.rating)}<blockquote>${esc(r.text)}</blockquote><figcaption><b>${esc(r.name)}</b><span>${esc(r.about)}</span></figcaption></figure>`).join('') : none;
  } catch (e) { box.innerHTML = none; }
}
function reviewForm() {
  if (!$('rf')) return;
  let clientId = uid(), sending = false;
  $('rf').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    const v = (id) => $(id).value.trim();
    const rv = { name: v('rname'), rating: v('rrating'), about: v('rabout'), text: v('rtext'), website: v('rweb') };
    const err = (m) => { $('rmsg').innerHTML = `<div class="errbox" role="alert">${esc(m)}</div>`; };
    if (rv.name.length < 2) return err('Please type your name.');
    if (!rv.rating) return err('Please choose a star rating.');
    if (rv.text.length < 10) return err('Please write a little more. A sentence or two is enough.');
    if (/https?:\/\/|www\./i.test(rv.text)) return err('Please leave web links out of your review.');
    if (!API_URL) return err('Reviews are not switched on yet.');
    sending = true; $('rsend').disabled = true; $('rsend').textContent = 'Sending…'; $('rmsg').innerHTML = '';
    try {
      let res;
      try { res = await fetch(API_URL, { method: 'POST', body: JSON.stringify({ action: 'reviewSubmit', clientId, review: rv }), redirect: 'follow' }); }
      catch (x) { throw new Error('We could not send your review. Please check your internet and try again.'); }
      let j; try { j = await res.json(); } catch (x) { throw new Error('Something went wrong. Please try again.'); }
      if (!j.ok) throw new Error(j.error || 'Something went wrong. Please try again.');
      $('rf').innerHTML = '<div class="done"><div class="tick">✓</div><h3>Thank you</h3><p>We have your review. It will appear on this page once we have checked it.</p></div>';
    } catch (x) { err(x.message); sending = false; $('rsend').disabled = false; $('rsend').textContent = 'Send review'; }
  });
}

function gallery() {
  const box = document.getElementById('gal'); if (!box || typeof GALLERY === 'undefined') return;
  const V = GALLERY.videos; let cur = -1, timer = null;
  box.innerHTML = '<div class="gcar"><button type="button" class="garrow prev" id="gprev" aria-label="Previous video">‹</button>' +
    '<div class="gtrack" id="gtrack" tabindex="0" aria-label="Gallery videos. Swipe left or right.">' +
    V.map((v, k) => '<div class="gslide" data-k="' + k + '"><video muted playsinline preload="none" poster="' + v.poster + '" disablepictureinpicture controlslist="nodownload noremoteplayback" aria-label="Gallery video ' + (k + 1) + '"></video><span class="gpause" aria-hidden="true">▶</span></div>').join('') +
    '</div><button type="button" class="garrow next" id="gnext" aria-label="Next video">›</button></div>' +
    '<div class="gdots" id="gdots">' + V.map((v, k) => '<button type="button" data-k="' + k + '" aria-label="Go to video ' + (k + 1) + '"></button>').join('') + '</div>' +
    '<p class="ghint">Swipe left or right for the next video</p>';
  const track = document.getElementById('gtrack');
  const slides = [...track.querySelectorAll('.gslide')], dots = [...document.querySelectorAll('#gdots button')];
  const vids = slides.map(s => s.querySelector('video'));
  vids.forEach(v => { v.muted = true; v.defaultMuted = true; });
  function load(k) { const v = vids[(k + V.length) % V.length]; if (!v.getAttribute('src')) { v.src = V[(k + V.length) % V.length].src; v.preload = 'auto'; } }
  function activate(k) {
    if (k === cur) return; cur = k;
    vids.forEach((v, n) => { if (n !== k) { v.pause(); if (n !== (k + 1) % V.length) { /* keep neighbours loaded */ } } });
    slides.forEach((s, n) => s.classList.toggle('on', n === k));
    dots.forEach((d, n) => d.classList.toggle('on', n === k));
    load(k); load(k + 1);
    const v = vids[k]; v.currentTime = 0; v.muted = true;
    const p = v.play(); if (p && p.catch) p.catch(() => { slides[k].classList.add('paused'); });
    slides[k].classList.remove('paused');
  }
  function go(k) { k = (k + V.length) % V.length; slides[k].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); }
  vids.forEach((v, k) => v.addEventListener('ended', () => go(k + 1)));
  vids.forEach((v, k) => { v.addEventListener('pause', () => { if (k === cur && !v.ended) slides[k].classList.add('paused'); }); v.addEventListener('playing', () => slides[k].classList.remove('paused')); });
  /* which slide is centred? */
  function centred() {
    const mid = track.scrollLeft + track.clientWidth / 2; let best = 0, bd = 1e9;
    slides.forEach((s, n) => { const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = n; } });
    return best;
  }
  track.addEventListener('scroll', () => { clearTimeout(timer); timer = setTimeout(() => activate(centred()), 120); }, { passive: true });
  slides.forEach((s, k) => s.addEventListener('click', () => {
    if (k !== cur) { go(k); return; }
    const v = vids[k]; if (v.paused) { v.play(); } else { v.pause(); }
  }));
  dots.forEach(d => d.addEventListener('click', () => go(+d.dataset.k)));
  document.getElementById('gprev').addEventListener('click', () => go(cur - 1));
  document.getElementById('gnext').addEventListener('click', () => go(cur + 1));
  track.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); } });
  activate(0);
  const ph = document.getElementById('photos');
  if (ph) ph.innerHTML = GALLERY.photos.map(p => '<figure><img src="' + p.src + '" alt="' + p.alt + '" loading="lazy"></figure>').join('');
}
chrome(); build(); wire(); reviews(); reviewForm(); gallery();


/* Page-to-page transition: a Gifted car drives across, then the next page opens */
(function () {
  const car = '<svg class="gocar" viewBox="0 0 230 100" aria-hidden="true"><ellipse cx="116" cy="88" rx="96" ry="5" fill="rgba(0,0,0,.35)"/>' +
    '<path d="M12 70V54q0-7 9-10l32-7q10-19 30-20h46q20 0 32 18l34 7q12 3 12 13v15z" fill="#0b0f1a"/>' +
    '<path d="M62 38q8-13 22-14h24v14zM114 24h20q15 1 24 14h-44z" fill="#a9cdee"/>' +
    '<text x="60" y="58" font-family="Poppins,Arial,sans-serif" font-weight="700" font-size="14" fill="#fff">Gifted</text>' +
    '<rect x="212" y="50" width="10" height="6" rx="3" fill="#F5B81C"/><rect x="8" y="52" width="6" height="8" rx="2" fill="#d33"/>' +
    '<g class="wh" style="transform-origin:54px 74px"><circle cx="54" cy="74" r="15" fill="#05070c"/><circle cx="54" cy="74" r="9" fill="#F5B81C"/><path d="M54 66v16M46 74h16" stroke="#8a6a0c" stroke-width="2"/></g>' +
    '<g class="wh" style="transform-origin:174px 74px"><circle cx="174" cy="74" r="15" fill="#05070c"/><circle cx="174" cy="74" r="9" fill="#F5B81C"/><path d="M174 66v16M166 74h16" stroke="#8a6a0c" stroke-width="2"/></g></svg>';
  const go = document.createElement('div'); go.id = 'go'; go.setAttribute('aria-hidden', 'true');
  go.innerHTML = '<div class="goroad"></div>' + car; document.body.appendChild(go);
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.addEventListener('click', (e) => {
    if (reduce || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href]'); if (!a || a.target || a.hasAttribute('download')) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || !/^https?:$/.test(u.protocol)) return;
    if (u.pathname === location.pathname && u.search === location.search) return;
    e.preventDefault(); document.documentElement.classList.add('leaving');
    setTimeout(() => { location.href = u.href; }, 800);
  });
  window.addEventListener('pageshow', () => document.documentElement.classList.remove('leaving'));
})();
