/* ═══════════════════════════════════════════════════════════
   DIANOMY — Main App Entry
   Initializes animated canvas background, navbar, router,
   and all page renderers.
   ═══════════════════════════════════════════════════════════ */

// ── Animated Canvas Background (ported from AnimatedBackground.tsx) ──
function initAnimatedBackground() {
  const canvas = document.getElementById('animated-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let w, h;
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  const mobile = () => window.innerWidth < 768;

  const COLORS = {
    coral: '16, 90%, 58%',
    teal: '190, 80%, 50%',
    background: '225, 30%, 8%'
  };

  class Node {
    constructor(randomY) { this.init(randomY); }
    init(ry) {
      this.x = Math.random() * w;
      this.y = ry ? Math.random() * h : h + 30;
      this.vx = (Math.random() - 0.5) * 0.22;
      this.vy = -(Math.random() * 0.16 + 0.06);
      this.r = Math.random() * 1.8 + 0.8;
      this.isCoral = Math.random() < 0.25;
      this.ph = Math.random() * Math.PI * 2;
      this.ps = 0.015 + Math.random() * 0.02;
      this.a = ry ? Math.random() * 0.8 + 0.2 : 0;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.ph += this.ps;
      if (this.a < 1) this.a = Math.min(1, this.a + 0.02);
      if (this.x < -60) this.x = w + 60;
      if (this.x > w + 60) this.x = -60;
      return this.y > -60;
    }
    draw() {
      const pulse = Math.sin(this.ph) * 0.5 + 0.5;
      const r = this.r + pulse * 1.5;
      const aa = this.a * (0.35 + pulse * 0.45);
      if (this.isCoral) {
        const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r * 7);
        g.addColorStop(0, 'hsla(' + COLORS.coral + ', ' + (aa * 0.3) + ')');
        g.addColorStop(1, 'hsla(' + COLORS.coral + ', 0)');
        ctx.beginPath();
        ctx.arc(this.x, this.y, r * 7, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
      ctx.fillStyle = this.isCoral
        ? 'hsla(' + COLORS.coral + ', ' + Math.min(1, aa * 1.5) + ')'
        : 'hsla(' + COLORS.teal + ', ' + Math.min(1, aa * 1.3) + ')';
      ctx.fill();
    }
  }

  class Packet {
    constructor(from, to) {
      this.a = from; this.b = to; this.t = 0;
      this.spd = 0.007 + Math.random() * 0.006;
      this.isCoral = Math.random() < 0.45;
      this.trail = [];
    }
    get x() { return this.a.x + (this.b.x - this.a.x) * this.t; }
    get y() { return this.a.y + (this.b.y - this.a.y) * this.t; }
    update() {
      this.t += this.spd;
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 16) this.trail.shift();
      return this.t < 1;
    }
    draw() {
      for (let i = 0; i < this.trail.length; i++) {
        const p = i / this.trail.length;
        ctx.beginPath();
        ctx.arc(this.trail[i].x, this.trail[i].y, 2 * p, 0, Math.PI * 2);
        ctx.fillStyle = this.isCoral
          ? 'hsla(' + COLORS.coral + ', ' + (p * 0.55) + ')'
          : 'hsla(' + COLORS.teal + ', ' + (p * 0.45) + ')';
        ctx.fill();
      }
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 12);
      g.addColorStop(0, this.isCoral ? 'hsla(' + COLORS.coral + ', 0.5)' : 'hsla(' + COLORS.teal + ', 0.4)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(this.x, this.y, 12, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.arc(this.x, this.y, 2.8, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(' + (this.isCoral ? COLORS.coral : COLORS.teal) + ', 1.0)';
      ctx.fill();
    }
  }

  let hexes = [], stars = [], nodes = [], pkts = [];
  let pktTimer = 0, auroraT = 0;
  const DIST = () => mobile() ? 115 : 160;

  function initHex() {
    hexes = [];
    const n = mobile() ? 5 : 10;
    for (let i = 0; i < n; i++) hexes.push({
      x: Math.random() * w, y: Math.random() * h,
      sz: 55 + Math.random() * 170,
      rot: Math.random() * Math.PI * 2,
      rs: (Math.random() - 0.5) * 0.0008,
      a: 0.02 + Math.random() * 0.05,
      isCoral: Math.random() < 0.3
    });
  }

  function initStars() {
    stars = [];
    const n = mobile() ? 60 : 140;
    for (let i = 0; i < n; i++) stars.push({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 0.9 + 0.15,
      ph: Math.random() * Math.PI * 2,
      spd: 0.25 + Math.random() * 1.1,
      ba: 0.06 + Math.random() * 0.18
    });
  }

  function initElements() {
    initHex(); initStars();
    const n = mobile() ? 28 : 62;
    nodes = Array.from({ length: n }, () => new Node(true));
    pkts = [];
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    initElements();
  }

  let rafId;
  function frame(ts) {
    rafId = requestAnimationFrame(frame);
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = 'hsl(' + COLORS.background + ')';
    ctx.fillRect(0, 0, w, h);

    auroraT += 0.007;
    const breath = Math.sin(auroraT) * 0.5 + 0.5;
    const acx = w * 0.5 + (mx - w * 0.5) * 0.05;
    const acy = h * 0.5 + (my - h * 0.5) * 0.05;
    const ar = Math.min(w, h) * 0.42 * (0.8 + breath * 0.2);

    const ag1 = ctx.createRadialGradient(acx, acy, 0, acx, acy, ar);
    ag1.addColorStop(0, 'hsla(' + COLORS.coral + ', ' + (0.06 + breath * 0.03) + ')');
    ag1.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = ag1; ctx.fillRect(0, 0, w, h);

    const ag2 = ctx.createRadialGradient(acx + 120, acy - 90, 0, acx, acy, ar * 1.5);
    ag2.addColorStop(0, 'hsla(' + COLORS.teal + ', ' + (0.03 + breath * 0.02) + ')');
    ag2.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = ag2; ctx.fillRect(0, 0, w, h);

    stars.forEach(s => {
      const a = s.ba * (0.45 + 0.55 * Math.sin(s.ph + ts * 0.001 * s.spd));
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(210, 40%, 96%, ' + a + ')';
      ctx.fill();
    });

    hexes.forEach(hx => {
      hx.rot += hx.rs;
      ctx.save(); ctx.translate(hx.x, hx.y); ctx.rotate(hx.rot);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i;
        if (i === 0) ctx.moveTo(hx.sz * Math.cos(a), hx.sz * Math.sin(a));
        else ctx.lineTo(hx.sz * Math.cos(a), hx.sz * Math.sin(a));
      }
      ctx.closePath();
      ctx.strokeStyle = hx.isCoral
        ? 'hsla(' + COLORS.coral + ', ' + (hx.a * 0.9) + ')'
        : 'hsla(220, 15%, 55%, ' + (hx.a * 0.7) + ')';
      ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
    });

    const px = (mx / (w || 1) - 0.5) * 12;
    const py = (my / (h || 1) - 0.5) * 8;

    const D = DIST();
    ctx.save(); ctx.translate(px, py);
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < D) {
          const op = (1 - d / D) * 0.2 * Math.min(a.a, b.a);
          const lg = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          lg.addColorStop(0, a.isCoral ? 'hsla(' + COLORS.coral + ', ' + op + ')' : 'hsla(220, 15%, 55%, ' + op + ')');
          lg.addColorStop(1, b.isCoral ? 'hsla(' + COLORS.coral + ', ' + op + ')' : 'hsla(220, 15%, 55%, ' + op + ')');
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = lg; ctx.lineWidth = 0.8; ctx.stroke();
        }
      }
    }
    nodes = nodes.filter(n => n.update());
    nodes.forEach(n => n.draw());
    ctx.restore();
    while (nodes.length < (mobile() ? 28 : 62)) nodes.push(new Node(false));

    pktTimer++;
    const interval = mobile() ? 55 : 30;
    if (pktTimer > interval && nodes.length > 8) {
      pktTimer = 0;
      const from = nodes[Math.floor(Math.random() * nodes.length)];
      const near = nodes.filter(n => {
        if (n === from) return false;
        const dx = n.x - from.x, dy = n.y - from.y;
        return Math.sqrt(dx * dx + dy * dy) < DIST();
      });
      if (near.length) {
        pkts.push(new Packet(from, near[Math.floor(Math.random() * near.length)]));
        if (pkts.length > (mobile() ? 10 : 20)) pkts.splice(0, 1);
      }
    }
    pkts = pkts.filter(p => p.update());
    ctx.save(); ctx.translate(px, py);
    pkts.forEach(p => p.draw());
    ctx.restore();
  }

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  window.addEventListener('touchmove', e => {
    if (e.touches[0]) { mx = e.touches[0].clientX; my = e.touches[0].clientY; }
  }, { passive: true });
  window.addEventListener('resize', resize);
  resize();
  rafId = requestAnimationFrame(frame);
}


