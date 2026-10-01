// WhatsApp link configuration & Direct Social Links
export const SOCIAL_LINKS = {
  email: 'habibamarghani1@gmail.com',
  behance: 'https://www.behance.net/habibayasser43',
  linkedin: 'https://www.linkedin.com/in/habiba-yasser3',
  whatsapp: 'https://wa.me/201117616300'
};

export const WHATSAPP_CONFIG = {
  number: '201117616300', 
  getLink: (lang) => {
    const text = lang === 'ar'
      ? 'مرحباً أستاذة حبيبة، اطلعت على أعمالك في موقعك وأود الاستفسار عن مشروع تصميم...'
      : 'Hello Habiba, I reviewed your design portfolio and would like to discuss a project...';
    
    return `https://wa.me/${WHATSAPP_CONFIG.number}?text=${encodeURIComponent(text)}`;
  }
};

// Project categories: Manila Folder Cabinet Categories
export const CATEGORIES = [
  {
    id: 'all',
    slug: 'all',
    name: { ar: 'كل الأعمال', en: 'All Works' },
    color: 'var(--candy)',
    desc: {
      ar: 'استعراض شامل لجميع الأعمال والمشاريع المنفذة بمختلف المجالات الإعلانية والبصرية.',
      en: 'A comprehensive showcase of creative works across advertising, media, and visual design.'
    }
  },
  {
    id: 'social',
    slug: 'social',
    name: { ar: 'سوشيال ميديا', en: 'Social Media' },
    color: 'var(--blush)',
    desc: {
      ar: 'حملات إعلانية ومنشورات وتصاميم مخصصة لمنصات التواصل الاجتماعي تجذب الانتباه وتعزز التفاعل.',
      en: 'High-impact social media campaigns, promotional creatives, and engaging digital content.'
    }
  },
  {
    id: 'media',
    slug: 'media',
    name: { ar: 'أغلفة وميديا', en: 'Covers & Media' },
    color: 'var(--butter)',
    desc: {
      ar: 'تصاميم أغلفة الكتب والملازم ومصغرات يوتيوب التعليمية بتكوين بصري متزن وموجه.',
      en: 'Educational book covers, publication layouts, and click-worthy YouTube thumbnails.'
    }
  },
  {
    id: 'brand',
    slug: 'brand',
    name: { ar: 'هوية ودراسات فنية', en: 'Visual Studies' },
    color: 'var(--peri)',
    desc: {
      ar: 'مفاهيم بصرية وتكوينات معمارية ونحتية تبرز جوهر العلامات التجارية والأثاث العصري.',
      en: 'Artistic compositions and visual studies exploring form, space, and modern branding.'
    }
  }
];

