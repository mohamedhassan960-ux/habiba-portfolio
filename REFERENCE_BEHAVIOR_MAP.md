# REFERENCE BEHAVIOR MAP — SALMA OSAMA LIVE REFERENCE
**URL:** `https://salmaosama.online/`  
**Purpose:** Forensic behavioral and structural blueprint for 1:1 parity reconstruction of Habiba Yasser's Portfolio.

---

## SYSTEM 1: GLOBAL ENVIRONMENT & SKY ENGINE
- **Visual Structure:**
  - Fixed full-screen diurnal sky backdrop (`.sky`).
  - Vertical sky gradient shifts automatically driven by scroll progress (`--day` token: Dawn `#FFE5EE` → Day `#F8FAFC` → Sunset `#F9A8D4` / `#C7D2FE` → Night `#0B0F19` / `#1E1B4B`).
  - Procedural starfield with random twinkle animations (`#twinkles`, SVG `#spark`).
  - Floating SVG clouds at varied depths drifting horizontally (`.cloud`, `#clouds`).
  - Astronomical moon simulation (`#moon-sky`, `#moon-canvas`, `#moon-tip`): calculates exact lunar phase from epoch date (`Date.UTC(2000, 0, 6, 18, 14)` and synodic month `29.530588853`), rendering crater reliefs and maria (`Procellarum`, `Imbrium`, `Serenitatis`, `Crisium`) via 2D canvas with sun grazing light shaders.
- **Interactions & Behaviors:**
  - Moon position adapts to viewport width (`placeMoon()`).
  - Moon is draggable on desktop when night opacity > 0.4: `pointerdown` captures pointer, drags moon with tilt angle (`--mr`), spawns magic dust particles (`magic()`), and on release springs back with damped harmonic inertia (`springHome()`).
  - Hovering over moon reveals tooltip `#moon-tip` showing phase name, % illuminated, and lunar cycle day.
- **Reset:** Spring return on pointer release.

---

## SYSTEM 2: CURSOR ENGINE
- **Visual Structure:**
  - Custom SVG Data URI cursors declared on `:root`:
    - `--cur`: Hot pink / electric arrow pointer with retro dark border and sparkling star accent (`32x32`).
    - `--cur-pen`: Illustrator pen tool icon (`30x30`) with hot pink tip.
    - `--cur-eraser`: Angled pink eraser block (`28x28`).
    - `--cur-cross`: Precision crosshair with central dot (`28x28`).
  - Global CSS rule: `html { cursor: var(--cur, auto); }` and `a, button, [role="tab"], label, .item, .clicky { cursor: var(--cur, pointer); }`.
  - Floating Hero Cursor (`.fcursor`): SVG designer cursor with pink label (`Salma` / `Habiba`) roaming autonomously with `@keyframes roam`.
- **Interactions & Behaviors:**
  - Cursor seamlessly swaps according to active drawing tool on canvas (`data-tool="pen|pencil|rect|ellipse|eraser|select"`).

---

## SYSTEM 3: NAVIGATION CAPSULE & RETRO WINDOW MENU
- **Visual Structure:**
  - Capsule `#nav` floating fixed at top center (`backdrop-filter: blur(12px)`).
  - Left traffic light dots (`.dots`): close `×`, minimize `–`, maximize `+`.
  - Search pill / Brand badge (`.nav-logo`): magnifying glass icon + designer name with individual character wave spans (`.nl-name i`).
  - Navigation links: Work, About, Services/Apps, Contact.
  - Language toggle pill (`EN` / `عربي`).
  - Menu button (`#menu-btn`): burger lines + "Menu" label.
  - Window flyout `#menu` (`menu.exe`): retro titlebar, category links, pulsing status dot, WhatsApp direct link, and "Bring the bar back" action.
