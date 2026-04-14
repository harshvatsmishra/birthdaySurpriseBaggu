/* ========================================
   Week 3 Logic: Time Machine
   Hub, Starry Night, Scratch-Off
   ======================================== */

// --- Global State ---
let pastComplete = false;
let playlistComplete = false;
let futureComplete = false;
let completedConstellations = 0;
let completedCards = 0;

// --- DOM Elements ---
const screens = {
  hub: document.getElementById('hub-screen'),
  starry: document.getElementById('starry-screen'),
  scratch: document.getElementById('scratch-screen'),
  finale: document.getElementById('finale-screen')
};

const portalPast = document.getElementById('portal-past');
const portalPlaylist = document.getElementById('portal-playlist');
const portalFuture = document.getElementById('portal-future');
const hubBackBtn = document.getElementById('hub-back-btn');
const starryBackBtn = document.getElementById('starry-back-btn');
const scratchBackBtn = document.getElementById('scratch-back-btn');
const finaleBtn = document.getElementById('finale-btn');

// --- Initialization ---
function init() {
  createSparkles();
  spawnFloatingPhotos();
  initCursorTrail();
  setupNavigation();
  initStarryNight();
  initScratchOff();
  setupLetterReveal();
}

// --- Background Sparkles ---
function createSparkles() {
  const bg = document.getElementById('sparkle-bg');
  for (let i = 0; i < 50; i++) {
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.left = Math.random() * 100 + 'vw';
    s.style.top = Math.random() * 100 + 'vh';
    s.style.width = s.style.height = (Math.random() * 3 + 1) + 'px';
    s.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
    s.style.animationDelay = (Math.random() * 2) + 's';
    bg.appendChild(s);
  }
}

// --- Navigation ---
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

function setupNavigation() {
  portalPast.addEventListener('click', () => {
    showScreen('starry');
    // Re-draw starry container mapping if window resized
    setTimeout(renderStars, 100);
  });

  portalPlaylist.addEventListener('click', (e) => {
    if (portalPlaylist.classList.contains('locked')) {
      e.preventDefault(); // Prevent link from opening
      return;
    }

    // Unlock future on click
    if (!playlistComplete) {
      playlistComplete = true;
      // Use a short delay so if she comes back to the tab, the alert pops up
      setTimeout(() => {
        showCustomAlert("✨ The final Future Portal is now OPEN. ✨");
        portalFuture.classList.remove('locked');
        const lockIcon = portalFuture.querySelector('.portal-lock');
        if (lockIcon) lockIcon.remove();
      }, 1000);
    }
  });

  portalFuture.addEventListener('click', () => {
    if (portalFuture.classList.contains('locked')) return;
    showScreen('scratch');
  });

  hubBackBtn.addEventListener('click', () => {
    window.location.href = '../index.html#home_bday_surprises26';
  });

  starryBackBtn.addEventListener('click', () => showScreen('hub'));
  scratchBackBtn.addEventListener('click', () => showScreen('hub'));

  finaleBtn.addEventListener('click', () => {
    window.location.href = '../index.html#home_bday_surprises26';
  });
}

// ============================================
// STARRY NIGHT LOGIC (IDEA 1)
// ============================================
const constellationsData = [
  {
    id: 0,
    title: "The First Smile",
    text: "Remember the first time we just couldn't stop smiling at each other? That was the exact moment I knew. ✨",
    points: [{ x: 25, y: 55 }, { x: 10, y: 35 }, { x: 18, y: 25 }, { x: 25, y: 32 }, { x: 32, y: 25 }, { x: 40, y: 35 }],
    found: false,
    nodes: []
  },
  {
    id: 1,
    title: "The Infinity Loop",
    text: "Through every up and down, every fight and makeup, my love for you will just keep on looping infinitely. ♾️",
    points: [{ x: 65, y: 35 }, { x: 70, y: 25 }, { x: 85, y: 40 }, { x: 90, y: 30 }],
    found: false,
    nodes: []
  },
  {
    id: 2,
    title: "The Perfect Match",
    text: "Like two puzzle pieces meant to be together. We just fit, Buggu. 🧩💖",
    points: [{ x: 50, y: 65 }, { x: 60, y: 90 }, { x: 35, y: 75 }, { x: 65, y: 75 }, { x: 40, y: 90 }],
    found: false,
    nodes: []
  }
];

let activeConstellation = null;
let currentPointIndex = 0;

function initStarryNight() {
  document.getElementById('memory-close').addEventListener('click', () => {
    document.getElementById('memory-modal').classList.add('hidden');
    checkStarryCompletion();
  });
}

