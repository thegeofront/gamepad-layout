/* ── Constants ───────────────────────────────────── */

const CANVAS_W = 1920;
const CANVAS_H = 1080;

const CORNER_RADIUS = 14;
const LABEL_PAD_Y = 70;
const DOT_RADIUS = 6;
const HIT_RADIUS = 20;

const NUM_SLOTS = 16;
const SLOT_RANGE = CANVAS_H - 2 * LABEL_PAD_Y;
const SLOT_STEP = SLOT_RANGE / (NUM_SLOTS - 1);

const LEFT_LINE_END = 290;
const RIGHT_LINE_END = CANVAS_W - 290;

const LABEL_HIT_W = 160;
const LABEL_HIT_H = 32;

/* ── Device definitions ──────────────────────────── */

const DEVICES = {
  xbox: {
    name: 'Xbox Controller',
    image: 'assets/xbox.png',
    displayWidth: 840,
    buttonDefs: [
      { id: 'lt', name: 'LT', label: 'Left Trigger', ox: 192, oy: 12, side: 'left' },
      { id: 'lb', name: 'LB', label: 'Left Bumper', ox: 228, oy: 72, side: 'left' },
      { id: 'guide', name: 'Xbox', label: 'Xbox Button', ox: 640, oy: 72, side: 'left' },
      { id: 'view', name: 'View', label: 'View', ox: 510, oy: 288, side: 'left' },
      { id: 'ls', name: 'LS', label: 'Left Stick', ox: 280, oy: 288, side: 'left' },
      { id: 'dpad', name: 'D-Pad', label: 'D-Pad', ox: 418, oy: 510, side: 'left' },
      { id: 'rt', name: 'RT', label: 'Right Trigger', ox: 1088, oy: 12, side: 'right' },
      { id: 'rb', name: 'RB', label: 'Right Bumper', ox: 1052, oy: 72, side: 'right' },
      { id: 'y', name: 'Y', label: '"Y" Button', ox: 942, oy: 132, side: 'right' },
      { id: 'x', name: 'X', label: '"X" Button', ox: 872, oy: 264, side: 'right' },
      { id: 'b', name: 'B', label: '"B" Button', ox: 1030, oy: 264, side: 'right' },
      { id: 'menu', name: 'Menu', label: 'Menu', ox: 676, oy: 288, side: 'right' },
      { id: 'a', name: 'A', label: '"A" Button', ox: 950, oy: 382, side: 'right' },
      { id: 'rs', name: 'RS', label: 'Right Stick', ox: 770, oy: 510, side: 'right' },
    ],
  },
  ps5: {
    name: 'PS5 Controller',
    image: 'assets/ps5.png',
    displayWidth: 840,
    buttonDefs: [
      { id: 'l2', name: 'L2', label: 'L2 Trigger', ox: 168, oy: 11, side: 'left' },
      { id: 'l1', name: 'L1', label: 'L1 Bumper', ox: 200, oy: 68, side: 'left' },
      { id: 'ps', name: 'PS', label: 'PS Button', ox: 562, oy: 68, side: 'left' },
      { id: 'create', name: 'Create', label: 'Create', ox: 448, oy: 273, side: 'left' },
      { id: 'ls', name: 'LS', label: 'Left Stick', ox: 246, oy: 273, side: 'left' },
      { id: 'dpad', name: 'D-Pad', label: 'D-Pad', ox: 367, oy: 484, side: 'left' },
      { id: 'r2', name: 'R2', label: 'R2 Trigger', ox: 955, oy: 11, side: 'right' },
      { id: 'r1', name: 'R1', label: 'R1 Bumper', ox: 924, oy: 68, side: 'right' },
      { id: 'tri', name: '△', label: 'Triangle', ox: 827, oy: 125, side: 'right' },
      { id: 'sq', name: '□', label: 'Square', ox: 766, oy: 250, side: 'right' },
      { id: 'cir', name: '○', label: 'Circle', ox: 904, oy: 250, side: 'right' },
      { id: 'opts', name: 'Options', label: 'Options', ox: 593, oy: 273, side: 'right' },
      { id: 'cross', name: '✕', label: 'Cross', ox: 834, oy: 362, side: 'right' },
      { id: 'rs', name: 'RS', label: 'Right Stick', ox: 676, oy: 484, side: 'right' },
    ],
  },
  switch: {
    name: 'Nintendo Switch',
    image: 'assets/switch.png',
    displayWidth: 760,
    buttonDefs: [
      { id: 'zl', name: 'ZL', label: 'ZL Trigger', ox: 154, oy: 98, side: 'left' },
      { id: 'l', name: 'L', label: 'L Bumper', ox: 236, oy: 98, side: 'left' },
      { id: 'minus', name: '-', label: 'Minus', ox: 318, oy: 178, side: 'left' },
      { id: 'ls', name: 'LS', label: 'Left Stick', ox: 230, oy: 336, side: 'left' },
      { id: 'dpad', name: 'D-Pad', label: 'D-Pad', ox: 232, oy: 594, side: 'left' },
      { id: 'capture', name: 'Capture', label: 'Capture', ox: 274, oy: 746, side: 'left' },
      { id: 'zr', name: 'ZR', label: 'ZR Trigger', ox: 750, oy: 98, side: 'right' },
      { id: 'r', name: 'R', label: 'R Bumper', ox: 668, oy: 98, side: 'right' },
      { id: 'plus', name: '+', label: 'Plus', ox: 626, oy: 178, side: 'right' },
      { id: 'x', name: 'X', label: '"X" Button', ox: 736, oy: 244, side: 'right' },
      { id: 'y', name: 'Y', label: '"Y" Button', ox: 662, oy: 316, side: 'right' },
      { id: 'a', name: 'A', label: '"A" Button', ox: 806, oy: 316, side: 'right' },
      { id: 'b', name: 'B', label: '"B" Button', ox: 736, oy: 388, side: 'right' },
      { id: 'rs', name: 'RS', label: 'Right Stick', ox: 736, oy: 590, side: 'right' },
      { id: 'home', name: 'Home', label: 'Home', ox: 684, oy: 746, side: 'right' },
    ],
  },
  keyboard_mouse: {
    name: 'Keyboard & Mouse',
    image: 'assets/keyboard_mouse.png',
    displayWidth: 1050,
    buttonDefs: [
      { id: 'wasd', name: 'WASD', label: 'Move', ox: 155, oy: 200, side: 'left' },
      { id: 'shift', name: 'Shift', label: 'Sprint', ox: 55, oy: 242, side: 'left' },
      { id: 'ctrl', name: 'Ctrl', label: 'Crouch', ox: 40, oy: 285, side: 'left' },
      { id: 'space', name: 'Space', label: 'Jump', ox: 305, oy: 300, side: 'left' },
      { id: 'tab', name: 'Tab', label: 'Map', ox: 42, oy: 160, side: 'left' },
      { id: 'e', name: 'E', label: 'Interact', ox: 175, oy: 160, side: 'left' },
      { id: 'q', name: 'Q', label: 'Ability', ox: 132, oy: 160, side: 'left' },
      { id: 'r', name: 'R', label: 'Reload', ox: 198, oy: 160, side: 'left' },
      { id: 'f', name: 'F', label: 'Melee', ox: 210, oy: 200, side: 'left' },
      { id: 'lmb', name: 'LMB', label: 'Fire', ox: 875, oy: 95, side: 'right' },
      { id: 'rmb', name: 'RMB', label: 'Aim', ox: 930, oy: 95, side: 'right' },
      { id: 'scroll', name: 'Scroll', label: 'Switch Weapon', ox: 900, oy: 55, side: 'right' },
      { id: 'mb4', name: 'M4', label: 'Ping', ox: 860, oy: 200, side: 'right' },
      { id: 'mb5', name: 'M5', label: 'Voice Chat', ox: 860, oy: 245, side: 'right' },
    ],
  },
};

