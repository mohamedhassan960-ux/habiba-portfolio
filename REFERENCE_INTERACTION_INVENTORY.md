# REFERENCE INTERACTION INVENTORY

Comprehensive interaction audit mapping every trigger, action, animation, state transition, and reset mechanism found on `https://salmaosama.online/`.

| Element | Trigger | Initial State | Action | Animation | Final State | Reset |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Custom Cursor** | Mouse move | Hidden / Default arrow | Track pointer across viewport | Instant SVG data URI update (`--cur`) | Distinctive retro hot-pink arrow with star sparkle | Returns to default outside window |
| **Drawing Cursor** | Tool select | Default arrow | Swaps CSS cursor variable on `.penline` | Instant CSS cursor swap | Tool icon (Pen, Pencil, Eraser, Crosshair) | Returns to `--cur` when leaving `.penline` |
| **Nav Close (`#nav-close`)** | Click on `×` | Full floating capsule with all navigation links | Collapses nav into compact Menu button | Child items slide to center with scale/opacity fade; capsule shrinks (`tuckBar`) | Compact Menu button with traffic lights | Restored via `#bar-back` |
| **Nav Restore (`#bar-back`)** | Click on button inside menu | Compact collapsed button | Expands nav capsule back to full width | Spring width expansion + staggered item pop-in (`bringBar`) | Full capsule nav | Collapsed via `#nav-close` |
| **Nav Brand Logo** | Mouse hover | Static text | Staggers wave transform across letters | `nlwave`: translateY(-4px) rotate(3deg) | Reverts to resting state on pointerleave | Pointerleave |
| **Menu Button (`#menu-btn`)** | Click / Tap | `#menu` hidden | Toggles visibility of `menu.exe` retro window flyout | Scale and opacity pop-in | Window open with category links and status dot | ESC or outside click closes |
| **Display Wordmark Letters** | Pointerenter / Touchmove | Resting typographic baseline | Compresses and rebounds letters | Squash-and-stretch (`jelly()`: scale 1.22/0.8 → 0.88/1.14 → 1) | Rebounds to natural scale | Auto-reset after 600ms |
| **Hero Character Sticker** | Cursor move | Center looking | Irises track mouse pointer coordinates | Smooth translation (`iris.style.translate`) | Eyes follow cursor angle | Center drift on idle |
| **Hero Cat** | Cursor move | Center looking | Pupils track mouse pointer coordinates | Smooth translation (`pupils.setAttribute`) | Cat eyes follow cursor | Center drift on idle |
| **Hero Character & Cat Interaction** | Inactivity (3.5s idle) | Both tracking cursor | Characters turn toward each other | Synchronized slow blink + heart burst + cat jelly | Loving glance exchanged | Cleared immediately on pointer move |
| **Hero Window (`hello.txt`)** | Click `×` button | Window visible above "o/r/t" | Window flies into pixel folder | Parabolic translation + scale down + rotation | Window hidden; `#nw-ghost` button revealed | Restored via clicking `#nw-ghost` |
| **Hero Ghost (`#nw-ghost`)** | Click on ghost | Dashed marching-ants ghost button | Restores `hello.txt` window | Reverse parabolic flight back to original position | `hello.txt` restored | Re-closing `hello.txt` |
| **3D Butterfly (`#bfly`)** | Ambient loop | Perched on display wordmark | Wing flapping | 3D perspective wing rotation on Y-axis | Continuous ambient flight loop | N/A |
| **Drawing Tool (Pen)** | Click tool / Canvas click | Pen tool selected | Places anchor points with guide rubber band; closes path on origin | Bézier stroke draw + anchor handles | Vector path added to canvas | Ctrl+Z undo or Eraser |
| **Drawing Tool (Pencil)** | Drag on canvas | Pencil tool selected | Draws smooth freehand path | Real-time path smoothing | Colorful vector curve | Ctrl+Z undo or Eraser |
| **Drawing Tool (Type)** | Click on canvas | Type tool selected | Spawns editable text box | Pop-in focus with selection | Content-editable text placed on canvas | Blur, Delete, or Eraser |
| **Drawing Tool (Rect / Ellipse)** | Drag on canvas | Tool selected | Renders geometric shape with Shift constraint | Live dimension stretch + selection box | Shape confirmed on pointerup | Ctrl+Z undo or Eraser |
| **Drawing Tool (Eraser)** | Hover/Drag over shape | Eraser cursor | Removes any contacted shape or text | Instant deletion | Canvas element erased | Undo restores |
| **Drawing Canvas Auto-erase** | Scroll down past section | Drawings present | Clears all user drawings | Blur fade-out + rotational pop (`blur(6px) rotate(-40deg)`) | Pristine canvas reset | N/A |
| **Folder Tabs (Works)** | Tab click / Key arrow | Active tab selected | Switches displayed category and cards | Color shift (`--tab`) + slide/tilt transition (`stepFolder`) | New category cards rendered | Clicking another tab |
| **Folder Touch Swipe** | Swipe left/right on phone | Active folder | Increments/decrements active folder | Wiggle feedback + folder flip | Next folder activated | Swiping in reverse |
| **Project Card** | Click on card | Polaroid in folder | Opens focused Lightbox | Scale-in transition with backdrop blur | Fullscreen artwork modal | ESC or close button |
| **Lightbox Navigation** | Arrow Left/Right | Current project | Steps through project images | Cross-fade artwork transition | Adjacent project artwork displayed | Wraps around |
| **3D Basket Items** | Pointerdown & drag | Resting in woven basket | Draggable within basket bounding box | Pointer capture + boundary clamping + drop jelly bounce | New resting coordinates in basket | Natural gravity drag |
| **About Photo Window** | Click `×` button | Real photo `salma_irl.jpg` | Shrinks photo into nametag; reveals standin | Parabolic arc shrink (`scale(0.04) rotate(-20deg)`) + nametag jelly | Cartoon standin visible with iced coffee | Clicking nametag restores photo |
| **Iced Coffee Cup (`.icoffee`)** | Click / Tap | Resting in standin's hand | Triggers sipping animation | Cup tilt + fluid level shift + sparkle burst + character looks at cup | Cup returns to hand | Cooldown timer |
| **Chat Simulation** | Scroll into view | Initial question visible | Automatically types response sequence | Character typing indicator (3 bouncing dots) → response speech bubble | Complete conversation displayed | N/A (runs once per session) |
| **3D Boarding Pass** | Mouse move | Flat tilted card | 3D parallax tilt based on cursor position | Perspective rotation (`perspective(1100px) rotateX(...) rotateY(...)`) | Dynamic card perspective | Mouse leaves card |
| **Credentials Button (`[data-cv]`)** | Click "Read Credentials" | Closed modal | Opens `#cv-dialog` retro modal | Backdrop fade + modal scale-in | CV PDF viewer and certificates visible | ESC or close button |
| **Download PDF** | Click "Download PDF" | Download button | Downloads `Habiba-Yasser-CV.pdf` file | Browser download pipeline | File saved to user device | N/A |
| **Cairo Clock (`#cairo-time`)** | Real-time interval (30s) | Current time | Queries Africa/Cairo timezone | Instant text update | Exact Cairo local time displayed | Continuous |
| **Copy Address Button** | Click button | "Copy Address" label | Writes email to system clipboard | Confetti burst + label swaps to "Copied ✿" | Clipboard holds email | Reverts after 2200ms |
| **Write Note Button (`[data-flip]`)** | Click button | Front postcard visible | 3D flip card to back compose form | 3D rotation (`transform: rotateY(180deg)`) + textarea autofocus | Compose form displayed | Clicking "↻ Card" flips back |
| **Wish Word (`#wish-word`)** | Pointerenter / move | Static word | Emits magic fairy dust sparkles | Particle burst (`magic()`: scale, rotate, fade) | Trail of colorful sparkles | Particles self-destruct |
| **Send Wish Form** | Form submit | Form filled | Transmits message or triggers mailto fallback | Confetti explosion + `#wish-star` streaks across sky | Success receipt message shown | Flips back to front after 4.2s |
| **Astronomical Moon** | Drag when night > 0.4 | Resting in night sky | Drags moon across sky with tilt | Pointer capture + tilt angle (`--mr`) + fairy dust particles | Moon follows mouse | Springs home with harmonic oscillation |
| **Moon Tooltip** | Hover on moon | Hidden tooltip | Displays moon phase metrics | Fade-in tooltip above moon | "Tonight's moon: [Phase], X% lit" | Pointerleave |
| **Constellation Stars** | Click / Tap | Glowing SVG spark | Navigates to verified external destination | Pulse glow + target link open | Opens WhatsApp, Behance, LinkedIn, or Email | N/A |
| **Language Switcher** | Click `EN` / `عربي` | Current language | Flips HTML dir and language state | Smooth layout inversion (RTL ⇄ LTR) | Language and typography switched | Clicking toggle again |
