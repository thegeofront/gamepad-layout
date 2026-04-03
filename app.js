/* ── Constants ───────────────────────────────────── */

const CANVAS_W = 1920;
const CANVAS_H = 1080;
const IMG_W = 1280;
const IMG_H = 888;

const CTRL_W = 840;
const CTRL_SCALE = CTRL_W / IMG_W;
const CTRL_H = Math.round(IMG_H * CTRL_SCALE);
const CTRL_X = Math.round((CANVAS_W - CTRL_W) / 2);
const CTRL_Y = Math.round((CANVAS_H - CTRL_H) / 2);

const CORNER_RADIUS = 14;
const LABEL_PAD_Y = 70;
const DOT_RADIUS = 6;
const HIT_RADIUS = 20;

const NUM_SLOTS = 16;
const SLOT_RANGE = CANVAS_H - 2 * LABEL_PAD_Y;
const SLOT_STEP = SLOT_RANGE / (NUM_SLOTS - 1);

const LEFT_TURN_X  = CTRL_X - 50;
const LEFT_LINE_END  = 290;
const RIGHT_TURN_X = CTRL_X + CTRL_W + 50;
const RIGHT_LINE_END = CANVAS_W - 290;

const BUTTON_DEFS = [
  { id: 'lt',    name: 'LT',    label: 'Left Trigger',  ox: 192,  oy: 12,  side: 'left'  },
  { id: 'lb',    name: 'LB',    label: 'Left Bumper',   ox: 228,  oy: 72,  side: 'left'  },
  { id: 'guide', name: 'Xbox',  label: 'Xbox Button',   ox: 640,  oy: 72,  side: 'left'  },
  { id: 'view',  name: 'View',  label: 'View',          ox: 510,  oy: 288, side: 'left'  },
  { id: 'ls',    name: 'LS',    label: 'Left Stick',    ox: 280,  oy: 288, side: 'left'  },
  { id: 'dpad',  name: 'D-Pad', label: 'D-Pad',         ox: 418,  oy: 510, side: 'left'  },
  { id: 'rt',    name: 'RT',    label: 'Right Trigger',  ox: 1088, oy: 12,  side: 'right' },
  { id: 'rb',    name: 'RB',    label: 'Right Bumper',   ox: 1052, oy: 72,  side: 'right' },
  { id: 'y',     name: 'Y',     label: '"Y" Button',     ox: 942,  oy: 132, side: 'right' },
  { id: 'x',     name: 'X',     label: '"X" Button',     ox: 872,  oy: 264, side: 'right' },
  { id: 'b',     name: 'B',     label: '"B" Button',     ox: 1030, oy: 264, side: 'right' },
  { id: 'menu',  name: 'Menu',  label: 'Menu',           ox: 676,  oy: 288, side: 'right' },
  { id: 'a',     name: 'A',     label: '"A" Button',     ox: 950,  oy: 382, side: 'right' },
  { id: 'rs',    name: 'RS',    label: 'Right Stick',    ox: 770,  oy: 510, side: 'right' },
];

/* ── State ───────────────────────────────────────── */

let configs = [createDefaultConfig()];
let activeIdx = 0;
let controllerImg = null;
let canvas, ctx;

let dragBtnId = null;
let dragType = null;   // 'dot' | 'label'
let hoveredBtnId = null;
let hoveredType = null; // 'dot' | 'label'

let cachedLabelYs = new Map();

/* ── Helpers ─────────────────────────────────────── */

function cfg() { return configs[activeIdx]; }

function createDefaultConfig() {
  const c = { name: 'Default', themeColor: '#00ffc8', buttons: {} };
  const leftSlots = assignDefaultSlots('left');
  const rightSlots = assignDefaultSlots('right');
  for (const b of BUTTON_DEFS) {
    const slot = b.side === 'left' ? leftSlots[b.id] : rightSlots[b.id];
    c.buttons[b.id] = { label: b.label, ox: b.ox, oy: b.oy, side: b.side, slot };
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
    x: CTRL_X + ox * CTRL_SCALE,
    y: CTRL_Y + oy * CTRL_SCALE,
  };
}

function canvasCoords(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) * (CANVAS_W / rect.width),
    y: (e.clientY - rect.top)  * (CANVAS_H / rect.height),
  };
}

function slotY(slot) {
  return LABEL_PAD_Y + slot * SLOT_STEP;
}

function nearestSlot(y) {
  const raw = Math.round((y - LABEL_PAD_Y) / SLOT_STEP);
  return Math.max(0, Math.min(NUM_SLOTS - 1, raw));
}

