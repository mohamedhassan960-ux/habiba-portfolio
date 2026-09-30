import React, { useEffect, useRef, useState } from 'react';

const FILLS = ['#1D4ED8', '#F43F5E', '#C7D2FE', '#60A5FA', '#93C5FD', '#FCE7F3'];

export default function PenLine({ lang }) {
  const isRTL = lang === 'ar';
  const containerRef = useRef(null);
  const psvgRef = useRef(null);
  const pArtRef = useRef(null);
  const pSelRef = useRef(null);
  const pAncRef = useRef(null);
  const pCurRef = useRef(null);
  const drawSvgRef = useRef(null);
  const drawShapesRef = useRef(null);
  const drawTextRef = useRef(null);
  const rubberRef = useRef(null);
  const dselRef = useRef(null);
  const hintRef = useRef(null);

  const [activeTool, setActiveTool] = useState('pen');
  const [toolsOpen, setToolsOpen] = useState(false);
  const [isDrawingPen, setIsDrawingPen] = useState(false);
  const toolRef = useRef('pen');
  const fillIndexRef = useRef(0);
  const histRef = useRef([]);
  const actRef = useRef(null);
  const penDraftRef = useRef(null);
  const selTimerRef = useRef(null);
  const drawnAtRef = useRef(null);

  useEffect(() => {
    toolRef.current = activeTool;
  }, [activeTool]);

  // 1. Build and animate the Bézier curve background
  useEffect(() => {
    const pl = containerRef.current;
    const psvg = psvgRef.current;
    const pArt = pArtRef.current;
    const pSel = pSelRef.current;
    const pAnc = pAncRef.current;
    const pCur = pCurRef.current;
    if (!pl || !psvg || !pArt || !pSel || !pAnc || !pCur) return;

    let penData = null;
    let penProgress = 0;
    let idleK = 0;
    let idleT = 0;
    let cX = 0;
    let cY = 0;
    let isIntersecting = false;
    let animId = null;

    const buildPen = () => {
      const w = pl.clientWidth;
      const h = pl.clientHeight;
      const b = h * 0.6;
      const L = Math.min(w * 0.1, 150);
      const rad = (d) => (d * Math.PI) / 180;

      psvg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      const A = [
        [-40, b, 0],
        [w * 0.22, b - h * 0.3, -8],
        [w * 0.48, b + h * 0.08, 6],
        [w * 0.74, b - h * 0.24, -5],
        [w + 40, b - h * 0.02, 0]
      ];

      const hin = (a) => [a[0] - L * Math.cos(rad(a[2])), a[1] - L * Math.sin(rad(a[2]))];
      const hout = (a) => [a[0] + L * Math.cos(rad(a[2])), a[1] + L * Math.sin(rad(a[2]))];

      let d = `M${A[0][0]} ${A[0][1]}`;
      for (let i = 1; i < A.length; i++) {
        const o = hout(A[i - 1]);
        const n = hin(A[i]);
        d += ` C${o[0].toFixed(1)} ${o[1].toFixed(1)} ${n[0].toFixed(1)} ${n[1].toFixed(1)} ${A[i][0].toFixed(1)} ${A[i][1].toFixed(1)}`;
      }

      pArt.setAttribute('d', d);
      pArt.setAttribute('fill', 'none');
      pArt.setAttribute('stroke', '#FF4F9A');
      pArt.setAttribute('stroke-width', '5');
      pArt.setAttribute('stroke-linecap', 'round');

      pSel.setAttribute('d', d);
      pSel.setAttribute('fill', 'none');
      pSel.setAttribute('stroke', '#7B7FF6');
      pSel.setAttribute('stroke-width', '1.4');

      const len = pSel.getTotalLength();
      const samples = Array.from({ length: 161 }, (_, i) => {
        const l = (len * i) / 160;
        const p = pSel.getPointAtLength(l);
        return [l, p.x, p.y];
      });

      const anchors = A.slice(1, 4).map((a) => {
        let best = samples[0];
        let bd = Infinity;
        for (const s of samples) {
          const dd = (s[1] - a[0]) ** 2 + (s[2] - a[1]) ** 2;
          if (dd < bd) {
            bd = dd;
            best = s;
          }
        }
        return { x: a[0], y: a[1], l: best[0], i: hin(a), o: hout(a) };
      });

      pAnc.innerHTML = anchors
        .map(
          (a) =>
            `<g class="anc"><g class="hdl"><line x1="${a.i[0].toFixed(1)}" y1="${a.i[1].toFixed(1)}" x2="${a.o[0].toFixed(1)}" y2="${a.o[1].toFixed(1)}"/><circle cx="${a.i[0].toFixed(1)}" cy="${a.i[1].toFixed(1)}" r="4.5"/><circle cx="${a.o[0].toFixed(1)}" cy="${a.o[1].toFixed(1)}" r="4.5"/></g><rect x="${(a.x - 6).toFixed(1)}" y="${(a.y - 6).toFixed(1)}" width="12" height="12"/></g>`
        )
        .join('');

      pArt.style.strokeDasharray = `${len}`;
      pSel.style.strokeDasharray = `${len}`;
      penData = { len, anchors, groups: [...pAnc.children] };
    };

    const observer = new IntersectionObserver(
      (entries) => {
        isIntersecting = entries[0].isIntersecting;
      },
      { rootMargin: '100px' }
    );
    observer.observe(pl);

    buildPen();
    window.addEventListener('resize', buildPen);

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    const onScroll = () => {
      // Auto-erase drawings when scrolling away
      if (drawnAtRef.current !== null && Math.abs(window.scrollY - drawnAtRef.current) > 100) {
        eraseDrawings();
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const penTick = (t) => {
      if (penData && isIntersecting) {
        const r = pl.getBoundingClientRect();
        const vh = window.innerHeight;
        const target = clamp((vh * 0.95 - r.top) / (vh * 0.55), 0, 1);
        penProgress += (target - penProgress) * 0.08;
        if (Math.abs(target - penProgress) < 0.0005) penProgress = target;

        const drawn = penData.len * penProgress;
        const head = pSel.getPointAtLength(drawn);
        pArt.style.strokeDashoffset = (penData.len - drawn).toFixed(1);
        pSel.style.strokeDashoffset = (penData.len - drawn).toFixed(1);

        let active = -1;
        let tx = head.x;
        let ty = head.y;
        let k = 0.5;

        penData.anchors.forEach((a, i) => {
          if (drawn >= a.l) active = i;
        });

        if (penProgress > 0.995) {
          if (t > idleT) {
            idleK = (idleK + 1) % penData.anchors.length;
            idleT = t + 2400;
          }
          active = idleK;
          tx = penData.anchors[idleK].x;
          ty = penData.anchors[idleK].y;
          k = 0.06;
        }

        cX += (tx - cX) * k;
        cY += (ty - cY) * k;
        pCur.style.transform = `translate(${cX.toFixed(1)}px, ${cY.toFixed(1)}px)`;
        pCur.classList.toggle('show', penProgress > 0.01 && drawnAtRef.current === null && !actRef.current && !penDraftRef.current);

        penData.groups.forEach((g, i) => {
          g.classList.toggle('on', drawn >= penData.anchors[i].l);
          g.classList.toggle('sel', i === active);
        });
      }
      animId = requestAnimationFrame(penTick);
    };
    animId = requestAnimationFrame(penTick);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', buildPen);
      window.removeEventListener('scroll', onScroll);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  // 2. Full-featured Vector Drawing System
  const nextFill = () => {
    return FILLS[fillIndexRef.current++ % FILLS.length];
  };

  const getCoordinates = (e) => {
    const r = drawSvgRef.current.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };

  const popIn = (el) => {
    el.animate(
      [
        { transform: 'scale(0.8)', opacity: 0 },
        { transform: 'scale(1)', opacity: 1 }
      ],
      { duration: 250, easing: 'cubic-bezier(.2, 1.5, .4, 1)' }
    );
  };

  const showSel = (x, y, w, h) => {
    if (!dselRef.current) return;
    clearTimeout(selTimerRef.current);
    dselRef.current.setAttribute('opacity', '1');
    const [box, ...hs] = dselRef.current.children;
    box.setAttribute('x', x);
    box.setAttribute('y', y);
    box.setAttribute('width', w);
    box.setAttribute('height', h);

    const pts = [
      [0, 0], [0.5, 0], [1, 0], [1, 0.5],
      [1, 1], [0.5, 1], [0, 1], [0, 0.5]
    ];
    pts.forEach(([u, v], i) => {
      if (hs[i]) {
        hs[i].setAttribute('x', x + w * u - 4);
        hs[i].setAttribute('y', y + h * v - 4);
        hs[i].setAttribute('width', 8);
        hs[i].setAttribute('height', 8);
      }
    });
  };

  const flashSel = (el) => {
    if (!el || !el.getBBox) return;
    try {
      const b = el.getBBox();
      const tx = +(el.dataset.tx || 0);
      const ty = +(el.dataset.ty || 0);
      showSel(b.x + tx - 3, b.y + ty - 3, b.width + 6, b.height + 6);
      selTimerRef.current = setTimeout(() => {
        if (dselRef.current) dselRef.current.setAttribute('opacity', '0');
      }, 900);
    } catch {}
  };

  const touched = () => {
    drawnAtRef.current = window.scrollY;
    if (hintRef.current) {
      hintRef.current.textContent = isRTL ? 'مرر للأسفل للمسح التلقائي ✿' : 'scroll down to erase ✿';
    }
  };

  const eraseEl = (el) => {
    if (!el || el.dataset.erasing) return;
    el.dataset.erasing = 'true';
    el.style.pointerEvents = 'none';
    let removed = false;
    const done = () => {
      if (!removed && el.parentNode) {
        removed = true;
        el.remove();
      }
    };
    try {
      const anim = el.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(0.3)' }
        ],
        { duration: 180, fill: 'forwards' }
      );
      anim.onfinish = done;
      if (anim.finished) anim.finished.then(done).catch(done);
    } catch {
      done();
    }
    setTimeout(done, 220);
  };

  const eraseDrawings = () => {
    drawnAtRef.current = null;
    finishPen();
    if (dselRef.current) dselRef.current.setAttribute('opacity', '0');
    histRef.current = [];
    const shapes = drawShapesRef.current?.children || [];
    const texts = drawTextRef.current?.children || [];
    [...shapes, ...texts].forEach((el, i) => {
      el.animate(
        [
          { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' },
          { opacity: 0, transform: 'scale(0.3) rotate(-20deg)', filter: 'blur(6px)' }
        ],
        { duration: 400, delay: i * 35, fill: 'forwards' }
      ).onfinish = () => el.remove();
    });
    if (hintRef.current) {
      hintRef.current.textContent = isRTL ? 'جرّب الرسم: اختر أداة وارسم ✿' : 'try me: pick a tool and draw ✿';
    }
  };

  const undo = () => {
    const act = histRef.current.pop();
    if (!act) return false;
    if (act.type === 'add' && act.el?.parentNode) {
      act.el.remove();
    } else if (act.type === 'move' && act.el) {
      act.el.dataset.tx = act.tx;
      act.el.dataset.ty = act.ty;
      act.el.setAttribute('transform', `translate(${act.tx} ${act.ty})`);
      flashSel(act.el);
    }
    return true;
  };

  // Pen tool vector path construction
  const addPenPoint = (x, y) => {
    touched();
    const dshapes = drawShapesRef.current;
    const dsvg = drawSvgRef.current;
    if (!penDraftRef.current) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('class', 'shape');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', '#1D4ED8');
      path.setAttribute('stroke-width', '3');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      dshapes.appendChild(path);

      const marks = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      dsvg.appendChild(marks);

      penDraftRef.current = { pts: [], path, marks };
      setIsDrawingPen(true);
      if (hintRef.current) {
        hintRef.current.textContent = isRTL
          ? 'انقر لوضع نقاط أخرى، انقر مرتين أو اضغط إنهاء لإكمال الخط ✿'
          : 'Click to add points, double-click or click finish to complete line ✿';
      }
    }

    const P = penDraftRef.current;

    // Check if clicking near the last added point (< 15px) - user wants to disconnect/finish line
    if (P.pts.length >= 1) {
      const lastPt = P.pts[P.pts.length - 1];
      if (Math.hypot(x - lastPt[0], y - lastPt[1]) < 15) {
        finishPen();
        return;
      }
    }

    // Close path if clicking near first point
    if (P.pts.length > 2 && Math.hypot(x - P.pts[0][0], y - P.pts[0][1]) < 16) {
      P.path.setAttribute('d', P.path.getAttribute('d') + ' Z');
      P.path.setAttribute('fill', nextFill());
      P.path.setAttribute('stroke', '#0F172A');
      P.path.setAttribute('stroke-width', '2.5');
      finishPen();
      return;
    }

    P.pts.push([x, y]);
    P.path.setAttribute(
      'd',
      P.pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
    );

    const mark = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    mark.setAttribute('class', P.pts.length === 1 ? 'pm first' : 'pm');
    mark.setAttribute('x', (x - 4.5).toFixed(1));
    mark.setAttribute('y', (y - 4.5).toFixed(1));
    mark.setAttribute('width', '9');
    mark.setAttribute('height', '9');
    P.marks.appendChild(mark);
  };

  const finishPen = () => {
    if (!penDraftRef.current) return;
    const P = penDraftRef.current;
    penDraftRef.current = null;
    setIsDrawingPen(false);
    P.marks.remove();
    if (rubberRef.current) rubberRef.current.setAttribute('visibility', 'hidden');
    if (P.pts.length < 2) {
      P.path.remove();
    } else {
      histRef.current.push({ type: 'add', el: P.path });
      popIn(P.path);
      flashSel(P.path);
    }
    if (hintRef.current) {
      hintRef.current.textContent = isRTL ? 'جرّب الرسم: اختر أداة وارسم ✿' : 'try me: pick a tool and draw ✿';
    }
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    if (penDraftRef.current) {
      const P = penDraftRef.current;
      // If the double-click event just pushed a duplicate 3rd point right on top of the 2nd point, pop it
      if (P.pts.length >= 2) {
        const last = P.pts[P.pts.length - 1];
        const prev = P.pts[P.pts.length - 2];
        if (Math.hypot(last[0] - prev[0], last[1] - prev[1]) < 25) {
          P.pts.pop();
          P.path.setAttribute(
            'd',
            P.pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
          );
        }
      }
      finishPen();
    }
  };

  const selectTool = (t) => {
    finishPen();
    toolRef.current = t;
    setActiveTool(t);
  };

  const placeText = (x, y) => {
    const dtext = drawTextRef.current;
    if (!dtext) return;
    const t = document.createElement('span');
    t.className = 'dtxt';
    t.contentEditable = 'true';
    t.spellcheck = false;
    t.textContent = isRTL ? 'مرحباً!' : 'Hello!';
    t.style.left = `${x}px`;
    t.style.top = `${y}px`;
    t.style.color = FILLS[fillIndexRef.current++ % FILLS.length];
    dtext.appendChild(t);
    t.focus();
    const sel = window.getSelection();
    if (sel) sel.selectAllChildren(t);
    touched();
    popIn(t);
    histRef.current.push({ type: 'add', el: t });

    t.addEventListener('blur', () => {
      if (!t.textContent.trim()) t.remove();
    });

    t.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        t.blur();
      }
    });

    t.addEventListener('pointerdown', (e) => {
      if (toolRef.current === 'eraser') {
        e.preventDefault();
        eraseEl(t);
        return;
      }
      if (toolRef.current !== 'select') return;
      e.preventDefault();
      try { t.setPointerCapture(e.pointerId); } catch {}
      const sx = e.clientX;
      const sy = e.clientY;
      const l0 = parseFloat(t.style.left);
      const t0 = parseFloat(t.style.top);
      const mv = (ev) => {
        t.style.left = `${l0 + ev.clientX - sx}px`;
        t.style.top = `${t0 + ev.clientY - sy}px`;
        touched();
      };
      t.addEventListener('pointermove', mv);
      t.addEventListener('pointerup', () => t.removeEventListener('pointermove', mv), { once: true });
    });
  };

  const handlePointerDown = (e) => {
    if (e.button !== 0) return;
    const [x, y] = getCoordinates(e);
    const dsvg = drawSvgRef.current;
    const dshapes = drawShapesRef.current;
    const tool = toolRef.current;

    if (e.target.closest('.pm')) {
      e.preventDefault();
      finishPen();
      return;
    }

    if (tool === 'type') {
      e.preventDefault();
      const f = document.activeElement;
      if (f?.classList.contains('dtxt')) f.blur();
      else placeText(x, y);
      return;
    }

    if (tool === 'pen') {
      e.preventDefault();
      addPenPoint(x, y);
      return;
    }

    if (tool === 'eraser') {
      e.preventDefault();
      try { dsvg.setPointerCapture(e.pointerId); } catch {}
      actRef.current = { mode: 'erase' };
      eraseEl(e.target.closest('.shape'));
      return;
    }

    if (tool === 'select') {
      const s = e.target.closest('.shape');
      if (!s) return;
      e.preventDefault();
      try { dsvg.setPointerCapture(e.pointerId); } catch {}
      actRef.current = {
        mode: 'move',
        el: s,
        x0: x,
        y0: y,
        tx: +(s.dataset.tx || 0),
        ty: +(s.dataset.ty || 0)
      };
      return;
    }

    e.preventDefault();
    try { dsvg.setPointerCapture(e.pointerId); } catch {}
    touched();

    const fill = nextFill();
    const baseAttrs = {
      fill,
      stroke: '#0F172A',
      'stroke-width': '2.5'
    };

    if (tool === 'rect') {
      const rectEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rectEl.setAttribute('class', 'shape');
      rectEl.setAttribute('x', `${x}`);
      rectEl.setAttribute('y', `${y}`);
      rectEl.setAttribute('width', '0');
      rectEl.setAttribute('height', '0');
      rectEl.setAttribute('rx', '8');
      Object.entries(baseAttrs).forEach(([k, v]) => rectEl.setAttribute(k, v));
      dshapes.appendChild(rectEl);
      actRef.current = { mode: 'rect', x0: x, y0: y, el: rectEl };
    }

    if (tool === 'ellipse') {
      const ellEl = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      ellEl.setAttribute('class', 'shape');
      ellEl.setAttribute('cx', `${x}`);
      ellEl.setAttribute('cy', `${y}`);
      ellEl.setAttribute('rx', '0');
      ellEl.setAttribute('ry', '0');
      Object.entries(baseAttrs).forEach(([k, v]) => ellEl.setAttribute(k, v));
      dshapes.appendChild(ellEl);
      actRef.current = { mode: 'ellipse', x0: x, y0: y, el: ellEl };
    }

    if (tool === 'pencil') {
      const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathEl.setAttribute('class', 'shape');
      pathEl.setAttribute('d', `M${x.toFixed(1)} ${y.toFixed(1)}`);
      pathEl.setAttribute('fill', 'none');
      pathEl.setAttribute('stroke', fill);
      pathEl.setAttribute('stroke-width', '5');
      pathEl.setAttribute('stroke-linecap', 'round');
      pathEl.setAttribute('stroke-linejoin', 'round');
      dshapes.appendChild(pathEl);
      actRef.current = {
        mode: 'pencil',
        last: [x, y],
        d: `M${x.toFixed(1)} ${y.toFixed(1)}`,
        el: pathEl
      };
    }
  };

  const handlePointerMove = (e) => {
    const [x, y] = getCoordinates(e);
    const act = actRef.current;
    const rubber = rubberRef.current;

    // Update rubber band for pen tool
    if (penDraftRef.current && !act && rubber) {
      const l = penDraftRef.current.pts[penDraftRef.current.pts.length - 1];
      rubber.setAttribute('x1', l[0]);
      rubber.setAttribute('y1', l[1]);
      rubber.setAttribute('x2', x);
      rubber.setAttribute('y2', y);
      rubber.setAttribute('visibility', 'visible');
    }

    if (!act) return;

    if (act.mode === 'rect' || act.mode === 'ellipse') {
      let w = x - act.x0;
      let h = y - act.y0;
      if (e.shiftKey) {
        const m = Math.max(Math.abs(w), Math.abs(h));
        w = Math.sign(w || 1) * m;
        h = Math.sign(h || 1) * m;
      }
      const X = Math.min(act.x0, act.x0 + w);
      const Y = Math.min(act.y0, act.y0 + h);
      const W = Math.abs(w);
      const H = Math.abs(h);

      if (act.mode === 'rect') {
        act.el.setAttribute('x', X);
        act.el.setAttribute('y', Y);
        act.el.setAttribute('width', W);
        act.el.setAttribute('height', H);
      } else {
        act.el.setAttribute('cx', X + W / 2);
        act.el.setAttribute('cy', Y + H / 2);
        act.el.setAttribute('rx', W / 2);
        act.el.setAttribute('ry', H / 2);
      }
      showSel(X, Y, W, H);
    } else if (act.mode === 'pencil') {
      if (Math.hypot(x - act.last[0], y - act.last[1]) > 3) {
        act.d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
        act.el.setAttribute('d', act.d);
        act.last = [x, y];
      }
    } else if (act.mode === 'erase') {
      eraseEl(document.elementFromPoint(e.clientX, e.clientY)?.closest('.shape, .dtxt'));
    } else if (act.mode === 'move') {
      const tx = act.tx + x - act.x0;
      const ty = act.ty + y - act.y0;
      act.el.dataset.tx = tx;
      act.el.dataset.ty = ty;
      act.el.setAttribute('transform', `translate(${tx.toFixed(1)} ${ty.toFixed(1)})`);
      touched();
    }
  };

  const handlePointerUp = () => {
    if (!actRef.current) return;
    const a = actRef.current;
    actRef.current = null;

    if (a.mode === 'erase') return;
    if (a.mode === 'move') {
      if (+a.el.dataset.tx !== a.tx || +a.el.dataset.ty !== a.ty) {
        histRef.current.push({ type: 'move', el: a.el, tx: a.tx, ty: a.ty });
      }
      flashSel(a.el);
      return;
    }

    try {
      const b = a.el.getBBox();
      if (b.width < 4 && b.height < 4) {
        a.el.remove();
        if (dselRef.current) dselRef.current.setAttribute('opacity', '0');
        return;
      }
    } catch {}

    histRef.current.push({ type: 'add', el: a.el });
    popIn(a.el);
    flashSel(a.el);
  };

  // Keyboard shortcuts (Ctrl+Z to undo, tools V, N, P, T, M, L, E)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target?.closest && e.target.closest('input, textarea, [contenteditable="true"]')) return;
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        if (undo()) e.preventDefault();
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const toolMap = {
        v: 'select',
        n: 'pencil',
        p: 'pen',
        t: 'type',
        m: 'rect',
        l: 'ellipse',
        e: 'eraser'
      };
      const selected = toolMap[e.key.toLowerCase()];
      if (selected) {
        selectTool(selected);
      }
      if (e.key === 'Enter' || e.key === 'Escape') {
        finishPen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Phone check
  useEffect(() => {
    if (window.matchMedia('(max-width: 760px), (pointer: coarse)').matches) {
      selectTool('pencil');
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`penline ${toolsOpen ? 'tools-open' : ''}`}
      id="penline"
      data-tool={activeTool}
    >
      {/* 7-Tool Illustrator Toolbar */}
      <div className="pen-tools" role="toolbar">
        <button
          type="button"
          tabIndex={-1}
          className="pt-toggle"
          title={isRTL ? 'أدوات الرسم' : 'Drawing tools'}
          onClick={() => {
            if (toolsOpen) finishPen();
            setToolsOpen(!toolsOpen);
          }}
        >
          <svg className="ic-pen" viewBox="0 0 20 20">
            <path
              d="M3.5 16.5l1-4 9-9 3 3-9 9z"
              fill="#FF4F9A"
              stroke="#0F172A"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M3.5 16.5l1-4 3 3z" fill="#0F172A" />
          </svg>
          <svg className="ic-x" viewBox="0 0 20 20">
            <path d="M5 5l10 10M15 5L5 15" stroke="#0F172A" strokeWidth="2.6" strokeLinecap="round" />
          </svg>
        </button>

        <button
          type="button"
          tabIndex={-1}
          data-tool="select"
          title="Selection (V)"
          style={{ '--i': 0 }}
          className={activeTool === 'select' ? 'on' : ''}
          onClick={() => selectTool('select')}
        >
          <svg viewBox="0 0 20 20">
            <path d="M5 2.5l10 6-4.3 1.2L8.3 14z" fill="currentColor" />
          </svg>
        </button>

        <button
          type="button"
          tabIndex={-1}
          data-tool="pencil"
          title="Pencil (N)"
          style={{ '--i': 1 }}
          className={activeTool === 'pencil' ? 'on' : ''}
          onClick={() => selectTool('pencil')}
        >
          <svg viewBox="0 0 20 20">
            <path
              d="M3.5 16.5l1-4 9-9 3 3-9 9z"
              fill="#C7D2FE"
              stroke="#0F172A"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path d="M3.5 16.5l1-4 3 3z" fill="#0F172A" />
          </svg>
        </button>

        <button
          type="button"
          tabIndex={-1}
          data-tool="pen"
          title="Pen (P)"
          style={{ '--i': 2 }}
          className={activeTool === 'pen' ? 'on' : ''}
          onClick={() => selectTool('pen')}
        >
          <svg viewBox="0 0 20 20">
            <path
              d="M3 17l3-8 6-6 5 5-6 6z"
              fill="#fff"
              stroke="#0F172A"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path d="M3 17l5-5" stroke="#0F172A" strokeWidth="1.3" />
          </svg>
        </button>

        <button
          type="button"
          tabIndex={-1}
          data-tool="type"
          title="Type (T)"
          style={{ '--i': 3 }}
          className={activeTool === 'type' ? 'on' : ''}
          onClick={() => selectTool('type')}
        >
          <svg viewBox="0 0 20 20">
            <path d="M4 4h12M10 4v13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>

        <button
          type="button"
          tabIndex={-1}
          data-tool="rect"
          title="Rectangle (M)"
          style={{ '--i': 4 }}
          className={activeTool === 'rect' ? 'on' : ''}
          onClick={() => selectTool('rect')}
        >
          <svg viewBox="0 0 20 20">
            <rect
              x="3.5"
              y="5"
              width="13"
              height="10"
              rx="1.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
        </button>

        <button
          type="button"
          tabIndex={-1}
          data-tool="ellipse"
          title="Ellipse (L)"
          style={{ '--i': 5 }}
          className={activeTool === 'ellipse' ? 'on' : ''}
          onClick={() => selectTool('ellipse')}
        >
          <svg viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="6.3" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>

        <button
          type="button"
          tabIndex={-1}
          data-tool="eraser"
          title="Eraser (E)"
          style={{ '--i': 6 }}
          className={activeTool === 'eraser' ? 'on' : ''}
          onClick={() => selectTool('eraser')}
        >
          <svg viewBox="0 0 20 20">
            <path
              d="M3 12.8l7.3-7.3 5.4 5.4-5.8 5.8H6.2z"
              fill="#F43F5E"
              stroke="#0F172A"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path d="M7 8.8l5.4 5.4" stroke="#0F172A" strokeWidth="1.4" />
          </svg>
        </button>
      </div>

      {/* Floating Helper Hint */}
      <span ref={hintRef} className="pen-hint" id="pen-hint">
        {isRTL ? 'جرّب الرسم: اختر أداة وارسم ✿' : 'try me: pick a tool and draw ✿'}
      </span>

      {/* Quick Finish Button while drawing with Pen */}
      {isDrawingPen && (
        <button
          type="button"
          className="btn-finish-pen"
          onClick={(e) => {
            e.stopPropagation();
            finishPen();
          }}
          title={isRTL ? 'إنهاء الخط' : 'Finish line'}
        >
          <span>✓</span> {isRTL ? 'إنهاء الخط' : 'Finish line'}
        </button>
      )}

      {/* Background SVG Bézier Curve */}
      <svg ref={psvgRef} className="pen-svg" id="pen-svg" style={{ overflow: 'visible' }}>
        <path
          ref={pArtRef}
          className="pen-art pp-art"
          id="pen-art"
          fill="none"
          stroke="#FF4F9A"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          ref={pSelRef}
          className="pen-path pp-sel"
          id="pen-path"
          fill="none"
          stroke="#7B7FF6"
          strokeWidth="1.4"
        />
        <g ref={pAncRef} className="pen-anchors" id="pen-anchors" />
      </svg>

      {/* Interactive Vector Drawing Canvas */}
      <svg
        ref={drawSvgRef}
        className="draw-svg"
        id="draw-svg"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        onPointerLeave={() => {
          if (rubberRef.current) rubberRef.current.setAttribute('visibility', 'hidden');
        }}
      >
        <g ref={drawShapesRef} id="draw-shapes" />
        <line
          ref={rubberRef}
          id="rubber"
          className="rubber"
          visibility="hidden"
          stroke="#7B7FF6"
          strokeWidth="1.4"
          strokeDasharray="4 4"
          fill="none"
          pointerEvents="none"
        />
        <g ref={dselRef} id="dsel" className="dsel" opacity="0">
          <rect className="box" />
          <rect className="h" />
          <rect className="h" />
          <rect className="h" />
          <rect className="h" />
          <rect className="h" />
          <rect className="h" />
          <rect className="h" />
          <rect className="h" />
        </g>
      </svg>

      {/* Text Container */}
      <div ref={drawTextRef} className="draw-text" id="draw-text" />

      {/* Pen Cursor Icon Following Line */}
      <div ref={pCurRef} className="pen-cursor" id="pen-cursor">
        <svg viewBox="0 0 30 30">
          <path
            d="M3 27 7.5 14 16 5.5l8.5 8.5L16 22.5z"
            fill="#fff"
            stroke="#0F172A"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M3 27l7.2-7.2" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="11.6" cy="18.4" r="1.9" fill="#0F172A" />
          <path d="m18 3.5 8.5 8.5" stroke="#FF4F9A" strokeWidth="3.4" strokeLinecap="round" />
        </svg>
        <span className="pen-tip">{isRTL ? 'أداة القلم (P)' : 'Pen Tool (P)'}</span>
      </div>
    </div>
  );
}