- **Interactions & Behaviors:**
  - Clicking `×` on nav triggers `tuckBar()`: child elements collapse sequentially toward center with scale/opacity fade, and nav shrinks into compact button.
  - Clicking `#bar-back` triggers `bringBar()`: spring expansion restoring all items.
  - Hovering nav logo triggers sequential character wave (`nlwave`).
  - ESC or clicking outside closes `#menu`.

---

## SYSTEM 4: HERO DISPLAY TYPOGRAPHY & INTERACTIVE CHARACTERS
- **Visual Structure:**
  - Selection bounding frame (`.sel`): 8 resize handles + PSD document tab (`portfolio_final_FINAL.psd`).
  - Giant display wordmark: cursive "P" (`Mea Culpa`) + jelly sans letters (`Nunito 900`).
  - Illustrated Character Sticker inside "o" (`.w-o`): die-cut white outline sticker with animated tracking eyes (`.eye.e1`, `.eye.e2`, `.iris`, `.lid`) and tooltip "that's me ✿".
  - Hero Kitty Cat (`#hero-cat`): sitting on "l/o", animated tail (`.ctail`), tracking eyes (`.pupils`, `.lids`), and tooltip "meow ✿".
  - Floating retro window `hello.txt` (`#namewin`): close, minimize, maximize.
  - Marching-ants Ghost button (`#nw-ghost`): dashed SVG border, reveals when `hello.txt` is closed.
  - Flapping 3D Butterfly (`#bfly`): multi-jointed SVG wings flapping in 3D perspective.
  - Bottom accessories: Pixel hearts (`#hearts`) with pop animation, Pixel folder (`#pix-folder`).
  - Subhead text and pill CTA buttons (`See my work`, `Say hi`).
- **Interactions & Behaviors:**
  - Pointer/Touch move across letters triggers jelly squash-and-stretch (`jelly()`).
  - Iris and Cat pupils actively track cursor coordinates (`lookers` array).
  - Idle state (3.5s inactivity on screen): `setLove(true)` triggers—character and cat look at each other, exchange a slow blink, and spawn heart bursts!
  - Clicking `×` on `hello.txt` flies window into pixel folder; clicking `#nw-ghost` restores it.

---

## SYSTEM 5: PENLINE & 7-TOOL DRAWING SYSTEM
- **Visual Structure:**
  - `#penline` section with dynamic SVG Bézier curve (`#pen-art`, `#pen-path`).
  - Pen cursor follow icon (`.pen-cursor`).
  - Floating 7-Tool Toolbar (`.pen-tools`, role="toolbar"):
    1. Select (V)
    2. Pencil (N)
    3. Pen (P)
    4. Type (T)
    5. Rectangle (M)
    6. Ellipse (L)
    7. Eraser (E)
  - Interactive drawing canvas (`#draw-svg`, `#draw-shapes`, `#rubber`, `#dsel`, `#draw-text`).
  - Helper hint bar (`#pen-hint`): "try me: pick a tool and draw ✿".
- **Interactions & Behaviors:**
  - Select (V): Click and drag any drawn shape or text box to move; displays 8 blue transformation handles (`#dsel`).
  - Pencil (N): Freehand sketching on SVG with smooth Bézier interpolation.
  - Pen (P): Click to add vector anchor points; rubber-band guide line follows cursor; clicking origin closes path with fill; double-click/Enter finishes path.
  - Type (T): Click anywhere to spawn editable floating text span (`contenteditable="true"`).
  - Rectangle (M): Drag to create rectangle with rounded corners (`rx=8`); Shift key constrains to square.
  - Ellipse (L): Drag to create ellipse; Shift key constrains to circle.
  - Eraser (E): Hover/drag over any element removes it instantly.
  - Undo: <kbd>Ctrl</kbd> + <kbd>Z</kbd> (or Cmd+Z) reverses history step-by-step.
  - Auto-erase on scroll: Scrolling past section fades drawings with blur and rotational pop-out.

---

