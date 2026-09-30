import React, { useEffect, useRef, useMemo } from 'react';

// Mulberry32 PRNG for deterministic astronomical lunar surface features
const mulberry = (a) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Exact reference lunar procedural rendering function from salmaosama.online
function drawMoon(canvas, p) {
  const S = canvas.width,
    R = S / 2,
    rnd = mulberry(7),
    TAU = Math.PI * 2;
  const th = TAU * p,
    Lx = Math.sin(th),
    Lz = -Math.cos(th),
    sgn = Lx >= 0 ? 1 : -1;
  const layer = () => {
    const c = document.createElement('canvas');
    c.width = c.height = S;
    return [c, c.getContext('2d')];
  };
  const disc = (g) => {
    g.beginPath();
    g.arc(R, R, R, 0, TAU);
  };

  // Albedo: shapes are drawn crisp on a scratch layer, then blurred in ONE pass
  const [, x] = layer(),
    [sc, s] = layer();
  x.fillStyle = '#dcd6c8';
  disc(x);
  x.fill();
  x.save();
  disc(x);
  x.clip();

  for (let i = 0; i < 80; i++) {
    const a = rnd() * TAU,
      d = Math.sqrt(rnd()) * R;
    s.fillStyle = `rgba(${rnd() < 0.55 ? '255,252,242' : '160,154,142'},${0.05 + rnd() * 0.08})`;
    s.beginPath();
    s.arc(R + Math.cos(a) * d, R + Math.sin(a) * d, S * (0.03 + rnd() * 0.08), 0, TAU);
    s.fill();
  }
  x.filter = `blur(${S * 0.022}px)`;
  x.drawImage(sc, 0, 0);
  s.clearRect(0, 0, S, S);

  // Maria in their real near-side layout: Procellarum, Imbrium, Serenitatis, Tranquillitatis, Crisium...
  const MARIA = [
    [-0.62, 0, 0.3, 0.5],
    [-0.5, -0.28, 0.22, 0.2],
    [-0.45, 0.25, 0.2, 0.22],
    [-0.28, -0.4, 0.3, 0.24],
    [0.08, -0.32, 0.18, 0.17],
    [0.25, -0.02, 0.24, 0.2],
    [0.62, -0.2, 0.12, 0.11],
    [0.5, 0.22, 0.14, 0.18],
    [0.28, 0.35, 0.1, 0.09],
    [-0.18, 0.38, 0.17, 0.13],
    [-0.48, 0.46, 0.1, 0.09],
    [-0.05, -0.64, 0.35, 0.07],
    [-0.08, -0.1, 0.14, 0.12],
    [-0.28, -0.05, 0.16, 0.12]
  ];
  for (const [mx, my, rx, ry] of MARIA) {
    for (let k = 0; k < 14; k++) {
      s.fillStyle = `rgba(${104 + rnd() * 10},${102 + rnd() * 8},${100 + rnd() * 12},${0.1 + rnd() * 0.07})`;
      s.beginPath();
      s.ellipse(
        R + (mx + (rnd() - 0.5) * rx) * R,
        R + (my + (rnd() - 0.5) * ry) * R,
        rx * R * (0.7 + rnd() * 0.4),
        ry * R * (0.7 + rnd() * 0.4),
        rnd() * Math.PI,
        0,
        TAU
      );
      s.fill();
    }
  }
  x.filter = `blur(${S * 0.016}px)`;
  x.drawImage(sc, 0, 0);
  x.filter = 'none';

  const tyx = R - 0.12 * R,
    tyy = R + 0.66 * R;
  x.lineCap = 'round';
  for (let i = 0; i < 30; i++) {
    const a = rnd() * TAU,
      L = R * (0.3 + rnd() * 0.9);
    x.strokeStyle = `rgba(255,253,245,${0.025 + rnd() * 0.03})`;
    x.lineWidth = S * (0.003 + rnd() * 0.005);
    x.beginPath();
    x.moveTo(tyx, tyy);
    x.lineTo(tyx + Math.cos(a) * L, tyy + Math.sin(a) * L);
    x.stroke();
  }
  for (const [bx, by, br] of [
    [-0.12, 0.66, 0.03],
    [-0.3, -0.1, 0.022],
    [-0.56, -0.12, 0.015],
    [0.1, -0.66, 0.012],
    [-0.62, -0.44, 0.013],
    [0.52, 0.02, 0.01]
  ]) {
    const g = x.createRadialGradient(R + bx * R, R + by * R, 0, R + bx * R, R + by * R, br * S);
    g.addColorStop(0, `rgba(255,254,248,${br > 0.02 ? 0.75 : 0.45})`);
    g.addColorStop(1, 'rgba(255,254,248,0)');
    x.fillStyle = g;
    x.beginPath();
    x.arc(R + bx * R, R + by * R, br * S, 0, TAU);
    x.fill();
  }
  x.restore();

  // Relief: craters as light/shadow around mid-grey; shown strongly only where sunlight grazes
  const [rc, rl] = layer(),
    [, rb] = layer();
  rl.fillStyle = 'rgb(128,128,128)';
  disc(rl);
  rl.fill();
  rl.save();
  disc(rl);
  rl.clip();

  const inMare = (u, v) =>
    MARIA.some(([mx, my, rx, ry]) => ((u - mx) / rx) ** 2 + ((v - my) / ry) ** 2 < 1);

  for (let i = 0; i < 360; i++) {
    const a = rnd() * TAU,
      d = Math.sqrt(rnd()) * 0.97,
      u = Math.cos(a) * d,
      v = Math.sin(a) * d;
    if (inMare(u, v) && rnd() < 0.7) continue;
    const cx = R + u * R,
      cy = R + v * R,
      r = S * (0.004 + Math.pow(rnd(), 3) * 0.03),
      sh = r * 0.35;
    rl.fillStyle = `rgba(0,0,0,${0.35 + rnd() * 0.3})`;
    rl.beginPath();
    rl.arc(cx + sgn * sh * 0.5, cy, r * 0.9, 0, TAU);
    rl.fill();
    rl.fillStyle = `rgba(255,255,255,${0.3 + rnd() * 0.3})`;
    rl.beginPath();
    rl.arc(cx - sgn * sh, cy, r, Math.PI * 0.5, Math.PI * 1.5, sgn < 0);
    rl.fill();
    rl.fillStyle = 'rgba(128,128,128,.6)';
    rl.beginPath();
    rl.arc(cx, cy, r * 0.6, 0, TAU);
    rl.fill();
  }
  rl.restore();
  rb.filter = `blur(${S * 0.0025}px)`;
  rb.drawImage(rc, 0, 0);

  const alb = x.getImageData(0, 0, S, S).data,
    rel = rb.getImageData(0, 0, S, S).data;
  const ctx = canvas.getContext('2d'),
    out = ctx.createImageData(S, S),
    o = out.data,
    EARTH = 0.05,
    PHASE = (1 - Lz) / 2;

  for (let py = 0; py < S; py++) {
    for (let px = 0; px < S; px++) {
      const nx = (px + 0.5 - R) / R,
        ny = (py + 0.5 - R) / R,
        rr = nx * nx + ny * ny;
      if (rr > 1) continue;
      const nz = Math.sqrt(1 - rr),
        mu0 = nx * Lx + nz * Lz;
      const I = mu0 > 0 ? 0.78 * ((2 * mu0) / (mu0 + nz)) + 0.22 * mu0 : 0;
      const graze = 1 - Math.min(1, Math.max(0, mu0)),
        k = 0.05 + 0.1 * graze + 1.3 * graze * graze * PHASE;
      const idx = (py * S + px) * 4,
        relief = 1 + ((rel[idx] - 128) / 128) * k,
        n = (rnd() - 0.5) * 7;
      o[idx] = alb[idx] * relief * (I * 1.07 + EARTH * 0.8) + n;
      o[idx + 1] = alb[idx + 1] * relief * (I * 1.04 + EARTH * 0.9) + n;
      o[idx + 2] = alb[idx + 2] * relief * (I * 0.97 + EARTH * 1.4) + n;
      o[idx + 3] = 255 * Math.min(1, (1 - Math.sqrt(rr)) * R);
    }
  }
  ctx.putImageData(out, 0, 0);
}

