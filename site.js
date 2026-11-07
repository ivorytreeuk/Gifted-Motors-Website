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

function chrome() {
  const page = (document.querySelector('[data-page]') || {}).dataset ? document.querySelector('[data-page]').dataset.page : '';
  const L = [['home', 'index.html', 'Home'], ['cars', 'cars.html', 'Our cars'], ['services', 'services.html', 'Services'], ['pay', 'pay.html', 'Make a payment'], ['contact', 'contact.html', 'Contact']];
  $('site-header').outerHTML = `<header class="nav"><div class="wrap nav-in">
    <a href="index.html" class="brand" aria-label="Gifted Motors home"><img src="logo.png" alt="Gifted Motors"></a>
    <nav class="links" id="links" aria-label="Main">${L.map((l) => `<a href="${l[1]}" ${page === l[0] ? 'aria-current="page"' : ''}>${l[2]}</a>`).join('')}</nav>
    <a class="btn small" href="book.html">Book now</a>
    <button class="burger" id="burger" aria-label="Menu" aria-expanded="false" aria-controls="links"><span></span><span></span><span></span></button>
  </div></header>`;
  $('site-footer').outerHTML = `<footer class="foot"><div class="wrap foot-in"><div><img src="logo.png" alt="Gifted Motors"><p>&copy; ${new Date().getFullYear()} Gifted Motors Limited<br>${esc(SITE.address)}</p></div>
    <div><p><b>Call</b><br><a href="tel:+${SITE.phoneLink}">${esc(SITE.phone)}</a></p>${SITE.email ? `<p><a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></p>` : ''}</div>
    <div><p><b>Open</b><br>${SITE.hours.map((h) => esc(h[0]) + ': ' + esc(h[1])).join('<br>')}</p></div></div></footer>`;
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
  const links = Object.keys(names).filter((k) => /^https?:\/\//.test(SITE.social[k] || ''));
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
chrome(); build(); wire();