## SYSTEM 6: SELECTED WORKS & MANILA FOLDER CABINET
- **Visual Structure:**
  - Section `#work` with Manila Folder Cabinet (`#cabinet`).
  - Horizontal folder tabs: Favourites, Social, Brand, Campaign, Print.
  - Main active folder (`#folder`) with matching color theme (`--tab`), folder title, description, and asymmetric Polaroid grid.
  - Cards: Polaroid frames with tilted masking tape strips (`--tape`), drop shadows, category badges, and hover lift.
  - Pagination controls: Previous/Next buttons (`.fpager`), step dots (`.fdots`).
- **Interactions & Behaviors:**
  - Tab click or Arrow keys switch active folder with slide/tilt animation (`stepFolder()`).
  - Mobile touch swipe left/right switches folders (`touchstart`/`touchend` deltaX > 60px).
  - First-time mobile reveal triggers welcoming wiggle animation so swipeability is obvious.
  - Card click opens Fullscreen Lightbox.

---

## SYSTEM 7: PROJECT DATA ARCHITECTURE & DASHBOARD COMPATIBILITY
- **Data Model:**
  - Structured `CATEGORIES` array with `id`, `slug`, `title` (ar/en), and `color`.
  - Structured `PROJECTS` array with `id`, `title`, `description`, `category`, `categories[]`, `image`, `tools[]`, `metrics`, `featured`.
  - Dynamic filtering logic matching category slugs rather than hard-coded markup.

---

## SYSTEM 8: ABOUT SECTION & DYNAMIC CHAT
- **Visual Structure:**
  - Two-column layout:
    - Left: Sticky photo window `salma_irl.jpg` / `habiba_irl.jpg` with retro window frame, 3D greeting bubble ("Hello!" / "أهلاً!"), and "HELLO my name is..." nametag.
    - Right: Lead bio, credential pills with marching-ants SVG border, live chat simulation (`#chat`).
- **Interactions & Behaviors:**
  - Closing photo window `[data-photo="close"]`: Photo flies in a parabolic arc and shrinks (`scale(0.04) rotate(-20deg)`) into the nametag!
  - Standin character revealed: illustrated character holding iced coffee cup (`.icoffee`).
  - Tapping iced coffee: triggers sip animation (`.sip`), heart bursts, and standin eyes look down at the cup!
  - Clicking nametag or standin: reverses animation, smoothly restoring the real photo!
  - Chat Simulation: When scrolled into view, simulates live client question ("Love it all. When can we start?"), followed by Habiba's typing bubble ("Habiba is typing..."), converting to instant response with link to contact.

---

## SYSTEM 9: 3D BOARDING PASS & CREDENTIALS DIALOG
- **Visual Structure:**
  - `#pass`: 3D Boarding pass (`Flight HY 2028: CAI ✈ YOU`).
  - Two segments: Main boarding pass (route, passenger, class, specialization, verified training, design languages, status) + Perforated stub with barcode, "Read Credentials" button, and "Direct WhatsApp" button.
- **Interactions & Behaviors:**
  - Desktop 3D mouse parallax tilt: `perspective(1100px) rotateX(...) rotateY(...) scale(1.015)`.
  - Clicking "Read Credentials" (`[data-cv]`): opens `#cv-dialog` retro modal displaying verified certificates and CV reader.
  - Mobile responsive: stacks vertically with clean horizontal perforation.

---

## SYSTEM 10: CV VIEWER & PDF DOWNLOAD SYSTEM
- **Visual Structure:**
  - Modal `#cv-dialog` with titlebar `habiba_credentials.exe` / `Habiba-Yasser-CV.pdf`.
  - Interactive PDF embed iframe (`assets/Habiba-Yasser-CV.pdf#view=FitH`).
  - Verified training certificates list (TIEC Motion Graphics, ITI 2D Graphics, ITI Sound & Video Editing, TIEC Social Media Marketing).
  - Action buttons: "Download PDF" (actual valid PDF download) and WhatsApp CV request.
