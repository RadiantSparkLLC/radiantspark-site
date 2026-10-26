const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menuButton.textContent = open ? '×' : 'Menu';
  });
}
function showCountry(country, updateHash = true) {
  const selected = country === 'usa' ? 'usa' : country === 'india' ? 'india' : 'global';
  document.querySelectorAll('[data-country-page]').forEach(page => {
    page.hidden = page.dataset.countryPage !== selected;
  });
  document.querySelectorAll('.country-tab').forEach(button => {
    const active = button.dataset.country === selected;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const cta = document.querySelector('.nav-cta');
  if (cta) {
    cta.href = selected === 'india' ? '#india-contact' : selected === 'usa' ? '#usa-contact' : '#global-companies';
    cta.textContent = selected === 'india' ? 'India business ↘' : selected === 'usa' ? 'U.S. technology ↘' : 'Explore companies ↘';
  }
  document.title = selected === 'india' ? 'RDNT Sparkle Industries LLP | India' : selected === 'usa' ? 'Radiant Spark LLC | Spark IT Consulting · USA' : 'Radiant Spark Global | India & U.S. Companies';
  document.body.dataset.country = selected;
  const brandName = document.querySelector('[data-brand-name]');
  const brandSubtitle = document.querySelector('[data-brand-subtitle]');
  if (brandName) brandName.textContent = selected === 'india' ? 'RDNT Sparkle Industries LLP' : selected === 'usa' ? 'Radiant Spark LLC' : 'Radiant Spark Global';
  if (brandSubtitle) brandSubtitle.textContent = selected === 'india' ? 'India' : selected === 'usa' ? 'Spark IT Consulting · USA' : 'United States · India';
  document.querySelectorAll('[data-country-footer]').forEach(label => { label.hidden = label.dataset.countryFooter !== selected; });
  if (updateHash) history.replaceState(null, '', selected === 'global' ? location.pathname : '#' + selected);
  if (nav && menuButton) {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    menuButton.textContent = 'Menu';
  }
}
document.querySelectorAll('[data-country]').forEach(button => button.addEventListener('click', () => { showCountry(button.dataset.country); if (button.dataset.scrollTo) document.getElementById(button.dataset.scrollTo)?.scrollIntoView({behavior:'smooth'}); else window.scrollTo({top:0,behavior:'smooth'}); }));
document.querySelector('[data-country-contact]')?.addEventListener('click', () => { const selected = document.body.dataset.country || 'global'; const target = selected === 'usa' ? 'usa-contact' : selected === 'india' ? 'india-contact' : 'global-companies'; document.getElementById(target)?.scrollIntoView({behavior:'smooth'}); });
function countryFromHash(hash) {
  if (hash === '#usa' || hash.startsWith('#usa-') || hash === '#services') return 'usa';
  if (hash === '#india' || hash.startsWith('#india-') || hash === '#divisions') return 'india';
  if (['#about','#careers','#contact','#privacy'].includes(hash)) return 'global';
  return 'global';
}
document.querySelectorAll('[data-global-section]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  const section = link.dataset.globalSection;
  showCountry('global', false);
  history.pushState(null, '', '#' + section);
  document.getElementById(section)?.scrollIntoView({behavior:'smooth'});
}));
window.addEventListener('hashchange', () => showCountry(countryFromHash(location.hash), false));
showCountry(countryFromHash(location.hash), false);
document.getElementById('global-ask-button')?.addEventListener('click', () => document.getElementById('assistant-toggle')?.click());
const year = document.querySelector('[data-current-year]');
if (year) year.textContent = new Date().getFullYear();