/* ── Dynamic layout variables ────────────────────── */

let imgW = 1280;
let imgH = 888;
let ctrlW = 840;
let ctrlScale = ctrlW / imgW;
let ctrlH = Math.round(imgH * ctrlScale);
let ctrlX = Math.round((CANVAS_W - ctrlW) / 2);
let ctrlY = Math.round((CANVAS_H - ctrlH) / 2);
let leftTurnX = ctrlX - 50;
let rightTurnX = ctrlX + ctrlW + 50;

function recalcLayout() {
  const device = DEVICES[cfg().device] || DEVICES.xbox;
  ctrlW = Math.min(device.displayWidth, imgW);
  ctrlScale = ctrlW / imgW;
  ctrlH = Math.round(imgH * ctrlScale);
  ctrlX = Math.round((CANVAS_W - ctrlW) / 2);
  ctrlY = Math.round((CANVAS_H - ctrlH) / 2);
  leftTurnX = ctrlX - 50;
  rightTurnX = ctrlX + ctrlW + 50;
}

/* ── State ───────────────────────────────────────── */

let configs = [createDefaultConfig('xbox')];
let activeIdx = 0;
let controllerImg = null;
let canvas, ctx;

let dragBtnId = null;
let dragType = null;   // 'dot' | 'label'
let hoveredBtnId = null;
let hoveredType = null; // 'dot' | 'label'