// ── Navbar Renderer ──
function renderNavbar() {
  const nav = document.getElementById('main-navbar');
  if (!nav) return;

  const currentHash = window.location.hash || '#/';
  if (currentHash === '#/' || currentHash === '#/login' || currentHash === '#/verify-phone') {
    nav.style.display = 'none';
    return;
  }
  nav.style.display = 'block';

  const user = Storage.getUser();
  const isLoggedIn = !!user;

  nav.innerHTML = `
    <div class="navbar-inner">
      <a class="navbar-logo text-gradient-coral hover-glow-coral" id="navbar-logo" data-route="${isLoggedIn ? '#/dashboard' : '#/'}">
        DIANOMY.
      </a>
      <div class="navbar-links">
        <a class="nav-link" data-route="#/dashboard">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          <span class="label">Requests</span>
        </a>
        <a class="nav-link" data-route="#/create">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span class="label">New Request</span>
        </a>
        <a class="nav-link" data-route="#/runner">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          <span class="label">Run</span>
        </a>
        <a class="nav-link" data-route="#/profile">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span class="label">Profile</span>
        </a>

        <button class="nav-icon-btn" id="nav-mute-btn" aria-label="${isMuted() ? 'Unmute sounds' : 'Mute sounds'}">
          ${isMuted()
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>'
    }
        </button>

        <button class="nav-icon-btn logout-btn" id="nav-logout-btn" aria-label="Log Out" style="display:${isLoggedIn ? 'flex' : 'none'}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </div>
    </div>
  `;

  // Nav link clicks
  nav.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      sounds.click();
      Router.navigate(this.getAttribute('data-route'));
    });
  });

  // Logo click
  const logo = nav.querySelector('#navbar-logo');
  if (logo) {
    logo.addEventListener('click', function (e) {
      e.preventDefault();
      sounds.pop();
      const target = Storage.isLoggedIn() ? '#/dashboard' : '#/';
      Router.navigate(target);
    });
  }

  // Mute toggle
  const muteBtn = nav.querySelector('#nav-mute-btn');
  if (muteBtn) {
    muteBtn.addEventListener('click', function () {
      toggleMute();
      if (!isMuted()) sounds.click();
      renderNavbar(); // Re-render to update icon
    });
  }

  // Logout button
  const logoutBtn = nav.querySelector('#nav-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      sounds.click();
      showLogoutDialog();
    });
  }
}