// Lightweight 3D-style particle sphere: draws locally with Canvas and needs no remote libraries.
(() => {
  const canvas = document.getElementById('cinematic-orb');
  if (!canvas) return;
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0, height = 0, frame = 0, tick = 0;
  const latitudes = 17, longitudes = 28;
  const burstColors = ['#347fff','#1761cf','#ffad22','#ffd064','#f3f7ff','#55bafa'];
  const burstParticles = Array.from({length:420}, () => ({angle:Math.random()*Math.PI*2,offset:Math.random()*850,speed:.35+Math.random()*1.25,size:2+Math.random()*7,alpha:.3+Math.random()*.6,color:burstColors[Math.floor(Math.random()*burstColors.length)]}));
  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  }
  function draw() {
    if (!width || !height) return;
    context.clearRect(0, 0, width, height);
    const globalView = document.body.dataset.country === 'global';
    const cx = width * (globalView ? .5 : width < 700 ? .84 : .77);
    const cy = height * (globalView ? .43 : width < 700 ? .25 : .31);
    const radius = globalView ? Math.min(width * (width < 700 ? .46 : .34), height * .43, width < 700 ? 245 : 350) : Math.min(width * (width < 700 ? .42 : .26), height * .31, width < 700 ? 215 : 310);
    const angle = tick * .0035;
    const points = [];
    const accent = document.body.dataset.country === 'usa' ? [75, 167, 255] : [246, 170, 36];
    const color = (alpha) => 'rgba(' + accent.join(',') + ',' + alpha + ')';
    const glow = context.createRadialGradient(cx, cy, radius * .08, cx, cy, radius * 1.15);
    glow.addColorStop(0, color(.105)); glow.addColorStop(.58, color(.045)); glow.addColorStop(1, color(0));
    context.fillStyle = glow; context.beginPath(); context.arc(cx, cy, radius * 1.15, 0, Math.PI * 2); context.fill();
    for (let row = 0; row <= latitudes; row++) {
      const lat = -Math.PI / 2 + Math.PI * row / latitudes;
      for (let col = 0; col < longitudes; col++) {
        const lon = Math.PI * 2 * col / longitudes;
        const x0 = Math.cos(lat) * Math.cos(lon), y0 = Math.sin(lat), z0 = Math.cos(lat) * Math.sin(lon);
        const x = x0 * Math.cos(angle) - z0 * Math.sin(angle);
        const z = x0 * Math.sin(angle) + z0 * Math.cos(angle);
        const perspective = 1 / (1.18 - z * .22);
        points.push({x: cx + x * radius * perspective, y: cy + y0 * radius * perspective, z, size: (1.05 + (z + 1) * 1.25) * perspective, row, col});
      }
    }
    context.lineWidth = .65;
    for (let row = 0; row <= latitudes; row++) for (let col = 0; col < longitudes; col++) {
      const p = points[row * longitudes + col], next = points[row * longitudes + (col + 1) % longitudes];
      if (p.z + next.z < -.55) continue;
      context.strokeStyle = color(Math.max(.018, (p.z + next.z + 1.8) * .023));
      context.beginPath(); context.moveTo(p.x, p.y); context.lineTo(next.x, next.y); context.stroke();
      if (row < latitudes) {
        const down = points[(row + 1) * longitudes + col];
        if (p.z + down.z > -.5) { context.strokeStyle = color(Math.max(.015, (p.z + down.z + 1.8) * .018)); context.beginPath(); context.moveTo(p.x, p.y); context.lineTo(down.x, down.y); context.stroke(); }
      }
    }
    for (const p of points) {
      if (p.z < -.48) continue;
      context.fillStyle = color(.16 + (p.z + .5) * .42); context.beginPath(); context.arc(p.x, p.y, p.size, 0, Math.PI * 2); context.fill();
    }
    if (globalView) {
      const spread = Math.max(width, height) * .83;
      for (const particle of burstParticles) {
        const distance = (particle.offset + tick * particle.speed) % spread;
        const drift = Math.sin(tick * .012 + particle.offset) * 13;
        const x = cx + Math.cos(particle.angle) * distance;
        const y = cy + Math.sin(particle.angle) * distance * .72 + drift;
        const fade = .22 + .78 * (1 - distance / spread);
        context.globalAlpha = particle.alpha * fade;
        context.fillStyle = particle.color;
        context.fillRect(x, y, particle.size, particle.size);
      }
      context.globalAlpha = 1;
    }
    if (!reduceMotion) { tick++; frame = requestAnimationFrame(draw); }
  }
  window.addEventListener('resize', resize, {passive:true});
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frame) cancelAnimationFrame(frame);
    else if (!document.hidden && !reduceMotion) frame = requestAnimationFrame(draw);
  });
  resize();
  if (!reduceMotion) frame = requestAnimationFrame(draw);
})();

