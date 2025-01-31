// p5.js Sketch (no delete tool, no redo)

// Global state
let currentTool = 'draw';     // 'draw' or 'color'
let currentColor = '#000000'; // default black
let bgColor = '#A63D40';      // background color
let strokeWidth = 4;          // draw line thickness
let isDrawing = false;        // track if mouse is held down

// We'll store snapshots for UNDO
let paths = [];

// Setup runs once
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(bgColor);
  setupUI();
}

// Resize if the user changes window size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(bgColor);
  if (paths.length > 0) {
    image(paths[paths.length - 1], 0, 0);
  }
}

// p5 draw loop (unused here, since we draw in mouseDragged)
function draw() {}

// Mouse dragged for drawing
function mouseDragged() {
  if (!isDrawing) return;
  if (currentTool === 'draw') {
    stroke(currentColor);
    strokeWeight(strokeWidth);
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

// Mouse pressed: if we’re in draw mode, start drawing
function mousePressed() {
  if (currentTool === 'draw') {
    isDrawing = true;
  }
}

// Mouse released: stop drawing, save snapshot for undo
function mouseReleased() {
  if (isDrawing) {
    isDrawing = false;
    saveState();
  }
}

// Save a snapshot to paths for undo
function saveState() {
  const snapshot = get();
  paths.push(snapshot);
}

// Undo: remove last snapshot, redraw older state if any
function undo() {
  if (paths.length > 0) {
    paths.pop();
  }
  background(bgColor);
  if (paths.length > 0) {
    image(paths[paths.length - 1], 0, 0);
  }
}

// Export to PNG
function exportPNG() {
  saveCanvas('drawing', 'png');
}

// Setup UI event listeners
function setupUI() {
  // Switch to Draw
  const btnDraw = document.getElementById('switch-draw');
  btnDraw?.addEventListener('click', () => {
    currentTool = 'draw';
    btnDraw.classList.add('active');
    document.getElementById('switch-color').classList.remove('active');
  });

  // Switch to Color
  const btnColor = document.getElementById('switch-color');
  btnColor?.addEventListener('click', () => {
    currentTool = 'color';
    btnColor.classList.add('active');
    document.getElementById('switch-draw').classList.remove('active');
  });

  // Color squares
  document.getElementById('color-dark')?.addEventListener('click', () => setColor('#333333'));
  document.getElementById('color-grey')?.addEventListener('click', () => setColor('#888888'));
  document.getElementById('color-white')?.addEventListener('click', () => setColor('#ffffff'));
  document.getElementById('color-blue')?.addEventListener('click', () => setColor('#0000ff'));
  document.getElementById('color-red')?.addEventListener('click', () => setColor('#ff0000'));
  document.getElementById('color-pink')?.addEventListener('click', () => setColor('#ff69b4'));
  document.getElementById('color-lime')?.addEventListener('click', () => setColor('#00ff00'));
  document.getElementById('color-yellow')?.addEventListener('click', () => setColor('#ffff00'));
  document.getElementById('color-orange')?.addEventListener('click', () => setColor('#ffa500'));

  // Undo
  document.getElementById('undo')?.addEventListener('click', undo);

  // Export
  document.getElementById('export-png')?.addEventListener('click', exportPNG);

  // Clear (if you have a button #clear-canvas)
  const btnClear = document.getElementById('clear-canvas');
  btnClear?.addEventListener('click', () => {
    background(bgColor);
    paths = [];
  });
}

function setColor(col) {
  currentColor = col;
}