function assignDefaultSlots(side) {
  const defs = BUTTON_DEFS.filter(d => d.side === side).sort((a, b) => a.oy - b.oy);
  const offset = Math.floor((NUM_SLOTS - defs.length) / 2);
  const map = {};
  defs.forEach((d, i) => { map[d.id] = offset + i; });
  return map;
}

function hitTest(cx, cy) {
  const buttons = cfg().buttons;
  for (const def of BUTTON_DEFS) {
    const b = buttons[def.id];
    if (!b) continue;
    const { x, y } = toCanvas(b.ox, b.oy);
    const dx = cx - x, dy = cy - y;
    if (dx * dx + dy * dy <= HIT_RADIUS * HIT_RADIUS) return def.id;
  }
  return null;
}

const LABEL_HIT_W = 160;
const LABEL_HIT_H = 32;

function hitTestLabel(cx, cy) {
  const buttons = cfg().buttons;
  for (const def of BUTTON_DEFS) {
    const b = buttons[def.id];
    if (!b || !b.label) continue;
    const ly = cachedLabelYs.get(def.id);
    if (ly == null) continue;
    const isLeft = b.side === 'left';
    const lineEnd = isLeft ? LEFT_LINE_END : RIGHT_LINE_END;
    const rx = isLeft ? lineEnd - LABEL_HIT_W : lineEnd;
    const ry = ly - LABEL_HIT_H / 2;
    if (cx >= rx && cx <= rx + LABEL_HIT_W && cy >= ry && cy <= ry + LABEL_HIT_H) {
      return def.id;
    }
  }
  return null;
}

/* ── Theme color ─────────────────────────────────── */

function applyThemeColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const s = document.documentElement.style;
  s.setProperty('--accent',       hex);
  s.setProperty('--accent-dim',   `rgba(${r},${g},${b},0.6)`);
  s.setProperty('--accent-glow',  `rgba(${r},${g},${b},0.15)`);
  s.setProperty('--border',       `rgba(${r},${g},${b},0.12)`);
  s.setProperty('--border-focus', `rgba(${r},${g},${b},0.5)`);
}

/* ── Render ──────────────────────────────────────── */

