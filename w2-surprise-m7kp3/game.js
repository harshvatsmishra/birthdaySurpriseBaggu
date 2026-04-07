/* ========================================
   Week 2 — Walking Date Game Engine
   Player-controlled movement + 7 stores
   ======================================== */
(function () {
  'use strict';

  // ============================================
  // DATA
  // ============================================
  const STORES = [
    { id: 'flower', x: 450, cloud: 'cloud-flower', boyText: 'Want to pick some beautiful flowers? 🌸', overlayId: 'overlay-flower' },
    { id: 'book', x: 950, cloud: 'cloud-book', boyText: 'Do you want to explore some books? 📚', overlayId: 'overlay-book' },
    { id: 'restaurant', x: 1450, cloud: 'cloud-restaurant', boyText: 'Feeling hungry? Let\'s try something chinese! 🍜', overlayId: 'overlay-restaurant' },
    { id: 'fountain', x: 1950, cloud: 'cloud-fountain', boyText: 'Let\'s make a wish together! ⛲', overlayId: 'overlay-fountain' },
    { id: 'lock', x: 2450, cloud: 'cloud-lock', boyText: 'Want to lock our love forever? 🔒', overlayId: 'overlay-lock' },
    { id: 'cinema', x: 2950, cloud: 'cloud-cinema', boyText: 'Do you want to watch a movie? 🎬', overlayId: 'overlay-cinema' },
    { id: 'surprise', x: 3450, cloud: 'cloud-surprise', boyText: 'I have something very special for you... ✨', overlayId: 'overlay-surprise' },
  ];

  const FLOWERS = [
    { id: 'rose', emoji: '🌹', name: 'Red Rose', color: '#FF4444', message: 'You are the love of my life ❤️' },
    { id: 'tulip', emoji: '🌷', name: 'Pink Tulip', color: '#FF69B4', message: 'You bring perfect happiness 💕' },
    { id: 'daisy', emoji: '🌼', name: 'Daisy', color: '#FFD700', message: 'You make every day beautiful 🌟' },
    { id: 'sunflower', emoji: '🌻', name: 'Sunflower', color: '#FFA500', message: 'You are my sunshine ☀️' },
    { id: 'hibiscus', emoji: '🌺', name: 'Hibiscus', color: '#FF6B81', message: 'Your beauty is rare & precious 💎' },
    { id: 'orchid', emoji: '💮', name: 'Orchid', color: '#DDA0DD', message: 'You are elegant beyond measure 👑' },
  ];

  const BOOKS = [
    {
      title: 'Her Beauty', author: '— A Boy in Awe', color: '#E0115F',
      pages: [
        { quote: '"The way the sunlight catches your smile — I swear the whole world stops just to admire you."', src: 'On her smile' },
        { quote: '"You don\'t need a mirror to know you\'re beautiful. Just look at the way flowers bloom when you walk past them."', src: 'On her presence' },
        { quote: '"I\'ve seen sunsets, starry nights, and oceans — but nothing, nothing comes close to the beauty I see when I look at you."', src: 'On her eyes' },
        { quote: '"Your beauty isn\'t just in your face. It\'s in the way you care, the way you laugh, and the way you make everyone around you feel loved."', src: 'On her soul' },
        { quote: '"If beauty were time, you\'d be an eternity."', src: 'On forever' },
      ]
    },
    {
      title: 'A Lifetime With You', author: '— Promises He Keeps', color: '#7851A9',
      pages: [
        { quote: '"I promise to choose you — every morning, every night, in every lifetime. You are my always."', src: 'The first promise' },
        { quote: '"Growing old doesn\'t scare me. Growing old without you does. I want every wrinkle to be a memory we made together."', src: 'On growing old' },
        { quote: '"I don\'t just want your good days. I want your bad days, your tired days, your grumpy days — I want all of you, forever."', src: 'On forever' },
        { quote: '"One lifetime with you is not enough. If I could, I\'d find you in every life and fall in love with you all over again."', src: 'On lifetimes' },
        { quote: '"I promise — the hand you\'re holding now will never let go. Not today, not tomorrow, not ever."', src: 'The last promise' },
      ]
    },
    {
      title: 'What I Feel For You', author: '— Words From His Heart', color: '#4A90D9',
      pages: [
        { quote: '"Before you, I didn\'t know what love meant. Now I can\'t imagine what life would mean without you."', src: 'On love' },
        { quote: '"You make me want to be a better person — not because you ask me to, but because you deserve the best version of me."', src: 'On becoming better' },
        { quote: '"I fall in love with you every single day. The way you talk, the way you care, the way you are — it\'s all magic to me."', src: 'On daily love' },
        { quote: '"My heart doesn\'t beat faster when I see you — it beats right. Like it finally found the rhythm it was searching for."', src: 'On belonging' },
        { quote: '"You are my calm in every storm, my smile in every sadness, and my home in every place I go."', src: 'On home' },
      ]
    },
    {
      title: 'Pride and Prejudice', author: 'Jane Austen', color: '#8B4513',
      pages: [
        { quote: '"You have bewitched me, body and soul, and I love, I love, I love you."', src: 'Chapter 58' },
        { quote: '"I cannot fix on the hour, or the spot, or the look, or the words, which laid the foundation. I was in the middle before I knew I had begun."', src: 'Chapter 60' },
        { quote: '"My affections and wishes are unchanged; but one word from you will silence me on this subject for ever."', src: 'Chapter 58' },
        { quote: '"You are too generous to trifle with me. If your feelings are still what they were last April, tell me so at once."', src: 'Chapter 58' },
        { quote: '"In vain have I struggled. It will not do. My feelings will not be repressed. You must allow me to tell you how ardently I admire and love you."', src: 'Chapter 34' },
      ]
    },
    {
      title: 'Letters I\'ll Never Send', author: '— A Boy Who Writes', color: '#228B22',
      pages: [
        { quote: '"Dear you,\nI watched you laugh today and forgot how to breathe. How does one person carry so much light?"', src: 'Letter #1' },
        { quote: '"Some people search their whole lives for what I found the moment I met you — a reason to believe in forever."', src: 'Letter #7' },
        { quote: '"You asked me what I\'m thinking. The truth? I\'m thinking about how lucky the moon is — because she gets to watch you sleep."', src: 'Letter #12' },
        { quote: '"I didn\'t fall in love with you. I walked into love with you, with my eyes wide open, choosing to take every step along the way."', src: 'Letter #15' },
        { quote: '"If you ever doubt how much you matter — look at me. I am proof that your existence makes someone\'s entire world brighter."', src: 'Letter #20' },
      ]
    },
    {
      title: 'My Soulmate', author: '— Written in the Stars', color: '#C41E3A',
      pages: [
        { quote: '"Whatever our souls are made of, yours and mine are the same. I knew it the moment our eyes met."', src: 'On connection' },
        { quote: '"You are not just the love of my life — you are the life of my love. Everything I do, I do for us."', src: 'On purpose' },
        { quote: '"In a room full of people, my eyes will always search for you. My heart will always beat for you. That\'s not a choice — that\'s destiny."', src: 'On destiny' },
        { quote: '"They say soulmates are rare. But when I look at you, I know rarity was made for this — for us."', src: 'On us' },
        { quote: '"My bounty is as boundless as the sea, my love as deep; the more I give to thee, the more I have, for both are infinite."', src: 'Shakespeare' },
      ]
    },
  ];

  const WISHES = [
    'I wish to hold your hand forever ✨',
    'I wish every morning starts with your smile 🌅',
    'I wish to travel the world with you 🌍',
    'I wish to grow old loving you 💕',
    'I wish every day feels as magical as this ⭐',
  ];

  const LOCK_COLORS = [
    { name: 'Rose Gold', color: '#B76E79' },
    { name: 'Ruby Red', color: '#E0115F' },
    { name: 'Royal Purple', color: '#7851A9' },
    { name: 'Ocean Blue', color: '#4169E1' },
    { name: 'Golden', color: '#FFD700' },
  ];

  const VIDEOS = [
    { id: 'v1', title: 'Perfect Mix 💕', thumb: '🎬', src: 'assets/videos/video1.mp4' },
    { id: 'v2', title: 'Angel from Heaven 💖', thumb: '🎥', src: 'assets/videos/video2.mp4' },
    { id: 'v3', title: 'Wildest Dreams 💗', thumb: '📽️', src: 'assets/videos/video3.mp4' },
    { id: 'v4', title: 'Khyaal ✨', thumb: '🎞️', src: 'assets/videos/video4.mp4' },
  ];

  const SURPRISE_ITEMS = [
    { type: 'photo', id: 'p1', label: 'Upadhyay and co 1 💕', img: 'assets/photos/photo1.jpg' },
    { type: 'photo', id: 'p2', label: 'Upadhyay and co 2 💕', img: 'assets/photos/photo2.jpg' },
    { type: 'photo', id: 'p3', label: 'Upadhyay and co 3 💕', img: 'assets/photos/photo3.jpg' },
    { type: 'photo', id: 'p4', label: 'Upadhyay and co 4 💕', img: 'assets/photos/photo4.jpg' },
    { type: 'photo', id: 'p5', label: 'Upadhyay and co 5 💕', img: 'assets/photos/photo5.jpg' },
    { type: 'photo', id: 'p6', label: 'Mishra??? 💕', img: 'assets/photos/photo6.jpg' },
    { type: 'letter', id: 'l1', label: 'Letter 1 💌', content: 'Dear Buggu,\n\nEvery moment with you feels like a dream I never want to wake up from.\n\nYou are my sunshine, my everything.\n\n— With all my love ❤️' },
    { type: 'letter', id: 'l2', label: 'Letter 2 💌', content: 'My dearest,\n\nIf I could give you one thing, it would be the ability to see yourself through my eyes.\n\nOnly then would you realize how special you are.\n\n— Forever yours ❤️' },
    { type: 'letter', id: 'l3', label: 'Letter 3 💌', content: 'Buggu,\n\nYou don\'t just make me happy. You make me believe that happiness exists.\n\nThank you for being you.\n\n— Your HVM ❤️' },
    { type: 'letter', id: 'l4', label: 'Letter 4 💌', content: 'To my Buggu,\n\nDistance means nothing when someone means everything.\n\nYou are my favorite hello and my hardest goodbye.\n\n— Always yours ❤️' },
  ];

  // ============================================
  // STATE
  // ============================================
  let playerX = 100;
  let isMovingLeft = false;
  let isMovingRight = false;
  let activeStore = null;
  let inStore = false;
  let introComplete = false;
  let bouquet = [];
  let currentBook = null;
  let currentPage = 0;
  let wishesUsed = 0;
  let selectedLockColor = null;
  let lockPlaced = false;
  let storesVisited = new Set();

  const WORLD_WIDTH = 3800;
  const PROXIMITY = 90;
  const MOVE_SPEED = 2.5;

  // ============================================
  // DOM
  // ============================================
  const $ = id => document.getElementById(id);

  const dom = {
    game: $('game'),
    streetWorld: $('street-world'),
    hintBar: $('hint-bar'),
    hintText: $('hint-text'),
    characters: $('characters'),
    charBoy: $('char-boy'),
    charGirl: $('char-girl'),
    boyDialogue: $('boy-dialogue'),
    boyDialogueText: $('boy-dialogue-text'),
    enterArea: $('enter-area'),
    enterBtn: $('enter-btn'),
    moveControls: $('move-controls'),
    moveLeft: $('move-left'),
    moveRight: $('move-right'),
    introOverlay: $('intro-overlay'),
    introText: $('intro-text'),
    introBtn: $('intro-btn'),
    // Flower
    flowerGrid: $('flower-grid'),
    bouquetList: $('bouquet-list'),
    bouquetDone: $('bouquet-done'),
    // Bookstore
    bookshelf: $('bookshelf'),
    bookCoverPage: $('book-cover-page'),
    bookPage: $('book-page'),
    readerTitle: $('reader-title'),
    readerAuthor: $('reader-author'),
    openBook: $('open-book'),
    readerClose: $('reader-close'),
    quoteText: $('quote-text'),
    quoteSource: $('quote-source'),
    pageNum: $('page-num'),
    prevPage: $('prev-page'),
    nextPage: $('next-page'),
    // Fountain
    coinsRow: $('coins-row'),
    wishDisplay: $('wish-display'),
    wishText: $('wish-text'),
    fountainDone: $('fountain-done'),
    // Lock
    colorPicks: $('color-picks'),
    lockPlaceBtn: $('lock-place-btn'),
    lockControls: $('lock-controls'),
    lockDone: $('lock-done'),
    lockDoneBtn: $('lock-done-btn'),
    lockPlacedIcon: $('lock-placed-icon'),
    bridgeRailOv: $('bridge-rail-ov'),
    // Cinema
    movieList: $('movie-list'),
    theaterView: $('theater-view'),
    cinemaVideo: $('cinema-video'),
    cinemaDone: $('cinema-done'),
    // Surprise
    hangingGrid: $('hanging-grid'),
    // Viewer
    viewerOverlay: $('viewer-overlay'),
    viewerBox: $('viewer-box'),
    viewerClose: $('viewer-close'),
    // Complete
    completeScreen: $('complete-screen'),
    backHomeBtn: $('back-home-btn'),
  };

  // ============================================
  // NTFY NOTIFICATIONS
  // ============================================
  const NTFY_TOPIC = 'buggu-bday-26apr-hvm';

  function sendNotification(title, message) {
    var msg = String(message).substring(0, 500);
    var url = 'https://ntfy.sh/' + NTFY_TOPIC;
    console.log('[W2] Sending ntfy:', title, msg);

    // Method 1: fetch POST
    try {
      fetch(url, {
        method: 'POST',
        body: msg,
        headers: { 'Title': title },
      })
        .then(function (r) { console.log('[W2] ntfy status:', r.status); })
        .catch(function (e) { console.error('[W2] ntfy error:', e); });
    } catch (e) {
      console.error('[W2] ntfy exception:', e);
    }

    // Method 2: Image beacon backup
    try {
      var shortMsg = msg.length > 200 ? msg.substring(0, 200) + '...' : msg;
      var img = new Image();
      img.src = url + '?title=' + encodeURIComponent(title) + '&message=' + encodeURIComponent(shortMsg) + '&t=' + Date.now();
    } catch (e) { }
  }

  // ============================================
  // INIT
  // ============================================
  init();

  function init() {
    setupMovement();
    setupStorebacks();
    buildFlowerGrid();
    buildBookshelf();
    buildCoins();
    buildColorPicks();
    buildMovieList();
    buildHangingGrid();
    setupBookReader();
    setupEnterBtn();
    setupFountainDone();
    setupLockBridge();
    setupCinema();
    setupViewer();
    setupComplete();
    setupRestaurant();
    playIntro();
  }

  // ============================================
  // INTRO
  // ============================================
  function playIntro() {
    const lines = [
      "Hey Buggu! 💕",
      "Today I'm taking you on a special date! We'll walk together on this beautiful street.",
      "You control where we go — let's explore together! Use the arrows to walk 🚶‍♀️🚶"
    ];
    let lineIdx = 0;
    function showLine() {
      if (lineIdx >= lines.length) {
        dom.introBtn.classList.remove('hidden');
        return;
      }
      dom.introText.textContent = '';
      typeText(lines[lineIdx], dom.introText, () => {
        lineIdx++;
        setTimeout(showLine, 1200);
      });
    }
    showLine();
    dom.introBtn.addEventListener('click', () => {
      dom.introOverlay.classList.add('hidden');
      introComplete = true;
      updateHint('Use the arrows to walk! First stop: Flower Shop 🌸 →');
      sendNotification('Week 2 Started!', 'Buggu started the walking date! 💕');
    });
  }

  function typeText(text, el, cb) {
    let i = 0;
    function type() {
      if (i < text.length) { el.textContent += text.charAt(i); i++; setTimeout(type, 28); }
      else if (cb) cb();
    }
    type();
  }

  // ============================================
  // MOVEMENT
  // ============================================
  function setupMovement() {
    // Touch & mouse for left/right buttons (hold to walk)
    ['mousedown', 'touchstart'].forEach(evt => {
      dom.moveLeft.addEventListener(evt, e => { e.preventDefault(); isMovingLeft = true; }, { passive: false });
      dom.moveRight.addEventListener(evt, e => { e.preventDefault(); isMovingRight = true; }, { passive: false });
    });
    ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(evt => {
      dom.moveLeft.addEventListener(evt, () => { isMovingLeft = false; });
      dom.moveRight.addEventListener(evt, () => { isMovingRight = false; });
    });

    // Also support single tap to nudge (30px per tap)
    dom.moveLeft.addEventListener('click', () => { if (introComplete && !inStore) { playerX = Math.max(30, playerX - 40); updateWorld(); checkProximity(); } });
    dom.moveRight.addEventListener('click', () => { if (introComplete && !inStore) { playerX = Math.min(WORLD_WIDTH - 30, playerX + 40); updateWorld(); checkProximity(); } });

    // Keyboard arrows
    document.addEventListener('keydown', e => {
      if (!introComplete || inStore) return;
      if (e.key === 'ArrowLeft') isMovingLeft = true;
      if (e.key === 'ArrowRight') isMovingRight = true;
    });
    document.addEventListener('keyup', e => {
      if (e.key === 'ArrowLeft') isMovingLeft = false;
      if (e.key === 'ArrowRight') isMovingRight = false;
    });

    requestAnimationFrame(gameLoop);
  }

  function gameLoop() {
    if (introComplete && !inStore) {
      let moved = false;
      if (isMovingLeft && playerX > 30) { playerX -= MOVE_SPEED; moved = true; }
      if (isMovingRight && playerX < WORLD_WIDTH - 30) { playerX += MOVE_SPEED; moved = true; }

      if (moved) {
        dom.charBoy.classList.add('walking');
        dom.charGirl.classList.add('walking');
      } else {
        dom.charBoy.classList.remove('walking');
        dom.charGirl.classList.remove('walking');
      }

      updateWorld();
      checkProximity();
    }
    requestAnimationFrame(gameLoop);
  }

  function updateWorld() {
    const vw = dom.game.offsetWidth;
    let scrollX = playerX - vw / 2;
    scrollX = Math.max(0, Math.min(scrollX, WORLD_WIDTH - vw));
    dom.streetWorld.style.transform = 'translateX(' + (-scrollX) + 'px)';
  }

  // ============================================
  // STORE PROXIMITY
  // ============================================
  function checkProximity() {
    let nearStore = null;
    for (const store of STORES) {
      const dist = Math.abs(playerX - store.x);
      if (dist < PROXIMITY) { nearStore = store; break; }
    }

    // Clear all clouds
    STORES.forEach(s => {
      const cloud = $(s.cloud);
      if (cloud) cloud.classList.remove('active');
    });

    if (nearStore && nearStore !== activeStore) {
      activeStore = nearStore;
      const cloud = $(nearStore.cloud);
      if (cloud) cloud.classList.add('active');
      showBoyDialogue(nearStore.boyText);
      dom.enterArea.classList.remove('hidden');
    } else if (!nearStore && activeStore) {
      activeStore = null;
      hideBoyDialogue();
      dom.enterArea.classList.add('hidden');
    }
  }

  function showBoyDialogue(text) {
    dom.boyDialogueText.textContent = text;
    dom.boyDialogue.classList.remove('hidden');
  }

  function hideBoyDialogue() {
    dom.boyDialogue.classList.add('hidden');
  }

  // ============================================
  // ENTER STORE
  // ============================================
  function setupEnterBtn() {
    dom.enterBtn.addEventListener('click', () => {
      if (!activeStore) return;
      enterStore(activeStore);
    });
  }

  function enterStore(store) {
    inStore = true;
    const overlay = $(store.overlayId);
    if (overlay) overlay.classList.remove('hidden');
    dom.enterArea.classList.add('hidden');
    hideBoyDialogue();
    STORES.forEach(s => { const c = $(s.cloud); if (c) c.classList.remove('active'); });

    dom.charBoy.classList.remove('walking');
    dom.charGirl.classList.remove('walking');

    storesVisited.add(store.id);
    sendNotification('Entered ' + store.id + '!', 'Buggu entered the ' + store.id + ' store!');
    updateHint('Exploring ' + store.id + '...');
  }

  function exitStore(storeId) {
    const overlay = $('overlay-' + storeId);
    if (overlay) overlay.classList.add('hidden');
    inStore = false;
    activeStore = null;

    // Check if all stores visited (except restaurant placeholder)
    const visitableStores = ['flower', 'book', 'fountain', 'lock', 'cinema', 'surprise'];
    const allVisited = visitableStores.every(s => storesVisited.has(s));
    if (allVisited) {
      setTimeout(showComplete, 800);
    } else {
      updateHint('Keep walking to find more places! →');
    }
  }

  function setupStorebacks() {
    document.querySelectorAll('.store-back').forEach(btn => {
      btn.addEventListener('click', () => {
        const storeId = btn.dataset.store;
        exitStore(storeId);
      });
    });
  }

  // ============================================
  // FLOWER SHOP
  // ============================================
  function buildFlowerGrid() {
    dom.flowerGrid.innerHTML = '';
    FLOWERS.forEach(f => {
      const div = document.createElement('div');
      div.className = 'flower-card';
      div.dataset.id = f.id;
      div.innerHTML = '<div class="flower-emoji">' + f.emoji + '</div><div class="flower-name">' + f.name + '</div>';
      div.addEventListener('click', () => pickFlower(f, div));
      dom.flowerGrid.appendChild(div);
    });
  }

  function pickFlower(flower, el) {
    const idx = bouquet.findIndex(b => b.id === flower.id);
    if (idx !== -1) {
      bouquet.splice(idx, 1);
      el.classList.remove('picked');
    } else {
      el.classList.add('picked');
      bouquet.push(flower);
    }
    renderBouquet();
  }

  function renderBouquet() {
    if (bouquet.length === 0) {
      dom.bouquetList.innerHTML = '<p class="empty-msg">Tap flowers to add them!</p>';
      dom.bouquetDone.classList.add('hidden');
      return;
    }
    dom.bouquetList.innerHTML = '';
    bouquet.forEach(f => {
      const span = document.createElement('div');
      span.className = 'bouquet-item';
      span.innerHTML = '<span class="b-emoji">' + f.emoji + '</span><span class="b-msg">' + f.message + '</span>';
      dom.bouquetList.appendChild(span);
    });
    if (bouquet.length >= 2) dom.bouquetDone.classList.remove('hidden');
  }

  // Bouquet done
  dom.bouquetDone.addEventListener('click', () => {
    const bouquetDetails = bouquet.map(f => f.emoji + ' ' + f.name + ' — ' + f.message).join(' | ');
    sendNotification('Bouquet Complete!', 'Buggu picked: ' + bouquetDetails);
    setTimeout(() => exitStore('flower'), 500);
  });

  // ============================================
  // BOOKSTORE
  // ============================================
  function buildBookshelf() {
    dom.bookshelf.innerHTML = '';
    BOOKS.forEach((b, idx) => {
      const div = document.createElement('div');
      div.className = 'book-card';
      div.style.setProperty('--book-color', b.color);
      div.innerHTML = '<div class="book-icon">📖</div><div class="book-title-text">' + b.title + '</div><div class="book-author-text">' + b.author + '</div>';
      div.addEventListener('click', () => openBookReader(idx));
      dom.bookshelf.appendChild(div);
    });
  }

  function openBookReader(idx) {
    currentBook = BOOKS[idx];
    currentPage = 0;
    dom.readerTitle.textContent = currentBook.title;
    dom.readerAuthor.textContent = currentBook.author;
    dom.bookCoverPage.classList.remove('hidden');
    dom.bookPage.classList.add('hidden');
    $('overlay-reader').classList.remove('hidden');
    $('book-reader').style.borderColor = currentBook.color;
    sendNotification('Reading book!', currentBook.title + ' by ' + currentBook.author);
  }

  function setupBookReader() {
    dom.openBook.addEventListener('click', () => {
      dom.bookCoverPage.classList.add('hidden');
      dom.bookPage.classList.remove('hidden');
      showPage();
    });
    dom.prevPage.addEventListener('click', () => { if (currentPage > 0) { currentPage--; showPage(); } });
    dom.nextPage.addEventListener('click', () => {
      if (currentPage < currentBook.pages.length - 1) { currentPage++; showPage(); }
    });
    dom.readerClose.addEventListener('click', () => {
      $('overlay-reader').classList.add('hidden');
    });
  }

  function showPage() {
    const p = currentBook.pages[currentPage];
    dom.quoteText.textContent = p.quote;
    dom.quoteSource.textContent = '— ' + p.src;
    dom.pageNum.textContent = (currentPage + 1) + '/' + currentBook.pages.length;
    dom.bookPage.style.animation = 'none';
    void dom.bookPage.offsetHeight;
    dom.bookPage.style.animation = 'pageFlip .4s ease';
  }

  // ============================================
  // WISHING FOUNTAIN
  // ============================================
  function buildCoins() {
    dom.coinsRow.innerHTML = '';
    for (let i = 0; i < WISHES.length; i++) {
      const btn = document.createElement('button');
      btn.className = 'coin-btn';
      btn.textContent = '🪙';
      btn.dataset.idx = i;
      btn.addEventListener('click', () => throwCoin(btn, i));
      dom.coinsRow.appendChild(btn);
    }
  }

  function throwCoin(btn, idx) {
    if (btn.classList.contains('thrown')) return;
    btn.classList.add('thrown');
    wishesUsed++;

    // Splash effect
    const splash = document.createElement('span');
    splash.className = 'coin-splash';
    splash.textContent = '💫';
    splash.style.left = btn.offsetLeft + 'px';
    splash.style.top = btn.offsetTop + 'px';
    dom.coinsRow.appendChild(splash);
    setTimeout(() => splash.remove(), 600);

    dom.wishText.textContent = WISHES[idx];
    dom.wishDisplay.classList.remove('hidden');
    dom.wishDisplay.style.animation = 'none';
    void dom.wishDisplay.offsetHeight;
    dom.wishDisplay.style.animation = 'popIn .4s ease';

    sendNotification('Made a wish!', WISHES[idx]);

    if (wishesUsed >= WISHES.length) {
      dom.fountainDone.classList.remove('hidden');
    }
  }

  function setupFountainDone() {
    dom.fountainDone.addEventListener('click', () => exitStore('fountain'));
  }

  // ============================================
  // LOVE LOCK BRIDGE
  // ============================================
  function buildColorPicks() {
    dom.colorPicks.innerHTML = '';
    LOCK_COLORS.forEach((c, i) => {
      const div = document.createElement('div');
      div.className = 'color-pick';
      div.style.background = c.color;
      div.title = c.name;
      div.addEventListener('click', () => selectLockColor(i, div));
      dom.colorPicks.appendChild(div);
    });
  }

  function selectLockColor(idx, el) {
    document.querySelectorAll('.color-pick').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    selectedLockColor = LOCK_COLORS[idx];
    dom.lockPlaceBtn.classList.remove('hidden');
  }

  function setupLockBridge() {
    dom.lockPlaceBtn.addEventListener('click', () => {
      if (!selectedLockColor) return;
      lockPlaced = true;
      dom.lockControls.classList.add('hidden');

      // Add lock to bridge
      const lockEl = document.createElement('span');
      lockEl.className = 'existing-lock';
      lockEl.textContent = '🔒';
      lockEl.style.cssText = 'left:50%;top:40%;font-size:1.4rem;opacity:1;color:' + selectedLockColor.color;
      dom.bridgeRailOv.appendChild(lockEl);

      dom.lockPlacedIcon.style.color = selectedLockColor.color;
      dom.lockDone.classList.remove('hidden');
      sendNotification('Love Lock Placed!', 'H ❤️ D — Forever in ' + selectedLockColor.name);
    });

    dom.lockDoneBtn.addEventListener('click', () => exitStore('lock'));
  }

  // ============================================
  // CINEMA HALL
  // ============================================
  function buildMovieList() {
    dom.movieList.innerHTML = '';
    VIDEOS.forEach((v, i) => {
      const div = document.createElement('div');
      div.className = 'movie-card';
      div.innerHTML = '<div class="movie-thumb">' + v.thumb + '</div><div class="movie-title-text">' + v.title + '</div>';
      div.addEventListener('click', () => playMovie(i));
      dom.movieList.appendChild(div);
    });
  }

  function playMovie(idx) {
    dom.movieList.classList.add('hidden');
    dom.theaterView.classList.remove('hidden');

    // For now, show placeholder since no real video sources
    const vid = dom.cinemaVideo;
    if (VIDEOS[idx].src) {
      vid.src = VIDEOS[idx].src;
      vid.play().catch(() => { });
    }

    dom.cinemaDone.classList.remove('hidden');
    sendNotification('Watching movie!', VIDEOS[idx].title);
  }

  function setupCinema() {
    dom.cinemaDone.addEventListener('click', () => {
      dom.cinemaVideo.pause();
      dom.theaterView.classList.add('hidden');
      dom.movieList.classList.remove('hidden');
      exitStore('cinema');
    });
  }

  // ============================================
  // SURPRISE ROOM
  // ============================================
  function buildHangingGrid() {
    dom.hangingGrid.innerHTML = '';
    SURPRISE_ITEMS.forEach(item => {
      const div = document.createElement('div');
      div.className = 'hanging-item';
      div.innerHTML = '<div class="item-icon">' + (item.type === 'photo' ? '📷' : '💌') + '</div><div class="item-label">' + item.label + '</div>';
      div.addEventListener('click', () => openViewer(item));
      dom.hangingGrid.appendChild(div);
    });
  }

  function openViewer(item) {
    if (item.type === 'photo') {
      dom.viewerBox.innerHTML = '<img src="' + item.img + '" style="width:100%;border-radius:10px" id="surprise-img"><p style="color:#666;font-size:.85rem;margin-top:8px">' + item.label + '</p>';
      const imgEl = dom.viewerBox.querySelector('#surprise-img');
      if (imgEl) {
        imgEl.onerror = () => {
          dom.viewerBox.innerHTML = '<div style="font-size:5rem;margin:20px 0">📷</div><p style="color:#888;font-size:.85rem">' + item.label + '</p><p style="color:#aaa;font-size:.75rem;margin-top:8px">Drop file named <b>' + item.img.split('/').pop() + '</b> in assets/photos/ to see it here! 💕</p>';
        };
      }
    } else {
      dom.viewerBox.innerHTML = '<div style="font-size:2rem;margin-bottom:12px">💌</div><div class="letter-text">' + item.content + '</div>';
    }
    dom.viewerOverlay.classList.remove('hidden');
    sendNotification('Viewing ' + item.type + '!', item.label);
  }

  function setupViewer() {
    dom.viewerClose.addEventListener('click', () => {
      dom.viewerOverlay.classList.add('hidden');
    });
  }

  // ============================================
  // COMPLETE
  // ============================================
  function showComplete() {
    dom.completeScreen.classList.remove('hidden');
    sendNotification('Week 2 Complete!', 'Buggu finished the walking date! Stores visited: ' + Array.from(storesVisited).join(', '));
  }

  function setupComplete() {
    dom.backHomeBtn.addEventListener('click', () => {
      window.location.href = '../index.html';
    });
  }

  // ============================================
  // RESTAURANT BOOKING
  // ============================================
  function setupRestaurant() {
    const dateInput = $('booking-date');
    const timeSlotsEl = $('time-slots');
    const confirmBtn = $('booking-confirm');
    const bookingDone = $('booking-done');
    const bookingSummary = $('booking-summary');
    const bookingExit = $('booking-exit');
    const bookingForm = document.querySelector('.booking-form');

    let selectedSlot = null;

    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Time slot selection
    timeSlotsEl.addEventListener('click', e => {
      const btn = e.target.closest('.time-slot-btn');
      if (!btn) return;
      document.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSlot = btn.dataset.slot;
      // Show confirm if date also selected
      if (dateInput.value) confirmBtn.classList.remove('hidden');
    });

    dateInput.addEventListener('change', () => {
      if (selectedSlot) confirmBtn.classList.remove('hidden');
    });

    // Confirm booking
    confirmBtn.addEventListener('click', () => {
      if (!dateInput.value || !selectedSlot) return;
      const dateObj = new Date(dateInput.value + 'T00:00:00');
      const dateStr = dateObj.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      bookingSummary.textContent = '📅 ' + dateStr + '  ⏰ ' + selectedSlot;
      bookingForm.classList.add('hidden');
      bookingDone.classList.remove('hidden');
      sendNotification('🍜 Delivery Booked!', 'Buggu booked delivery for ' + dateStr + ' at ' + selectedSlot);
    });

    // Exit
    bookingExit.addEventListener('click', () => {
      storesVisited.add('restaurant');
      exitStore('restaurant');
    });
  }

  // ============================================
  // HELPERS
  // ============================================
  function updateHint(text) {
    dom.hintText.textContent = text;
  }

})();
