import React, { useEffect, useRef } from 'react';

export default function Services({ lang }) {
  const isRTL = lang === 'ar';
  const basketRef = useRef(null);

  // Setup draggable basket toys
  useEffect(() => {
    const basket = basketRef.current;
    if (!basket) return;

    let zTop = 10;
    const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
    const jelly = (el) => {
      if (!el) return;
      el.animate(
        { scale: ['1', '1.22 .8', '.88 1.14', '1.06 .95', '1'] },
        { duration: 600, easing: 'ease-out' }
      );
    };

    const cleanupFns = [];

    basket.querySelectorAll('.item').forEach((it) => {
      let x = 0;
      let y = 0;
      let sx = 0;
      let sy = 0;
      let px = 0;
      let py = 0;
      let lim = [0, 0, 0, 0];

      const onPointerDown = (e) => {
        e.preventDefault();
        it.setPointerCapture(e.pointerId);
        it.classList.add('grab');
        it.style.zIndex = ++zTop;

        const b = basket.getBoundingClientRect();
        const r = it.getBoundingClientRect();
        lim = [
          x - (r.left - b.left),
          x + (b.right - r.right),
          y - (r.top - b.top),
          y + (b.bottom - r.bottom)
        ];
        sx = x;
        sy = y;
        px = e.clientX;
        py = e.clientY;
      };

      const onPointerMove = (e) => {
        if (!it.hasPointerCapture(e.pointerId)) return;
        x = clamp(sx + e.clientX - px, lim[0], lim[1]);
        y = clamp(sy + e.clientY - py, lim[2], lim[3]);
        it.style.translate = `${x}px ${y}px`;
      };

      const onPointerUp = () => {
        if (it.classList.contains('grab')) {
          it.classList.remove('grab');
          jelly(it.firstElementChild);
        }
      };

      it.addEventListener('pointerdown', onPointerDown);
      it.addEventListener('pointermove', onPointerMove);
      it.addEventListener('pointerup', onPointerUp);
      it.addEventListener('pointercancel', onPointerUp);

      cleanupFns.push(() => {
        it.removeEventListener('pointerdown', onPointerDown);
        it.removeEventListener('pointermove', onPointerMove);
        it.removeEventListener('pointerup', onPointerUp);
        it.removeEventListener('pointercancel', onPointerUp);
      });
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return (
    <section className="section" id="services" aria-labelledby="apps-title">
      <div className="wrap apps-grid">
        {/* Left Column: Apps & Creative Tools Kit */}
        <div>
          <h2 className="h2" id="apps-title" data-r>
            {isRTL ? 'أدوات وبرامج التصميم' : 'Apps I design with'}
          </h2>
          <p className="intro" data-r>
            {isRTL
              ? 'مجموعة أدواتي اليومية في سلة واحدة. اسحب أي عنصر والعب بيه!'
              : 'My everyday creative kit, all in one basket. Grab any app and drag it around.'}
          </p>
          <ul className="kit">
            <li data-r>
              <i style={{ '--dot': '#31A8FF' }} />
              <b>Photoshop</b>
              <span>{isRTL ? 'تصاميم السوشيال ميديا، المعالجة الرقمية والموكاب' : 'Social posts, retouching & mockups'}</span>
            </li>
            <li data-r style={{ '--d': '.05s' }}>
              <i style={{ '--dot': '#FF9A00' }} />
              <b>Illustrator</b>
              <span>{isRTL ? 'الشعارات، الأيقونات وأغلفة الكتب' : 'Vector logos, book covers & typography'}</span>
            </li>
            <li data-r style={{ '--d': '.1s' }}>
              <i style={{ '--dot': '#EA580C' }} />
              <b>Premiere Pro</b>
              <span>{isRTL ? 'مونتاج الفيديو، الريلز وتنسيق الإيقاع' : 'Video editing, pacing & reels'}</span>
            </li>
            <li data-r style={{ '--d': '.15s' }}>
              <i style={{ '--dot': '#9333EA' }} />
              <b>After Effects</b>
              <span>{isRTL ? 'الموشن جرافيك والمؤثرات البصرية' : 'Motion graphics & visual animation'}</span>
            </li>
            <li data-r style={{ '--d': '.2s' }}>
              <i style={{ '--dot': '#00C4CC' }} />
              <b>Canva</b>
              <span>{isRTL ? 'قوالب مرنة وسهلة التعديل' : 'Templates clients can edit themselves'}</span>
            </li>
            <li data-r style={{ '--d': '.25s' }}>
              <i style={{ '--dot': '#F43F5E' }} />
              <b>AI Tools</b>
              <span>{isRTL ? 'استكشاف الأفكار وتسريع المسودات' : 'Exploring ideas and speeding up busywork'}</span>
            </li>
          </ul>
        </div>

        {/* Right Column: 3D Draggable Apps Basket */}
        <div className="basket-zone" data-r aria-hidden="true">
          <p className="drag-hint">
            {isRTL ? 'العب بيهم ورميهم ✿' : 'toss them around ✿'}{' '}
            <svg viewBox="0 0 48 40" fill="none" stroke="currentColor">
              {isRTL ? (
                <path d="M44 6c-14 0 -28 8 -34 26M10 32l9-3M10 32l-3-9" strokeWidth="2.5" strokeLinecap="round" />
              ) : (
                <path d="M4 6c14 0 28 8 34 26M38 32l-9-3M38 32l3-9" strokeWidth="2.5" strokeLinecap="round" />
              )}
            </svg>
          </p>
          <div className="basket" id="basket" ref={basketRef}>
            <div className="handle h1" />
            <div className="b-in">
              <div className="wall t" />
              <div className="wall b" />
              <div className="wall l" />
              <div className="wall r" />
              <div className="floor" />
            </div>

            {/* Draggable Item 1: Design Order Receipt */}
            <div className="item" style={{ left: '41%', top: '12%', '--r': '10deg' }}>
              <div className="face receipt" style={{ '--anim': 'idleC', '--dur': '5s', '--dl': '-1s' }}>
                <b>{isRTL ? 'طلب تصميم' : 'Design order'}</b>
                <p>{isRTL ? 'سوشيال ميديا' : 'Social media'} <span>✓</span></p>
                <p>{isRTL ? 'هوية بصرية' : 'Brand identity'} <span>✓</span></p>
                <p>{isRTL ? 'مونتاج فيديو' : 'Video editing'} <span>✓</span></p>
                <p>{isRTL ? 'أغلفة ومطبوعات' : 'Print & covers'} <span>✓</span></p>
                <em>{isRTL ? 'النتيجة: براند متألق ✿' : 'Total: one happy brand ✿'}</em>
                <i />
              </div>
            </div>

            {/* Draggable Item 2: Color Swatch Chip */}
            <div className="item" style={{ left: '60%', top: '46%', '--r': '-8deg' }}>
              <div className="face swatch" style={{ '--dur': '4.4s', '--dl': '-2s' }}>
                <span />
                Candy Pink
                <small>#FF4F9A</small>
              </div>
            </div>

            {/* Draggable Item 3: Canva App */}
            <div className="item" style={{ left: '18%', top: '18%', '--r': '-8deg' }}>
              <div className="face app a-cv" style={{ '--anim': 'idleB', '--dur': '3s', '--dl': '-.4s' }}>
                Canva
              </div>
            </div>

            {/* Draggable Item 4: Photoshop App */}
            <div className="item" style={{ left: '22%', top: '52%', '--r': '-10deg' }}>
              <div className="face app a-ps" style={{ '--dur': '3.4s', '--dl': '-1.3s' }}>
                Ps
              </div>
            </div>

            {/* Draggable Item 5: Illustrator App */}
            <div className="item" style={{ left: '40%', top: '56%', '--r': '7deg' }}>
              <div className="face app a-ai" style={{ '--anim': 'idleB', '--dur': '3.3s', '--dl': '-1.9s' }}>
                Ai
              </div>
            </div>

            {/* Draggable Item 6: After Effects App */}
            <div className="item" style={{ left: '64%', top: '14%', '--r': '9deg' }}>
              <div className="face app a-ae" style={{ '--dur': '3.9s', '--dl': '-.8s' }}>
                Ae
              </div>
            </div>

            {/* Draggable Item 7: AI Tools Spark */}
            <div className="item" style={{ left: '78%', top: '54%', '--r': '-6deg' }}>
              <div className="face app a-gpt" style={{ '--anim': 'idleB', '--dur': '3.6s', '--dl': '-2.6s' }}>
                <svg viewBox="0 0 100 100">
                  <path d="M50 4c5 26 20 41 46 46-26 5-41 20-46 46-5-26-20-41-46-46 26-5 41-20 46-46z" />
                </svg>
              </div>
            </div>

            <div className="handle h2" />
          </div>
        </div>
      </div>
    </section>
  );
}