function render() {
  const c = cfg();
  const accent = c.themeColor;

  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  // Background
  const bg = ctx.createRadialGradient(
    CANVAS_W / 2, CANVAS_H / 2, 80,
    CANVAS_W / 2, CANVAS_H / 2, CANVAS_W * 0.65,
  );
  bg.addColorStop(0, '#141428');
  bg.addColorStop(1, '#08080f');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Controller image
  if (controllerImg) {
    ctx.drawImage(controllerImg, CTRL_X, CTRL_Y, CTRL_W, CTRL_H);
  }

  cachedLabelYs = new Map();
  for (const def of BUTTON_DEFS) {
    const b = c.buttons[def.id];
    if (!b || !b.label) continue;
    cachedLabelYs.set(def.id, slotY(b.slot));
  }

  if (dragType === 'label' || hoveredType === 'label') {
    const activeId = dragBtnId || hoveredBtnId;
    if (activeId) drawSlotGuides(c.buttons[activeId].side, accent);
  }

  for (const def of BUTTON_DEFS) {
    const ly = cachedLabelYs.get(def.id);
    if (ly != null) drawLabelLine(def.id, ly, accent);
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
  const isLeft  = b.side === 'left';
  const turnX   = isLeft ? LEFT_TURN_X   : RIGHT_TURN_X;
  const lineEnd = isLeft ? LEFT_LINE_END  : RIGHT_LINE_END;
  const isActive  = id === dragBtnId || id === hoveredBtnId;
  const dotHot    = isActive && (hoveredType === 'dot' || dragType === 'dot');
  const labelHot  = isActive && (hoveredType === 'label' || dragType === 'label');

  ctx.save();
  ctx.lineCap = 'round';

  // Glow pass
  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.arcTo(turnX, ly, lineEnd, ly, CORNER_RADIUS);
  ctx.lineTo(lineEnd, ly);
  ctx.strokeStyle = rgba(accent, 0.2);
  ctx.lineWidth = isActive ? 10 : 7;
  ctx.stroke();

  // Main line
  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.arcTo(turnX, ly, lineEnd, ly, CORNER_RADIUS);
  ctx.lineTo(lineEnd, ly);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Dot at anchor
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

  // Endpoint tick
  ctx.beginPath();
  ctx.moveTo(lineEnd, ly - 6);
  ctx.lineTo(lineEnd, ly + 6);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Label hover highlight
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

    // Grip dots (vertical drag hint)
    const gripX = isLeft ? lineEnd - hlW + 10 : lineEnd + hlW - 10;
    ctx.fillStyle = rgba(accent, 0.4);
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.arc(gripX, ly + i * 6, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Text
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
        b.ox = Math.round((x - CTRL_X) / CTRL_SCALE);
        b.oy = Math.round((y - CTRL_Y) / CTRL_SCALE);
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

  const leftDefs  = BUTTON_DEFS.filter(d => d.side === 'left');
  const rightDefs = BUTTON_DEFS.filter(d => d.side === 'right');

  addGroup(container, 'Left Side',  leftDefs);
  addGroup(container, 'Right Side', rightDefs);
}

function addGroup(container, title, defs) {
  const group = document.createElement('div');
  group.className = 'button-group';

  const h3 = document.createElement('h3');
  h3.textContent = title;
  group.appendChild(h3);

  for (const def of defs) {
    const row = document.createElement('div');
    row.className = 'button-row';

    const lbl = document.createElement('label');
    lbl.textContent = def.name;
    lbl.setAttribute('for', `inp-${def.id}`);

    const inp = document.createElement('input');
    inp.type = 'text';
    inp.id = `inp-${def.id}`;
    inp.value = cfg().buttons[def.id]?.label || '';
    inp.placeholder = def.name;
    inp.addEventListener('input', (e) => {
      cfg().buttons[def.id].label = e.target.value;
      render();
    });

    row.append(lbl, inp);
    group.appendChild(row);
  }

  container.appendChild(group);
}

function syncInputsToConfig() {
  const c = cfg();
  for (const def of BUTTON_DEFS) {
    const inp = document.getElementById(`inp-${def.id}`);
    if (inp) inp.value = c.buttons[def.id]?.label || '';
  }
  document.getElementById('color-picker').value = c.themeColor;
  document.getElementById('color-hex').textContent = c.themeColor;
  document.getElementById('config-name').value = c.name;
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
  activeIdx = idx;
  refreshConfigDropdown();
  syncInputsToConfig();
  render();
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

/* ── Save / Load ─────────────────────────────────── */

function normalizeLoadedConfigs(data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Expected a non-empty array of configs');
  }

  for (const entry of data) {
    if (!entry.name) entry.name = 'Untitled';
    if (!entry.themeColor) entry.themeColor = '#00ffc8';
    if (!entry.buttons) entry.buttons = {};

    const needsDefaultSlots = { left: [], right: [] };
    for (const def of BUTTON_DEFS) {
      if (!entry.buttons[def.id]) {
        entry.buttons[def.id] = { label: def.label, ox: def.ox, oy: def.oy, side: def.side };
      }
      const btn = entry.buttons[def.id];
      btn.side = btn.side || def.side;
      if (btn.slot !== undefined) {
        delete btn.labelY;
      } else if (btn.labelY != null) {
        btn.slot = nearestSlot(btn.labelY);
        delete btn.labelY;
      } else {
        needsDefaultSlots[btn.side].push(def.id);
        delete btn.labelY;
      }
    }
    for (const side of ['left', 'right']) {
      if (needsDefaultSlots[side].length === 0) continue;
      const defaults = assignDefaultSlots(side);
      for (const id of needsDefaultSlots[side]) {
        entry.buttons[id].slot = defaults[id] ?? 0;
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
      switchConfig(0);
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
  link.download = `${cfg().name.replace(/[^a-z0-9_\- ]/gi, '')|| 'layout'}.png`;
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

  controllerImg = new Image();
  controllerImg.crossOrigin = 'anonymous';
  controllerImg.onload = () => render();
  controllerImg.src = 'assets/xbox.png';

  buildButtonInputs();
  refreshConfigDropdown();
  syncInputsToConfig();
  initDrag();

  // Color picker
  const picker = document.getElementById('color-picker');
  picker.addEventListener('input', (e) => {
    cfg().themeColor = e.target.value;
    document.getElementById('color-hex').textContent = e.target.value;
    applyThemeColor(e.target.value);
    render();
  });

  // Config name
  document.getElementById('config-name').addEventListener('input', (e) => {
    cfg().name = e.target.value;
    refreshConfigDropdown();
  });

  // Config select
  document.getElementById('config-select').addEventListener('change', (e) => {
    switchConfig(parseInt(e.target.value, 10));
  });

  // Config add / delete
  document.getElementById('add-config').addEventListener('click', addConfig);
  document.getElementById('del-config').addEventListener('click', deleteConfig);

  // Save / Load
  document.getElementById('save-btn').addEventListener('click', saveJSON);

  const fileInput = document.getElementById('file-input');
  document.getElementById('load-btn').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) loadJSON(e.target.files[0]);
    e.target.value = '';
  });

  // Download
  document.getElementById('download-btn').addEventListener('click', downloadPNG);
}

document.fonts.ready.then(init);
