/* ============================================================
   SUPERCONDUCKTORS — Animated duck mascot
   - Follows cursor with easing
   - Leaves footprints (fade ~3s)
   - Sleeps after 8s of mouse idle
   - Toggle button to send away / bring back
   - Cute clipart ducks at the bottom
   ============================================================ */
(function () {
  'use strict';

  // ----- Persisted state -----
  const LS_DUCK = 'sc_duck_visible';
  const LS_NIGHT = 'sc_night';
  let duckVisible = localStorage.getItem(LS_DUCK) !== 'false';

  // ----- Build duck DOM -----
  const duckEl = document.createElement('div');
  duckEl.className = 'sc-duck';
  duckEl.innerHTML = `
    <svg class="sc-duck-side" width="96" height="100" viewBox="0 0 110 115" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="55" cy="111" rx="26" ry="4" fill="rgba(0,0,0,0.12)"/>
      <ellipse cx="58" cy="72" rx="34" ry="28" fill="#FFD75A"/>
      <ellipse cx="60" cy="68" rx="22" ry="14" fill="#FFE38A" opacity="0.7"/>
      <path d="M88 60 Q104 48 102 66 Q97 78 84 72 Z" fill="#F5B400"/>
      <path d="M38 60 Q30 48 33 36 Q40 28 48 33 Q51 44 46 60 Z" fill="#FFD75A"/>
      <circle cx="38" cy="26" r="20" fill="#FFDC6A"/>
      <ellipse cx="30" cy="18" rx="9" ry="7" fill="white" opacity="0.4"/>
      <circle cx="28" cy="24" r="5.5" fill="#1F1A14"/>
      <circle cx="26.4" cy="22.4" r="1.8" fill="white"/>
      <path d="M16 27 Q3 23 1 30 Q3 36 16 34 Z" fill="#FF8A1F"/>
      <path d="M16 34 Q3 36 2 42 Q7 46 16 41 Z" fill="#E36A00"/>
      <line x1="3" y1="34.5" x2="16" y2="34" stroke="#A8480A" stroke-width="0.9"/>
      <g class="sc-foot-l" fill="#FF8A1F">
        <rect x="40" y="94" width="6" height="10" rx="3"/>
        <path d="M43 103 Q35 108 31 106 Q35 102 40 102 Z"/>
        <path d="M43 103 Q37 111 30 110 Q35 106 41 105 Z"/>
        <path d="M43 103 Q46 111 53 110 Q49 106 44 104 Z"/>
      </g>
      <g class="sc-foot-r" fill="#FF8A1F">
        <rect x="58" y="94" width="6" height="10" rx="3"/>
        <path d="M61 103 Q53 108 49 106 Q53 102 58 102 Z"/>
        <path d="M61 103 Q55 111 48 110 Q53 106 59 105 Z"/>
        <path d="M61 103 Q64 111 71 110 Q67 106 62 104 Z"/>
      </g>
    </svg>
    <svg class="sc-duck-sleep" width="100" height="80" viewBox="0 0 100 75" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="68" rx="36" ry="5" fill="rgba(0,0,0,0.12)"/>
      <ellipse cx="50" cy="52" rx="36" ry="22" fill="#FFD75A"/>
      <ellipse cx="44" cy="46" rx="22" ry="13" fill="#FFE38A" opacity="0.6"/>
      <path d="M18 48 Q30 30 55 28 Q70 30 78 48 Q65 60 50 62 Q30 62 18 48 Z" fill="#F5B400" opacity="0.7"/>
      <circle cx="72" cy="38" r="16" fill="#FFDC6A"/>
      <path d="M64 37 Q68 34 74 37" stroke="#1F1A14" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M80 40 Q88 38 90 42 Q88 46 80 44 Z" fill="#FF8A1F"/>
      <path d="M16 50 Q8 40 12 32 Q18 38 20 50 Z" fill="#E0B040"/>
    </svg>
    <div class="sc-duck-name">Bartholomew II</div>
  `;
  document.body.appendChild(duckEl);

  // toggle pill
  const toggleEl = document.createElement('button');
  toggleEl.className = 'sc-duck-toggle';
  toggleEl.setAttribute('aria-label', 'Toggle duck mascot');
  toggleEl.innerHTML = `<span class="sc-toggle-emoji"><img src="assets/duck-logo.png" alt="" /></span><span class="sc-toggle-text"></span>`;
  document.body.appendChild(toggleEl);

  // ----- State -----
  let mouseX = window.innerWidth * 0.6;
  let mouseY = window.innerHeight * 0.5;
  let duckX = mouseX;
  let duckY = mouseY;
  let lastDx = 0;
  let facingRight = true;
  let isSleeping = false;
  let lastMoveTime = performance.now();
  let footprintAccum = 0;

  const SIDE_SVG = duckEl.querySelector('.sc-duck-side');
  const SLEEP_SVG = duckEl.querySelector('.sc-duck-sleep');
  const NAME_EL = duckEl.querySelector('.sc-duck-name');
  const FOOT_L = duckEl.querySelector('.sc-foot-l');
  const FOOT_R = duckEl.querySelector('.sc-foot-r');
  let waddle = 0;

  // ----- Visibility apply -----
  function applyVisibility() {
    if (duckVisible) {
      duckEl.classList.add('on');
      toggleEl.querySelector('.sc-toggle-text').textContent = 'Hide duck';
      toggleEl.classList.remove('off');
    } else {
      duckEl.classList.remove('on');
      toggleEl.querySelector('.sc-toggle-text').textContent = 'Bring duck';
      toggleEl.classList.add('off');
    }
  }
  toggleEl.addEventListener('click', () => {
    duckVisible = !duckVisible;
    localStorage.setItem(LS_DUCK, duckVisible);
    applyVisibility();
    if (duckVisible) {
      duckX = -120;
      duckY = window.innerHeight - 200;
      lastMoveTime = performance.now();
    }
  });
  applyVisibility();

  // ----- Mouse tracking -----
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    lastMoveTime = performance.now();
    if (isSleeping) wakeUp();
  });
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
      lastMoveTime = performance.now();
      if (isSleeping) wakeUp();
    }
  }, { passive: true });

  function sleep() {
    if (isSleeping) return;
    isSleeping = true;
    SIDE_SVG.style.display = 'none';
    SLEEP_SVG.style.display = 'block';
    NAME_EL.textContent = 'Zzz...';
    spawnZzz();
  }
  function wakeUp() {
    if (!isSleeping) return;
    isSleeping = false;
    SIDE_SVG.style.display = 'block';
    SLEEP_SVG.style.display = 'none';
    NAME_EL.textContent = 'Bartholomew II';
  }
  function spawnZzz() {
    if (!isSleeping || !duckVisible) return;
    const z = document.createElement('div');
    z.className = 'sc-zzz';
    z.textContent = ['Z', 'Zz', 'zz'][Math.floor(Math.random() * 3)];
    z.style.left = (duckX + 30 + Math.random() * 20) + 'px';
    z.style.top = (duckY - 50) + 'px';
    document.body.appendChild(z);
    setTimeout(() => z.remove(), 2400);
    setTimeout(spawnZzz, 1400 + Math.random() * 600);
  }

  // ----- Footprint -----
  function spawnFootprint(x, y, side) {
    const fp = document.createElement('div');
    fp.className = 'sc-footprint';
    const offset = side === 'l' ? -8 : 8;
    fp.style.left = (x + offset) + 'px';
    fp.style.top = (y - 4) + 'px';
    document.body.appendChild(fp);
    setTimeout(() => fp.remove(), 3500);
  }

  // ----- Loop -----
  function loop() {
    requestAnimationFrame(loop);
    if (!duckVisible) return;

    // sleep detection
    if (!isSleeping && performance.now() - lastMoveTime > 7000) sleep();

    // ease toward mouse, but stop a little before
    const targetX = mouseX - 30; // duck stays slightly behind/below
    const targetY = mouseY + 20;
    const dx = targetX - duckX;
    const dy = targetY - duckY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (!isSleeping && dist > 8) {
      duckX += dx * 0.06;
      duckY += dy * 0.06;
      lastDx = dx;

      // facing
      if (dx > 2 && !facingRight) { facingRight = true; SIDE_SVG.style.transform = 'scaleX(1)'; }
      else if (dx < -2 && facingRight) { facingRight = false; SIDE_SVG.style.transform = 'scaleX(-1)'; }

      // waddle
      waddle += Math.min(dist * 0.04, 0.4);
      const s = Math.sin(waddle);
      FOOT_L.setAttribute('transform', `translate(0,${s * 4})`);
      FOOT_R.setAttribute('transform', `translate(0,${-s * 4})`);
      // body bob (cannot overwrite scaleX, so use rotate inline)
      // we use the SVG group rotate via inline transform style - keep scaleX for facing
      // we'll skip body rotate to keep things clean

      // footprints — drop directly under the duck's feet
      footprintAccum += dist * 0.06;
      if (footprintAccum > 14) {
        footprintAccum = 0;
        // alternate left/right foot, drop at duck's actual feet position
        const side = (Math.random() > 0.5) ? 'l' : 'r';
        const footX = duckX + (side === 'l' ? -14 : 12); // account for SVG left: -48px offset
        const footY = duckY - 100 + 95; // feet are near bottom of SVG (100px tall, positioned at bottom: 0)
        spawnFootprint(footX, footY, side);
      }
    } else {
      FOOT_L.setAttribute('transform', '');
      FOOT_R.setAttribute('transform', '');
    }

    duckEl.style.transform = `translate(${duckX}px, ${duckY - 100}px)`;
  }
  loop();

  // ============================================================
  // Footer ducklings — cute, randomized clipart ducks
  // ============================================================
  function buildDucklings() {
    const footers = document.querySelectorAll('.site-footer');
    footers.forEach((footer) => {
      const row = document.createElement('div');
      row.className = 'sc-duckling-row';
      const count = 7;
      for (let i = 0; i < count; i++) {
        const d = document.createElement('span');
        d.className = 'sc-duckling';
        const img = document.createElement('img');
        img.src = 'assets/duck-logo.png';
        img.alt = '';
        d.appendChild(img);
        const size = (22 + Math.random() * 16);
        d.style.width = size + 'px';
        d.style.height = size + 'px';
        d.style.animationDelay = (Math.random() * 2.5) + 's';
        d.style.animationDuration = (2.5 + Math.random() * 1.5) + 's';
        d.style.transform = `rotate(${(Math.random() * 16 - 8)}deg)`;
        row.appendChild(d);
      }
      footer.querySelector('.site-footer__inner')?.appendChild(row);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildDucklings);
  } else {
    buildDucklings();
  }

  // ============================================================
  // Night mode — persisted across pages
  // ============================================================
  function applyNight() {
    const isNight = localStorage.getItem(LS_NIGHT) === 'true';
    document.body.classList.toggle('night', isNight);
    document.querySelectorAll('.night-toggle').forEach(b => {
      b.textContent = isNight ? '☀' : '☾';
      b.setAttribute('aria-label', isNight ? 'Switch to day' : 'Switch to night');
    });
  }
  function bindNight() {
    document.querySelectorAll('.night-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const cur = localStorage.getItem(LS_NIGHT) === 'true';
        localStorage.setItem(LS_NIGHT, !cur);
        applyNight();
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { bindNight(); applyNight(); });
  } else {
    bindNight(); applyNight();
  }

  // ============================================================
  // Mobile menu
  // ============================================================
  function bindMenu() {
    document.querySelectorAll('.menu-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelector('.nav')?.classList.toggle('open');
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bindMenu);
  else bindMenu();

  // ============================================================
  // Tweaks panel
  // ============================================================
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "duck": "#FFCB2E",
    "orange": "#FF8A1F",
    "bolt": "#3BC9E0",
    "ink": "#1F1A14",
    "displayFont": "Fraunces",
    "showCursor": true,
    "duckCursor": false,
    "footprints": true
  }/*EDITMODE-END*/;

  let tweaks = { ...TWEAK_DEFAULTS };

  function applyTweaks() {
    const r = document.documentElement.style;
    r.setProperty('--duck', tweaks.duck);
    r.setProperty('--orange', tweaks.orange);
    r.setProperty('--bolt', tweaks.bolt);
    document.body.classList.toggle('duck-cursor', !!tweaks.duckCursor);
    document.body.classList.toggle('no-footprints', !tweaks.footprints);
    if (tweaks.displayFont) {
      r.setProperty('--display', `'${tweaks.displayFont}', serif`);
    }
  }
  applyTweaks();

  let panel = null;
  function buildPanel() {
    if (panel) return panel;
    panel = document.createElement('div');
    panel.className = 'sc-tweaks';
    panel.innerHTML = `
      <header>
        <strong>Tweaks</strong>
        <button class="sc-tweaks-close" aria-label="Close">×</button>
      </header>
      <div class="sc-tweaks-body">
        <label class="sc-tw-row">
          <span>Duck yellow</span>
          <input type="color" data-key="duck" value="${tweaks.duck}">
        </label>
        <label class="sc-tw-row">
          <span>Orange accent</span>
          <input type="color" data-key="orange" value="${tweaks.orange}">
        </label>
        <label class="sc-tw-row">
          <span>Bolt accent</span>
          <input type="color" data-key="bolt" value="${tweaks.bolt}">
        </label>
        <label class="sc-tw-row">
          <span>Display font</span>
          <select data-key="displayFont">
            <option value="Fraunces">Fraunces</option>
            <option value="Geist">Geist</option>
            <option value="JetBrains Mono">JetBrains Mono</option>
          </select>
        </label>
        <label class="sc-tw-row sc-tw-toggle">
          <span>Duck cursor</span>
          <input type="checkbox" data-key="duckCursor" ${tweaks.duckCursor ? 'checked' : ''}>
        </label>
        <label class="sc-tw-row sc-tw-toggle">
          <span>Footprints</span>
          <input type="checkbox" data-key="footprints" ${tweaks.footprints ? 'checked' : ''}>
        </label>
        <button class="sc-tw-reset">Reset</button>
        <p class="sc-tw-hint">Live changes save to the file.</p>
      </div>
    `;
    document.body.appendChild(panel);
    panel.querySelector('select[data-key="displayFont"]').value = tweaks.displayFont;

    panel.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('input', () => {
        const key = el.dataset.key;
        let val;
        if (el.type === 'checkbox') val = el.checked;
        else val = el.value;
        tweaks[key] = val;
        applyTweaks();
        try {
          window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: val } }, '*');
        } catch {}
      });
    });
    panel.querySelector('.sc-tw-reset').addEventListener('click', () => {
      tweaks = { ...TWEAK_DEFAULTS };
      applyTweaks();
      panel.querySelectorAll('input, select').forEach(el => {
        const k = el.dataset.key;
        if (el.type === 'checkbox') el.checked = tweaks[k];
        else el.value = tweaks[k];
      });
      try {
        window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { ...TWEAK_DEFAULTS } }, '*');
      } catch {}
    });
    panel.querySelector('.sc-tweaks-close').addEventListener('click', deactivate);
    return panel;
  }
  function activate() { buildPanel().classList.add('open'); }
  function deactivate() {
    panel?.classList.remove('open');
    try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch {}
  }
  window.addEventListener('message', (e) => {
    const t = e.data?.type;
    if (t === '__activate_edit_mode') activate();
    else if (t === '__deactivate_edit_mode') deactivate();
  });
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch {}
})();