export default function SkyAtmosphere({ lang }) {
  const isRTL = lang === 'ar';
  const moonSkyRef = useRef(null);
  const moonCanvasRef = useRef(null);
  const moonTipRef = useRef(null);
  const moonMRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, r: 0, drag: null, raf: 0 });
  const nightValRef = useRef(0);
  const moonSpotRef = useRef({ fx: Math.random(), fy: Math.random() });

  // 14 random twinkles generated once
  const twinkles = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: (2 + Math.random() * 94).toFixed(1),
      y: (4 + Math.random() * 90).toFixed(1),
      z: Math.floor(10 + Math.random() * 12),
      dl: (-(Math.random() * 4)).toFixed(1)
    }));
  }, []);

  // 7 Fluffy dual-layer clouds matching reference
  const clouds = useMemo(
    () => [
      { t: 8, s: 22, dur: 95, dl: -10 },
      { t: 22, s: 14, dur: 130, dl: -70 },
      { t: 38, s: 26, dur: 110, dl: -40 },
      { t: 55, s: 18, dur: 150, dl: -100 },
      { t: 70, s: 30, dur: 120, dl: -20 },
      { t: 86, s: 16, dur: 140, dl: -80 },
      { t: 102, s: 24, dur: 105, dl: -55 }
    ],
    []
  );

  // Sparkle / Fairy dust particle generator
  const spawnMagic = (x, y, count = 1) => {
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'burst';
      s.textContent = ['✦', '★', '♥', '✿'][Math.floor(Math.random() * 4)];
      s.style.position = 'fixed';
      s.style.left = `${x}px`;
      s.style.top = `${y}px`;
      s.style.color = ['#FFE066', '#FF4F9A', '#60A5FA', '#C7D2FE'][Math.floor(Math.random() * 4)];
      s.style.pointerEvents = 'none';
      s.style.zIndex = '9999';
      document.body.appendChild(s);

      const angle = Math.random() * Math.PI * 2;
      const dist = 15 + Math.random() * 35;
      const anim = s.animate(
        [
          { transform: 'translate(0, 0) scale(0.5)', opacity: 1 },
          {
            transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(1.1) rotate(${(Math.random() - 0.5) * 90}deg)`,
            opacity: 0
          }
        ],
        { duration: 600, easing: 'cubic-bezier(.2, .8, .2, 1)' }
      );
      anim.onfinish = () => s.remove();
    }
  };

  useEffect(() => {
    // 1. Generate Starfield using box-shadows (Layer 1: 90 stars, Layer 2: 40 stars)
    const starEls = document.querySelectorAll('.stars i');
    if (starEls[0]) {
      starEls[0].style.boxShadow = Array.from(
        { length: 90 },
        () => `${(Math.random() * 100).toFixed(1)}vw ${(Math.random() * 100).toFixed(1)}vh #fff`
      ).join(',');
    }
    if (starEls[1]) {
      starEls[1].style.boxShadow = Array.from(
        { length: 40 },
        () => `${(Math.random() * 100).toFixed(1)}vw ${(Math.random() * 100).toFixed(1)}vh #fff`
      ).join(',');
    }

    // 2. Responsive Moon Placement
    const placeMoon = () => {
      const ms = moonSkyRef.current;
      if (!ms) return;
      if (window.innerWidth <= 760) {
        ms.style.left = ms.style.top = ms.style.right = '';
        return;
      }
      const S = ms.offsetWidth || 160;
      const W = window.innerWidth;
      const H = window.innerHeight;
      // In RTL, Habiba's character scene is on the left, so moon sits on the left
      // In LTR, character scene is on the right, so moon sits on the right
      const x0 = isRTL ? W * 0.08 : W * 0.45;
      const x1 = isRTL ? W * 0.46 - S : W * 0.90 - S;
      const cy = H * (0.16 + moonSpotRef.current.fy * 0.08);
      ms.style.right = 'auto';
      ms.style.left = `${Math.round(x0 + moonSpotRef.current.fx * Math.max(0, x1 - x0))}px`;
      ms.style.top = `${Math.round(Math.max(8, cy - S / 2))}px`;
    };

    placeMoon();
    window.addEventListener('resize', placeMoon);

    // 3. Scroll-driven diurnal sky phases (Dawn -> Day -> Sunset -> Night)
    let edgeKey = '';
    const skyEl = document.querySelector('.sky');
    const layers = {
      b: document.querySelector('.sky-b'),
      c: document.querySelector('.sky-c'),
      d: document.querySelector('.sky-d')
    };

    const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
    const mixC = (p, q, k) => p.map((v, i) => v + (q[i] - v) * k);

    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const secAbout = document.getElementById('about');
      const secServices = document.getElementById('services') || document.getElementById('apps');
      const secContact = document.getElementById('contact');

      const ramp = (el) => {
        if (!el) return 0;
        return clamp((vh * 0.6 - el.getBoundingClientRect().top) / (vh * 0.7), 0, 1);
      };

      const ob = ramp(secAbout);
      const oc = ramp(secServices);
      const n = secContact
        ? clamp((vh - secContact.getBoundingClientRect().top) / (vh * 0.5), 0, 1)
        : 0;

      if (layers.b) layers.b.style.opacity = ob;
      if (layers.c) layers.c.style.opacity = oc;
      if (layers.d) layers.d.style.opacity = n;

      // Ultra-smooth dynamic edge color blending across 4 phases:
      // Morning Dawn [255, 244, 248] -> Afternoon [255, 234, 243] -> Sunset [255, 231, 166] -> Night [74, 35, 80]
      const edge = mixC(
        mixC(mixC([255, 244, 248], [255, 234, 243], ob), [255, 231, 166], oc),
        [74, 35, 80],
        n
      ).map(Math.round);

      const key = edge.map((v) => v >> 3).join();
      if (key !== edgeKey) {
        edgeKey = key;
        const rgbStr = `rgb(${edge.join(',')})`;
        if (skyEl) skyEl.style.backgroundColor = rgbStr;
        document.body.style.backgroundColor = rgbStr;
      }

      document.documentElement.style.setProperty('--night', n.toFixed(3));
      nightValRef.current = n;

      document.documentElement.style.setProperty(
        '--p',
        (y / Math.max(1, document.documentElement.scrollHeight - vh)).toFixed(3)
      );

      // Tuck navbar away when entering starry night mode (n > 0.55)
      const nav = document.getElementById('nav');
      if (nav) {
        const away = n > 0.55;
        if (away !== nav.classList.contains('away')) {
          nav.classList.toggle('away', away);
        }
      }
    };

    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    const resizeObs = new ResizeObserver(onScroll);
    resizeObs.observe(document.body);
    onScroll();

    // 4. Authentic Procedural Lunar Rendering & Tooltip
    const canvas = moonCanvasRef.current;
    if (canvas) {
      canvas.width = 400;
      canvas.height = 400;

      const SYN = 29.530588853;
      const REF = Date.UTC(2000, 0, 6, 18, 14);
      let age = ((Date.now() - REF) / 864e5) % SYN;
      if (age < 0) age += SYN;
      const p = age / SYN;
      const lit = (1 - Math.cos(2 * Math.PI * p)) / 2;

      const NAMES = [
        [0.03, isRTL ? 'محاق' : 'New moon'],
        [0.22, isRTL ? 'هلال متزايد' : 'Waxing crescent'],
        [0.28, isRTL ? 'تربيع أول' : 'First quarter'],
        [0.47, isRTL ? 'أحدب متزايد' : 'Waxing gibbous'],
        [0.53, isRTL ? 'بدر كامل' : 'Full moon'],
        [0.72, isRTL ? 'أحدب متناقص' : 'Waning gibbous'],
        [0.78, isRTL ? 'تربيع ثانٍ' : 'Last quarter'],
        [0.97, isRTL ? 'هلال متناقص' : 'Waning crescent'],
        [1.01, isRTL ? 'محاق' : 'New moon']
      ];
      const moonPhaseName = NAMES.find((entry) => p < entry[0])[1];

      if (moonTipRef.current) {
        moonTipRef.current.innerHTML = `<b>${isRTL ? 'قمر الليلة:' : "Tonight's moon:"} ${moonPhaseName}</b>${Math.round(lit * 100)}% ${isRTL ? 'مضاء' : 'lit'}, ${isRTL ? 'اليوم' : 'day'} ${Math.floor(age) + 1} ${isRTL ? 'من الشهر القمري' : 'of the cycle'}`;
      }

      if (moonSkyRef.current) {
        moonSkyRef.current.style.setProperty('--lit', Math.max(0.15, lit).toFixed(2));
      }

      // Draw the authentic reference moon
      drawMoon(canvas, p);
    }

    // 5. Interactive Drag Physics & Damped Harmonic Return
    const moonSky = moonSkyRef.current;
    const moonM = moonMRef.current;

    const paintM = () => {
      if (!moonSky) return;
      moonSky.style.setProperty('--mx', `${moonM.x.toFixed(1)}px`);
      moonSky.style.setProperty('--my', `${moonM.y.toFixed(1)}px`);
      moonSky.style.setProperty('--mr', `${moonM.r.toFixed(2)}deg`);
    };

    const springHome = () => {
      cancelAnimationFrame(moonM.raf);
      const step = () => {
        moonM.vx += -moonM.x * 0.06;
        moonM.vy += -moonM.y * 0.06;
        moonM.vx *= 0.86;
        moonM.vy *= 0.86;
        moonM.x += moonM.vx;
        moonM.y += moonM.vy;
        moonM.r += (Math.min(28, Math.max(-28, moonM.vx * 1.4)) - moonM.r) * 0.2;
        paintM();

        if (Math.abs(moonM.x) + Math.abs(moonM.y) + Math.abs(moonM.vx) + Math.abs(moonM.vy) > 0.15) {
          moonM.raf = requestAnimationFrame(step);
        } else {
          moonM.x = 0;
          moonM.y = 0;
          moonM.vx = 0;
          moonM.vy = 0;
          moonM.r = 0;
          paintM();
        }
      };
      moonM.raf = requestAnimationFrame(step);
    };

    const isOverMoon = (e) => {
      if (!moonSky) return false;
      const r = moonSky.getBoundingClientRect();
      return Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) < r.width * 0.5;
    };

    const busy = (el) =>
      el &&
      el.closest &&
      el.closest('a, button, input, textarea, label, [contenteditable="true"], .item, .scene, .mailcard');

    const handlePointerDown = (e) => {
      if (e.pointerType === 'touch' || e.button !== 0 || nightValRef.current <= 0.4 || !isOverMoon(e) || busy(e.target)) return;
      e.preventDefault();
      cancelAnimationFrame(moonM.raf);
      moonM.drag = { px: e.clientX, py: e.clientY, ox: moonM.x, oy: moonM.y };
      moonSky.classList.add('dragging');
      document.documentElement.classList.add('moon-grabbing');
    };

    const handlePointerMove = (e) => {
      if (moonM.drag) {
        const nx = moonM.drag.ox + e.clientX - moonM.drag.px;
        const ny = moonM.drag.oy + e.clientY - moonM.drag.py;
        moonM.vx = nx - moonM.x;
        moonM.vy = ny - moonM.y;
        moonM.x = nx;
        moonM.y = ny;
        moonM.r += (Math.min(30, Math.max(-30, moonM.vx * 1.6)) - moonM.r) * 0.25;
        paintM();

        if (Math.random() < 0.4) {
          spawnMagic(e.clientX, e.clientY, 1);
        }
        return;
      }

      if (moonSky) {
        moonSky.classList.toggle('hover', nightValRef.current > 0.4 && isOverMoon(e));
      }
    };

    const handlePointerUp = (e) => {
      if (!moonM.drag) return;
      moonM.drag = null;
      if (moonSky) moonSky.classList.remove('dragging');
      document.documentElement.classList.remove('moon-grabbing');
      spawnMagic(e.clientX, e.clientY, 8);
      springHome();
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('scroll', scrollListener);
      window.removeEventListener('resize', placeMoon);
      resizeObs.disconnect();
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      cancelAnimationFrame(moonM.raf);
    };
  }, [isRTL]);

  return (
    <>
      {/* Animated Sky Backdrop: 4 diurnal layers + dual stars + clouds + twinkles */}
      <div className="sky" aria-hidden="true">
        <div className="sky-a" />
        <div className="sky-b" />
        <div className="sky-c" />
        <div className="sky-d" />
        <div className="stars">
          <i />
          <i />
        </div>
        <div className="clouds" id="clouds">
          {clouds.map((c, idx) => (
            <div
              key={idx}
              className="cloud"
              style={{
                '--t': `${c.t}%`,
                '--s': `${c.s}vw`,
                '--dur': `${c.dur}s`,
                '--dl': `${c.dl}s`
              }}
            >
              <svg viewBox="0 0 120 60">
                <path
                  d="M22 58a18 18 0 0 1-2-35.8A24 24 0 0 1 64 12a20 20 0 0 1 33 9.5A18.5 18.5 0 0 1 100 58z"
                  fill="#FFD9EA"
                  transform="translate(3 4)"
                />
                <path
                  d="M22 58a18 18 0 0 1-2-35.8A24 24 0 0 1 64 12a20 20 0 0 1 33 9.5A18.5 18.5 0 0 1 100 58z"
                  fill="#fff"
                />
              </svg>
            </div>
          ))}
        </div>
        <div id="twinkles">
          {twinkles.map((t) => (
            <svg
              key={t.id}
              className="tw"
              style={{
                left: `${t.x}%`,
                top: `${t.y}%`,
                '--z': `${t.z}px`,
                '--dl': `${t.dl}s`
              }}
              viewBox="0 0 100 100"
            >
              <path d="M50 4c5 26 20 41 46 46-26 5-41 20-46 46-5-26-20-41-46-46 26-5 41-20 46-46z" />
            </svg>
          ))}
        </div>
      </div>

      {/* Procedural Celestial Moon with Interactive Drag & Tooltip */}
      <div
        ref={moonSkyRef}
        className="moon-sky"
        id="moon-sky"
        role="img"
        aria-label={
          isRTL
            ? 'قمر تفاعلي يمثل الطور الفلكي الحالي'
            : 'Interactive astronomical moon reflecting current lunar phase'
        }
      >
        <canvas ref={moonCanvasRef} width={400} height={400} />
        <span ref={moonTipRef} className="moon-tip" id="moon-tip" />
      </div>
    </>
  );
}