function renderStars() {
  const container = document.getElementById('stars-container');
  container.innerHTML = '';
  document.getElementById('star-lines').innerHTML = ''; // Clear SVG
  activeConstellation = null;

  const width = container.clientWidth;
  const height = container.clientHeight;

  constellationsData.forEach((c, cIdx) => {
    if (c.found) {
      drawCompletedConstellation(c, width, height);
      return;
    }
    
    // Draw Hints
    const svg = document.getElementById('star-lines');
    for(let i=0; i<c.points.length; i++) {
        let p1 = c.points[i];
        let p2 = c.points[(i+1)%c.points.length];
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', (p1.x/100)*width);
        line.setAttribute('y1', (p1.y/100)*height);
        line.setAttribute('x2', (p2.x/100)*width);
        line.setAttribute('y2', (p2.y/100)*height);
        line.setAttribute('class', 'hint-line');
        svg.appendChild(line);
    }

    c.nodes = [];
    c.clickedOrder = [];
    c.points.forEach((p, pIdx) => {
      const node = document.createElement('div');
      node.className = 'constellation-node';
      node.style.left = p.x + '%';
      node.style.top = p.y + '%';

      node.addEventListener('click', () => handleStarClick(cIdx, pIdx, node, width, height));
      container.appendChild(node);
      c.nodes.push({ el: node, x: (p.x / 100) * width, y: (p.y / 100) * height });
    });
  });
}

function drawCompletedConstellation(c, width, height) {
  const container = document.getElementById('stars-container');
  const svg = document.getElementById('star-lines');

  for (let i = 0; i < c.points.length; i++) {
    const node = document.createElement('div');
    node.className = 'constellation-node active';
    node.style.left = c.points[i].x + '%';
    node.style.top = c.points[i].y + '%';
    node.style.pointerEvents = 'none';
    container.appendChild(node);

    if (i > 0) {
      const prev = c.points[i - 1];
      drawLineSVG(svg, (prev.x / 100) * width, (prev.y / 100) * height, (c.points[i].x / 100) * width, (c.points[i].y / 100) * height);
    }
  }
  // close path
  const first = c.points[0];
  const last = c.points[c.points.length - 1];
  drawLineSVG(svg, (last.x / 100) * width, (last.y / 100) * height, (first.x / 100) * width, (first.y / 100) * height);
}

function handleStarClick(cIdx, pIdx, nodeEl, width, height) {
  const c = constellationsData[cIdx];
  if (c.found) return;
  if (c.clickedOrder && c.clickedOrder.includes(pIdx)) return; // already clicked

  // New constellation started
  if (activeConstellation !== cIdx) {
    // Reset any partial progress of previously active one
    if (activeConstellation !== null) {
      const prevC = constellationsData[activeConstellation];
      prevC.clickedOrder = [];
      prevC.nodes.forEach(n => n.el.classList.remove('active'));
      renderStars(); // Redraw everything to clear partial lines and restore hints
    }
    activeConstellation = cIdx;
  }

  // Valid click
  nodeEl.classList.add('active');
  const svg = document.getElementById('star-lines');

  if (c.clickedOrder.length > 0) {
    const prevIdx = c.clickedOrder[c.clickedOrder.length - 1];
    const prevNode = c.nodes[prevIdx];
    const currNode = c.nodes[pIdx];
    drawLineSVG(svg, prevNode.x, prevNode.y, currNode.x, currNode.y);
  }

  c.clickedOrder.push(pIdx);

  // Check if complete
  if (c.clickedOrder.length === c.points.length) {
    // connect last clicked to first clicked
    const firstIdx = c.clickedOrder[0];
    const firstNode = c.nodes[firstIdx];
    const currNode = c.nodes[pIdx];
    drawLineSVG(svg, currNode.x, currNode.y, firstNode.x, firstNode.y);

    c.found = true;
    completedConstellations++;
    
    // Snap to the perfect structured outline by redrawing
    setTimeout(() => renderStars(), 250);

    // Show memory modal Delay
    setTimeout(() => {
      document.getElementById('memory-title').textContent = c.title;
      document.getElementById('memory-text').textContent = c.text;
      document.getElementById('memory-modal').classList.remove('hidden');
    }, 800);
  }
}

function drawLineSVG(svg, x1, y1, x2, y2) {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  svg.appendChild(line);
}

function showCustomAlert(msg) {
  document.getElementById('alert-text').textContent = msg;
  document.getElementById('alert-modal').classList.remove('hidden');
}