// ── Logout Dialog ──
function showLogoutDialog() {
  const existing = document.getElementById('logout-dialog');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'logout-dialog';
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-backdrop" id="logout-backdrop"></div>
    <div class="modal-content">
      <div class="glass-strong p-6 text-center" style="border-radius:var(--radius)">
        <div style="width:3.5rem;height:3.5rem;border-radius:1rem;background:hsla(var(--destructive-h),var(--destructive-s),var(--destructive-l),0.15);display:flex;align-items:center;justify-content:center;margin:0 auto 1rem" class="animate-scale-in">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--destructive)"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </div>
        <h2 style="font-family:var(--font-display);font-size:1.125rem;font-weight:700;color:var(--foreground);margin-bottom:0.25rem">Sign Out?</h2>
        <p style="font-size:0.875rem;color:var(--muted-foreground);margin-bottom:1.5rem">Are you sure you want to log out and return to the landing page?</p>
        <div style="display:flex;gap:0.75rem">
          <button class="btn btn-outline" style="flex:1" id="logout-cancel">Cancel</button>
          <button class="btn" style="flex:1;background:var(--destructive);color:var(--destructive-foreground);font-weight:600" id="logout-confirm">Log Out</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById('logout-backdrop').addEventListener('click', () => overlay.remove());
  document.getElementById('logout-cancel').addEventListener('click', () => { sounds.click(); overlay.remove(); });
  document.getElementById('logout-confirm').addEventListener('click', async function () {
    sounds.click();
    try {
      await auth.signOut();
      Storage.removeUser();
      overlay.remove();
      Router.navigate('#/');
    } catch (error) {
      console.error('Logout error:', error);
      Notifications.error('Logout failed. Please try again.');
    }
  });
}