- **Interactions & Behaviors:**
  - `openCV()` checks PDF availability; shows fallback prompt if unavailable.
  - ESC or outside click closes dialog.

---

## SYSTEM 11: APPS BASKET (SERVICES & 3D DRAGGABLE TOYS)
- **Visual Structure:**
  - Section `#apps` with 3D Woven Basket container (`#basket`).
  - Draggable items: `Photoshop`, `Illustrator`, `Premiere Pro`, `After Effects`, `Canva`, Receipt slip, Color swatch chip.
- **Interactions & Behaviors:**
  - Drag physics: `pointerdown` captures pointer, brings item to top z-index, clamps within basket bounds with margin buffer.
  - Release triggers jelly bounce animation (`jelly()`).
  - Touch-optimized without hijacking page scrolling.

---

## SYSTEM 12: CONTACT 3D MAILCARD & REAL-TIME CAIRO CLOCK
- **Visual Structure:**
  - Section `#contact` with 3D flip mailcard (`#mailcard`).
  - Front (`#mc-card`): Cairo postmark stamp, designer photo stamp, email address, "Copy Address" button, "Write a note ✎" button, and real-time Cairo clock (`#cairo-time`).
  - Back (`#compose`): Message form with animated typewriter placeholder cycling through example project inquiries, honey pot spam trap, and submit button.
- **Interactions & Behaviors:**
  - "Copy Address": Copies `habibamarghani1@gmail.com` to clipboard, displays "Copied ✿" feedback and confetti burst, resets after 2200ms.
  - "Write a note ✎": Triggers 3D flip to back, sets `inert` on front, focuses message input.
  - Real-time Cairo clock: Updates live via `Intl.DateTimeFormat(..., { timeZone: 'Africa/Cairo' })`.
  - Form Submit: Fires celebratory sparkle particles (`magic()`), shoots `#wish-star` across the sky, shows sent feedback, and flips back after 4.2s.

---

## SYSTEM 13: CELESTIAL CONSTELLATION & STAR LINKS
- **Visual Structure:**
  - Starfield scene (`#scene`) in dark night sky.
  - SVG constellation polyline connecting major stars: `points="7,64 15,30 31,14 50,7 69,14 85,30 93,64"`.
  - Interactive star links with pulsing glow:
    - **Behance** (`see my projects` / `استعراض المشاريع`)
    - **Email** (`best for new projects` / `أفضل للمشاريع الجديدة`)
    - **LinkedIn** (`let's connect` / `لنتواصل معاً`)
    - **WhatsApp** (`quick chat` / `محادثة سريعة`)
  - Character sticker sitting among the clouds with tracking eyes.

---

## SYSTEM 14: FOOTER & CLOSING INTERACTION
- **Visual Structure:**
  - Minimalist retro footer with copyright and "Back to top" link.
  - Smooth anchor return to top with reset.

---

## SYSTEM 15: MOBILE VIEWPORTS & TOUCH ADAPTATION
- **Breakpoints:**
  - Mobile (<760px), Small Mobile (<480px), Tablet (768px - 1024px).
- **Behaviors:**
  - Navigation: Full links collapse into compact capsule menu button.
  - Drawing toolbar: Folds into single floating action button (`.pt-toggle`) that fans out on tap.
  - Works Cabinet: Manila tabs support horizontal scrolling; cards display in clean single-column stream.
  - Boarding pass: Stacks vertically with dashed divider.
  - Basket: Draggable toys constrained to touch safe bounds.

---

## SYSTEM 16: ACCESSIBILITY, REDUCED MOTION & KEYBOARD NAVIGATION
- **Accessibility:**
  - `prefers-reduced-motion` suppresses intensive animations and sets instant transitions.
  - Full keyboard trap and ESC support for all modals (`menu.exe`, `#cv-dialog`, Lightbox).
  - ARIA attributes: `role="toolbar"`, `aria-selected`, `aria-label`, `aria-hidden`, and `sr-only` live regions for screen readers.
