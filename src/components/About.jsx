import React, { useState, useRef, useEffect } from 'react';
import { WHATSAPP_CONFIG, SOCIAL_LINKS } from '../data/portfolioData';

export default function About({ lang, content }) {
  const isRTL = lang === 'ar';
  const {
    headline,
    bio,
    boardingPass
  } = content;

  const bp = boardingPass || {};
  const cvUrl = bp.cvUrl || '/assets/Habiba-Yasser-CV.pdf';
  const cvFileName = bp.cvFileName || 'Habiba-Yasser-CV.pdf';

  const [isPhotoClosed, setIsPhotoClosed] = useState(false);
  const [isSipping, setIsSipping] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [whoClient, setWhoClient] = useState(isRTL ? 'عميلك القادم يكتب الآن…' : 'Your brand is typing…');
  const [clientPhase, setClientPhase] = useState('dots');
  const [clientText, setClientText] = useState('');
  const [designerPhase, setDesignerPhase] = useState('none');
  const [whoDesigner, setWhoDesigner] = useState('');

  const aboutPhotoRef = useRef(null);
  const photoWinRef = useRef(null);
  const nameTagRef = useRef(null);
  const photoAnimRef = useRef(null);
  const passRef = useRef(null);
  const cvDialogRef = useRef(null);
  const chatRef = useRef(null);
  const typingClientRef = useRef(null);
  const habibaAnswerRef = useRef(null);

  // Jelly bounce animation matching reference
  const jelly = (el) => {
    if (!el) return;
    try {
      el.animate(
        { scale: ['1', '1.22 0.8', '.88 1.14', '1.06 .95', '1'] },
        { duration: 600, easing: 'ease-out' }
      );
    } catch {}
  };

  // Parabolic flight animation for photo window
  const handleClosePhoto = (e) => {
    e?.stopPropagation?.();
    const photoWin = photoWinRef.current;
    const nameTag = nameTagRef.current;
    const aboutPhoto = aboutPhotoRef.current;
    if (!photoWin || !nameTag || !aboutPhoto) return;
    if (photoAnimRef.current && isPhotoClosed) return;

    const a = photoWin.getBoundingClientRect();
    const b = nameTag.getBoundingClientRect();
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);

    let finished = false;
    const done = () => {
      if (finished) return;
      finished = true;
      photoWin.style.visibility = 'hidden';
      setIsPhotoClosed(true);
      aboutPhoto.classList.add('closed');
      try {
        nameTag.animate({ scale: ['1', '1.18 .88', '.94 1.08', '1'] }, { duration: 550 });
      } catch {}
    };

    try {
      const anim = photoWin.animate(
        [
          { transform: 'translate(0, 0) scale(1) rotate(0)', opacity: 1 },
          { transform: `translate(${dx * 0.3}px, ${dy * 0.3 - 40}px) scale(0.7) rotate(-8deg)`, opacity: 1, offset: 0.4 },
          { transform: `translate(${dx}px, ${dy}px) scale(0.04) rotate(-20deg)`, opacity: 0.15 }
        ],
        { duration: 900, easing: 'cubic-bezier(.5, 0, .7, .4)', fill: 'forwards' }
      );
      photoAnimRef.current = anim;
      anim.onfinish = done;
      if (anim.finished) anim.finished.then(done).catch(done);
    } catch {
      done();
    }
    setTimeout(done, 920);
  };

  const handleRestorePhoto = () => {
    const photoWin = photoWinRef.current;
    const aboutPhoto = aboutPhotoRef.current;
    const anim = photoAnimRef.current;
    if (!anim || !aboutPhoto || !photoWin) return;

    setIsPhotoClosed(false);
    aboutPhoto.classList.remove('closed');
    photoWin.style.visibility = '';

    let finished = false;
    const done = () => {
      if (finished) return;
      finished = true;
      try { anim.cancel(); } catch {}
      photoAnimRef.current = null;
      photoWin.style.transform = '';
      photoWin.style.opacity = '1';
    };

    try {
      anim.reverse();
      anim.onfinish = done;
      if (anim.finished) anim.finished.then(done).catch(done);
    } catch {
      done();
    }
    setTimeout(done, 950);
  };

  const handleSip = () => {
    if (isSipping) return;
    setIsSipping(true);
    setTimeout(() => setIsSipping(false), 1250);
  };

  // 3D Perspective Tilt on Boarding Pass
  useEffect(() => {
    const pass = passRef.current;
    if (!pass) return;

    const handlePointerMove = (e) => {
      const r = pass.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      pass.style.transform = `perspective(1100px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) scale(1.015)`;
    };

    const handlePointerLeave = () => {
      pass.style.transform = '';
    };

    pass.addEventListener('pointermove', handlePointerMove);
    pass.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      pass.removeEventListener('pointermove', handlePointerMove);
      pass.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  // CV Dialog open / close handlers
  const openCvDialog = () => {
    if (cvDialogRef.current) {
      cvDialogRef.current.showModal();
    }
  };

  const closeCvDialog = () => {
    if (cvDialogRef.current) {
      cvDialogRef.current.close();
    }
  };

  // Synchronize labels when language changes
  useEffect(() => {
    if (!chatStarted) {
      setWhoClient(isRTL ? 'عميلك القادم يكتب الآن…' : 'Your brand is typing…');
    } else {
      setWhoClient(isRTL ? 'عميلك' : 'Your brand');
      if (designerPhase === 'dots') {
        setWhoDesigner(isRTL ? 'حبيبة تكتب الآن…' : 'Habiba is typing…');
      } else if (designerPhase === 'answered') {
        setWhoDesigner(isRTL ? 'حبيبة' : 'Habiba');
      }
    }
  }, [isRTL, chatStarted, designerPhase]);

  // Live Chat Typewriter on Intersection with exact reference timeline (1600ms wait -> typing -> 1700ms wait -> jelly)
  useEffect(() => {
    const triggerEl = typingClientRef.current;
    if (!triggerEl) return;

    const fullQuestion = isRTL
      ? 'شغلك رائع جداً! نقدر نبدأ امتى؟'
      : 'Love it all. When can we start?';

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !chatStarted) {
          observer.disconnect();
          setChatStarted(true);

          // Phase 1: 1600ms of "Your brand is typing..." with bouncing dots
          setTimeout(() => {
            setWhoClient(isRTL ? 'عميلك' : 'Your brand');
            setClientPhase('typing');

            // Phase 2: Letter-by-letter typewriter with natural random delay 28ms-55ms
            let i = 0;
            const typeStep = () => {
              i++;
              setClientText(fullQuestion.slice(0, i));
              if (i < fullQuestion.length) {
                const delay = Math.floor(Math.random() * (55 - 28 + 1)) + 28;
                setTimeout(typeStep, delay);
              } else {
                setClientPhase('done');

                // Phase 3: Immediately Habiba is typing for 1700ms with bouncing dots
                setDesignerPhase('dots');
                setWhoDesigner(isRTL ? 'حبيبة تكتب الآن…' : 'Habiba is typing…');

                setTimeout(() => {
                  setWhoDesigner(isRTL ? 'حبيبة' : 'Habiba');
                  setDesignerPhase('answered');
                }, 1700);
              }
            };

            typeStep();
          }, 1600);
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(triggerEl);
    return () => observer.disconnect();
  }, [chatStarted, isRTL]);

  // When designerPhase switches to 'answered', trigger jelly bounce
  useEffect(() => {
    if (designerPhase === 'answered' && habibaAnswerRef.current) {
      jelly(habibaAnswerRef.current);
    }
  }, [designerPhase]);

  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="wrap">
        <div className="about-grid">
          {/* Column 1: Interactive Photo Window / Cartoon Standin */}
          <div
            ref={aboutPhotoRef}
            className={`about-photo ${isPhotoClosed ? 'closed' : ''}`}
            data-r
          >
            {/* 3D Flip Greeting Bubble */}
            <span className="bubble-ar" aria-hidden="true">
              <span className="ba-in">
                <span className="ba-f" lang="ar" dir="rtl">
                  أهلاً!
                </span>
                <span className="ba-b">Hello!</span>
              </span>
            </span>

            {/* Retro Photo Window habiba_irl.jpg */}
            <figure ref={photoWinRef} className="win photo-win">
              <div className="win-bar" aria-hidden="true">
                <span className="dots">
                  <button
                    type="button"
                    tabIndex={-1}
                    data-photo="close"
                    title={isRTL ? 'إغلاق الصورة الواقعية' : 'Close photo'}
                    onClick={handleClosePhoto}
                  >
                    ×
                  </button>
                  <i />
                  <i />
                </span>
                habiba_irl.jpg
              </div>
              <img
                src={content.portrait?.image || "/images/habiba-portrait.jpg"}
                alt="Habiba Yasser"
                width={900}
                height={1150}
                loading="lazy"
                draggable={false}
              />
            </figure>

            {/* Cartoon Standin with Interactive Iced Coffee */}
            <div
              className="standin cursor-pointer"
              aria-hidden="true"
              onClick={handleRestorePhoto}
            >
              <p className="standin-bubble">
                {isRTL ? 'أنا الحقيقية راحت تشرب آيس كوفي' : 'IRL me went to grab an iced coffee'}
                <b>{isRTL ? 'النسخة الكرتونية في الخدمة ✿' : 'Cartoon me is on duty ✿'}</b>
              </p>
              <span className="sd">
                <span className="char">
                  <img
                    src="/images/habiba-sticker.png"
                    alt="Habiba Cartoon Standin"
                    width={774}
                    height={942}
                    draggable={false}
                    className="drop-shadow-lg"
                  />
                </span>

                {/* Interactive Iced Coffee with Sip Animation */}
                <span
                  className={`icoffee ${isSipping ? 'sip' : ''} cursor-pointer`}
                  title={isRTL ? 'ارتشف! ✿' : 'Sip! ✿'}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSip();
                  }}
                >
                  <span className="ic-say">{isRTL ? 'رشفة ✿' : 'sip ✿'}</span>
                  <svg viewBox="0 0 80 124" aria-hidden="true">
                    <defs>
                      <clipPath id="ic-cup-habiba">
                        <path d="M13 44h54l-5.6 68.5a5 5 0 0 1-5 4.5H23.6a5 5 0 0 1-5-4.5z" />
                      </clipPath>
                      <linearGradient id="ic-coffee-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#D9A574" />
                        <stop offset="1" stopColor="#9C6440" />
                      </linearGradient>
                    </defs>
                    <g className="ic-straw" strokeLinecap="round">
                      <path d="M44 50 51 4" stroke="#0F172A" strokeWidth="9" />
                      <path d="M44 50 51 4" stroke="#1D4ED8" strokeWidth="5.4" />
                      <path d="M44 50 51 4" stroke="#fff" strokeWidth="5.4" strokeDasharray="3.5 5" />
                    </g>
                    <g clipPath="url(#ic-cup-habiba)">
                      <rect x="0" y="40" width="80" height="84" fill="#fff" fillOpacity=".6" />
                      <g className="ic-liq">
                        <path d="M0 60c10-4 20 4 30 0s20-4 30 0 14 3 20 1v63H0z" fill="url(#ic-coffee-grad)" />
                        <path d="M0 60c10-4 20 4 30 0s20-4 30 0 14 3 20 1v8c-6 2-12-1-20-1s-20 4-30 0-20-4-30 0z" fill="#F6E4CF" />
                      </g>
                      <g className="ic-ice" fill="#fff" fillOpacity=".8" stroke="#fff" strokeWidth="1.2">
                        <rect x="19" y="50" width="15" height="14" rx="3.5" transform="rotate(-14 26 57)" />
                        <rect x="41" y="53" width="14" height="13" rx="3.5" transform="rotate(12 48 59)" />
                        <rect x="30" y="63" width="12" height="11" rx="3" transform="rotate(-6 36 68)" />
                      </g>
                    </g>
                    <path d="M13 44h54l-5.6 68.5a5 5 0 0 1-5 4.5H23.6a5 5 0 0 1-5-4.5z" fill="none" stroke="#0F172A" strokeWidth="2.6" strokeLinejoin="round" />
                    <path d="M19.5 52l3.4 52" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".85" />
                    <path d="M14.5 42C17 27 63 27 65.5 42" fill="#fff" fillOpacity=".85" stroke="#0F172A" strokeWidth="2.6" />
                    <rect x="8" y="40" width="64" height="7" rx="3.5" fill="#C7D2FE" stroke="#0F172A" strokeWidth="2.6" />
                    <g className="ic-face">
                      <g className="ic-eyes" fill="#0F172A">
                        <circle cx="32" cy="88" r="2.7" />
                        <circle cx="48" cy="88" r="2.7" />
                      </g>
                      <path d="M37 92.5q3 3 6 0" stroke="#0F172A" strokeWidth="2" fill="none" strokeLinecap="round" />
                      <ellipse cx="26.5" cy="93" rx="3.4" ry="2.1" fill="#F43F5E" opacity=".75" />
                      <ellipse cx="53.5" cy="93" rx="3.4" ry="2.1" fill="#F43F5E" opacity=".75" />
                    </g>
                  </svg>
                </span>
              </span>
              <small>{isRTL ? 'اضغط على بطاقة الاسم لإعادة الصورة' : 'tap my name tag to bring her back'}</small>
            </div>

            {/* Retro Name Tag */}
            <div
              ref={nameTagRef}
              className="nametag cursor-pointer"
              aria-hidden="true"
              onClick={handleRestorePhoto}
              title={isRTL ? 'إعادة الصورة الواقعية' : 'Restore photo'}
            >
              <span className="nt-top">
                <b>HELLO</b>my name is
              </span>
              <span className="nt-name">
                {Array.from('Habiba').map((ch, i) => (
                  <i key={i} style={{ '--i': i }}>
                    {ch}
                  </i>
                ))}
              </span>
            </div>
          </div>

          {/* Column 2: Designer Bio, Specialties, Live Chat */}
          <div className="about-text">
            <h2 className="h2" id="about-title" data-r>
              {isRTL ? 'أهلاً، أنا حبيبة' : "Hi, I'm Habiba"}
            </h2>

            <p className="lead text-lg font-medium leading-relaxed my-4 text-[var(--plum)]">
              {headline || (isRTL
                ? 'طالبة بكلية الفنون الجميلة بالقاهرة (دفعة ٢٠٢٨)، ومصممة جرافيك ومونتيرة مستقلة.'
                : 'Fine Arts student at Cairo University (Class of 2028), graphic designer and video editor.')}
            </p>

            <p className="text-base opacity-85 leading-relaxed mb-6">
              {bio}
            </p>

            {/* Level & Specialty Badges */}
            <ul className="skills" data-r aria-label="Level and specialties">
              <li className="badge b1">{isRTL ? 'فنون جميلة القاهرة' : 'Fine Arts Cairo'}</li>
              <li className="badge b2">{isRTL ? 'دفعة ٢٠٢٨' : 'Class of 2028'}</li>
              <li>
                <a
                  className="story"
                  href={SOCIAL_LINKS.behance}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={isRTL ? 'حبيبة ياسر على بيهانس' : 'Habiba Yasser on Behance'}
                >
                  <span className="story-ring">
                    <img
                      src="/images/habiba-portrait.png"
                      alt=""
                      width="34"
                      height="34"
                      loading="lazy"
                    />
                    <span className="story-be" aria-hidden="true">Bē</span>
                  </span>
                  <span className="story-txt">
                    <b>{isRTL ? 'حبيبة ياسر' : 'Habiba Yasser'}</b>
                    <small>
                      <span>{isRTL ? 'على بيهانس' : 'on Behance'}</span>
                      <span>{isRTL ? 'شاهد أعمالي' : 'see my work'}</span>
                    </small>
                  </span>
                </a>
              </li>
              <li className="spec-group">
                <svg className="ants" aria-hidden="true">
                  <rect width="100%" height="100%" rx="18" />
                </svg>
                <span className="spec">{isRTL ? 'تخصص في' : 'Specialist in'}</span>
                <span className="chip" style={{ '--i': 0 }}>{isRTL ? 'سوشيال ميديا' : 'Social media'}</span>
                <span className="chip" style={{ '--i': 1 }}>{isRTL ? 'هوية بصرية' : 'Branding'}</span>
                <span className="chip" style={{ '--i': 2 }}>{isRTL ? 'أغلفة الكتب' : 'Book covers'}</span>
                <span className="chip" style={{ '--i': 3 }}>{isRTL ? 'مونتاج الفيديو' : 'Video editing'}</span>
              </li>
            </ul>

            {/* Live Chat Simulation */}
            <ol ref={chatRef} className="chat" id="chat" aria-label="Questions clients ask me">
              {/* FAQ 1: Services / Deliverables */}
              <li className="q" data-r>
                <span className="sr-only">A client asks: </span>
                {isRTL ? 'ما هي مجالات التصميم والخدمات التي تقدمينها؟' : 'Which industries and design services do you offer?'}
              </li>
              <li className="a" data-r style={{ '--d': '.12s' }}>
                <i className="ava" aria-hidden="true">
                  <span className="ava-in">
                    <img src="/images/habiba-sticker.png" alt="Habiba Avatar" />
                  </span>
                </i>
                <span className="sr-only">Habiba: </span>
                <b>{isRTL ? 'مجالات متعددة، وعين دقيقة على التفاصيل.' : 'Many fields, one eye for detail.'}</b>
                {isRTL
                  ? 'أقدم حزم متكاملة تشمل تصاميم منصات التواصل، وأغلفة الكتب، ومونتاج الفيديو الاحترافي وفق هوية بصرية متناسقة.'
                  : 'I craft complete campaign kits, editorial book covers, and rhythmic video editing with refined visual balance.'}
              </li>

              {/* FAQ 2: Academic Background */}
              <li className="q" data-r>
                <span className="sr-only">A client asks: </span>
                {isRTL ? 'ما هي خلفيتك الأكاديمية والمهنية؟' : 'What is your background and design focus?'}
              </li>
              <li className="a" data-r style={{ '--d': '.12s' }}>
                <i className="ava" aria-hidden="true">
                  <span className="ava-in">
                    <img src="/images/habiba-sticker.png" alt="Habiba Avatar" />
                  </span>
                </i>
                <span className="sr-only">Habiba: </span>
                <b>{isRTL ? 'أساس أكاديمي ورؤية معاصرة.' : 'Academic foundations & contemporary craft.'}</b>
                {isRTL
                  ? 'أدرس التصميم بكلية الفنون الجميلة بالقاهرة، وأجمع بين دراسة التكوين اللوني والنسب الهندسية والإنتاج الرقمي الدقيق.'
                  : 'I study graphic design at the Faculty of Fine Arts in Cairo, bridging classical composition and color theory with sharp commercial digital production.'}
              </li>

              {/* FAQ 3: AI in Workflow */}
              <li className="q" data-r>
                <span className="sr-only">A client asks: </span>
                {isRTL ? 'هل تستخدمين أدوات الذكاء الاصطناعي؟' : 'Do you use AI tools in your workflow?'}
              </li>
              <li className="a" data-r style={{ '--d': '.12s' }}>
                <i className="ava" aria-hidden="true">
                  <span className="ava-in">
                    <img src="/images/habiba-sticker.png" alt="Habiba Avatar" />
                  </span>
                </i>
                <span className="sr-only">Habiba: </span>
                <b>{isRTL ? 'الذكاء الاصطناعي أداة مساعدة، وليس المصمم.' : 'AI is an assistant, not the designer.'}</b>
                {isRTL
                  ? 'أوظف أدوات الذكاء الاصطناعي لتوسيع الأفكار وتسريع المسودات، بينما تظل الفكرة الجوهرية والتشطيب الفني بلمسة إنسانية خالصة.'
                  : 'I use AI tools to explore moodboards and accelerate workflows, while concept, balance, and final craftsmanship remain entirely human.'}
              </li>

              {/* Simulated Live Typewriter Interaction (Exactly at the bottom like reference) */}
              <li className="who" id="who-client" aria-hidden="true">
                {whoClient}
              </li>

              <li
                ref={typingClientRef}
                id="typing-client"
                className={`q ${clientPhase === 'dots' ? 'typing' : ''} ${clientPhase === 'typing' ? 'caret' : ''}`}
              >
                <span className="sr-only">{isRTL ? 'يسأل العميل: ' : 'A client asks: '}</span>
                {clientPhase === 'dots' ? (
                  <span className="tdots">
                    <i /><i /><i />
                  </span>
                ) : (
                  clientText
                )}
              </li>

              {designerPhase !== 'none' && (
                <>
                  <li className="who left" id="who-designer" aria-hidden="true">
                    {whoDesigner}
                  </li>

                  <li
                    ref={habibaAnswerRef}
                    id="habiba-answer"
                    className={`a ${designerPhase === 'dots' ? 'typing' : ''}`}
                  >
                    <i className="ava" aria-hidden="true">
                      <span className="ava-in">
                        <img src="/images/habiba-sticker.png" alt="Habiba Avatar" />
                      </span>
                    </i>
                    <span className="sr-only">Habiba: </span>
                    {designerPhase === 'dots' ? (
                      <span className="tdots">
                        <i /><i /><i />
                      </span>
                    ) : (
                      <>
                        <b>{isRTL ? 'اليوم، إذا كنت مستعداً ✿' : "Today, if you're ready ✿"}</b>
                        {isRTL ? (
                          <>احكيلي عن مشروعك و<a href="#contact">يلا نبدأ سوا</a>.</>
                        ) : (
                          <>Tell me about your brand and <a href="#contact">make a wish</a>.</>
                        )}
                      </>
                    )}
                  </li>
                </>
              )}
            </ol>
          </div>
        </div>

        {/* 3D Boarding Pass & CV Modal Trigger */}
        <div data-r>
          <div className="pass-wrap" id="pass" ref={passRef}>
            <article className="pass" aria-label="Quick facts and boarding pass">
              <div className="pass-main">
                <header className="pass-head">
                  <span className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
                      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" transform="rotate(90 12 12)" />
                    </svg>
                    {isRTL ? 'تذكرة صعود الطائرة' : 'Boarding pass'}
                  </span>
                  <span>{bp.flight || 'Flight HY 2028'}</span>
                </header>

                <div className="pass-route">
                  <div className="city">
                    <b>{bp.fromCode || 'CAI'}</b>
                    <span>{bp.fromCity || (isRTL ? 'القاهرة، مصر' : 'Cairo, Egypt')}</span>
                  </div>
                  <div className="route" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" transform="rotate(90 12 12)" />
                    </svg>
                  </div>
                  <div className="city to">
                    <b>{bp.toCode || 'YOU'}</b>
                    <span>{bp.toCity || (isRTL ? 'مشروعك وعلامتك' : 'Your brand')}</span>
                  </div>
                </div>

                <dl className="pass-fields">
                  <div>
                    <dt>{isRTL ? 'المسافر' : 'Passenger'}</dt>
                    <dd>{bp.passenger || (isRTL ? 'حبيبة ياسر' : 'Habiba Yasser')}</dd>
                  </div>
                  <div>
                    <dt>{isRTL ? 'الدرجة' : 'Class'}</dt>
                    <dd>{bp.degree || (isRTL ? 'فنون جميلة، دفعة ٢٠٢٨' : 'Fine Arts, Class of 2028')}</dd>
                  </div>
                  <div>
                    <dt>{isRTL ? 'التخصص' : 'Specialization'}</dt>
                    <dd>{bp.specialty || (isRTL ? 'جرافيك ومونتاج فيديو' : 'Graphic Design & Video Editing')}</dd>
                  </div>
                  <div>
                    <dt>{isRTL ? 'الاعتمادات الموثقة' : 'Verified Training'}</dt>
                    <dd>{bp.certificates || 'TIEC & ITI Certificates'}</dd>
                  </div>
                  <div>
                    <dt>{isRTL ? 'لغات التصميم' : 'Design Languages'}</dt>
                    <dd>{bp.languages || (isRTL ? 'العربية والإنجليزية' : 'Arabic & English')}</dd>
                  </div>
                  <div>
                    <dt>{isRTL ? 'الحالة' : 'Status'}</dt>
                    <dd>{bp.status || (isRTL ? 'متاحة لمشاريع جديدة' : 'Open for projects')}</dd>
                  </div>
                </dl>
              </div>

              {/* Perforated Stub */}
              <div className="pass-stub">
                <span className="stub-label text-xs uppercase font-bold tracking-wider opacity-70 block">
                  {bp.stubLabel || (isRTL ? 'السيرة الذاتية والشهادات' : 'Credentials & CV')}
                </span>

                <b className="stub-title block">{bp.stubTitle || (isRTL ? 'حبيبة ياسر' : 'Habiba Yasser')}</b>

                <span className="barcode" aria-hidden="true" />

                <div className="flex flex-col gap-2 w-full">
                  <button
                    className="btn btn-candy cursor-pointer w-full"
                    type="button"
                    data-cv
                    onClick={openCvDialog}
                  >
                    {isRTL ? 'اقرأ سيرتي الذاتية' : 'Read my CV'}
                  </button>

                  <a
                    className="btn stub-dl text-center cursor-pointer w-full block"
                    href={cvUrl}
                    download={cvFileName}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {isRTL ? 'تحميل السيرة الذاتية (PDF)' : 'Download PDF 🠓'}
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>

        {/* 1:1 Reference Native <dialog id="cv-dialog"> with Embedded PDF */}
        <dialog
          id="cv-dialog"
          ref={cvDialogRef}
          className="cv-dialog"
          onClick={(e) => {
            if (e.target === cvDialogRef.current) closeCvDialog();
          }}
        >
          <div className="win-bar">
            <span className="dots flex items-center gap-1.5">
              <button
                type="button"
                id="cv-close"
                title={isRTL ? 'إغلاق' : 'Close'}
                onClick={closeCvDialog}
              >
                ×
              </button>
              <i />
              <i />
            </span>
            <span className="font-bold text-xs sm:text-sm text-[var(--plum)]">
              {cvFileName}
            </span>
            <div className="cv-actions">
              <a
                href={cvUrl}
                download={cvFileName}
                className="dl"
                target="_blank"
                rel="noopener noreferrer"
              >
                {isRTL ? 'تحميل PDF 🠓' : 'Download PDF 🠓'}
              </a>
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold px-2.5 py-1 rounded-full border border-[var(--plum)] hover:bg-[var(--blush)] text-[var(--plum)]"
              >
                {isRTL ? 'فتح في نافذة جديدة ↗' : 'Open in new tab ↗'}
              </a>
              <button type="button" onClick={closeCvDialog}>
                {isRTL ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>

          {/* Document Content View */}
          <div className="flex-1 w-full overflow-y-auto bg-[#334155]/10 p-3 sm:p-6 flex justify-center items-start">
            <div className="bg-white rounded-xl shadow-2xl max-w-full w-[780px] border border-slate-300 overflow-hidden">
              {cvUrl.startsWith('data:') ? (
                <iframe
                  src={`${cvUrl}#view=FitH`}
                  title="Habiba Yasser CV PDF Viewer"
                  className="w-full h-[75vh] border-0"
                />
              ) : (
                <img
                  src="/assets/Habiba-Yasser-CV.png"
                  alt="Habiba Yasser CV — السيرة الذاتية حبيبة ياسر"
                  className="w-full h-auto block"
                  loading="eager"
                />
              )}
            </div>
          </div>
        </dialog>
      </div>
    </section>
  );
}
