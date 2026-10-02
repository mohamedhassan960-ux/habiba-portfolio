import React, { useEffect, useRef, useState } from 'react';
import { WHATSAPP_CONFIG } from '../data/portfolioData';

// Pixel art matrix definitions
const HEART_MATRIX = [
  '.kkk.....kkk.',
  'kpppk...kpppk',
  'kplppk.kppppk',
  'kpllppkpppppk',
  'kplpppppppppk',
  '.kpppppppppk.',
  '..kpppppppk..',
  '...kpppppk...',
  '....kpppk....',
  '.....kpk.....',
  '......k......'
];

const FOLDER_MATRIX = [
  '.kkkkk........',
  'kyyyyyk.......',
  'kyyyyyykkkkkk.',
  'kyyyyyyyyyyyyk',
  'kkkkkkkkkkkkkk',
  'kppppppppppppk',
  'kpllpppppppppk',
  'kplppppppppppk',
  'kppppppppppppk',
  'kppppppppppppk',
  'kppppppppppppk',
  'kkkkkkkkkkkkkk'
];

const PIX_COLORS = {
  heart: { k: '#0F172A', p: '#F43F5E', l: '#FECDD3' },
  gheart: { k: '#0F172A', p: '#1D4ED8', l: '#BAE6FD' },
  folder: { k: '#0F172A', y: '#C7D2FE', p: '#1D4ED8', l: '#93C5FD' }
};

function renderPixelSvg(matrix, colors) {
  const width = matrix[0].length;
  const height = matrix.length;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} shapeRendering="crispEdges">
      {matrix.map((row, y) =>
        Array.from(row).map((ch, x) => {
          if (colors[ch]) {
            return <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={colors[ch]} />;
          }
          return null;
        })
      )}
    </svg>
  );
}