function checkStarryCompletion() {
  if (completedConstellations === constellationsData.length && !pastComplete) {
    pastComplete = true;
    setTimeout(() => {
      // Meteor shower effect trigger here
      showCustomAlert("✨ A magical connection has been made! The Music Portal is now OPEN. ✨");
      portalPlaylist.classList.remove('locked');
      const lockIcon = portalPlaylist.querySelector('.portal-lock');
      if (lockIcon) lockIcon.remove();
      showScreen('hub');
    }, 500);
  }
}

// ============================================
// SCRATCH-OFF LOGIC (IDEA 5)
// ============================================
const scratchData = [
  { icon: '💆‍♀️', text: '1 Free Long Back Massage' },
  { icon: '🥘', text: 'I Will Cook Your Fav Meal' },
  { icon: '🎬', text: 'A Sudden Movie Date Night' },
  { icon: '✈️', text: 'A Surprise Weekend Gateway' }
];

function initScratchOff() {
  const grid = document.querySelector('.scratch-grid');
  grid.innerHTML = '';

  scratchData.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'scratch-card';

    const content = document.createElement('div');
    content.className = 'scratch-content';
    content.innerHTML = `<div class="scratch-content-icon">${item.icon}</div><div class="scratch-content-text">${item.text}</div>`;

    const canvas = document.createElement('canvas');
    canvas.className = 'scratch-canvas';
    canvas.id = 'canvas-' + i;

    card.appendChild(content);
    card.appendChild(canvas);
    grid.appendChild(card);

    // Setup Canvas after DOM insertion to get correct dimensions
    setTimeout(() => setupCanvas(canvas, i), 100);
  });
}

function setupCanvas(canvas, index) {
  const ctx = canvas.getContext('2d');

  // Set accurate dimensions
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  // Fill silver coating
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#e0e0e0");
  gradient.addColorStop(0.5, "#b0b0b0");
  gradient.addColorStop(1, "#cfcfcf");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add some pattern text to make it look like a scratch card
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.font = "bold 20px Quicksand";
  ctx.textAlign = "center";
  ctx.fillText("SCRATCH ME", canvas.width / 2, canvas.height / 2);

  // Scratch Logic
  let isDrawing = false;
  let isDone = false;

  function getMousePos(e) {
    const r = canvas.getBoundingClientRect();
    const evt = e.touches ? e.touches[0] : e;
    // Calculate scale in case of css transformations
    const scaleX = canvas.width / r.width;
    const scaleY = canvas.height / r.height;
    return {
      x: (evt.clientX - r.left) * scaleX,
      y: (evt.clientY - r.top) * scaleY
    };
  }

  function start(e) {
    if (isDone) return;
    isDrawing = true;
    const pos = getMousePos(e);
    scratch(pos.x, pos.y);
  }

  function move(e) {
    if (!isDrawing || isDone) return;
    e.preventDefault(); // prevent scrolling on touch
    const pos = getMousePos(e);
    scratch(pos.x, pos.y);
  }

  function stop() {
    isDrawing = false;
    if (!isDone) checkScratchCompletion(ctx, canvas, index, setDone);
  }

  function scratch(x, y) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();
  }

  const setDone = () => {
    isDone = true;
    canvas.style.transition = 'opacity 0.5s ease';
    canvas.style.opacity = '0';
    setTimeout(() => canvas.style.pointerEvents = 'none', 500);
    completedCards++;
    checkFutureCompletion();
  };

  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  canvas.addEventListener('mouseup', stop);
  canvas.addEventListener('mouseleave', stop);

  canvas.addEventListener('touchstart', start, { passive: false });
  canvas.addEventListener('touchmove', move, { passive: false });
  canvas.addEventListener('touchend', stop);
}

function checkScratchCompletion(ctx, canvas, index, onComplete) {
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let transparent = 0;

  // Check every 4th pixel for performance
  for (let i = 0; i < pixels.length; i += 16) {
    if (pixels[i + 3] < 128) transparent++;
  }

  const total = pixels.length / 16;
  if (transparent / total > 0.45) { // 45% scratched is enough
    onComplete();
  }
}

function sendNtfyMessage(title, msg) {
  const NTFY_TOPIC = 'buggu-bday-26apr-hvm';
  try {
    var url = 'https://ntfy.sh/' + NTFY_TOPIC;
    fetch(url, {
      method: 'POST',
      body: msg,
      headers: {
        'Title': title,
        'Tags': 'gift,sparkles'
      }
    }).catch(function (e) { console.error('[W3] ntfy error:', e); });
  } catch (e) {
    console.error('[W3] ntfy exception:', e);
  }
}