let cachedLabelYs = new Map();
let loadGeneration = 0;
let nextCustomId = 0;

/** Device key whose image was last applied to the canvas (used so load/switch always refreshes the image when it differs from what is on screen). */
let lastDisplayedDeviceKey = null;

/* ── Helpers ─────────────────────────────────────── */

function cfg() { return configs[activeIdx]; }

function createDefaultConfig(deviceKey = 'xbox') {
  const device = DEVICES[deviceKey] || DEVICES.xbox;
  const c = { name: 'Default', device: deviceKey, themeColor: '#00ffc8', buttons: {} };
  for (const def of device.buttonDefs) {
    c.buttons[def.id] = { name: def.name, label: def.label, ox: def.ox, oy: def.oy, side: def.side };
  }
  for (const side of ['left', 'right']) {
    const slots = assignDefaultSlots(c.buttons, side);
    for (const [id, slot] of Object.entries(slots)) {
      c.buttons[id].slot = slot;
    }
  }
  return c;
}

function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function rgba(hex, a) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

function toCanvas(ox, oy) {
  return {
    x: ctrlX + ox * ctrlScale,
    y: ctrlY + oy * ctrlScale,
  };
}

function canvasCoords(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) * (CANVAS_W / rect.width),
    y: (e.clientY - rect.top) * (CANVAS_H / rect.height),
  };
}

function slotY(slot) {
  return LABEL_PAD_Y + slot * SLOT_STEP;
}

function nearestSlot(y) {
  const raw = Math.round((y - LABEL_PAD_Y) / SLOT_STEP);
  return Math.max(0, Math.min(NUM_SLOTS - 1, raw));
}

function assignDefaultSlots(buttons, side) {
  const entries = Object.entries(buttons)
    .filter(([, b]) => b.side === side)
    .sort(([, a], [, b]) => a.oy - b.oy);
  const offset = Math.floor((NUM_SLOTS - entries.length) / 2);
  const map = {};
  entries.forEach(([id], i) => { map[id] = offset + i; });
  return map;
}

function hitTest(cx, cy) {
  const buttons = cfg().buttons;
  for (const [id, b] of Object.entries(buttons)) {
    if (!b || !b.label) continue;
    const { x, y } = toCanvas(b.ox, b.oy);
    const dx = cx - x, dy = cy - y;
    if (dx * dx + dy * dy <= HIT_RADIUS * HIT_RADIUS) return id;
  }
  return null;
}