// On-site guide: answers common questions from the published company information.
(() => {
  const panel = document.getElementById('spark-assistant');
  const toggle = document.getElementById('assistant-toggle');
  const close = document.getElementById('assistant-close');
  const form = document.getElementById('assistant-form');
  const input = document.getElementById('assistant-input');
  const messages = document.getElementById('assistant-messages');
  if (!panel || !toggle || !form || !input || !messages) return;
  function setOpen(open) { panel.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); if (open) input.focus(); }
  toggle.addEventListener('click', () => setOpen(panel.hidden));
  close?.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !panel.hidden) { setOpen(false); toggle.focus(); } });
  function addMessage(text, kind) { const item = document.createElement('div'); item.className = 'assistant-message ' + (kind === 'user' ? 'assistant-user' : 'assistant-reply'); item.textContent = text; messages.appendChild(item); messages.scrollTop = messages.scrollHeight; }
  function getAnswer(question) {
    const q = question.toLowerCase();
    if (/career|job|resume|résumé|talent|apply/.test(q)) return 'Radiant Spark LLC welcomes career inquiries for technology consulting, Oracle Cloud, integrations, AI, software, data, and IT staffing. Email your résumé to info@radiantsparkllc.com. Do not include sensitive identity, banking, or password information.';
    if (/contact|email|phone|reach|inquir/.test(q)) return 'For either company, email info@radiantsparkllc.com and include the company and division in your subject line. The U.S. company website is radiantsparkllc.com.';
    if (/privacy|security|data|track/.test(q)) return 'This static site has no contact form, analytics, or advertising trackers. The host may process basic technical logs. See the Privacy section for U.S. and India resources.';
    if (/india|rdnt|spark ev|drink|natur|distribution|beverage|food|solar|charging/.test(q)) return 'RDNT Sparkle Industries LLP is the India company. Its four divisions are Spark EV, Sparkle Drinks, Spicy Sparkle Naturals, and Sparkle Distribution Network. Choose “Industries India” in the top navigation to view them.';
    if (/usa|u.s.|united states|spark it|oracle|cloud|consult|technology|artificial intelligence|\bai\b|staff/.test(q)) return 'Radiant Spark LLC is the U.S. company. Spark IT Consulting lists six practices: business transformation, digital modernization, AI, technology integration, custom software, and IT consulting and staffing. Choose “Technology USA” in the top navigation to view them.';
    if (/global|company|companies|structure|who/.test(q)) return 'Radiant Spark Global is the shared website overview for two distinct companies: Radiant Spark LLC in the United States and RDNT Sparkle Industries LLP in India. Their services are listed in separate country views.';
    return 'I can help with the U.S. technology practices, India divisions, careers, contact, and privacy. Try one of the suggested questions below.';
  }
  function ask(question) { const q = question.trim(); if (!q) return; addMessage(q, 'user'); input.value = ''; window.setTimeout(() => addMessage(getAnswer(q), 'reply'), 220); }
  form.addEventListener('submit', event => { event.preventDefault(); ask(input.value); });
  panel.querySelectorAll('[data-chat-prompt]').forEach(button => button.addEventListener('click', () => ask(button.dataset.chatPrompt)));
})();



// Enable installable app support when hosted over HTTPS (such as GitHub Pages).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