// ── Landing Page Renderer ──
function renderLandingPage() {
  const page = document.getElementById('page-home');
  page.classList.add('active');
  page.className = 'page active page-home';

  page.innerHTML = `
    <section class="hero">
      <div style="max-width:42rem" class="animate-fade-in-up">
        <div class="glass-subtle hero-live-badge animate-fade-in delay-300">
          <span class="hero-live-dot"></span>
          Live on campus now
        </div>

        <h1 class="hero-title">
          <span class="text-gradient-coral">DIANOMY.</span>
        </h1>
        <p class="hero-subtitle">
          Gate to hostel, delivered by students. The last-mile campus delivery network.
        </p>

        <div class="hero-actions">
          <button class="btn btn-primary glow-coral hover-glow-coral" id="hero-get-started">
            Get Started
          </button>
        </div>
      </div>


      <div class="scroll-indicator">
        <span>Scroll</span>
        <div class="line"></div>
      </div>
    </section>

    <section class="features-section">
      <div class="section-header animate-fade-in">
        <h2 class="section-title">How it works</h2>
        <p class="section-desc">A peer-to-peer helping ecosystem, built for campus life.</p>
      </div>

      <div class="features-grid">
        ${[
      { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>', title: 'Post a Request', desc: 'Got an order stuck at the gate? Post it in seconds and a fellow student will bring it to your door.' },
      { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>', title: 'Run & Earn', desc: 'Heading towards the gate anyway? Pick up a delivery and earn small rewards on the way.' },
      { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', title: 'Verified Students Only', desc: 'College email login ensures only verified campus students can use the platform.' },
      { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>', title: 'Trust & Ratings', desc: 'Rate every delivery. Build your reputation and trust within the campus community.' },
      { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>', title: 'Real-Time Status', desc: 'Track your request from pending to accepted to delivered — all live updates.' },
      { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', title: 'Lightning Fast', desc: 'Most deliveries completed in under 10 minutes. No more 25-minute walks to the gate.' }
    ].map((f, i) => `
          <div class="glass card card-hover feature-card p-6 animate-fade-in-up delay-${(i + 1) * 100}" style="height:100%;border-radius:var(--radius)">
            <div class="feature-card-icon">${f.icon}</div>
            <h3>${f.title}</h3>
            <p>${f.desc}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="cta-section">
      <div class="cta-inner animate-fade-in-up">
        <div class="glass-strong card card-hover p-10" style="border-radius:var(--radius)">
          <h2 class="cta-title">Ready to skip the walk?</h2>
          <p class="cta-desc">Join hundreds of students already saving time on campus.</p>
          <button class="btn btn-primary glow-coral hover-glow-coral" id="cta-start-btn">
            Start Now — It's Free
          </button>
        </div>
      </div>
    </section>

    <footer class="footer">
      <p>© 2026 DIANOMY. Built by students, for students.</p>
    </footer>
  `;

  // Bind events
  const getStartedBtn = page.querySelector('#hero-get-started');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', function () {
      sounds.whoosh();
      Router.navigate('#/login');
    });
  }

  const ctaBtn = page.querySelector('#cta-start-btn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', function () {
      sounds.success();
      Router.navigate('#/login');
    });
  }

  // Play landing sound
  setTimeout(() => sounds.landing(), 400);
}


// ── Create Request Page ──
function renderCreateRequestPage() {
  const page = document.getElementById('page-create');
  page.classList.add('active');
  page.className = 'page active create-page';

  page.innerHTML = `
    <div class="create-container animate-fade-in-up">
      <h1 class="page-title" style="margin-bottom:0.25rem">New Delivery Request</h1>
      <p class="page-subtitle mb-6">Post your order details and a runner will pick it up.</p>

      <div class="glass-strong p-6" style="border-radius:var(--radius)">
        <form id="create-form" class="auth-form">
          <div>
            <label class="form-label">What's being delivered?</label>
            <input class="input-field" placeholder="e.g. Swiggy food order — 2 biryanis" id="create-desc" required />
          </div>
          <div class="form-grid-2">
            <div>
              <label class="form-label">Hostel</label>
              <select class="input-field" id="create-hostel" required style="appearance: auto; background-color: var(--secondary); color: white;">
                <option value="" disabled selected style="background-color: var(--background); color: white;">Select Hostel</option>
                <option value="Azad Hall" style="background-color: var(--background); color: white;">Azad Hall</option>
                <option value="Bose Hall" style="background-color: var(--background); color: white;">Bose Hall</option>
                <option value="Ambedkar Hall" style="background-color: var(--background); color: white;">Ambedkar Hall</option>
                <option value="Babha Hall" style="background-color: var(--background); color: white;">Babha Hall</option>
                <option value="Gandhi Hall" style="background-color: var(--background); color: white;">Gandhi Hall</option>
                <option value="Gokhale Hall" style="background-color: var(--background); color: white;">Gokhale Hall</option>
                <option value="Radhakrishnan Hall" style="background-color: var(--background); color: white;">Radhakrishnan Hall</option>
                <option value="Raman Hall" style="background-color: var(--background); color: white;">Raman Hall</option>
                <option value="Nehru Hall" style="background-color: var(--background); color: white;">Nehru Hall</option>
                <option value="Patel Hall" style="background-color: var(--background); color: white;">Patel Hall</option>
                <option value="Tagore Hall" style="background-color: var(--background); color: white;">Tagore Hall</option>
                <option value="Viswesvraya Hall" style="background-color: var(--background); color: white;">Viswesvraya Hall</option>
                <option value="Rajendra Prasad Hall" style="background-color: var(--background); color: white;">Rajendra Prasad Hall</option>
                <option value="Vikram Sarabhai Hall" style="background-color: var(--background); color: white;">Vikram Sarabhai Hall</option>
                <option value="Kakatiya Hall of Residence" style="background-color: var(--background); color: white;">Kakatiya Hall of Residence</option>
                <option value="Ramappa Hall of Residence" style="background-color: var(--background); color: white;">Ramappa Hall of Residence</option>
                <option value="International Students Hall" style="background-color: var(--background); color: white;">International Students Hall</option>
                <option value="Priyadarshini Hall" style="background-color: var(--background); color: white;">Priyadarshini Hall</option>
                <option value="Sarojini Hall" style="background-color: var(--background); color: white;">Sarojini Hall</option>
                <option value="New LH-A" style="background-color: var(--background); color: white;">New LH-A</option>
                <option value="New LH-B" style="background-color: var(--background); color: white;">New LH-B</option>
                <option value="New LH-C" style="background-color: var(--background); color: white;">New LH-C</option>
              </select>
            </div>
            <div>
              <label class="form-label">Room Number</label>
              <input class="input-field" placeholder="304" id="create-room" required />
            </div>
          </div>
          <div class="form-grid-2">
            <div>
              <label class="form-label">Expected Arrival</label>
              <div class="input-field-wrapper" style="position:relative">
                <input type="time" id="create-time" class="input-field" required style="appearance: none; background-color: var(--secondary); color: white; width: 100%;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position:absolute; right:1rem; top:50%; transform:translateY(-50%); pointer-events:none; color:var(--primary)"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
            </div>
            <div>
              <label class="form-label">Reward (₹)</label>
              <input class="input-field" type="number" placeholder="30" id="create-reward" required />
            </div>
          </div>
          <div style="margin-top:1rem">
            <label class="form-label">Delivery Instructions (Visible to Runner after acceptance)</label>
            <textarea class="input-field" id="create-instructions" placeholder="e.g. Call me when you reach the gate, or park near the main stairs." style="min-height:80px; padding:0.75rem"></textarea>
          </div>
          <button type="submit" class="btn btn-primary w-full glow-coral hover-glow-coral mt-2">
            Post Request
          </button>
        </form>
      </div>
    </div>
  `;

  const form = page.querySelector('#create-form');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const desc = document.getElementById('create-desc').value;
      const hostel = document.getElementById('create-hostel').value;
      const room = document.getElementById('create-room').value;
      const time = document.getElementById('create-time').value;
      const reward = document.getElementById('create-reward').value;
      const instructions = document.getElementById('create-instructions').value;

      const user = Storage.getUser();
      if (!user) {
        Notifications.error('You must be logged in to post a request.');
        Router.navigate('#/login');
        return;
      }

      const newRequest = {
        requester: user.name,
        requesterEmail: user.email,
        hostel: hostel,
        room: room,
        description: desc,
        reward: parseInt(reward, 10),
        arrivalTime: time,
        deliveryInstructions: instructions,
        status: 'pending',
        requesterPhone: user.phone || '',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      try {
        await db.collection('orders').add(newRequest);
        sounds.success();
        Notifications.success('Request posted! A runner will pick it up soon.');
        form.reset();
        Router.navigate('#/dashboard');
      } catch (error) {
        console.error('Error adding request:', error);
        Notifications.error('Failed to post request.');
      }
    });
  }
}


// ── Runner Dashboard Page ──
function renderRunnerDashboardPage() {
  const page = document.getElementById('page-runner-dashboard');
  if (!page) return;
  page.classList.add('active');
  page.className = 'page active dashboard-page';

  page.innerHTML = `
    <div class="page-content animate-fade-in-up">
      <div class="mb-6">
        <h1 class="page-title">Runner Dashboard</h1>
        <p class="page-subtitle">Accept and manage delivery runs</p>
      </div>
      <div class="glass animate-fade-in delay-200" style="border-radius:var(--radius-lg);padding:2rem;text-align:center">
        <p style="color:var(--muted-foreground);font-size:0.875rem">No active runs yet. Check back for available deliveries!</p>
      </div>
    </div>
  `;
}


// ── 404 Page ──
function render404Page() {
  const page = document.getElementById('page-404');
  if (!page) return;
  page.classList.add('active');
  page.className = 'page active not-found-page bg-gradient-mesh';

  page.innerHTML = `
    <div class="not-found-content animate-fade-in-up">
      <h1 class="not-found-title">404</h1>
      <p class="not-found-desc">The page you're looking for doesn't exist.</p>
      <button class="btn btn-primary glow-coral hover-glow-coral" id="not-found-home">Back to Home</button>
    </div>
  `;

  const btn = page.querySelector('#not-found-home');
  if (btn) btn.addEventListener('click', () => Router.navigate('#/'));
}


// ── Firebase Auth Helpers ──
// Removed Email Link handling as we are now Google-only

function initAuthListener() {
  // Set persistence to LOCAL explicitly to ensure consistency across devices
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
    auth.onAuthStateChanged(async (user) => {
      console.log('[DIANOMY] Auth State Changed. User:', user ? user.email : 'None');

      if (user) {
        // Top-level domain restriction enforcement
        if (user.email && !user.email.endsWith('@student.nitw.ac.in')) {
          console.warn('[DIANOMY] Unauthorized domain access attempt:', user.email);
          await auth.signOut();
          Storage.removeUser();
          renderNavbar();
          Router.navigate('#/login');
          return;
        }

        const userRef = db.collection('users').doc(user.uid);

        // Sync user profile from Firestore
        try {
          const doc = await userRef.get();
          let userData;

          if (doc.exists) {
            userData = doc.data();
            console.log('[DIANOMY] Existing user data found in Firestore');
            // Merge in latest Google info if Firestore is missing it
            if (!userData.name) userData.name = user.displayName || 'NITW Student';
            if (!userData.photoURL) userData.photoURL = user.photoURL || '';

            // FORCED EXTRACTION: Ensure auto-extracted fields are present and valid
            if (!userData.year || !userData.department || userData.year.includes('Edit') || userData.year === 'Unknown') {
              const extractedData = Utils.extractNitwEmailData(user.email) || {};
              userData.year = extractedData.year || 'Unknown';
              userData.department = extractedData.department || 'Unknown';
              userData.branch = extractedData.branch || 'Unknown';
              userData.rollNumber = user.email ? user.email.split('@')[0] : 'NITW Student';
            }
            userData.lastLogin = Date.now();
          } else {
            console.log('[DIANOMY] New user detected, creating profile');
            // Auto-extract data from email
            const extractedData = Utils.extractNitwEmailData(user.email) || {};

            // Map user data for the Profile page
            userData = {
              uid: user.uid,
              email: user.email || '',
              name: user.displayName || 'NITW Student',
              displayName: user.displayName || '',
              photoURL: user.photoURL || '',
              provider: 'google',
              avatarInitial: (user.displayName || 'U').charAt(0).toUpperCase(),
              rollNumber: user.email ? user.email.split('@')[0] : 'NITW Student',
              year: extractedData.year || 'Unknown',
              department: extractedData.department || 'Unknown',
              branch: extractedData.branch || 'Unknown',
              hostel: 'Not set',
              phone: user.phoneNumber || '',
              lastLogin: Date.now()
            };
          }

          // Save back to Firestore and Storage
          await userRef.set(userData, { merge: true });
          console.log('[DIANOMY] Profile synced:', userData.email);
          Storage.saveUser(userData);
          renderNavbar();
          initNotificationsListener(user.email);

          // Centralized Redirection Logic
          const currentHash = window.location.hash || '#/';
          // Only redirect if we are on landing or login pages
          if (currentHash === '#/login' || currentHash === '#/') {
            const hasValidPhone = userData.phone &&
              userData.phone !== '+91 XXXXX XXXXX' &&
              userData.phone.trim() !== '' &&
              userData.phone.trim() !== '+91';

            console.log('[DIANOMY] Redirecting. Valid phone:', hasValidPhone);
            setTimeout(() => {
              Router.navigate(hasValidPhone ? '#/profile' : '#/verify-phone');
            }, 100);
          }
        } catch (err) {
          console.error('[DIANOMY] Error syncing user:', err);
        }
      } else {
        console.log('[DIANOMY] No authenticated user.');
        Storage.removeUser();
        renderNavbar();
        if (window._notifUnsubscribe) window._notifUnsubscribe();
      }
    });
  }).catch(err => console.error('[DIANOMY] Persistence error:', err));
}

function initNotificationsListener(email) {
  if (window._notifUnsubscribe) window._notifUnsubscribe();
  window._notifUnsubscribe = db.collection('notifications')
    .where('toEmail', '==', email)
    .orderBy('createdAt', 'desc')
    .limit(5)
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          const now = Date.now();
          const created = data.createdAt ? data.createdAt.toMillis() : now;
          if (now - created < 30000) {
            showEmailNotification(data);
          }
        }
      });
    });
}

function showEmailNotification(data) {
  sounds.notification();

  const notif = document.createElement('div');
  notif.className = 'glass-strong p-6 animate-fade-in-up';
  notif.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 9999;
    max-width: 24rem;
    border-radius: var(--radius);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    border: 1px solid var(--primary);
  `;

  notif.innerHTML = `
    <div style="display:flex; gap:1rem; align-items:flex-start">
      <div style="background:var(--primary); color:white; padding:0.5rem; border-radius:0.5rem">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
      </div>
      <div>
        <h4 style="font-weight:700; margin-bottom:0.25rem">Email Notification</h4>
        <p style="font-size:0.875rem; color:var(--muted-foreground); margin-bottom:1rem">${data.message}</p>
        <button class="btn btn-primary btn-sm w-full" id="notif-close">Dismiss</button>
      </div>
    </div>
  `;
  document.body.appendChild(notif);

  notif.querySelector('#notif-close').addEventListener('click', () => notif.remove());
  setTimeout(() => { if (notif.parentNode) notif.remove(); }, 8000);
}


