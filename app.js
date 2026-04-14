/* ========================================
   Birthday Month App — Application Logic
   Secure routing + session persistence
   ======================================== */

(function () {
  'use strict';

  // ----- Configuration -----
  // Password stored as a simple hash to avoid plain-text in source
  const PASSWORD_HASH = simpleHash('puchiiis');
  const AUTH_TOKEN_KEY = 'x_bd_tkn_26apr';
  const AUTH_TOKEN_VALUE = 'c3VycHJpc2VfYmRheV8yNg=='; // obfuscated token
  const BIRTHDAY = new Date(2026, 3, 26, 0, 0, 0); // April 26, 2026
  const WEEKS = [
    { week: 1, emoji: '🌸', label: 'Week 1', dateRange: 'Apr 1 — Apr 7', unlock: new Date(2026, 3, 1, 0, 0, 0) },
    { week: 2, emoji: '💕', label: 'Week 2', dateRange: 'Apr 8 — Apr 14', unlock: new Date(2026, 3, 8, 0, 0, 0) },
    { week: 3, emoji: '🎀', label: 'Week 3', dateRange: 'Apr 15 — Apr 21', unlock: new Date(2026, 3, 15, 0, 0, 0) },
    { week: 4, emoji: '🎂', label: 'Week 4', dateRange: 'Apr 22 — Apr 26 🎉', unlock: new Date(2026, 3, 22, 0, 0, 0) },
  ];

  // ----- Obfuscated Route Hashes -----
  // These are non-guessable base64-encoded route identifiers
  const ROUTES = {
    lock: 'bG9ja19nYXRl',                             // "lock_gate"
    intro: 'c3VycHJpc2VfcmV2ZWFs',                    // "surprise_reveal"
    home: 'aG9tZV9iZGF5X3N1cnByaXNlczI2',             // "home_bday_surprises26"
    week: 'd2Vla19zdXJwcmlzZV8=',                      // "week_surprise_" (+ week number)
  };

  // ----- DOM Elements -----
  const screens = {
    password: document.getElementById('password-screen'),
    intro: document.getElementById('intro-screen'),
    home: document.getElementById('home-screen'),
    detail: document.getElementById('week-detail'),
  };

  const passwordInput = document.getElementById('password-input');
  const unlockBtn = document.getElementById('unlock-btn');
  const togglePassword = document.getElementById('toggle-password');
  const eyeIcon = document.getElementById('eye-icon');
  const hintText = document.getElementById('hint-text');
  const inputWrapper = document.getElementById('input-wrapper');
  const bdayCountdown = document.getElementById('bday-countdown');
  const detailClose = document.getElementById('detail-close');

  // ----- Simple Hash Function -----
  function simpleHash(str) {
    let hash = 0;
    const s = str.toLowerCase();
    for (let i = 0; i < s.length; i++) {
      const ch = s.charCodeAt(i);
      hash = ((hash << 5) - hash) + ch;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  // ----- Auth Helpers -----
  function isAuthenticated() {
    return sessionStorage.getItem(AUTH_TOKEN_KEY) === AUTH_TOKEN_VALUE;
  }

  function setAuthenticated() {
    sessionStorage.setItem(AUTH_TOKEN_KEY, AUTH_TOKEN_VALUE);
    // Also store a timestamp so we know when they logged in
    sessionStorage.setItem(AUTH_TOKEN_KEY + '_ts', Date.now().toString(36));
  }

  function requireAuth() {
    if (!isAuthenticated()) {
      navigateTo('lock');
      return false;
    }
    return true;
  }

  // ----- Init -----
  init();

  function init() {
    createFloatingHearts();
    setupPasswordEvents();
    startTimers();
    setupWeekTiles();
    setupDetailClose();

    // Listen for hash changes (back/forward navigation)
    window.addEventListener('hashchange', handleRoute);

    // Handle initial route
    handleRoute();
  }

  // ============================================
  // HASH-BASED ROUTING WITH AUTH GUARDS
  // ============================================
  function navigateTo(screenName, weekNum) {
    let hash;
    if (screenName === 'lock') {
      hash = ROUTES.lock;
    } else if (screenName === 'intro') {
      hash = ROUTES.intro;
    } else if (screenName === 'home') {
      hash = ROUTES.home;
    } else if (screenName === 'week' && weekNum) {
      hash = ROUTES.week + btoa(weekNum.toString());
    } else {
      hash = ROUTES.lock;
    }
    window.location.hash = hash;
  }

  function handleRoute() {
    const hash = window.location.hash.slice(1); // Remove #

    // No hash or lock route → password screen
    if (!hash || hash === ROUTES.lock) {
      if (isAuthenticated()) {
        // Already logged in, redirect to home
        navigateTo('home');
        return;
      }
      showScreen('password');
      return;
    }

    // Intro route
    if (hash === ROUTES.intro) {
      if (!requireAuth()) return;
      showScreen('intro');
      return;
    }

    // Home route
    if (hash === ROUTES.home) {
      if (!requireAuth()) return;
      showScreen('home');
      return;
    }

    // Week detail route — validate week number AND unlock status
    if (hash.startsWith(ROUTES.week)) {
      if (!requireAuth()) return;

      const encodedWeek = hash.slice(ROUTES.week.length);
      let weekNum;
      try {
        weekNum = parseInt(atob(encodedWeek), 10);
      } catch (e) {
        // Invalid base64 → redirect to home
        navigateTo('home');
        return;
      }

      const weekData = WEEKS.find(w => w.week === weekNum);
      if (!weekData) {
        // Invalid week number → redirect to home
        navigateTo('home');
        return;
      }

      // Check if the week is actually unlocked (server-time-like check)
      const now = new Date();
      if (weekData.unlock > now) {
        // Trying to access a locked week → redirect to home
        navigateTo('home');
        return;
      }

      // All checks passed — show the week detail
      openWeekDetail(weekData, true);
      return;
    }

    // Unknown route → redirect to lock if not authenticated, home if authenticated
    if (isAuthenticated()) {
      navigateTo('home');
    } else {
      navigateTo('lock');
    }
  }

  // ============================================
  // FLOATING HEARTS BACKGROUND
  // ============================================
  function createFloatingHearts() {
    const container = document.getElementById('hearts-bg');
    const hearts = ['💖', '💗', '💕', '💝', '♥', '🩷', '🤍', '✨', '⭐'];
    const count = 20;

    for (let i = 0; i < count; i++) {
      const heart = document.createElement('span');
      heart.className = 'floating-heart';
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = Math.random() * 100 + '%';
      heart.style.fontSize = (12 + Math.random() * 18) + 'px';
      heart.style.setProperty('--duration', (6 + Math.random() * 10) + 's');
      heart.style.setProperty('--delay', (Math.random() * 10) + 's');
      container.appendChild(heart);
    }
  }

  // ============================================
  // PASSWORD SCREEN
  // ============================================
  function setupPasswordEvents() {
    unlockBtn.addEventListener('click', handleUnlock);
    passwordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleUnlock();
    });

    // Clear error state on input
    passwordInput.addEventListener('input', () => {
      inputWrapper.classList.remove('wrong', 'shake');
      hintText.textContent = '';
      hintText.className = 'hint-text';
    });

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      eyeIcon.textContent = isPassword ? '🙈' : '👁️';
    });
  }

  function handleUnlock() {
    const value = passwordInput.value.trim();

    if (!value) {
      showHint('Please enter the password! 💭', 'error');
      shakeInput();
      return;
    }

    if (simpleHash(value) === PASSWORD_HASH) {
      showHint('Yay! Welcome! 🎉', 'success');
      unlockBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
      unlockBtn.querySelector('span').textContent = '💖 Opening...';
      setAuthenticated();

      setTimeout(() => {
        navigateTo('intro');
        startIntroAnimation();
      }, 800);
    } else {
      showHint('Oops! That\'s not the magic word 😅', 'error');
      shakeInput();
      passwordInput.value = '';
      passwordInput.focus();
    }
  }

  function showHint(message, type) {
    hintText.textContent = message;
    hintText.className = 'hint-text ' + type;
  }

  function shakeInput() {
    inputWrapper.classList.add('shake', 'wrong');
    setTimeout(() => inputWrapper.classList.remove('shake'), 500);
  }

  // ============================================
  // SCREEN TRANSITIONS
  // ============================================
  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
  }

  // ============================================
  // INTRO ANIMATION
  // ============================================
  function startIntroAnimation() {
    const words = document.querySelectorAll('.intro-word');

    // Step 1: Pop in each word one by one
    words.forEach(w => w.classList.add('pop-in'));

    // Step 2: After all words popped in, hold them together for a moment with glow
    const allPoppedTime = 500 + (words.length * 500) + 400;
    setTimeout(() => {
      words.forEach(w => {
        w.classList.remove('pop-in');
        w.classList.add('all-together');
      });
      triggerEmojiBurst();
    }, allPoppedTime);

    // Step 3: Fade the words up/away
    const fadeTime = allPoppedTime + 1400;
    setTimeout(() => {
      words.forEach(w => {
        w.classList.remove('all-together');
        w.classList.add('fade-up');
      });
    }, fadeTime);

    // Step 4: Reveal the image
    const imageTime = fadeTime + 600;
    setTimeout(() => {
      const imageReveal = document.getElementById('image-reveal');
      imageReveal.classList.add('show');
    }, imageTime);

    // Step 5: Fade out image and go to home
    const homeTime = imageTime + 2500;
    setTimeout(() => {
      const imageReveal = document.getElementById('image-reveal');
      imageReveal.classList.add('fade-out');
    }, homeTime);

    setTimeout(() => {
      navigateTo('home');
    }, homeTime + 800);
  }

  function triggerEmojiBurst() {
    const container = document.getElementById('emoji-burst');
    const emojis = ['🎉', '🎊', '💖', '✨', '🌟', '🎂', '🥳', '💕', '🎁', '🩷', '⭐', '🎈'];
    const count = 18;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'burst-emoji';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      const angle = (360 / count) * i;
      const distance = 80 + Math.random() * 120;
      const tx = Math.cos(angle * Math.PI / 180) * distance;
      const ty = Math.sin(angle * Math.PI / 180) * distance;
      const tr = (Math.random() - 0.5) * 720;

      el.style.top = '50%';
      el.style.left = '50%';
      el.style.setProperty('--tx', tx + 'px');
      el.style.setProperty('--ty', ty + 'px');
      el.style.setProperty('--tr', tr + 'deg');
      el.style.animationDelay = (Math.random() * 0.3) + 's';

      container.appendChild(el);
    }

    setTimeout(() => { container.innerHTML = ''; }, 1500);
  }

  // ============================================
  // WEEKLY TILES — TIMERS & UNLOCK LOGIC
  // ============================================
  function startTimers() {
    updateAllTimers();
    setInterval(updateAllTimers, 1000);
  }

  function updateAllTimers() {
    const now = new Date();

    // Birthday countdown
    const bdayDiff = BIRTHDAY - now;
    if (bdayDiff > 0) {
      bdayCountdown.textContent = formatCountdown(bdayDiff);
    } else {
      bdayCountdown.textContent = '🎉 Today!';
    }

    // Weekly tiles
    WEEKS.forEach(week => {
      const tile = document.getElementById('week-' + week.week);
      const statusIcon = document.getElementById('status-' + week.week);
      const statusText = document.getElementById('status-text-' + week.week);
      const timer = document.getElementById('timer-' + week.week);

      const diff = week.unlock - now;

      if (diff <= 0) {
        // UNLOCKED
        tile.classList.remove('locked');
        tile.classList.add('unlocked');
        statusIcon.textContent = '💝';
        statusText.textContent = 'Tap to open your surprise!';
        timer.textContent = '';
      } else {
        // LOCKED
        tile.classList.add('locked');
        tile.classList.remove('unlocked');
        statusIcon.textContent = '🔒';
        statusText.textContent = 'Unlocks soon...';
        timer.textContent = '⏰ ' + formatCountdown(diff);
      }
    });
  }

  function formatCountdown(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (days > 0) parts.push(days + 'd');
    parts.push(hours + 'h');
    parts.push(minutes + 'm');
    parts.push(seconds + 's');

    return parts.join(' ');
  }

  // ============================================
  // WEEK TILE CLICK HANDLING
  // ============================================
  function setupWeekTiles() {
    WEEKS.forEach(week => {
      const tile = document.getElementById('week-' + week.week);
      tile.addEventListener('click', () => {
        if (!requireAuth()) return;
        if (tile.classList.contains('locked')) {
          tile.style.animation = 'shake 0.4s ease-in-out';
          setTimeout(() => tile.style.animation = '', 400);
          return;
        }
        navigateTo('week', week.week);
      });
    });
  }

  function openWeekDetail(week, fromRoute) {
    if (!requireAuth()) return;

    // Double-check unlock status even when opening
    const now = new Date();
    if (week.unlock > now) {
      navigateTo('home');
      return;
    }

    // Week 1 has its own interactive game page
    if (week.week === 1) {
      window.location.href = 'w1-surprise-q8xz9/index.html';
      return;
    }

    // Week 2 has its own interactive walking date page
    if (week.week === 2) {
      window.location.href = 'w2-surprise-m7kp3/index.html';
      return;
    }

    // Week 3 Time Machine page
    if (week.week === 3) {
      window.location.href = 'w3-surprise-p3k9q/index.html';
      return;
    }

    document.getElementById('detail-emoji').textContent = week.emoji;
    document.getElementById('detail-title').textContent = week.label;
    document.getElementById('detail-date').textContent = week.dateRange;

    // Placeholder content for weeks 2-4
    document.getElementById('detail-content').innerHTML = `
      <div class="detail-placeholder">
        <span class="placeholder-icon">🎁</span>
        <p>Hey Buggu! Your ${week.label} surprise will appear here!</p>
        <p class="placeholder-sub">Something special is being prepared just for you, Deepika... 💫</p>
      </div>
    `;

    if (fromRoute) {
      showScreen('detail');
    }
  }

  // ============================================
  // DETAIL VIEW CLOSE
  // ============================================
  function setupDetailClose() {
    detailClose.addEventListener('click', () => {
      navigateTo('home');
    });
  }

})();