function hitTestLabel(cx, cy) {
  const buttons = cfg().buttons;
  for (const [id, b] of Object.entries(buttons)) {
    if (!b || !b.label) continue;
    const ly = cachedLabelYs.get(id);
    if (ly == null) continue;
    const isLeft = b.side === 'left';
    const lineEnd = isLeft ? LEFT_LINE_END : RIGHT_LINE_END;
    const rx = isLeft ? lineEnd - LABEL_HIT_W : lineEnd;
    const ry = ly - LABEL_HIT_H / 2;
    if (cx >= rx && cx <= rx + LABEL_HIT_W && cy >= ry && cy <= ry + LABEL_HIT_H) {
      return id;
    }
  }
  return null;
}

/* ── Theme color ─────────────────────────────────── */

function applyThemeColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const s = document.documentElement.style;
  s.setProperty('--accent', hex);
  s.setProperty('--accent-dim', `rgba(${r},${g},${b},0.6)`);
  s.setProperty('--accent-glow', `rgba(${r},${g},${b},0.15)`);
  s.setProperty('--border', `rgba(${r},${g},${b},0.12)`);
  s.setProperty('--border-focus', `rgba(${r},${g},${b},0.5)`);
}

/* ── Device image loading ────────────────────────── */

function loadDeviceImage(deviceKey) {
  const device = DEVICES[deviceKey] || DEVICES.xbox;
  const gen = ++loadGeneration;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    if (gen !== loadGeneration) return;
    controllerImg = img;
    imgW = img.naturalWidth;
    imgH = img.naturalHeight;
    lastDisplayedDeviceKey = deviceKey;
    recalcLayout();
    render();
  };
  img.src = device.image;
}

/* ── Render ──────────────────────────────────────── */

function render() {
  if (!ctx) return;
  const c = cfg();
  const accent = c.themeColor;

  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  const bg = ctx.createRadialGradient(
    CANVAS_W / 2, CANVAS_H / 2, 80,
    CANVAS_W / 2, CANVAS_H / 2, CANVAS_W * 0.65,
  );
  bg.addColorStop(0, '#141428');
  bg.addColorStop(1, '#08080f');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  if (controllerImg) {
    ctx.drawImage(controllerImg, ctrlX, ctrlY, ctrlW, ctrlH);
  }

  cachedLabelYs = new Map();
  for (const [id, b] of Object.entries(c.buttons)) {
    if (!b || !b.label) continue;
    cachedLabelYs.set(id, slotY(b.slot));
  }

  if (dragType === 'label' || hoveredType === 'label') {
    const activeId = dragBtnId || hoveredBtnId;
    if (activeId) drawSlotGuides(c.buttons[activeId].side, accent);
  }

  for (const [id] of Object.entries(c.buttons)) {
    const ly = cachedLabelYs.get(id);
    if (ly != null) drawLabelLine(id, ly, accent);
  }
}