// ── App Initialization ──
document.addEventListener('DOMContentLoaded', function () {
  // Start animated background
  initAnimatedBackground();

  // Initialize Auth
  initAuthListener();
  // handleEmailLinkSignIn is removed

  // Initialize Data Listeners
  Dashboard.init();
  Offers.init();

  // Render navbar
  renderNavbar();

  // Register routes
  Router.register('#/', function () {
    renderNavbar();
    renderLandingPage();
  });

  Router.register('#/login', function () {
    renderNavbar();
    Auth.step = Auth.step || 'email';
    Auth.render();
  });

  Router.register('#/dashboard', function () {
    renderNavbar();
    Dashboard.render();
  });

  Router.register('#/create', function () {
    renderNavbar();
    renderCreateRequestPage();
  });

  Router.register('#/runner', function () {
    renderNavbar();
    Offers.render();
  });

  Router.register('#/runner-dashboard', function () {
    renderNavbar();
    renderRunnerDashboardPage();
  });

  Router.register('#/verify-phone', function () {
    renderNavbar();
    VerifyPhone.render();
  });

  Router.register('#/profile', function () {
    renderNavbar();
    Profile.render();
  });

  Router.register('#/404', function () {
    renderNavbar();
    render404Page();
  });

  // Initialize router
  Router.init();
});
