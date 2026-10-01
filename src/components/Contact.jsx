import React, { useState, useEffect, useRef } from 'react';
import { WHATSAPP_CONFIG, SOCIAL_LINKS } from '../data/portfolioData';

export default function Contact({ lang, content }) {
  const isRTL = lang === 'ar';
  const { eyebrow, email } = content;
  const targetEmail = email || 'habibamarghani1@gmail.com';

  const [isFlipped, setIsFlipped] = useState(false);
  const [cairoTime, setCairoTime] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('');
  const [copyAnnouncement, setCopyAnnouncement] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [fromEmail, setFromEmail] = useState('');
  const [subjectText, setSubjectText] = useState(
    isRTL ? 'استفسار عن مشروع تصميم ✿' : 'A wish for my brand ✿'
  );
  const [messageBody, setMessageBody] = useState('');
  const [placeholderText, setPlaceholderText] = useState('');

  const cBodyRef = useRef(null);
  const wishWordRef = useRef(null);
  const sceneRef = useRef(null);
  const sceneCharRef = useRef(null);
  const wishStarRef = useRef(null);
  const loveTimeoutRef = useRef(null);
  const lastLoveTimeRef = useRef(0);

  // 1. Particle bursts (confetti)
  const burst = (x, y, n = 8) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const chars = ['♥', '✦', '✿', '★'];
    const colors = ['#1D4ED8', '#F43F5E', '#C7D2FE', '#60A5FA', '#FFE066'];
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'burst';
      s.textContent = chars[i % chars.length];
      s.style.left = `${x}px`;
      s.style.top = `${y}px`;
      s.style.color = colors[i % colors.length];
      document.body.appendChild(s);

      const angle = (i / n) * Math.PI * 2;
      const distance = 40 + Math.random() * 40;
      const anim = s.animate(
        [
          { transform: 'translate(0,0) scale(.4)', opacity: 1 },
          {
            transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1.1) rotate(${(Math.random() - 0.5) * 120}deg)`,
            opacity: 0
          }
        ],
        { duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)' }
      );
      anim.onfinish = () => s.remove();
    }
  };

  // 2. Magic sparkles (for wish word and drag)
  const magic = (x, y, spread = 40) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const s = document.createElement('i');
    const cols = ['#FFE066', '#FF9EC4', '#fff', '#93C5FD'];
    s.className = 'magic';
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    s.style.setProperty('--c', cols[Math.floor(Math.random() * cols.length)]);
    document.body.appendChild(s);

    const rand = (min, max) => min + Math.random() * (max - min);
    const anim = s.animate(
      [
        { transform: 'translate(-50%,-50%) scale(0) rotate(0)', opacity: 1 },
        {
          transform: `translate(calc(-50% + ${rand(-spread, spread)}px), calc(-50% + ${rand(-spread, -10)}px)) scale(${rand(0.6, 1.4)}) rotate(180deg)`,
          opacity: 0
        }
      ],
      { duration: rand(700, 1100), easing: 'cubic-bezier(.2,.8,.2,1)' }
    );
    anim.onfinish = () => s.remove();
  };

  // 3. Heart-eyes character reaction (loveMe)
  const loveMe = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (sceneRef.current) sceneRef.current.classList.add('love');
    if (sceneCharRef.current) sceneCharRef.current.classList.add('love');

    if (loveTimeoutRef.current) clearTimeout(loveTimeoutRef.current);
    loveTimeoutRef.current = setTimeout(() => {
      if (sceneRef.current) sceneRef.current.classList.remove('love');
      if (sceneCharRef.current) sceneCharRef.current.classList.remove('love');
    }, 3200);
  };

  // 4. Real-time Cairo clock
  useEffect(() => {
    const cairoFmt = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Africa/Cairo',
      hour: 'numeric',
      minute: '2-digit'
    });
    const updateTime = () => setCairoTime(cairoFmt.format(new Date()));
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // 5. Typewriter placeholder rotation for #c-body
  useEffect(() => {
    const PROMPTS = isRTL
      ? [
          'مرحباً حبيبة! بنطلق علامة تجارية جديدة ومحتاجين هوية بصرية كاملة…',
          'مرحباً حبيبة! هل ممكن تصميم حملة إعلانية مميزة لموسم التخفيضات؟',
          'مرحباً حبيبة! محتاجين بوستات وتصميمات سوشيال ميديا شهرية…'
        ]
      : [
          "Hi Habiba! We're launching a new brand and need a full visual identity…",
          'Hi Habiba! Could you design our promotional campaign this season?',
          'Hi Habiba! We need fresh social media posts for our feed every month…'
        ];

    let pi = 0;
    let pc = 0;
    let del = false;
    let timer = null;

    const typeStep = () => {
      let wait = del ? 18 : 42;
      const textarea = cBodyRef.current;
      const isFocused = document.activeElement === textarea;

      if (!isFocused && (!textarea || !textarea.value)) {
        const s = PROMPTS[pi];
        if (!del && ++pc > s.length) {
          del = true;
          wait = 1900;
        } else if (del && (pc -= 3) <= 0) {
          pc = 0;
          del = false;
          pi = (pi + 1) % PROMPTS.length;
          wait = 400;
        }
        setPlaceholderText(s.slice(0, Math.max(0, pc)));
      }
      timer = setTimeout(typeStep, wait);
    };

    timer = setTimeout(typeStep, 300);
    return () => clearTimeout(timer);
  }, [isRTL]);

  // 6. Magic sparkles on wish-word hover
  useEffect(() => {
    const el = wishWordRef.current;
    if (!el) return;

    let tm = 0;
    const handleMove = (e) => {
      const now = performance.now();
      if (now - tm < 40) return;
      tm = now;
      magic(e.clientX, e.clientY, 40);
    };

    const handleEnter = () => {
      const r = el.getBoundingClientRect();
      for (let i = 0; i < 10; i++) {
        magic(r.left + Math.random() * r.width, r.top + Math.random() * r.height, 60);
      }
    };

    el.addEventListener('pointerenter', handleEnter);
    el.addEventListener('pointermove', handleMove);

    return () => {
      el.removeEventListener('pointerenter', handleEnter);
      el.removeEventListener('pointermove', handleMove);
    };
  }, []);

  // 7. Copy address handler
  const handleCopyEmail = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(targetEmail);
    setCopyFeedback(isRTL ? 'تم النسخ ✿' : 'Copied ✿');
    setCopyAnnouncement(isRTL ? 'تم نسخ البريد الإلكتروني' : 'Email copied');
    burst(e.clientX, e.clientY, 8);
    loveMe();
    setTimeout(() => {
      setCopyFeedback('');
      setCopyAnnouncement('');
    }, 2200);
  };

  // 8. Compose textarea input handler
  const handleTextareaInput = (e) => {
    setMessageBody(e.target.value);
    const now = performance.now();
    if (now - lastLoveTimeRef.current > 5000) {
      lastLoveTimeRef.current = now;
      loveMe();
    }
  };

  // 9. Compose form submit handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isSending) return;

    setIsSending(true);
    loveMe();

    const submitBtn = e.currentTarget.querySelector('[type=submit]');
    if (submitBtn) {
      const r = submitBtn.getBoundingClientRect();
      for (let i = 0; i < 14; i++) {
        magic(r.left + Math.random() * r.width, r.top + Math.random() * r.height, 80);
      }

      // Fire shooting wish star
      const star = wishStarRef.current;
      if (star) {
        star.style.left = `${r.left + 20}px`;
        star.style.top = `${r.top + 8}px`;
        star.classList.remove('go');
        void star.getBoundingClientRect();
        star.classList.add('go');
      }
    }

    try {
      await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          email: fromEmail,
          _subject: subjectText,
          message: messageBody,
          _honey: '',
          _template: 'box'
        })
      });
    } catch (err) {
      console.warn('Direct email relay fallback:', err);
    }

    setFormSubmitted(true);
    setIsSending(false);

    // After 4200ms reset form and flip back
    setTimeout(() => {
      setFormSubmitted(false);
      setMessageBody('');
      setIsFlipped(false);
    }, 4200);
  };

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      {/* Background shooting stars */}
      <span className="shoot" style={{ left: '88%', top: '8%', '--dl': '1s' }} />
      <span className="shoot" style={{ left: '60%', top: '2%', '--dl': '5.5s' }} />

      {/* Screen reader live announcement for copy address */}
      <span id="copy-status" className="sr-only" aria-live="polite">
        {copyAnnouncement}
      </span>

      <div className="wrap">
        <div className="contact-grid">
          <div>
            {eyebrow && (
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary-blue)] mb-2 block" data-r>
                {eyebrow}
              </span>
            )}

            <h2 className="h2" id="contact-title" data-r>
              {isRTL ? (
                <>
                  عندك فكرة أو{' '}
                  <span
                    ref={wishWordRef}
                    id="wish-word"
                    className="wish-word cursor-pointer underline decoration-wavy decoration-[var(--candy-rose)] text-[var(--primary-blue)]"
                    onClick={loveMe}
                  >
                    أمنية
                  </span>{' '}
                  لمشروعك؟
                </>
              ) : (
                <>
                  Got a brand{' '}
                  <span
                    ref={wishWordRef}
                    id="wish-word"
                    className="wish-word cursor-pointer underline decoration-wavy decoration-[var(--candy-rose)] text-[var(--primary-blue)]"
                    onClick={loveMe}
                  >
                    wish
                  </span>
                  ?
                </>
              )}
            </h2>

            <p className="contact-copy" data-r>
              {isRTL
                ? 'اضغط على البطاقة لكتابة رسالة مباشرة، أو تواصل معي عبر النجوم.'
                : 'Tap my card to write me a note, or reach me through the stars.'}
            </p>

            {/* 3D Flip Mailcard */}
            <div className={`mailcard in ${isFlipped ? 'flipped' : ''}`} id="mailcard">
              <div className="mc-inner">
                {/* Front: contact.card */}
                <div
                  className="mc-face mc-card win cursor-pointer"
                  id="mc-card"
                  role="group"
                  aria-label="Contact card"
                  aria-hidden={isFlipped}
                  onClick={() => setIsFlipped(true)}
                >
                  <div className="win-bar">
                    <span className="dots" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                    <b>contact.card</b>
                    <span className="mc-hint" aria-hidden="true">
                      {isRTL ? 'اضغط للكتابة ✎' : 'tap to write ✎'}
                    </span>
                  </div>

                  {/* Mailcard Sky Graphic */}
                  <div className="mc-sky" aria-hidden="true">
                    <span className="ms-cloud c1">
                      <svg viewBox="0 0 120 60"><use href="#cloud" fill="#fff" /></svg>
                    </span>
                    <span className="ms-cloud c2">
                      <svg viewBox="0 0 120 60"><use href="#cloud" fill="#fff" /></svg>
                    </span>
                    <span className="ms-cloud c3">
                      <svg viewBox="0 0 120 60"><use href="#cloud" fill="#fff" opacity=".8" /></svg>
                    </span>
                    <svg className="ms-star" style={{ left: '12%', top: '18%', '--dl': '-.4s' }}><use href="#spark" /></svg>
                    <svg className="ms-star" style={{ left: '46%', top: '12%', '--dl': '-1.6s' }}><use href="#spark" /></svg>
                    <svg className="ms-star" style={{ left: '62%', top: '46%', '--dl': '-2.4s' }}><use href="#spark" /></svg>
                    <span className="ms-script">{isRTL ? 'تواصل معي' : 'send me a note'}</span>
                  </div>

                  {/* Stamp with Habiba portrait */}
                  <span className="mc-stamp" aria-hidden="true">
                    <img src="/images/habiba-portrait.png" alt="Habiba" />
                  </span>

                  {/* Cairo Postmark */}
                  <svg className="mc-post" viewBox="0 0 80 40" aria-hidden="true">
                    <circle cx="20" cy="20" r="16" />
                    <circle cx="20" cy="20" r="11" />
                    <path d="M40 12c8-4 14 4 22 0s12 0 16-2M40 20c8-4 14 4 22 0s12 0 16-2M40 28c8-4 14 4 22 0s12 0 16-2" />
                  </svg>

                  {/* Mailcard Bottom Details */}
                  <div className="mcb">
                    <span className="mcb-lab">{isRTL ? 'راسلني على' : 'Say hi at'}</span>
                    <a className="mcb-mail" href={`mailto:${targetEmail}`}>
                      {targetEmail}
                    </a>
                    <div className="mcb-actions">
                      <button
                        className="btn btn-candy cursor-pointer"
                        type="button"
                        data-copy
                        onClick={handleCopyEmail}
                      >
                        <span data-lbl>{copyFeedback || (isRTL ? 'نسخ البريد' : 'Copy address')}</span>
                      </button>
                      <button
                        className="btn cursor-pointer"
                        type="button"
                        data-flip
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsFlipped(true);
                        }}
                      >
                        {isRTL ? 'اكتب رسالة ✎' : 'Write a note ✎'}
                      </button>
                    </div>
                    <p className="mcb-time">
                      <i />
                      {isRTL
                        ? `الساعة الآن في القاهرة ${cairoTime || '…'}`
                        : `It's ${cairoTime || '…'} in Cairo right now`}
                    </p>
                  </div>
                </div>

                {/* Back: compose form */}
                <form
                  className={`mc-face compose win ${formSubmitted ? 'sent' : ''}`}
                  id="compose"
                  aria-hidden={!isFlipped}
                  onSubmit={handleFormSubmit}
                >
                  <input type="text" name="_honey" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                  <div className="win-bar">
                    <span className="dots" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                    <b>{isRTL ? 'رسالة جديدة' : 'New message'}</b>
                    <button
                      type="button"
                      className="mc-flip cursor-pointer"
                      data-flip
                      onClick={() => setIsFlipped(false)}
                    >
                      {isRTL ? '↻ البطاقة' : '↻ Card'}
                    </button>
                  </div>

                  <div className="c-row">
                    <span className="c-lab">{isRTL ? 'إلى' : 'To'}</span>
                    <button
                      type="button"
                      className="c-to cursor-pointer"
                      data-copy
                      onClick={handleCopyEmail}
                      aria-label={`Copy email address ${targetEmail}`}
                    >
                      <b>{targetEmail}</b>
                      <em>{copyFeedback || (isRTL ? 'نسخ' : 'Copy')}</em>
                    </button>
                  </div>

                  <label className="c-row">
                    <span className="c-lab">{isRTL ? 'من' : 'From'}</span>
                    <input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      autoComplete="email"
                      required
                      value={fromEmail}
                      onChange={(e) => setFromEmail(e.target.value)}
                    />
                  </label>

                  <label className="c-row">
                    <span className="c-lab">{isRTL ? 'الموضوع' : 'Subject'}</span>
                    <input
                      name="subject"
                      value={subjectText}
                      onChange={(e) => setSubjectText(e.target.value)}
                      autoComplete="off"
                    />
                  </label>

                  <label className="c-body">
                    <span className="sr-only">Message</span>
                    <textarea
                      ref={cBodyRef}
                      name="body"
                      id="c-body"
                      rows={3}
                      required
                      placeholder={placeholderText || (isRTL ? 'اكتب تفاصيل مشروعك هنا…' : 'Tell me about your project…')}
                      value={messageBody}
                      onChange={handleTextareaInput}
                    />
                  </label>

                  <div className="c-foot">
                    <button
                      className={`btn btn-butter wish-btn cursor-pointer ${isSending ? 'sending' : ''}`}
                      type="submit"
                      disabled={isSending}
                      title={isRTL ? 'إرسال إلى بريدي مباشرة' : 'Goes straight to my inbox'}
                    >
                      <svg aria-hidden="true"><use href="#spark" /></svg>
                      <span>
                        {isSending
                          ? isRTL ? 'جارٍ الإرسال…' : 'Sending…'
                          : isRTL ? 'إرسال الرسالة' : 'Send my message'}
                      </span>
                    </button>
                  </div>

                  {formSubmitted && (
                    <div className="c-sent" aria-live="polite">
                      <svg aria-hidden="true"><use href="#spark" /></svg>
                      <b>{isRTL ? 'تم الإرسال بنجاح ✿' : 'Message sent! ✿'}</b>
                      <p>
                        {isRTL
                          ? `وصلتني رسالتك وسأرد على ${fromEmail || 'بريدك'} قريباً جداً.`
                          : `It landed in my inbox. I'll reply to ${fromEmail || 'your email'} soon!`}
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Social Pills */}
            <ul className="socials mt-10" data-r aria-label="Find me online">
              <li>
                <a
                  className="sb"
                  style={{ '--b': '#E8336F', '--r': '-6deg' }}
                  href={`mailto:${targetEmail}`}
                  onClick={loveMe}
                >
                  <span className="sb-disc" aria-hidden="true">
                    <span className="sb-fill" />
                    <svg viewBox="0 0 24 24">
                      <g className="stroke">
                        <rect x="3" y="5" width="18" height="14" rx="3" />
                        <path d="m4 7 8 6 8-6" />
                      </g>
                    </svg>
                  </span>
                  <span className="sb-lbl">
                    <b>{isRTL ? 'البريد' : 'Email'}</b>
                    <small>{isRTL ? 'مراسلة' : 'Say hi'}</small>
                  </span>
                </a>
              </li>

              <li>
                <a
                  className="sb"
                  style={{ '--b': '#1769FF', '--r': '5deg' }}
                  href={SOCIAL_LINKS.behance}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={loveMe}
                >
                  <span className="sb-disc" aria-hidden="true">
                    <span className="sb-fill" />
                    <svg viewBox="0 0 24 24">
                      <path d="M16.969 16.927a2.561 2.561 0 0 0 1.901.677 2.501 2.501 0 0 0 1.531-.475c.362-.235.636-.584.779-.99h2.585a5.091 5.091 0 0 1-1.9 2.896 5.292 5.292 0 0 1-3.091.88 5.839 5.839 0 0 1-2.284-.433 4.871 4.871 0 0 1-1.723-1.211 5.657 5.657 0 0 1-1.08-1.874 7.057 7.057 0 0 1-.383-2.393c-.005-.8.129-1.595.396-2.349a5.313 5.313 0 0 1 5.088-3.604 4.87 4.87 0 0 1 2.376.563c.661.362 1.231.87 1.668 1.485a6.2 6.2 0 0 1 .943 2.133c.194.821.263 1.666.205 2.508h-7.699c-.063.79.184 1.574.688 2.187ZM6.947 4.084a8.065 8.065 0 0 1 1.928.198 4.29 4.29 0 0 1 1.49.638c.418.303.748.711.958 1.182.241.579.357 1.203.341 1.83a3.506 3.506 0 0 1-.506 1.961 3.726 3.726 0 0 1-1.503 1.287 3.588 3.588 0 0 1 2.027 1.437c.464.747.697 1.615.67 2.494a4.593 4.593 0 0 1-.423 2.032 3.945 3.945 0 0 1-1.163 1.413 5.114 5.114 0 0 1-1.683.807 7.135 7.135 0 0 1-1.928.259H0V4.084h6.947Z" />
                    </svg>
                  </span>
                  <span className="sb-lbl">
                    <b>Behance</b>
                    <small>{isRTL ? 'معرض الأعمال' : 'Full portfolio'}</small>
                  </span>
                </a>
              </li>

              <li>
                <a
                  className="sb"
                  style={{ '--b': '#0A66C2', '--r': '-4deg' }}
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={loveMe}
                >
                  <span className="sb-disc" aria-hidden="true">
                    <span className="sb-fill" />
                    <svg viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>
                    </svg>
                  </span>
                  <span className="sb-lbl">
                    <b>LinkedIn</b>
                    <small>{isRTL ? 'لنتواصل معاً' : "Let's connect"}</small>
                  </span>
                </a>
              </li>

              <li>
                <a
                  className="sb"
                  style={{ '--b': '#1EBE5A', '--r': '6deg' }}
                  href={WHATSAPP_CONFIG.getLink(lang)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={loveMe}
                >
                  <span className="sb-disc" aria-hidden="true">
                    <span className="sb-fill" />
                    <svg viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </span>
                  <span className="sb-lbl">
                    <b>WhatsApp</b>
                    <small>{isRTL ? 'محادثة فورية' : 'Quick chat'}</small>
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Celestial Constellation Scene */}
          <div className="scene" id="scene" ref={sceneRef} data-r>
            <svg className="constel" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polyline className="draw" points="7,64 15,30 31,14 50,7 69,14 85,30 93,64" />
            </svg>

            {/* Character sitting behind clouds with heart-eyes */}
            <span className="char" id="scene-char" ref={sceneCharRef} data-char aria-hidden="true">
              <img src="/images/habiba-sticker.png" alt="Habiba" className="char-sticker" />
              <span className="heye h1">
                <svg viewBox="0 0 24 22">
                  <defs>
                    <linearGradient id="heart-grad-s1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#F43F5E" />
                      <stop offset="100%" stopColor="#E11D48" />
                    </linearGradient>
                  </defs>
                  <path d="M12 21S1.5 14.4 1.5 7.4A5.4 5.4 0 0 1 12 4.6a5.4 5.4 0 0 1 10.5 2.8C22.5 14.4 12 21 12 21z" fill="url(#heart-grad-s1)" stroke="#0F172A" strokeWidth="1.6" strokeLinejoin="round"/>
                  <path d="M12 17.8C8.4 15.4 5 12 5 8.4" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.1" strokeLinecap="round"/>
                  <ellipse cx="7.4" cy="7.2" rx="2.3" ry="1.4" fill="#fff" transform="rotate(-35 7.4 7.2)"/>
                  <circle cx="10.6" cy="5.8" r=".75" fill="#fff"/>
                </svg>
              </span>
              <span className="heye h2">
                <svg viewBox="0 0 24 22">
                  <defs>
                    <linearGradient id="heart-grad-s2" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#F43F5E" />
                      <stop offset="100%" stopColor="#E11D48" />
                    </linearGradient>
                  </defs>
                  <path d="M12 21S1.5 14.4 1.5 7.4A5.4 5.4 0 0 1 12 4.6a5.4 5.4 0 0 1 10.5 2.8C22.5 14.4 12 21 12 21z" fill="url(#heart-grad-s2)" stroke="#0F172A" strokeWidth="1.6" strokeLinejoin="round"/>
                  <path d="M12 17.8C8.4 15.4 5 12 5 8.4" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.1" strokeLinecap="round"/>
                  <ellipse cx="7.4" cy="7.2" rx="2.3" ry="1.4" fill="#fff" transform="rotate(-35 7.4 7.2)"/>
                  <circle cx="10.6" cy="5.8" r=".75" fill="#fff"/>
                </svg>
              </span>
            </span>

            {/* Front cloud layer in front of the character */}
            <div className="cloud-front" aria-hidden="true">
              <svg viewBox="0 0 120 60">
                <use href="#cloud" fill="#C7D2FE" transform="translate(0 4)" />
                <use href="#cloud" fill="#fff" />
              </svg>
            </div>

            {/* 3 Dot stars along the constellation */}
            <svg className="dotstar" style={{ left: '7%', top: '64%', '--dl': '.4s' }} aria-hidden="true"><use href="#spark" /></svg>
            <svg className="dotstar" style={{ left: '31%', top: '14%', '--dl': '1.2s' }} aria-hidden="true"><use href="#spark" /></svg>
            <svg className="dotstar" style={{ left: '69%', top: '14%', '--dl': '2s' }} aria-hidden="true"><use href="#spark" /></svg>

            {/* 4 Interactive Star Links */}
            <a
              className="star-link cursor-pointer"
              style={{ left: '15%', top: '30%', '--dl': '.3s' }}
              href={SOCIAL_LINKS.behance}
              target="_blank"
              rel="noopener noreferrer"
              onClick={loveMe}
            >
              <svg aria-hidden="true"><use href="#spark" /></svg>
              <span>
                <b>Behance</b>
                <small>{isRTL ? 'استعراض المشاريع' : 'see my projects'}</small>
              </span>
            </a>

            <a
              className="star-link cursor-pointer"
              style={{ left: '50%', top: '7%', '--sz': '9cqw' }}
              href={`mailto:${targetEmail}`}
              onClick={loveMe}
            >
              <svg aria-hidden="true"><use href="#spark" /></svg>
              <span>
                <b>Email</b>
                <small>{isRTL ? 'أفضل للمشاريع الجديدة' : 'best for new projects'}</small>
              </span>
            </a>

            <a
              className="star-link cursor-pointer"
              style={{ left: '85%', top: '30%', '--dl': '.9s' }}
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={loveMe}
            >
              <svg aria-hidden="true"><use href="#spark" /></svg>
              <span>
                <b>LinkedIn</b>
                <small>{isRTL ? 'لنتواصل معاً' : "let's connect"}</small>
              </span>
            </a>

            <a
              className="star-link cursor-pointer"
              style={{ left: '91%', top: '64%', '--dl': '1.5s' }}
              href={WHATSAPP_CONFIG.getLink(lang)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={loveMe}
            >
              <svg aria-hidden="true"><use href="#spark" /></svg>
              <span>
                <b>WhatsApp</b>
                <small>{isRTL ? 'محادثة سريعة' : 'quick chat'}</small>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Shooting wish star flying across the night sky */}
      <svg className="wish-star" id="wish-star" ref={wishStarRef} aria-hidden="true">
        <use href="#spark" />
      </svg>
    </section>
  );
}