export default function Hero({ lang, content }) {
  const isRTL = lang === 'ar';
  const wordRef = useRef(null);
  const winRef = useRef(null);
  const ghostRef = useRef(null);
  const folderRef = useRef(null);
  const bflyRef = useRef(null);
  const heroCatRef = useRef(null);
  const heroCharRef = useRef(null);

  const [isWinMin, setIsWinMin] = useState(false);
  const [isFileFiled, setIsFileFiled] = useState(false);
  const filedAnimRef = useRef(null);

  // Jelly squash and stretch animation
  const jelly = (el) => {
    if (!el) return;
    el.animate(
      { scale: ['1', '1.22 .8', '.88 1.14', '1.06 .95', '1'] },
      { duration: 600, easing: 'ease-out' }
    );
  };

  // Particle bursts
  const burst = (x, y, n = 8, chars = ['♥', '✦', '✿', '♥']) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const colors = ['#1D4ED8', '#F43F5E', '#C7D2FE', '#60A5FA'];
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'burst';
      s.textContent = chars[i % chars.length];
      s.style.left = `${x}px`;
      s.style.top = `${y}px`;
      s.style.color = colors[i % colors.length];
      document.body.appendChild(s);

      const angle = (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
      const distance = 40 + Math.random() * 45;
      const anim = s.animate(
        [
          { transform: 'translate(0,0) scale(.4)', opacity: 1 },
          {
            transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1.1) rotate(${(Math.random() - 0.5) * 180}deg)`,
            opacity: 0
          }
        ],
        { duration: 600 + Math.random() * 300, easing: 'cubic-bezier(.2,.8,.2,1)' }
      );
      anim.onfinish = () => s.remove();
    }
  };

  // Close window -> file into folder
  const handleWinClose = (e) => {
    e.stopPropagation();
    if (isFileFiled || !winRef.current || !folderRef.current || !ghostRef.current) return;

    const win = winRef.current;
    const folder = folderRef.current;
    const ghost = ghostRef.current;
    const a = win.getBoundingClientRect();
    const b = folder.getBoundingClientRect();
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const filed = win.animate(
      [
        { transform: 'translate(0,0) scale(1) rotate(0)', opacity: 1 },
        {
          transform: `translate(${dx * 0.35}px, ${dy * 0.35 - 70}px) scale(.75) rotate(-12deg)`,
          opacity: 1,
          offset: 0.45
        },
        { transform: `translate(${dx}px, ${dy}px) scale(.06) rotate(-30deg)`, opacity: 0.2 }
      ],
      {
        duration: prefersReducedMotion ? 1 : 900,
        easing: 'cubic-bezier(.5,0,.7,.4)',
        fill: 'forwards'
      }
    );

    filedAnimRef.current = filed;
    filed.onfinish = () => {
      win.style.visibility = 'hidden';
      setIsFileFiled(true);
      folder.classList.add('has-file');
      folder.animate({ scale: ['1', '1.35 .8', '.9 1.15', '1'] }, { duration: 500 });
    };

    // Position ghost at exact resting location
    Object.assign(ghost.style, {
      left: `${win.offsetLeft}px`,
      top: `${win.offsetTop}px`,
      width: `${win.offsetWidth}px`,
      height: `${win.offsetHeight}px`
    });

    const g = ghost.getBoundingClientRect();
    const f = folder.getBoundingClientRect();
    ghost.style.setProperty(
      '--a',
      `${(Math.atan2(f.top + f.height / 2 - (g.bottom - 19), f.left + f.width / 2 - (g.right - 29)) * 180) / Math.PI - 5}deg`
    );
    ghost.classList.add('show');
  };

  // Restore filed window
  const handleUnfile = () => {
    if (!filedAnimRef.current || !winRef.current || !ghostRef.current || !folderRef.current) {
      if (folderRef.current) jelly(folderRef.current);
      return;
    }
    const folder = folderRef.current;
    const win = winRef.current;
    const ghost = ghostRef.current;

    folder.classList.remove('has-file');
    win.style.visibility = '';
    ghost.classList.remove('show');

    filedAnimRef.current.reverse();
    filedAnimRef.current.onfinish = () => {
      filedAnimRef.current.cancel();
      filedAnimRef.current = null;
      setIsFileFiled(false);
      jelly(win);
    };
  };

  // Window max wobble
  const handleWinMax = (e) => {
    e.stopPropagation();
    if (!winRef.current) return;
    winRef.current.animate(
      {
        scale: ['1', '1.18', '.94', '1.05', '1'],
        rotate: ['0deg', '-4deg', '3deg', '-1deg', '0deg']
      },
      { duration: 700, easing: 'ease-out' }
    );
  };

  // Cat click
  const handleCatClick = (e) => {
    e.stopPropagation();
    if (heroCatRef.current) {
      const catSvg = heroCatRef.current.querySelector('.cat');
      jelly(catSvg);
      burst(e.clientX, e.clientY, 7);
    }
  };

  // Eye and cat tracking + Butterfly flight path
  useEffect(() => {
    let mx = null;
    let my = null;
    let lastMove = 0;
    let animId = null;

    const onPointerMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      lastMove = performance.now();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // Touch letter squash
    const onTouchMove = (e) => {
      const t = e.touches[0];
      const target = document.elementFromPoint(t.clientX, t.clientY)?.closest('.word .l');
      if (target) jelly(target);
    };
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // Eye lookers
    const eyes = [];
    if (heroCharRef.current) {
      heroCharRef.current.querySelectorAll('.eye').forEach((eye) => {
        const iris = eye.firstElementChild;
        if (iris) {
          eyes.push({
            el: eye,
            set: (x, y) => {
              iris.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
            }
          });
        }
      });
    }

    let catPupils = null;
    if (heroCatRef.current) {
      catPupils = heroCatRef.current.querySelector('.pupils');
    }

    // Butterfly physics
    const bf = bflyRef.current;
    const wordEl = wordRef.current;
    let bt = Math.random() * 50;
    let bx = 0;
    let by = 0;
    let bank = 0;

    // Blinking timers
    let blinkTimers = [];
    const scheduleBlink = (el, isCat = false) => {
      const tId = setTimeout(() => {
        if (!el) return;
        el.classList.add('blink');
        setTimeout(() => el.classList.remove('blink'), isCat ? 200 : 130);
        if (Math.random() < 0.25) {
          setTimeout(() => {
            el.classList.add('blink');
            setTimeout(() => el.classList.remove('blink'), 120);
          }, 280);
        }
        scheduleBlink(el, isCat);
      }, 2200 + Math.random() * 3400);
      blinkTimers.push(tId);
    };

    if (heroCharRef.current) scheduleBlink(heroCharRef.current, false);
    if (heroCatRef.current) scheduleBlink(heroCatRef.current.querySelector('.cat') || heroCatRef.current, true);

    // Idle love state (cat and character gaze at each other)
    let love = false;
    let nuzzleTimers = [];
    const setLove = (on) => {
      love = on;
      if (wordRef.current) wordRef.current.classList.toggle('idle-love', on);
      nuzzleTimers.forEach(clearTimeout);
      nuzzleTimers = [];
      const charEl = heroCharRef.current;
      const catEl = heroCatRef.current?.querySelector('.cat') || heroCatRef.current;
      if (charEl) charEl.classList.remove('slow');
      if (catEl) catEl.classList.remove('slow');
      if (!on) return;

      nuzzleTimers.push(setTimeout(() => {
        if (charEl) charEl.classList.add('blink', 'slow');
        if (catEl) catEl.classList.add('blink', 'slow');
      }, 1000));

      nuzzleTimers.push(setTimeout(() => {
        if (charEl) charEl.classList.remove('blink', 'slow');
        if (catEl) catEl.classList.remove('blink', 'slow');
      }, 1650));

      nuzzleTimers.push(setTimeout(() => {
        if (charEl && catEl) {
          const a = charEl.getBoundingClientRect();
          const b = catEl.getBoundingClientRect();
          burst((a.right + b.left) / 2, Math.min(a.top + a.height * 0.35, b.top), 5, ['♥', '♡', '♥']);
          jelly(catEl);
        }
      }, 1900));
    };

    let isHeroVisible = true;
    const heroSection = wordRef.current?.closest('.hero') || wordRef.current;
    const heroObserver = new IntersectionObserver(
      (entries) => {
        const nextVisible = entries[0].isIntersecting;
        if (nextVisible !== isHeroVisible) {
          isHeroVisible = nextVisible;
          if (isHeroVisible && !animId) {
            animId = requestAnimationFrame(loop);
          }
        }
      },
      { rootMargin: '200px 0px' }
    );
    if (heroSection) heroObserver.observe(heroSection);

    const loop = (t) => {
      if (!isHeroVisible) {
        animId = null;
        return;
      }

      const idle = mx === null || (performance.now() - lastMove > 3500);
      if (idle !== love) setLove(idle);

      const charEl = heroCharRef.current;
      const catEl = heroCatRef.current?.querySelector('.cat') || heroCatRef.current;

      // 1. Eyes tracking
      if (love && charEl && catEl) {
        // Look at each other
        const a = charEl.getBoundingClientRect();
        const b = catEl.getBoundingClientRect();
        const dx = b.left + b.width / 2 - (a.left + a.width / 2);
        const dy = b.top + b.height * 0.35 - (a.top + a.height * 0.35);
        const angle = Math.atan2(dy, dx);
        eyes.forEach(({ set }) => set(Math.cos(angle) * 3.5, Math.sin(angle) * 3.5));

        if (catPupils) {
          const cdx = (a.left + a.width / 2) - (b.left + b.width / 2);
          const cdy = (a.top + a.height * 0.35) - (b.top + b.height * 0.35);
          const cangle = Math.atan2(cdy, cdx);
          catPupils.setAttribute(
            'transform',
            `translate(${(Math.cos(cangle) * 2.5).toFixed(2)} ${(Math.sin(cangle) * 2.5).toFixed(2)})`
          );
        }
      } else if (mx !== null) {
        // Track pointer
        eyes.forEach(({ el, set }) => {
          const r = el.getBoundingClientRect();
          const dx = mx - (r.left + r.width / 2);
          const dy = my - (r.top + r.height / 2);
          const dist = Math.hypot(dx, dy);
          const maxShift = 4;
          const shift = Math.min(maxShift, dist * 0.04);
          const angle = Math.atan2(dy, dx);
          set(Math.cos(angle) * shift, Math.sin(angle) * shift);
        });

        if (catPupils) {
          const r = catPupils.getBoundingClientRect();
          const dx = mx - (r.left + r.width / 2);
          const dy = my - (r.top + r.height / 2);
          const dist = Math.hypot(dx, dy);
          const maxShift = 2.6;
          const shift = Math.min(maxShift, dist * 0.03);
          const angle = Math.atan2(dy, dx);
          catPupils.setAttribute(
            'transform',
            `translate(${(Math.cos(angle) * shift).toFixed(2)} ${(Math.sin(angle) * shift).toFixed(2)})`
          );
        }
      }

      // 2. Butterfly flight
      if (bf && wordEl) {
        const W = wordEl.clientWidth;
        const H = wordEl.clientHeight;
        const s = bf.offsetWidth || 40;
        let speed = 0.0045;

        if (mx !== null) {
          const r = bf.getBoundingClientRect();
          const d = Math.hypot(mx - (r.left + s / 2), my - (r.top + s / 2));
          if (d < 90) speed = 0.014;
        }

        bt += speed;
        const x = W * 0.5 + W * 0.47 * Math.sin(bt) + W * 0.03 * Math.sin(bt * 5.3);
        const y = H * 0.46 + H * 0.4 * Math.sin(bt * 1.63 + 1) + H * 0.03 * Math.sin(bt * 7.1);
        const vx = x - bx;
        bx = x;
        by = y;

        const clampedVx = Math.min(28, Math.max(-28, vx * 7));
        bank += (clampedVx - bank) * 0.08;
        bf.style.transform = `translate(${(x - s / 2).toFixed(1)}px, ${(y - s / 2).toFixed(1)}px) rotate(${bank.toFixed(1)}deg)`;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      heroObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      blinkTimers.forEach(clearTimeout);
      nuzzleTimers.forEach(clearTimeout);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <header className="hero" id="top">
      <div className="wrap">
        <h1 className="sr-only">
          {content.name} · {content.eyebrow}
        </h1>

        {/* The Central Display Canvas */}
        <div className="word" id="word" ref={wordRef} dir="ltr">
          {/* Marquee Selection Box */}
          <div className="sel" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <span>habiba_portfolio_final_v2.psd</span>
          </div>

          {/* First Line: "Port" with cursive "P" */}
          <div className="w-line" aria-hidden="true">
            <span
              className="P"
              onPointerEnter={(e) => jelly(e.currentTarget)}
            >
              P
            </span>
            <span
              className="l"
              style={{ '--i': 1 }}
              onPointerEnter={(e) => jelly(e.currentTarget)}
            >
              o
            </span>
            <span
              className="l"
              style={{ '--i': 2 }}
              onPointerEnter={(e) => jelly(e.currentTarget)}
            >
              r
            </span>
            <span
              className="l"
              style={{ '--i': 3 }}
              onPointerEnter={(e) => jelly(e.currentTarget)}
            >
              t
            </span>
          </div>

          {/* Second Line: "folio" with Character Sticker & Cat Sticker */}
          <div className="w-line w-line2" aria-hidden="true">
            <span
              className="l"
              style={{ '--i': 4 }}
              onPointerEnter={(e) => jelly(e.currentTarget)}
            >
              f
            </span>

            {/* Character Sticker inside "o" */}
            <span className="w-o">
              <span className="tip">{isRTL ? 'أنا هنا ✿' : "that's me ✿"}</span>
              <span className="char" ref={heroCharRef} data-char="">
                <img
                  src={content.portrait || "/images/habiba-sticker.png"}
                  alt="Habiba Yasser"
                  width="820"
                  height="982"
                  decoding="async"
                  draggable="false"
                />
              </span>
            </span>

            <span
              className="l"
              style={{ '--i': 6 }}
              onPointerEnter={(e) => jelly(e.currentTarget)}
            >
              l
            </span>
            <span
              className="l"
              style={{ '--i': 7 }}
              onPointerEnter={(e) => jelly(e.currentTarget)}
            >
              i
            </span>
            <span
              className="l"
              style={{ '--i': 8 }}
              onPointerEnter={(e) => jelly(e.currentTarget)}
            >
              o
              {/* Cute Cat Sticker sitting on "o" */}
              <span
                className="hero-cat"
                id="hero-cat"
                ref={heroCatRef}
                onClick={handleCatClick}
              >
                <span className="meow">{isRTL ? 'مياو ✿' : 'meow ✿'}</span>
                <span className="cat">
                  <svg viewBox="0 0 100 112">
                    <g stroke="#0F172A" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">
                      <g className="ctail">
                        <path d="M68 100c15 3 26-5 24-18-1-8-8-11-12-7" fill="none" strokeWidth="15" />
                        <path d="M68 100c15 3 26-5 24-18-1-8-8-11-12-7" fill="none" stroke="#C7D2FE" strokeWidth="9.5" />
                      </g>
                      <path d="M28 104c-4-22 4-44 22-46 18 2 26 24 22 46z" fill="#C7D2FE" />
                      <path d="M39 68c3 5 7 8 11 8s8-3 11-8c2 10-3 22-11 24-8-2-13-14-11-24z" fill="#F8FAFC" stroke="none" />
                      <path d="M31 83c4 0 6 2 7 4M30.5 93c4 0 6 2 7 4M69 83c-4 0-6 2-7 4M69.5 93c-4 0-6 2-7 4" fill="none" stroke="#64748B" strokeWidth="2.4" />
                      <ellipse cx="41" cy="104" rx="7.5" ry="5" fill="#F8FAFC" />
                      <ellipse cx="59" cy="104" rx="7.5" ry="5" fill="#F8FAFC" />
                      <path d="M25 33 28 8 45 21z" fill="#C7D2FE" />
                      <path d="M75 33 72 8 55 21z" fill="#C7D2FE" />
                      <path d="M29.5 27 31 15 40 22z" fill="#F43F5E" stroke="none" />
                      <path d="M70.5 27 69 15 60 22z" fill="#F43F5E" stroke="none" />
                      <path d="M50 15c16 0 28 9 29 22 3 1 5 4 3 7-1 3-4 3-5 3-4 8-14 13-27 13S27 55 23 47c-1 0-4 0-5-3-2-3 0-6 3-7 1-13 13-22 29-22z" fill="#C7D2FE" />
                      <path d="M44 19v7M50 17v8M56 19v7" fill="none" stroke="#64748B" strokeWidth="2.4" />
                      <ellipse cx="50" cy="47" rx="10" ry="7" fill="#F8FAFC" stroke="none" />
                      <circle cx="39" cy="37" r="6.8" fill="#FBBF24" />
                      <circle cx="61" cy="37" r="6.8" fill="#FBBF24" />
                      <g className="pupils" stroke="none">
                        <ellipse cx="39" cy="37" rx="3.1" ry="4.2" fill="#0F172A" />
                        <ellipse cx="61" cy="37" rx="3.1" ry="4.2" fill="#0F172A" />
                        <circle cx="40.6" cy="35" r="1.5" fill="#fff" />
                        <circle cx="62.6" cy="35" r="1.5" fill="#fff" />
                      </g>
                      <g className="lids" fill="#C7D2FE" stroke="none">
                        <circle cx="39" cy="37" r="7.6" />
                        <circle cx="61" cy="37" r="7.6" />
                      </g>
                      <path d="M47.5 43.5h5l-2.5 3z" fill="#F43F5E" strokeWidth="1.6" />
                      <path d="M50 46.5c0 3-2 4-4 3M50 46.5c0 3 2 4 4 3" fill="none" strokeWidth="1.8" />
                      <ellipse cx="31" cy="46" rx="4" ry="2.4" fill="#F43F5E" stroke="none" opacity=".85" />
                      <ellipse cx="69" cy="46" rx="4" ry="2.4" fill="#F43F5E" stroke="none" opacity=".85" />
                      <path d="M21 43l-11-2M21 47l-11 1M79 43l11-2M79 47l11 1" fill="none" strokeWidth="1.4" />
                    </g>
                  </svg>
                </span>
              </span>
            </span>
          </div>

          {/* Floating Retro Window habiba.txt */}
          <div
            className={`namewin win ${isWinMin ? 'is-min' : ''}`}
            id="namewin"
            ref={winRef}
            aria-hidden="true"
          >
            <div className="win-bar">
              <span className="dots">
                <button
                  type="button"
                  tabIndex={-1}
                  data-win="close"
                  title={isRTL ? 'إغلاق وحفظ بالمجلد' : 'Close and file into folder'}
                  onClick={handleWinClose}
                >
                  ×
                </button>
                <button
                  type="button"
                  tabIndex={-1}
                  data-win="min"
                  title={isRTL ? 'تصغير' : 'Minimize'}
                  onClick={() => setIsWinMin(!isWinMin)}
                >
                  –
                </button>
                <button
                  type="button"
                  tabIndex={-1}
                  data-win="max"
                  title={isRTL ? 'تكبير' : 'Zoom'}
                  onClick={handleWinMax}
                >
                  +
                </button>
              </span>
              habiba.txt
            </div>
            <div
              className="nw-body clicky cursor-pointer"
              onClick={(e) => {
                jelly(winRef.current);
                burst(e.clientX, e.clientY);
              }}
            >
              <div>
                <div>
                  <strong>{content.name}</strong>
                  <small>{content.eyebrow}</small>
                </div>
              </div>
            </div>
          </div>

          {/* Ghost outline button when habiba.txt is filed */}
          <button
            type="button"
            className="nw-ghost cursor-pointer"
            id="nw-ghost"
            ref={ghostRef}
            tabIndex={-1}
            aria-hidden="true"
            title={isRTL ? 'استعادة habiba.txt' : 'Bring habiba.txt back'}
            onClick={handleUnfile}
          >
            <svg className="ants">
              <rect width="100%" height="100%" rx="18" />
            </svg>
            <span className="ng-tag">
              <svg viewBox="0 0 16 16">
                <path d="M2 8s2.3-4.5 6-4.5S14 8 14 8s-2.3 4.5-6 4.5S2 8 2 8z" />
                <circle cx="8" cy="8" r="1.8" />
                <path d="M3 13 13 3" />
              </svg>
              habiba.txt
            </span>
            <b>{isRTL ? 'راجعة قريباً ✿' : 'brb ✿'}</b>
            <small>
              {isRTL
                ? 'المفكرة محفوظة بالمجلد، اضغط لإعادتها'
                : 'tucked into the folder, tap to bring it back'}
            </small>
            <svg className="ng-arrow" viewBox="0 0 40 16">
              <path d="M3 8h30M27 3l6 5-6 5" />
            </svg>
          </button>

          {/* Floating Designer Cursor */}
          <div className="fcursor" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M3 2l7 19 2.5-7.5L20 11z" />
            </svg>
            <b>{isRTL ? 'حبيبة' : 'Habiba'}</b>
          </div>

          {/* 3D Flapping Butterfly */}
          <span className="bfly" id="bfly" ref={bflyRef} aria-hidden="true">
            <span className="bf-tilt">
              <span className="bf-wing l">
                <svg viewBox="0 0 30 50">
                  <g stroke="#0F172A" strokeWidth="2.2" strokeLinejoin="round">
                    <path d="M30 24C21 6 7 4 5 14c-2 9 10 14 25 12z" fill="#60A5FA" />
                    <path d="M30 27C19 28 9 34 13 42c4 7 14 2 17-12z" fill="#C7D2FE" />
                    <circle cx="13" cy="14" r="2.6" fill="#fff" stroke="none" />
                  </g>
                </svg>
              </span>
              <span className="bf-wing r">
                <svg viewBox="30 0 30 50">
                  <g stroke="#0F172A" strokeWidth="2.2" strokeLinejoin="round">
                    <path d="M30 24C39 6 53 4 55 14c2 9-10 14-25 12z" fill="#60A5FA" />
                    <path d="M30 27c11 1 21 7 17 15-4 7-14 2-17-12z" fill="#C7D2FE" />
                    <circle cx="47" cy="14" r="2.6" fill="#fff" stroke="none" />
                  </g>
                </svg>
              </span>
              <span className="bf-body">
                <svg viewBox="0 0 20 50">
                  <g stroke="#0F172A" strokeLinecap="round" fill="none">
                    <path d="M10 13v29" strokeWidth="4.6" />
                    <path d="M10 13C9 8 6 5 3 4M10 13c1-5 4-8 7-9" strokeWidth="1.6" />
                  </g>
                </svg>
              </span>
            </span>
          </span>

          {/* Interactive Pixel Hearts */}
          <span
            className="hearts"
            id="hearts"
            data-depth="16"
            aria-hidden="true"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              burst(r.left + r.width / 2, r.top, 6, ['♥', '♥', '✦']);
            }}
          >
            <span className="pix hp" style={{ width: '22px' }}>
              {renderPixelSvg(HEART_MATRIX, PIX_COLORS.heart)}
            </span>
            <span className="pix hg" style={{ width: '22px', marginLeft: '4px' }}>
              {renderPixelSvg(HEART_MATRIX, PIX_COLORS.gheart)}
            </span>
            <span className="kiss">♥</span>
          </span>

          {/* Desktop Pixel Folder */}
          <span
            className="pix clicky cursor-pointer"
            id="pix-folder"
            ref={folderRef}
            data-depth="-14"
            aria-hidden="true"
            title={isRTL ? 'افتح المجلد' : 'Open the folder'}
            style={{
              right: isRTL ? 'auto' : '.55em',
              left: isRTL ? '.55em' : 'auto',
              bottom: '-.08em',
              width: '.4em',
              '--dl': '1.7s'
            }}
            onClick={handleUnfile}
          >
            {renderPixelSvg(FOLDER_MATRIX, PIX_COLORS.folder)}
          </span>
        </div>

        {/* Hero Footer Information */}
        <div className="hero-foot">
          <div className="hero-role" data-r>
            <span>{content.title || (isRTL ? 'مصممة جرافيك ومونتيرة من القاهرة، مصر.' : 'Graphic designer & video editor based in Cairo, Egypt.')}</span>
            <span>{content.description}</span>
          </div>
          <div className="hero-cta" data-r style={{ '--d': '.1s' }}>
            <a className="btn btn-candy" href="#work">
              {content.ctaSecondary || (isRTL ? 'استعراض الأعمال' : 'See my work')}
            </a>
            <a className="btn" href="#contact">
              {content.ctaPrimary || (isRTL ? 'تواصل معي' : 'Say hi')}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