function checkFutureCompletion() {
  if (completedCards === scratchData.length && !futureComplete) {
    futureComplete = true;
    setTimeout(() => {
      document.querySelector('.scratch-title').textContent = "Exciting!";
      document.querySelector('.scratch-subtitle').textContent = "Which promise would you want to redeem first? Tap to select!";
      document.querySelector('.scratch-subtitle').style.color = '#FFD700';
      document.querySelector('.scratch-subtitle').style.fontWeight = 'bold';

      const cards = document.querySelectorAll('.scratch-card');
      cards.forEach((card, index) => {
        card.style.cursor = 'pointer';
        card.style.transform = 'scale(1.02)';
        card.style.boxShadow = '0 0 25px rgba(255, 105, 180, 0.8)';

        card.addEventListener('click', () => {
          const choiceText = scratchData[index].text + " " + scratchData[index].icon;
          document.getElementById('selected-promise-text').textContent = "Your choice: " + choiceText;

          // Send response to ntfy!
          sendNtfyMessage('Week 3 Surprise Pick! 🎟️', 'Buggu selected to redeem: ' + choiceText);

          showScreen('finale');
        });
      });
    }, 1500);
  }
}

// ============================================
// MAGIC CURSOR TRAIL (IDEA 1)
// ============================================
function initCursorTrail() {
  const emojis = ['✨', '💫', '⭐'];
  let lastSpawn = 0;
  
  function spawnParticle(e) {
    const now = Date.now();
    if (now - lastSpawn < 50) return; // Limit spawn rate
    lastSpawn = now;
    
    let x, y;
    if (e.touches && e.touches.length > 0) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }
    
    const sparkle = document.createElement('div');
    sparkle.className = 'cursor-sparkle';
    sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
      sparkle.remove();
    }, 1000);
  }
  
  window.addEventListener('mousemove', spawnParticle);
  window.addEventListener('touchmove', spawnParticle, {passive: true});
}

// ============================================
// FLOATING POLAROIDS (IDEA 5)
// ============================================
function spawnFloatingPhotos() {
  const container = document.getElementById('photo-bg');
  if(!container) return;
  const photoCount = 5;
  
  for (let i = 0; i < photoCount; i++) {
    const p = document.createElement('div');
    p.className = 'floating-polaroid';
    
    const size = 100 + Math.random() * 60;
    const left = Math.random() * 80 + 10;
    const startRot = (Math.random() - 0.5) * 45;
    const endRot = (Math.random() - 0.5) * 45;
    const duration = 20 + Math.random() * 15;
    const delay = Math.random() * -30;
    
    p.style.width = size + 'px';
    p.style.height = (size * 1.2) + 'px';
    p.style.left = left + '%';
    p.style.setProperty('--start-rot', startRot + 'deg');
    p.style.setProperty('--end-rot', endRot + 'deg');
    p.style.animationDuration = duration + 's';
    p.style.animationDelay = delay + 's';
    
    const img = document.createElement('img');
    img.src = '../w2-surprise-m7kp3/assets/photos/photo6.jpg';
    p.appendChild(img);
    
    container.appendChild(p);
  }
}

// ============================================
// HOLD TO REVEAL LETTER (IDEA 3)
// ============================================
function setupLetterReveal() {
  const btn = document.getElementById('fingerprint-btn');
  const progress = document.getElementById('hold-progress');
  if (!btn || !progress) return;
  
  let holdTimer;
  
  function startHold(e) {
    if (e.cancelable) e.preventDefault();
    progress.classList.add('holding');
    
    holdTimer = setTimeout(() => {
      revealLetter();
    }, 3000);
  }
  
  function endHold() {
    progress.classList.remove('holding');
    clearTimeout(holdTimer);
  }
  
  btn.addEventListener('mousedown', startHold);
  btn.addEventListener('touchstart', startHold, {passive: false});
  
  btn.addEventListener('mouseup', endHold);
  btn.addEventListener('mouseleave', endHold);
  btn.addEventListener('touchend', endHold);
}

function revealLetter() {
  const flash = document.getElementById('flash-overlay');
  const mainContent = document.getElementById('finale-main-content');
  const letterContent = document.getElementById('letter-content');
  
  flash.classList.add('flash');
  
  setTimeout(() => {
    mainContent.classList.add('hidden');
    letterContent.classList.remove('hidden');
    
    setTimeout(() => {
      flash.classList.remove('flash');
    }, 100);
  }, 500);
}

// Start
document.addEventListener('DOMContentLoaded', init);
