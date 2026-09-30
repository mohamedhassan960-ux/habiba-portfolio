# DRAWING TOOL PARITY VERIFICATION

Tool-by-tool verification matrix comparing the 7 drawing tools against `https://salmaosama.online/`.

| Tool | Reference Tested | Implemented | Browser Tested | Status | Behavior Notes |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Select (V)** | YES | YES | YES | **VERIFIED** | Click & drag shapes or text; displays 8-point bounding transform box `#dsel`; records movement in undo history. |
| **Pencil (N)** | YES | YES | YES | **VERIFIED** | Freehand smooth Bézier path drawing on `#draw-svg`; stroke color cycles through palette (`#1D4ED8`, `#F43F5E`, `#C7D2FE`, `#60A5FA`); 5px stroke width with round caps. |
| **Pen (P)** | YES | YES | YES | **VERIFIED** | Vector path with anchor points (`addPenPoint`); rubber-band guideline (`#rubber`) follows cursor; clicking origin closes path with fill; double-click/Enter finishes path. |
| **Type (T)** | YES | YES | YES | **VERIFIED** | Clicking canvas spawns inline editable text span (`contenteditable="true"`); supports editing, moving in select tool, and erasing. Tested via Playwright evaluate. |
| **Rectangle (M)** | YES | YES | YES | **VERIFIED** | Click & drag creates SVG `<rect>` with 8px corner radius (`rx="8"`); Shift key constrains to 1:1 square. Tested: created 150x100 rect with fill `#F43F5E`. |
| **Ellipse (L)** | YES | YES | YES | **VERIFIED** | Click & drag creates SVG `<ellipse>`; Shift key constrains to 1:1 circle. Tested: created SVG ellipse with dynamic fill. |
| **Eraser (E)** | YES | YES | YES | **VERIFIED** | Pointer drag or click over any `.shape` or `.dtxt` erases it immediately with custom eraser cursor and scale-down fade animation. Tested: 1 shape erased to 0. |
| **Undo (<kbd>Ctrl</kbd>+<kbd>Z</kbd>)** | YES | YES | YES | **VERIFIED** | Keyboard shortcut reverses last added shape, text, or movement step-by-step. Tested: 2 shapes reduced to 1, then 0. |
| **Scroll Auto-Erase** | YES | YES | YES | **VERIFIED** | Scrolling down past `#penline` triggers smooth blur & rotational pop fade-out (`eraseDrawings()`), resetting the canvas. Tested: shapes count reduced from 1 to 0 after scrolling. |
| **Mobile Fan-Out** | YES | YES | YES | **VERIFIED** | Toolbar folds into `.pt-toggle` button on mobile and fans out on tap; defaults to pencil tool. |