export const PORTFOLIO_CONTENT = {
  ar: {
    nav: {
      name: 'حبيبة ياسر',
      work: 'الأعمال',
      about: 'عن المصممة',
      services: 'الخدمات',
      contact: 'تواصل',
      whatsapp: 'واتساب',
      status: 'متاحة لمشاريع جديدة',
    },
    hero: {
      eyebrow: 'طالبة بكلية الفنون الجميلة | مصممة جرافيك ومونتيرة',
      name: 'حبيبة ياسر',
      title: 'مصممة جرافيك ومونتيرة من القاهرة، مصر.',
      description: 'أهلاً بيك! نورت المكان ✿ خدلك لفة وشوف البراندات والتصاميم اللي حبيت أطلعها للنور بكل تفاصيلها.',
      ctaPrimary: 'خلينا نشتغل سوا',
      ctaSecondary: 'استعراض الأعمال',
      status: 'متاحة لمشاريع جديدة',
      location: 'القاهرة، مصر',
      portraitAlt: 'صورة شخصية للمصممة حبيبة ياسر',
    },
    works: {
      eyebrow: '',
      sectionTitle: 'أعمال مختارة',
      sectionSubtitle: '',
      viewFull: 'معاينة بدقة كاملة',
      disclaimer: '',
      items: [
        {
          id: 'aswan-row-routine',
          index: '01',
          year: '2024',
          title: 'حملة الهروب من الروتين — كاياك وتجديف أسوان',
          category: 'إعلان سوشيال ميديا وبوستر رأسي',
          categorySlug: 'social',
          description: 'بوستر إعلاني رأسي لمنصات التواصل يسلط الضوء على تجربة التجديف في نيل أسوان الساحر مع عرض ترويجي بخصم 50%، معتمداً على لقطات بولارويد حية وألوان صيفية مبهجة.',
          image: '/images/aswan-row-routine.jpg',
          accent: '#0284C7',
          tags: ['ASWAN ROW', 'سوشيال ميديا', 'إعلان ترويجي', 'أسوان'],
          aspectRatio: 'aspect-[9/16]',
          metrics: {
            studyFocus: 'لقطات بولارويد تفاعلية مع خلفية السماء الصافية',
            composition: 'تسلسل هرمي يبدأ بالدعوة الرئيسية وينتهي ببيانات الحجز',
            colorHarmony: 'أزرق النيل والسماء مع الأصفر المشمس والرمادي',
            deliverable: 'بوستر رأسي لقصص إنستغرام وفيسبوك'
          }
        },
        {
          id: 'aswan-row-group6',
          index: '02',
          year: '2024',
          title: 'حملة عرض الصحاب — اللمة تكمل بـ 6',
          category: 'منشور سوشيال ميديا ترويجي',
          categorySlug: 'social',
          description: 'منشور تفاعلي يركز على عروض المجموعات والأصدقاء في شهر مايو (احجز 4 و2 مجاناً)، بتوزيع ثلاثي للصور في إطارات دائرية ناعمة تعكس روح البهجة والنشاط.',
          image: '/images/aswan-row-group6.jpg',
          accent: '#F59E0B',
          tags: ['ASWAN ROW', 'عرض الصحاب', 'بوست ترويجي', 'فوتوشوب'],
          aspectRatio: 'aspect-[4/5]',
          metrics: {
            studyFocus: 'استعراض تجربة الأصدقاء والمجموعات التفاعلية',
            composition: 'إطار ثلاثي مقوس مع إبراز شارة العرض المجاني',
            colorHarmony: 'الأصفر المشمس مع زرقة مياه النيل والرمال',
            deliverable: 'منشورات سوشيال ميديا لمنصات إنستغرام وفيسبوك'
          }
        },
        {
          id: 'aswan-row-friday-ride',
          index: '03',
          year: '2024',
          title: 'رايد الجمعة — لحظات الصيف على ضفاف النيل',
          category: 'منشور إعلاني مخصص للفيد',
          categorySlug: 'social',
          description: 'تصميم إعلاني مربع لرايد الجمعة الأسبوعي للتجديف في نيل أسوان عند الغروب، مع تقسيم ثلاثي عمودي يعزز عمق المشهد الطبيعي ونقاء المياه.',
          image: '/images/aswan-row-friday-ride.jpg',
          accent: '#0EA5E9',
          tags: ['ASWAN ROW', 'رايد الجمعة', 'سوشيال ميديا', 'تصميم مربع'],
          aspectRatio: 'aspect-square',
          metrics: {
            studyFocus: 'التجمع الشبابي وأجواء التجديف عند الغروب',
            composition: 'نافذة ثلاثية متوازية تفصل مشهد التجديف بتناغم',
            colorHarmony: 'تباين بين زرقة المياه ودفء أشعة الشمس الذهبية',
            deliverable: 'بوست فيسبوك وإنستغرام مربع (1080x1080)'
          }
        },
        {
          id: 'elsayegh-science-yt',
          index: '04',
          year: '2024',
          title: 'حل كتاب الصايغ — غلاف تعليمي وبوستر يوتيوب',
          category: 'غلاف كتاب وبوستر يوتيوب تعليمي',
          categorySlug: 'media',
          description: 'تصميم متكامل يجمع بين إخراج غلاف كتاب "العلوم المتكاملة" ومصغرة يوتيوب تعليمية موجهة للمرحلة الثانوية، مع إبراز هوية المدرس وتجسيد مجسم الكتاب ثلاثي الأبعاد.',
          image: '/images/elsayegh-science-yt.jpg',
          accent: '#8B5CF6',
          tags: ['كتاب الصايغ', 'أغلفة كتب', 'مصغرات يوتيوب', 'علوم متكاملة'],
          aspectRatio: 'aspect-video',
          metrics: {
            studyFocus: 'دمج صورة المحاضر مع موكاب ثلاثي الأبعاد للغلاف',
            composition: 'كتلة نصية محاطة بشريط بارز مع توزيع متزن',
            colorHarmony: 'البنفسجي الأكاديمي مع الأصفر المشع وخلفية المكتبة',
            deliverable: 'مصغرة يوتيوب وبوستر ترويجي بدقة 16:9'
          }
        },
        {
          id: 'ashley-chair-50',
          index: '05',
          year: '2024',
          title: 'حملة الخصم الترويجية — أناقة تتجدد',
          category: 'إعلان تجاري وترويج عروض',
          categorySlug: 'social',
          description: 'تصميم تجاري وترويجي يركز على التسلسل الهرمي البصري، ونسب الخصم، وتوزيع العناصر لجذب انتباه المتلقي بدقة.',
          image: '/images/ashley-chair-50.jpg',
          accent: '#2563EB',
          tags: ['Ashley Furniture', 'Commercial Ad', 'Sale 50%', 'Typography'],
          aspectRatio: 'aspect-square',
          metrics: {
            studyFocus: 'الهرمية البصرية وتوجيه العين',
            composition: 'كتلة نصية متباينة مع توزيع الكراسي',
            colorHarmony: 'الأزرق الداكن والأبيض الصريح',
            deliverable: 'منشورات سوشيال ميديا ومطبوعات'
          }
        },
        {
          id: 'ashley-root-chair',
          index: '06',
          year: '2024',
          title: 'كرسي اللوتس النحتي — من قلب الطبيعة',
          category: 'دراسة مفهوم فني وإخراج بصري',
          categorySlug: 'brand',
          description: 'تكوين فني تجريدي يبرز العلاقة بين التشكيل النحتي العضوي لجذع الشجرة وورقة اللوتس في إطار إعلاني هادئ.',
          image: '/images/ashley-root-chair.jpg',
          accent: '#1D4ED8',
          tags: ['Ashley Furniture', 'Visual Study', 'Social Media', 'Photoshop'],
          aspectRatio: 'aspect-square',
          metrics: {
            studyFocus: 'التشكيل العضوي والضوء الطبيعي',
            composition: 'مركزية متزنة بقاعدة خشبية نحتية',
            colorHarmony: 'تدرجات الخشب الدافئ والرمادي الهادئ',
            deliverable: 'حملة إعلانية للسوشيال ميديا'
          }
        },
        {
          id: 'ashley-puzzle',
          index: '07',
          year: '2024',
          title: 'غرفة المعيشة المتناغمة — قطع الأحجية',
          category: 'حملة بصرية وتنسيق فراغي',
          categorySlug: 'brand',
          description: 'فكرة إعلانية قائمة على تشبيه عناصر الأثاث بقطع الأحجية التي تكتمل بتناغم داخل مساحة المعيشة العصرية.',
          image: '/images/ashley-puzzle.jpg',
          accent: '#60A5FA',
          tags: ['Ashley Furniture', 'Living Space', 'Creative Concept', 'Layout'],
          aspectRatio: 'aspect-square',
          metrics: {
            studyFocus: 'التناغم الفراغي وفكرة الأحجية',
            composition: 'شبكة ديناميكية تجمع الأريكة والمقاعد',
            colorHarmony: 'درجات الأزرق المائل للبترولي والبيج',
            deliverable: 'محتوى رقمي وحملات موجهة'
          }
        },
        {
          id: 'ashley-split-arch',
          index: '08',
          year: '2024',
          title: 'سلسلة الأقواس المعمارية — غرفة الطعام',
          category: 'تصميم تحريري وإخراج ملصقات',
          categorySlug: 'brand',
          description: 'توزيع رأسي ثلاثي الأقواس يعرض تفاصيل طاولة الطعام ومقاعدها مع تنظيم خطي للمواصفات والأسعار الترويجية.',
          image: '/images/ashley-split-arch.jpg',
          accent: '#3B82F6',
          tags: ['Ashley Furniture', 'Dining Room', 'Poster Design', 'Editorial'],
          aspectRatio: 'aspect-square',
          metrics: {
            studyFocus: 'الأقواس المعمارية كإطارات تفاعلية',
            composition: 'ثلاثي رأسي (Triptych) يعرض الزوايا',
            colorHarmony: 'الأزرق الملكي والخشب الطبيعي',
            deliverable: 'ملصقات إعلانية وعرض كتالوج'
          }
        }
      ]
    },
    about: {
      eyebrow: '',
      sectionTitle: 'رؤية أكاديمية وتنفيذ بصري معاصر',
      headline: 'طالبة فنون جميلة تجمع بين المعرفة الأكاديمية والإنتاج الرقمي الدقيق.',
      bio: 'أدرس التصميم الجرافيكي بكلية الفنون الجميلة (دفعة ٢٠٢٨)، وأعمل بشكل مستقل على مساعدة صناع المحتوى والعلامات التجارية في تحويل أفكارهم ورؤاهم إلى تصاميم بصرية متزنة ومؤثرة. يركز أسلوبي على الإنصات لسياق العميل، وإتقان التكوين اللوني والطباعي، وبناء حلول تصميمية تتسم بالهدوء والفاعلية التجارية.',
      credentials: [
        { title: 'Motion Graphics', issuer: 'TIEC (مركز الإبداع التكنولوجي)' },
        { title: '2D Graphics Design', issuer: 'معهد تكنولوجيا المعلومات (ITI)' },
        { title: 'Sound & Video Editing', issuer: 'معهد تكنولوجيا المعلومات (ITI)' },
        { title: 'Social Media Marketing', issuer: 'TIEC (مركز الإبداع التكنولوجي)' }
      ],
      tools: ['Photoshop', 'Illustrator', 'After Effects', 'Premiere Pro', 'Canva'],
      portrait: {
        image: '/images/habiba-portrait.jpg',
        alt: 'صورة شخصية للمصممة حبيبة ياسر',
        name: 'حبيبة ياسر',
        role: 'مصممة جرافيك ومونتيرة',
        education: 'كلية الفنون الجميلة — قسم جرافيك',
        graduation: 'دفعة ٢٠٢٨',
        location: 'القاهرة، مصر',
      },
      boardingPass: {
        flight: 'Flight HY 2028',
        passenger: 'حبيبة ياسر',
        degree: 'فنون جميلة، دفعة ٢٠٢٨',
        specialty: 'جرافيك ومونتاج فيديو',
        certificates: 'TIEC & ITI Certificates',
        languages: 'العربية والإنجليزية',
        status: 'متاحة لمشاريع جديدة',
        fromCode: 'CAI',
        fromCity: 'القاهرة، مصر',
        toCode: 'YOU',
        toCity: 'مشروعك وعلامتك',
        stubTitle: 'حبيبة ياسر',
        stubLabel: 'السيرة الذاتية والشهادات',
        cvFileName: 'Habiba-Yasser-CV.pdf',
        cvUrl: '/assets/Habiba-Yasser-CV.pdf'
      }
    },
    contact: {
      eyebrow: '',
      heading: 'عندك فكرة أو أمنية لمشروعك؟',
      subheading: '',
      ctaPrimary: 'خلينا نشتغل سوا',
      ctaSecondary: 'راسلني عبر البريد الإلكتروني',
      email: 'habibamarghani1@gmail.com',
      behance: 'https://www.behance.net/habibayasser43',
      linkedin: 'https://www.linkedin.com/in/habiba-yasser3',
      note: 'الرد المباشر متاح عبر واتساب لمناقشة المشاريع الجديدة.',
    },
    footer: {
      name: 'حبيبة ياسر',
      role: 'مصممة جرافيك ومونتيرة',
      backToTop: 'العودة للأعلى',
      rights: 'جميع الحقوق محفوظة.',
      links: [
        { label: 'الأعمال', href: '#work' },
        { label: 'عن المصممة', href: '#about' },
        { label: 'الخدمات', href: '#services' },
        { label: 'تواصل', href: '#contact' },
      ],
    }
  },
  en: {
    nav: {
      name: 'Habiba Yasser',
      work: 'Work',
      about: 'About',
      services: 'Services',
      contact: 'Contact',
      whatsapp: 'WhatsApp',
      status: 'Available for projects',
    },
    hero: {
      eyebrow: 'Fine Arts Student | Graphic Designer & Video Editor',
      name: 'Habiba Yasser',
      title: 'Graphic designer based in Cairo, Egypt.',
      description: 'Hi, you made it! Pull up a chair and look around. These are the brands, feeds and ideas I loved bringing to life.',
      ctaPrimary: "Let's work together",
      ctaSecondary: 'See my work',
      status: 'Available for projects',
      location: 'Cairo, Egypt',
      portraitAlt: 'Portrait of designer Habiba Yasser',
    },
    works: {
      eyebrow: '',
      sectionTitle: 'Selected work',
      sectionSubtitle: '',
      viewFull: 'View full size',
      disclaimer: '',
      items: [
        {
          id: 'aswan-row-routine',
          index: '01',
          year: '2024',
          title: 'Break the Routine Campaign — Aswan Rowing & Kayaking',
          category: 'Social Media Ad & Story Campaign',
          categorySlug: 'social',
          description: 'Dynamic vertical story ad highlighting the Nile kayaking experience in Aswan with a 50% discount offer, featuring candid polaroid snapshots and vibrant summer hues.',
          image: '/images/aswan-row-routine.jpg',
          accent: '#0284C7',
          tags: ['ASWAN ROW', 'Social Media', 'Summer Campaign', 'Poster'],
          aspectRatio: 'aspect-[9/16]',
          metrics: {
            studyFocus: 'Candid polaroid moments with clear sky backdrop',
            composition: 'Top-down visual hierarchy leading to booking CTA',
            colorHarmony: 'Nile and sky blues contrasted with sunny yellow',
            deliverable: 'Vertical story ads for Instagram and Facebook'
          }
        },
        {
          id: 'aswan-row-group6',
          index: '02',
          year: '2024',
          title: 'Friends Offer Campaign — Aswan Kayak Group Ride',
          category: 'Promotional Social Media Post',
          categorySlug: 'social',
          description: 'An engaging group-offer social post for the May promotion (Book 4, Get 2 Free), arranged in a triptych of rounded arched frames capturing energetic team kayaking.',
          image: '/images/aswan-row-group6.jpg',
          accent: '#F59E0B',
          tags: ['ASWAN ROW', 'Friends Promo', 'Social Post', 'Photoshop'],
          aspectRatio: 'aspect-[4/5]',
          metrics: {
            studyFocus: 'Dynamic group kayaking experience showcase',
            composition: 'Triptych rounded arch layout with promotional badge',
            colorHarmony: 'Warm sunshine yellow paired with deep river blues',
            deliverable: 'Engaging social feed posts for Instagram and Facebook'
          }
        },
        {
          id: 'aswan-row-friday-ride',
          index: '03',
          year: '2024',
          title: 'Friday Ride — Summer Kayak On The Nile',
          category: 'Square Feed Ad & Community Event',
          categorySlug: 'social',
          description: 'Square feed announcement for the weekly Friday sunset kayak ride in Aswan, featuring a rhythmic three-pillar photo crop framing the scenic river backdrop.',
          image: '/images/aswan-row-friday-ride.jpg',
          accent: '#0EA5E9',
          tags: ['ASWAN ROW', 'Friday Ride', 'Social Feed', 'Square Post'],
          aspectRatio: 'aspect-square',
          metrics: {
            studyFocus: 'Sunset rowing atmosphere and community vibe',
            composition: 'Vertical three-slit window framing the scenic river',
            colorHarmony: 'Water blues contrasted with warm golden hour tones',
            deliverable: 'Square feed post optimized for 1080x1080 resolution'
          }
        },
        {
          id: 'elsayegh-science-yt',
          index: '04',
          year: '2024',
          title: 'El-Sayegh Integrated Sciences — Book Cover & YouTube Media',
          category: 'Educational Book Cover & YouTube Visual',
          categorySlug: 'media',
          description: 'Integrated visual branding combining a 3D educational textbook mock-up with a high-contrast YouTube thumbnail for secondary school sciences.',
          image: '/images/elsayegh-science-yt.jpg',
          accent: '#8B5CF6',
          tags: ['El-Sayegh Book', 'Book Cover', 'YouTube Thumbnail', 'Education'],
          aspectRatio: 'aspect-video',
          metrics: {
            studyFocus: 'Instructor presence blended with 3D book mockup',
            composition: 'Bold brushed tape headline with balanced visual anchor',
            colorHarmony: 'Academic violet, warm glowing yellow, and library depth',
            deliverable: '16:9 high-CTR YouTube thumbnail and promo poster'
          }
        },
        {
          id: 'ashley-chair-50',
          index: '05',
          year: '2024',
          title: 'Promotional 50% Campaign — Elegance Renewed',
          category: 'Commercial Ad & Offer Promotion',
          categorySlug: 'social',
          description: 'Commercial campaign layout focusing on visual hierarchy, discount prominence, and clean typographic structure.',
          image: '/images/ashley-chair-50.jpg',
          accent: '#2563EB',
          tags: ['Ashley Furniture', 'Commercial Ad', 'Sale 50%', 'Typography'],
          aspectRatio: 'aspect-square',
          metrics: {
            studyFocus: 'Visual hierarchy and eye path flow',
            composition: 'Contrasting typographic block with product balance',
            colorHarmony: 'Deep blue and crisp white contrast',
            deliverable: 'Social media posts and display prints'
          }
        },
        {
          id: 'ashley-root-chair',
          index: '06',
          year: '2024',
          title: 'Sculptural Lotus Chair — From Nature',
          category: 'Concept & Visual Art Direction',
          categorySlug: 'brand',
          description: 'Conceptual composition exploring the balance between organic tree root sculptures and modern living spaces.',
          image: '/images/ashley-root-chair.jpg',
          accent: '#1D4ED8',
          tags: ['Ashley Furniture', 'Visual Study', 'Social Media', 'Photoshop'],
          aspectRatio: 'aspect-square',
          metrics: {
            studyFocus: 'Organic forms and natural lighting',
            composition: 'Centered balance with sculptural base',
            colorHarmony: 'Warm natural wood and soft slate grey',
            deliverable: 'Social media campaign visuals'
          }
        },
        {
          id: 'ashley-puzzle',
          index: '07',
          year: '2024',
          title: 'Cohesive Living Space — The Puzzle Concept',
          category: 'Creative Spatial Campaign',
          categorySlug: 'brand',
          description: 'Creative campaign likening curated furniture pieces to puzzle elements seamlessly uniting modern living rooms.',
          image: '/images/ashley-puzzle.jpg',
          accent: '#60A5FA',
          tags: ['Ashley Furniture', 'Living Space', 'Creative Concept', 'Layout'],
          aspectRatio: 'aspect-square',
          metrics: {
            studyFocus: 'Harmonious spatial composition and puzzle motif',
            composition: 'Dynamic multi-angle grid connecting sofa and chairs',
            colorHarmony: 'Petrol blue tones and warm beige neutrals',
            deliverable: 'Targeted digital campaigns and banners'
          }
        },
        {
          id: 'ashley-split-arch',
          index: '08',
          year: '2024',
          title: 'Architectural Arches Series — Dining Collection',
          category: 'Editorial Layout & Poster Design',
          categorySlug: 'brand',
          description: 'Vertical three-panel arch presentation framing dining collection details with architectural typographic alignment.',
          image: '/images/ashley-split-arch.jpg',
          accent: '#3B82F6',
          tags: ['Ashley Furniture', 'Dining Room', 'Poster Design', 'Editorial'],
          aspectRatio: 'aspect-square',
          metrics: {
            studyFocus: 'Architectural arches as framing devices',
            composition: 'Vertical triptych highlighting dining set details',
            colorHarmony: 'Classic royal blue and natural solid wood',
            deliverable: 'Campaign posters and catalog layout'
          }
        }
      ]
    },
    about: {
      eyebrow: '',
      sectionTitle: 'Academic Foundations & Modern Digital Execution',
      headline: 'Fine Arts student uniting foundational design principles with contemporary digital craft.',
      bio: 'Currently studying Graphic Design at the Faculty of Fine Arts (Class of 2028), I work independently with creators and emerging brands to translate ideas into balanced, purposeful visual communications. My methodology centers on listening to client context, mastering compositional hierarchy, and delivering refined visual solutions that serve practical commercial goals without superficial clutter.',
      credentials: [
        { title: 'Motion Graphics', issuer: 'TIEC' },
        { title: '2D Graphics Design', issuer: 'Information Technology Institute (ITI)' },
        { title: 'Sound & Video Editing', issuer: 'Information Technology Institute (ITI)' },
        { title: 'Social Media Marketing', issuer: 'TIEC' }
      ],
      tools: ['Photoshop', 'Illustrator', 'After Effects', 'Premiere Pro', 'Canva'],
      portrait: {
        image: '/images/habiba-portrait.jpg',
        alt: 'Portrait of designer Habiba Yasser',
        name: 'Habiba Yasser',
        role: 'Graphic Designer | Video Editor',
        education: 'Faculty of Fine Arts — Graphic Design',
        graduation: 'Class of 2028',
        location: 'Cairo, Egypt',
      },
      boardingPass: {
        flight: 'Flight HY 2028',
        passenger: 'Habiba Yasser',
        degree: 'Fine Arts, Class of 2028',
        specialty: 'Graphic Design & Video Editing',
        certificates: 'TIEC & ITI Certificates',
        languages: 'Arabic & English',
        status: 'Open for projects',
        fromCode: 'CAI',
        fromCity: 'Cairo, Egypt',
        toCode: 'YOU',
        toCity: 'Your brand',
        stubTitle: 'Habiba Yasser',
        stubLabel: 'Credentials & CV',
        cvFileName: 'Habiba-Yasser-CV.pdf',
        cvUrl: '/assets/Habiba-Yasser-CV.pdf'
      }
    },
    contact: {
      eyebrow: '',
      heading: 'Got a brand wish?',
      subheading: '',
      ctaPrimary: "Let's work together",
      ctaSecondary: 'Email me directly',
      email: 'habibamarghani1@gmail.com',
      behance: 'https://www.behance.net/habibayasser43',
      linkedin: 'https://www.linkedin.com/in/habiba-yasser3',
      note: 'Direct chat available via WhatsApp for new project inquiries.',
    },
    footer: {
      name: 'Habiba Yasser',
      role: 'Graphic Designer | Video Editor',
      backToTop: 'Back to top',
      rights: 'All rights reserved.',
      links: [
        { label: 'Work', href: '#work' },
        { label: 'About', href: '#about' },
        { label: 'Services', href: '#services' },
        { label: 'Contact', href: '#contact' },
      ],
    }
  }
};