function drawSlotGuides(side, accent) {
  const isLeft = side === 'left';
  const lineEnd = isLeft ? LEFT_LINE_END : RIGHT_LINE_END;
  ctx.save();
  ctx.strokeStyle = rgba(accent, 0.12);
  ctx.lineWidth = 1;
  for (let i = 0; i < NUM_SLOTS; i++) {
    const y = slotY(i);
    ctx.beginPath();
    ctx.moveTo(lineEnd - 6, y);
    ctx.lineTo(lineEnd + 6, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawLabelLine(id, ly, accent) {
  const b = cfg().buttons[id];
  if (!b || !b.label) return;

  const { x: bx, y: by } = toCanvas(b.ox, b.oy);
  const isLeft = b.side === 'left';
  const turnX = isLeft ? leftTurnX : rightTurnX;
  const lineEnd = isLeft ? LEFT_LINE_END : RIGHT_LINE_END;
  const isActive = id === dragBtnId || id === hoveredBtnId;
  const dotHot = isActive && (hoveredType === 'dot' || dragType === 'dot');
  const labelHot = isActive && (hoveredType === 'label' || dragType === 'label');

  ctx.save();
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.arcTo(turnX, ly, lineEnd, ly, CORNER_RADIUS);
  ctx.lineTo(lineEnd, ly);
  ctx.strokeStyle = rgba(accent, 0.2);
  ctx.lineWidth = isActive ? 10 : 7;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.arcTo(turnX, ly, lineEnd, ly, CORNER_RADIUS);
  ctx.lineTo(lineEnd, ly);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.8;
  ctx.stroke();

  const dotR = dotHot ? DOT_RADIUS + 3 : DOT_RADIUS;
  ctx.beginPath();
  ctx.arc(bx, by, dotR, 0, Math.PI * 2);
  ctx.fillStyle = accent;
  ctx.shadowColor = accent;
  ctx.shadowBlur = dotHot ? 18 : 10;
  ctx.fill();
  ctx.shadowBlur = 0;

  if (dotHot) {
    ctx.beginPath();
    ctx.arc(bx, by, dotR + 6, 0, Math.PI * 2);
    ctx.strokeStyle = rgba(accent, 0.35);
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.moveTo(lineEnd, ly - 6);
  ctx.lineTo(lineEnd, ly + 6);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.8;
  ctx.stroke();

  if (labelHot) {
    const hlW = LABEL_HIT_W;
    const hlH = LABEL_HIT_H;
    const hlX = isLeft ? lineEnd - hlW : lineEnd;
    const hlY = ly - hlH / 2;
    ctx.fillStyle = rgba(accent, 0.08);
    ctx.strokeStyle = rgba(accent, 0.25);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(hlX, hlY, hlW, hlH, 4);
    ctx.fill();
    ctx.stroke();

    const gripX = isLeft ? lineEnd - hlW + 10 : lineEnd + hlW - 10;
    ctx.fillStyle = rgba(accent, 0.4);
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.arc(gripX, ly + i * 6, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.font = '600 24px Inter, system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = rgba(accent, 0.5);
  ctx.shadowBlur = 6;
  ctx.fillStyle = '#ffffff';

  if (isLeft) {
    ctx.textAlign = 'right';
    ctx.fillText(b.label, lineEnd - 14, ly);
  } else {
    ctx.textAlign = 'left';
    ctx.fillText(b.label, lineEnd + 14, ly);
  }

  ctx.restore();
}

/* ── Drag interaction ────────────────────────────── */

function cursorForHover() {
  if (!hoveredBtnId) return 'default';
  return hoveredType === 'label' ? 'ns-resize' : 'grab';
}

function initDrag() {
  canvas.addEventListener('mousedown', (e) => {
    const { x, y } = canvasCoords(e);

    const labelHit = hitTestLabel(x, y);
    if (labelHit) {
      dragBtnId = labelHit;
      dragType = 'label';
      canvas.style.cursor = 'ns-resize';
      render();
      return;
    }

    const dotHit = hitTest(x, y);
    if (dotHit) {
      dragBtnId = dotHit;
      dragType = 'dot';
      canvas.style.cursor = 'grabbing';
      render();
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    const { x, y } = canvasCoords(e);

    if (dragBtnId) {
      const b = cfg().buttons[dragBtnId];
      if (dragType === 'dot') {
        b.ox = Math.round((x - ctrlX) / ctrlScale);
        b.oy = Math.round((y - ctrlY) / ctrlScale);
      } else {
        b.slot = nearestSlot(y);
      }
      render();
      return;
    }

    const labelHit = hitTestLabel(x, y);
    if (labelHit) {
      if (hoveredBtnId !== labelHit || hoveredType !== 'label') {
        hoveredBtnId = labelHit;
        hoveredType = 'label';
        canvas.style.cursor = 'ns-resize';
        render();
      }
      return;
    }

    const dotHit = hitTest(x, y);
    if (dotHit !== hoveredBtnId || (dotHit && hoveredType !== 'dot')) {
      hoveredBtnId = dotHit;
      hoveredType = dotHit ? 'dot' : null;
      canvas.style.cursor = dotHit ? 'grab' : 'default';
      render();
    } else if (!dotHit && hoveredBtnId) {
      hoveredBtnId = null;
      hoveredType = null;
      canvas.style.cursor = 'default';
      render();
    }
  });

  canvas.addEventListener('mouseup', () => {
    if (dragBtnId) {
      dragBtnId = null;
      dragType = null;
      canvas.style.cursor = cursorForHover();
      render();
    }
  });

  canvas.addEventListener('mouseleave', () => {
    const wasDirty = dragBtnId || hoveredBtnId;
    dragBtnId = null;
    dragType = null;
    hoveredBtnId = null;
    hoveredType = null;
    canvas.style.cursor = 'default';
    if (wasDirty) render();
  });
}

/* ── Sidebar: button inputs ──────────────────────── */

function buildButtonInputs() {
  const container = document.getElementById('button-list');
  container.innerHTML = '';

  const buttons = cfg().buttons;
  const leftEntries = [];
  const rightEntries = [];

  for (const [id, b] of Object.entries(buttons)) {
    const entry = { id, ...b };
    if (b.side === 'left') leftEntries.push(entry);
    else rightEntries.push(entry);
  }

  leftEntries.sort((a, b) => a.oy - b.oy);
  rightEntries.sort((a, b) => a.oy - b.oy);

  addGroup(container, 'Left Side', leftEntries, 'left');
  addGroup(container, 'Right Side', rightEntries, 'right');
}

function addGroup(container, title, entries, side) {
  const group = document.createElement('div');
  group.className = 'button-group';

  const header = document.createElement('div');
  header.className = 'button-group-header';

  const h3 = document.createElement('h3');
  h3.textContent = title;

  const addBtn = document.createElement('button');
  addBtn.className = 'icon-btn add-entry-btn';
  addBtn.title = `Add ${side} entry`;
  addBtn.textContent = '+';
  addBtn.addEventListener('click', () => addButton(side));

  header.append(h3, addBtn);
  group.appendChild(header);

  for (const entry of entries) {
    const row = document.createElement('div');
    row.className = 'button-row';

    const lbl = document.createElement('label');
    lbl.textContent = entry.name || entry.id;
    lbl.setAttribute('for', `inp-${entry.id}`);

    const inp = document.createElement('input');
    inp.type = 'text';
    inp.id = `inp-${entry.id}`;
    inp.value = entry.label || '';
    inp.placeholder = entry.name || entry.id;
    inp.addEventListener('input', (e) => {
      cfg().buttons[entry.id].label = e.target.value;
      render();
    });

    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn danger del-entry-btn';
    delBtn.title = 'Remove entry';
    delBtn.innerHTML = '&times;';
    delBtn.addEventListener('click', () => removeButton(entry.id));

    row.append(lbl, inp, delBtn);
    group.appendChild(row);
  }

  container.appendChild(group);
}

function addButton(side) {
  const id = `custom_${nextCustomId++}`;
  const buttons = cfg().buttons;

  const usedSlots = new Set();
  for (const [, b] of Object.entries(buttons)) {
    if (b.side === side) usedSlots.add(b.slot);
  }
  let slot = 0;
  while (usedSlots.has(slot) && slot < NUM_SLOTS) slot++;
  if (slot >= NUM_SLOTS) slot = NUM_SLOTS - 1;

  const defaultOx = Math.round(imgW / 2);
  const defaultOy = Math.round(imgH / 2);

  buttons[id] = {
    name: 'New',
    label: 'New',
    ox: defaultOx,
    oy: defaultOy,
    side: side,
    slot: slot,
  };

  buildButtonInputs();
  render();
}

function removeButton(id) {
  delete cfg().buttons[id];
  buildButtonInputs();
  render();
}

function syncInputsToConfig() {
  const c = cfg();
  for (const [id, b] of Object.entries(c.buttons)) {
    const inp = document.getElementById(`inp-${id}`);
    if (inp) inp.value = b.label || '';
  }
  document.getElementById('color-picker').value = c.themeColor;
  document.getElementById('color-hex').textContent = c.themeColor;
  document.getElementById('config-name').value = c.name;
  document.getElementById('device-select').value = c.device || 'xbox';
  applyThemeColor(c.themeColor);
}

/* ── Config management ───────────────────────────── */

function refreshConfigDropdown() {
  const sel = document.getElementById('config-select');
  sel.innerHTML = '';
  configs.forEach((c, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = c.name;
    sel.appendChild(opt);
  });
  sel.value = activeIdx;
}

function switchConfig(idx) {
  const prevDevice = lastDisplayedDeviceKey ?? configs[activeIdx]?.device ?? 'xbox';
  activeIdx = idx;
  const newDevice = cfg().device || 'xbox';

  refreshConfigDropdown();
  buildButtonInputs();
  syncInputsToConfig();

  if (newDevice !== prevDevice) {
    loadDeviceImage(newDevice);
  } else {
    recalcLayout();
    render();
  }
}

function addConfig() {
  const clone = JSON.parse(JSON.stringify(cfg()));
  clone.name = `${clone.name} (copy)`;
  configs.push(clone);
  switchConfig(configs.length - 1);
}

function deleteConfig() {
  if (configs.length <= 1) return;
  configs.splice(activeIdx, 1);
  switchConfig(Math.min(activeIdx, configs.length - 1));
}

/* ── Device switching ────────────────────────────── */

function switchDevice(deviceKey) {
  const c = cfg();
  if (c.device === deviceKey) return;

  const device = DEVICES[deviceKey] || DEVICES.xbox;
  c.device = deviceKey;
  c.buttons = {};
  for (const def of device.buttonDefs) {
    c.buttons[def.id] = { name: def.name, label: def.label, ox: def.ox, oy: def.oy, side: def.side };
  }
  for (const side of ['left', 'right']) {
    const slots = assignDefaultSlots(c.buttons, side);
    for (const [id, slot] of Object.entries(slots)) {
      c.buttons[id].slot = slot;
    }
  }

  buildButtonInputs();
  loadDeviceImage(deviceKey);
}

/* ── Save / Load ─────────────────────────────────── */

function normalizeLoadedConfigs(data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Expected a non-empty array of configs');
  }

  for (const entry of data) {
    if (!entry.name) entry.name = 'Untitled';
    if (!entry.themeColor) entry.themeColor = '#00ffc8';
    if (!entry.device || !DEVICES[entry.device]) {
      entry.device = 'xbox';
    }
    if (!entry.buttons) entry.buttons = {};

    const device = DEVICES[entry.device];

    for (const id of Object.keys(entry.buttons)) {
      const btn = entry.buttons[id];
      if (!btn || typeof btn !== 'object') {
        delete entry.buttons[id];
      }
    }

    const needsSlot = [];
    for (const [id, btn] of Object.entries(entry.buttons)) {
      if (!btn.name) {
        const def = device.buttonDefs.find(d => d.id === id);
        btn.name = def ? def.name : id;
      }
      if (!btn.side || (btn.side !== 'left' && btn.side !== 'right')) {
        const def = device.buttonDefs.find(d => d.id === id);
        btn.side = def ? def.side : 'left';
      }
      if (id.startsWith('custom_')) {
        if (btn.ox == null || btn.oy == null || typeof btn.ox !== 'number' || typeof btn.oy !== 'number') {
          btn.ox = Math.round(imgW / 2);
          btn.oy = Math.round(imgH / 2);
        }
      }
      if (typeof btn.slot === 'number' && !Number.isNaN(btn.slot)) {
        btn.slot = Math.max(0, Math.min(NUM_SLOTS - 1, Math.round(btn.slot)));
        delete btn.labelY;
      } else if (btn.labelY != null) {
        btn.slot = nearestSlot(btn.labelY);
        delete btn.labelY;
      } else {
        needsSlot.push(id);
      }
    }

    const existingIds = new Set(Object.keys(entry.buttons));
    for (const def of device.buttonDefs) {
      if (!existingIds.has(def.id)) {
        entry.buttons[def.id] = {
          name: def.name, label: def.label,
          ox: def.ox, oy: def.oy, side: def.side,
        };
        needsSlot.push(def.id);
      }
    }

    if (needsSlot.length > 0) {
      for (const side of ['left', 'right']) {
        const defaults = assignDefaultSlots(entry.buttons, side);
        for (const id of needsSlot) {
          if (entry.buttons[id]?.side === side) {
            entry.buttons[id].slot = defaults[id] ?? 0;
          }
        }
      }
    }

    for (const id of Object.keys(entry.buttons)) {
      if (id.startsWith('custom_')) {
        const num = parseInt(id.split('_')[1], 10);
        if (!isNaN(num) && num >= nextCustomId) nextCustomId = num + 1;
      }
    }
  }

  return data;
}

async function loadDefaultConfig() {
  const response = await fetch('assets/default.json', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  configs = normalizeLoadedConfigs(data);
  activeIdx = 0;
}

function saveJSON() {
  const json = JSON.stringify(configs, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gamepad-layouts.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function loadJSON(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      configs = normalizeLoadedConfigs(data);
      activeIdx = 0;
      switchConfig(0);
      requestAnimationFrame(() => {
        const list = document.getElementById('button-list');
        if (list) list.scrollTop = 0;
        const devSel = document.getElementById('device-select');
        if (devSel) devSel.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
    } catch (err) {
      alert('Failed to load file:\n' + err.message);
    }
  };
  reader.readAsText(file);
}

/* ── Download PNG ────────────────────────────────── */

function downloadPNG() {
  const prevHover = hoveredBtnId;
  const prevDrag = dragBtnId;
  hoveredBtnId = null;
  dragBtnId = null;
  render();

  const link = document.createElement('a');
  link.download = `${cfg().name.replace(/[^a-z0-9_\- ]/gi, '') || 'layout'}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  hoveredBtnId = prevHover;
  dragBtnId = prevDrag;
  render();
}

/* ── Init ────────────────────────────────────────── */

async function init() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;

  try {
    await loadDefaultConfig();
  } catch (err) {
    console.warn('Failed to load assets/default.json, using built-in default config.', err);
  }

  recalcLayout();
  loadDeviceImage(cfg().device || 'xbox');

  buildButtonInputs();
  refreshConfigDropdown();
  syncInputsToConfig();
  initDrag();

  document.getElementById('color-picker').addEventListener('input', (e) => {
    cfg().themeColor = e.target.value;
    document.getElementById('color-hex').textContent = e.target.value;
    applyThemeColor(e.target.value);
    render();
  });

  document.getElementById('config-name').addEventListener('input', (e) => {
    cfg().name = e.target.value;
    refreshConfigDropdown();
  });

  document.getElementById('config-select').addEventListener('change', (e) => {
    switchConfig(parseInt(e.target.value, 10));
  });

  document.getElementById('add-config').addEventListener('click', addConfig);
  document.getElementById('del-config').addEventListener('click', deleteConfig);

  document.getElementById('device-select').addEventListener('change', (e) => {
    switchDevice(e.target.value);
  });

  document.getElementById('save-btn').addEventListener('click', saveJSON);

  const fileInput = document.getElementById('file-input');
  document.getElementById('load-btn').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) loadJSON(e.target.files[0]);
    e.target.value = '';
  });

  document.getElementById('download-btn').addEventListener('click', downloadPNG);
}

document.fonts.ready.then(init);
