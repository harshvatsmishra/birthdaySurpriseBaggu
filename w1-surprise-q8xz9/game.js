/* ========================================
   Week 1 — Shopping Date Game Engine
   Scene-based dialogue + Shopping + Logger
   ======================================== */

(function () {
  'use strict';

  // ============================================
  // PERFUME DATA — CUSTOMIZE THESE
  // ============================================
  const PERFUMES = [
    {
      id: 1,
      name: 'Burberry Goddess',
      desc: 'Floral, Warm & Spicy, Citrus & Fruity, Earthy & Woody',
      link: 'https://www.fragrantica.com/perfume/Burberry/Goddess-Parfum-109082.html',
      img: '../week1-assets/perfume-1.png',
    },
    {
      id: 2,
      name: 'JPG Gaultier Divine',
      desc: 'Floral, Warm & Spicy',
      link: 'https://www.fragrantica.com/perfume/Jean-Paul-Gaultier/Gaultier-Divine-Le-Parfum-93887.html',
      img: '../week1-assets/perfume-2.png',
    },
    {
      id: 3,
      name: 'YSL Libre',
      desc: 'Floral, Lavender, Orange Blossom, Vanilla Extract',
      link: 'https://www.fragrantica.com/perfume/Yves-Saint-Laurent/Libre-Intense-62318.html',
      img: '../week1-assets/perfume-3.png',
    },
    {
      id: 4,
      name: 'Gucci Bloom',
      desc: 'White Floral, Tuberose, Jasmine',
      link: 'https://www.fragrantica.com/perfume/Gucci/Gucci-Bloom-44894.html',
      img: '../week1-assets/perfume-4.png',
    },
    {
      id: 5,
      name: 'Giorgio Armani Si',
      desc: 'Floral, Earthy & Woody',
      link: 'https://www.fragrantica.com/perfume/Giorgio-Armani/Si-Eau-de-Parfum-Intense-83977.html',
      img: '../week1-assets/perfume-5.png',
    },
    {
      id: 6,
      name: 'Carolina Herrera Good Girl',
      desc: 'Earthy & Woody',
      link: 'https://www.fragrantica.com/perfume/Carolina-Herrera/Good-Girl-39681.html',
      img: '../week1-assets/perfume-6.png',
    },
  ];

  // ============================================
  // SCENE SCRIPT — THE ENTIRE GAME FLOW
  // ============================================
  const SCENES = [
    // --- Opening ---
    {
      id: 'pre-intro-1',
      type: 'auto-dialogue',
      speaker: 'boy',
      text: "Since we are far from each other I won't be there to go on bday shopping with you. Let me bring that experience digitally for you.",
      hint: 'Wait...',
    },
    {
      id: 'pre-intro-2',
      type: 'auto-dialogue',
      speaker: 'boy',
      text: "Today we will start with adding some fragrance to your life!!!! Hold my hands and let's goooo!!!",
      hint: 'Wait...',
    },
    {
      id: 'intro',
      type: 'dialogue',
      speaker: 'boy',
      text: "It's your birthday month! I'm so excited! Are you excited as well? 🎉",
      hint: 'Choose your response below 👇',
    },
    {
      id: 'excited-choice',
      type: 'choice',
      options: ['Yes, a lot! 🥰', 'Yassssss! 🤩'],
    },
    {
      id: 'yayyy-popup',
      type: 'popup',
      img: '../week1-assets/funny-yayy.png',
      text: 'Yayyy 🎉',
      fallbackEmoji: '🥳',
    },
    {
      id: 'unwrap',
      type: 'dialogue',
      speaker: 'boy',
      text: "Let's unwrap what's there for Week 1! 🎁",
      hint: 'Tap to continue...',
    },

    // --- Walk to surprise ---
    {
      id: 'walk-1',
      type: 'walk',
      duration: 3000,
      hint: 'Walking to the surprise... 🚶',
    },
    {
      id: 'something-for-you',
      type: 'dialogue',
      speaker: 'boy',
      text: 'I have something for you 💝',
      hint: 'Choose your response below 👇',
    },
    {
      id: 'cant-wait-choice',
      type: 'choice',
      options: ["Can't wait to see! 😍", 'Whaaaatttt 😱'],
    },
    {
      id: 'unveil-popup',
      type: 'popup',
      img: '../week1-assets/unveil-reaction.png',
      text: 'Time to unveil ✨',
      fallbackEmoji: '🎁',
    },

    // --- Video ---
    {
      id: 'video-scene',
      type: 'video',
      hint: 'Watch the video! 🎬',
    },
    {
      id: 'liked-it',
      type: 'dialogue',
      speaker: 'boy',
      text: 'Did you like this? 🥺',
      hint: 'Choose your response below 👇',
    },
    {
      id: 'liked-choice',
      type: 'choice',
      options: ['A lot! 💖', 'I love you for this 🥹'],
    },
    {
      id: 'muahh-popup',
      type: 'popup',
      img: '../week1-assets/muahh-reaction.png',
      text: 'Muahhh 💋',
      fallbackEmoji: '💋',
    },

    // --- Letter ---
    {
      id: 'something-to-say',
      type: 'dialogue',
      speaker: 'boy',
      text: 'I have something to say... 💌',
      hint: 'Choose your response below 👇',
    },
    {
      id: 'say-choice',
      type: 'choice',
      options: ['Whatttt 😳', 'Say sayy!! 🗣️'],
    },
    {
      id: 'letter-scene',
      type: 'letter',
      hint: 'Read the letter 💌',
    },

    // --- I love you ---
    {
      id: 'i-love-you',
      type: 'dialogue',
      speaker: 'boy',
      text: 'I love you ❤️',
      hint: 'Choose your response below 👇',
    },
    {
      id: 'love-choice',
      type: 'choice',
      options: ['I loveeee you a lot 💗', "Who doesn't 😏"],
      popups: [
        { img: '../week1-assets/love-response-1.png', text: 'Awww 🥹💖', fallbackEmoji: '💖' },
        { img: '../week1-assets/love-response-2.png', text: 'Haha 😏💕', fallbackEmoji: '😏' },
      ],
    },

    // --- Shopping ---
    {
      id: 'shopping-intro',
      type: 'dialogue',
      speaker: 'boy',
      text: "Let's go for fragrance shopping for you! 🛍️✨",
      hint: 'Tap to continue...',
    },
    {
      id: 'walk-2',
      type: 'walk',
      duration: 3000,
      hint: 'Walking to the perfume shop... 🏪',
    },
    {
      id: 'shop-scene',
      type: 'shop',
      hint: 'Explore & shop! Tap perfumes to see details 🛍️',
    },

    // --- Post shopping ---
    {
      id: 'enough-shopping',
      type: 'dialogue',
      speaker: 'boy',
      text: "Enough shopping for this week! We'll go again next week 😄💖",
      hint: 'Tap to continue...',
    },
    {
      id: 'walk-3',
      type: 'walk',
      duration: 3500,
      bgClass: 'scene-home',
      hint: 'Walking home... 🏠',
    },
    {
      id: 'end',
      type: 'end',
    },
  ];

  // ============================================
  // STATE
  // ============================================
  let currentSceneIndex = 0;
  let cart = [];
  let responses = JSON.parse(localStorage.getItem('week1_responses') || '[]');
  let currentPerfumeId = null;

  // ============================================
  // DOM REFERENCES
  // ============================================
  const $ = (id) => document.getElementById(id);

  const dom = {
    sceneBg: $('scene-bg'),
    hintBar: $('hint-bar'),
    hintText: $('hint-text'),
    hintIcon: $('hint-icon'),
    characters: $('characters'),
    charBoy: $('char-boy'),
    charGirl: $('char-girl'),
    dialogueArea: $('dialogue-area'),
    dialogueBubble: $('dialogue-bubble'),
    dialogueSpeaker: $('dialogue-speaker'),
    dialogueText: $('dialogue-text'),
    choiceArea: $('choice-area'),
    choice1: $('choice-1'),
    choice2: $('choice-2'),
    popupOverlay: $('popup-overlay'),
    popupImg: $('popup-img'),
    popupText: $('popup-text'),
    popupClose: $('popup-close'),
    videoOverlay: $('video-overlay'),
    gameVideo: $('game-video'),
    videoDone: $('video-done'),
    letterOverlay: $('letter-overlay'),
    letterClose: $('letter-close'),
    shopOverlay: $('shop-overlay'),
    perfumeRack: $('perfume-rack'),
    cartBtn: $('cart-btn'),
    cartCount: $('cart-count'),
    perfumeModal: $('perfume-modal'),
    perfumeModalClose: $('perfume-modal-close'),
    perfumeModalImg: $('perfume-modal-img'),
    perfumeModalName: $('perfume-modal-name'),
    perfumeModalDesc: $('perfume-modal-desc'),
    perfumeModalLink: $('perfume-modal-link'),
    addToCartBtn: $('add-to-cart-btn'),
    cartModal: $('cart-modal'),
    cartModalClose: $('cart-modal-close'),
    cartItems: $('cart-items'),
    cartTotal: $('cart-total'),
    checkoutBtn: $('checkout-btn'),
    deliveryModal: $('delivery-modal'),
    deliveryDetails: $('delivery-details'),
    deliveryClose: $('delivery-close'),
    completeScreen: $('complete-screen'),
    backHomeBtn: $('back-home-btn'),
  };

  // ============================================
  // INIT
  // ============================================
  init();

  function init() {
    setupEventListeners();
    buildPerfumeRack();
    playScene();
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================
  function setupEventListeners() {
    // Dialogue tap to continue
    dom.dialogueArea.addEventListener('click', () => {
      const scene = SCENES[currentSceneIndex];
      if (scene && scene.type === 'dialogue') {
        nextScene();
      }
    });

    // Choices
    dom.choice1.addEventListener('click', () => handleChoice(0));
    dom.choice2.addEventListener('click', () => handleChoice(1));

    // Popup close
    dom.popupClose.addEventListener('click', () => {
      hide(dom.popupOverlay);
      nextScene();
    });

    // Video
    dom.gameVideo.addEventListener('ended', () => {
      dom.videoDone.classList.remove('hidden');
    });
    dom.videoDone.addEventListener('click', () => {
      dom.gameVideo.pause();
      hide(dom.videoOverlay);
      nextScene();
    });

    // Letter close
    dom.letterClose.addEventListener('click', () => {
      hide(dom.letterOverlay);
      nextScene();
    });

    // Perfume modal
    dom.perfumeModalClose.addEventListener('click', () => hide(dom.perfumeModal));
    dom.addToCartBtn.addEventListener('click', handleAddToCart);

    // Cart
    dom.cartBtn.addEventListener('click', openCartModal);
    dom.cartModalClose.addEventListener('click', () => hide(dom.cartModal));
    dom.checkoutBtn.addEventListener('click', handleCheckout);

    // Delivery close
    dom.deliveryClose.addEventListener('click', () => {
      hide(dom.deliveryModal);
      hide(dom.shopOverlay);
      nextScene();
    });

    // Back home
    dom.backHomeBtn.addEventListener('click', () => {
      window.location.href = '../index.html';
    });
  }

  // ============================================
  // SCENE ENGINE
  // ============================================
  function playScene() {
    if (currentSceneIndex >= SCENES.length) return;

    const scene = SCENES[currentSceneIndex];
    updateHint(scene.hint || '');

    switch (scene.type) {
      case 'dialogue':
        showDialogue(scene);
        break;
      case 'auto-dialogue':
        showAutoDialogue(scene);
        break;
      case 'choice':
        showChoices(scene);
        break;
      case 'popup':
        showPopup(scene);
        break;
      case 'walk':
        playWalk(scene);
        break;
      case 'video':
        showVideo();
        break;
      case 'letter':
        showLetter();
        break;
      case 'shop':
        showShop();
        break;
      case 'end':
        showComplete();
        break;
    }
  }

  function nextScene() {
    currentSceneIndex++;
    hideAll();
    playScene();
  }

  function hideAll() {
    hide(dom.dialogueArea);
    hide(dom.choiceArea);
  }

  function hide(el) { el.classList.add('hidden'); }
  function show(el) { el.classList.remove('hidden'); }

  // ============================================
  // DIALOGUE
  // ============================================
  function showAutoDialogue(scene) {
    const isBoy = scene.speaker === 'boy';
    dom.dialogueSpeaker.textContent = isBoy ? 'HVM 💙' : 'Buggu 💖';
    dom.dialogueSpeaker.style.color = isBoy ? '#4A90D9' : '#FF1493';
    dom.dialogueBubble.className = 'dialogue-bubble' + (isBoy ? '' : ' girl-speaking');

    dom.dialogueText.textContent = '';
    dom.dialogueText.classList.add('typing');
    show(dom.dialogueArea);

    typeText(scene.text, dom.dialogueText, () => {
      dom.dialogueText.classList.remove('typing');
      const readTime = Math.max(2500, scene.text.length * 60); // Dynamic read delay
      updateHint('Reading...');
      setTimeout(nextScene, readTime);
    });
  }

  function showDialogue(scene) {
    const isBoy = scene.speaker === 'boy';
    dom.dialogueSpeaker.textContent = isBoy ? 'HVM 💙' : 'Buggu 💖';
    dom.dialogueSpeaker.style.color = isBoy ? '#4A90D9' : '#FF1493';
    dom.dialogueBubble.className = 'dialogue-bubble' + (isBoy ? '' : ' girl-speaking');

    // Typewriter effect
    dom.dialogueText.textContent = '';
    dom.dialogueText.classList.add('typing');
    show(dom.dialogueArea);

    typeText(scene.text, dom.dialogueText, () => {
      dom.dialogueText.classList.remove('typing');
      updateHint('Tap the dialogue to continue 👆');
    });
  }

  function typeText(text, el, callback) {
    let i = 0;
    const speed = 30;
    function type() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        if (callback) callback();
      }
    }
    type();
  }

  // ============================================
  // CHOICES
  // ============================================
  function showChoices(scene) {
    dom.choice1.textContent = scene.options[0];
    dom.choice2.textContent = scene.options[1];
    show(dom.choiceArea);
  }

  function handleChoice(index) {
    const scene = SCENES[currentSceneIndex];
    const choice = scene.options[index];

    // Log the response
    logResponse(scene.id, getPreviousDialogueText(), choice);

    hide(dom.choiceArea);

    // Some choices have specific popups per option
    if (scene.popups && scene.popups[index]) {
      const popup = scene.popups[index];
      currentSceneIndex++; // skip the next generic popup
      showPopup(popup);
    } else {
      nextScene();
    }
  }

  function getPreviousDialogueText() {
    // Find the last dialogue scene before this choice
    for (let i = currentSceneIndex - 1; i >= 0; i--) {
      if (SCENES[i].type === 'dialogue') return SCENES[i].text;
    }
    return '';
  }

  // ============================================
  // IMAGE POPUP
  // ============================================
  function showPopup(scene) {
    dom.popupImg.onerror = function () {
      this.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><text x="100" y="110" text-anchor="middle" font-size="80">${scene.fallbackEmoji || '🎉'}</text></svg>`;
    };
    dom.popupImg.src = scene.img || '';
    dom.popupText.textContent = scene.text || '';
    show(dom.popupOverlay);
  }

  // ============================================
  // WALKING SCENE
  // ============================================
  function playWalk(scene) {
    if (scene.bgClass) {
      dom.sceneBg.className = 'scene-bg ' + scene.bgClass;
    }

    dom.sceneBg.classList.add('walking');
    dom.charBoy.classList.add('walking');
    dom.charGirl.classList.add('walking');

    show(dom.dialogueArea);
    dom.dialogueSpeaker.textContent = '';
    dom.dialogueText.textContent = '🚶 Walking...';
    dom.dialogueText.classList.remove('typing');
    dom.dialogueBubble.className = 'dialogue-bubble';

    setTimeout(() => {
      dom.sceneBg.classList.remove('walking');
      dom.charBoy.classList.remove('walking');
      dom.charGirl.classList.remove('walking');
      hide(dom.dialogueArea);
      nextScene();
    }, scene.duration || 3000);
  }

  // ============================================
  // VIDEO
  // ============================================
  function showVideo() {
    dom.videoDone.classList.add('hidden');
    dom.gameVideo.currentTime = 0;
    show(dom.videoOverlay);

    // Show done button when video ends
    dom.gameVideo.onended = () => {
      dom.videoDone.classList.remove('hidden');
    };

    // Show done button on error (missing video file)
    dom.gameVideo.onerror = () => {
      dom.videoDone.classList.remove('hidden');
      dom.videoDone.textContent = 'Continue ✨';
    };

    dom.gameVideo.play().catch(() => {
      // Auto-play blocked or no video — show done button
      dom.videoDone.classList.remove('hidden');
      dom.videoDone.textContent = 'Continue ✨';
    });

    // Safety fallback — always show button after 3s
    setTimeout(() => {
      dom.videoDone.classList.remove('hidden');
    }, 3000);
  }

  // ============================================
  // LETTER
  // ============================================
  function showLetter() {
    show(dom.letterOverlay);
  }

  // ============================================
  // PERFUME SHOPPING
  // ============================================
  function buildPerfumeRack() {
    dom.perfumeRack.innerHTML = '';
    PERFUMES.forEach((p) => {
      const div = document.createElement('div');
      div.className = 'perfume-item';
      div.id = 'perfume-' + p.id;
      div.innerHTML = `
        <img src="${p.img}" alt="${p.name}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 140%22><rect x=%2225%22 y=%2220%22 width=%2250%22 height=%22100%22 rx=%228%22 fill=%22%23FFB6C1%22/><rect x=%2230%22 y=%2210%22 width=%2240%22 height=%2220%22 rx=%2220%22 fill=%22%23FF69B4%22/><rect x=%2245%22 y=%225%22 width=%2210%22 height=%2210%22 rx=%222%22 fill=%22%23FF1493%22/></svg>'">
        <div class="perfume-item-name">${p.name}</div>
      `;
      div.addEventListener('click', () => openPerfumeDetail(p));
      dom.perfumeRack.appendChild(div);
    });
  }

  function showShop() {
    show(dom.shopOverlay);
    updateCartCount();
  }

  function openPerfumeDetail(perfume) {
    currentPerfumeId = perfume.id;
    dom.perfumeModalImg.src = perfume.img;
    dom.perfumeModalImg.onerror = function () {
      this.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 140"><rect x="25" y="20" width="50" height="100" rx="8" fill="%23FFB6C1"/><rect x="30" y="10" width="40" height="20" rx="20" fill="%23FF69B4"/><rect x="45" y="5" width="10" height="10" rx="2" fill="%23FF1493"/></svg>`;
    };
    dom.perfumeModalName.textContent = perfume.name;
    dom.perfumeModalDesc.innerHTML = '<strong>Fragrance Family:</strong> ' + perfume.desc;
    if (dom.perfumeModalLink) {
      dom.perfumeModalLink.href = perfume.link || '#';
      dom.perfumeModalLink.target = '_blank';
      dom.perfumeModalLink.textContent = '🔍 Explore Details';
    }

    const inCart = cart.some((c) => c.id === perfume.id);
    dom.addToCartBtn.textContent = inCart ? '✓ Already in Cart' : 'Add to Cart 🛒';
    dom.addToCartBtn.className = 'add-to-cart-btn' + (inCart ? ' added' : '');

    show(dom.perfumeModal);
  }

  function handleAddToCart() {
    if (!currentPerfumeId) return;
    const perfume = PERFUMES.find((p) => p.id === currentPerfumeId);
    if (!perfume) return;

    const already = cart.some((c) => c.id === perfume.id);
    if (already) return;

    cart.push(perfume);
    logResponse('add-to-cart', 'Added perfume', perfume.name);
    updateCartCount();

    dom.addToCartBtn.textContent = '✓ Added!';
    dom.addToCartBtn.className = 'add-to-cart-btn added';

    // Mark on rack
    const rackItem = document.getElementById('perfume-' + perfume.id);
    if (rackItem) rackItem.classList.add('in-cart');

    setTimeout(() => hide(dom.perfumeModal), 800);
  }

  function updateCartCount() {
    dom.cartCount.textContent = cart.length;
  }

  // ============================================
  // CART MODAL
  // ============================================
  function openCartModal() {
    dom.cartItems.innerHTML = '';

    if (cart.length === 0) {
      dom.cartItems.innerHTML = '<div class="cart-empty">Your cart is empty 🛒</div>';
      dom.cartTotal.textContent = '';
      dom.checkoutBtn.classList.add('hidden');
    } else {
      cart.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
          <img src="${item.img}" alt="${item.name}" onerror="this.style.display='none'">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
          </div>
          <button class="cart-item-remove" data-idx="${idx}">🗑️</button>
        `;
        dom.cartItems.appendChild(div);
      });

      // Remove button handlers
      dom.cartItems.querySelectorAll('.cart-item-remove').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.dataset.idx);
          const removed = cart.splice(idx, 1)[0];
          const rackItem = document.getElementById('perfume-' + removed.id);
          if (rackItem) rackItem.classList.remove('in-cart');
          updateCartCount();
          openCartModal(); // refresh
        });
      });

      dom.cartTotal.textContent = '';
      dom.checkoutBtn.classList.remove('hidden');
    }

    show(dom.cartModal);
  }

  // ============================================
  // CHECKOUT
  // ============================================
  function handleCheckout() {
    hide(dom.cartModal);

    // Build delivery details
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const dateStr = deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const total = cart.reduce((sum, p) => sum + p.priceNum, 0);
    const itemNames = cart.map((p) => p.name).join(', ');

    dom.deliveryDetails.innerHTML = `
      <p><strong>📦 Items:</strong> ${itemNames}</p>
      <p><strong>💰 Total:</strong> ₹${total.toLocaleString('en-IN')}</p>
      <p><strong>📍 Delivery to:</strong><br>Deepika Upadhyay<br>Varanasi, Uttar Pradesh</p>
      <p><strong>📅 Expected Delivery:</strong><br>${dateStr}</p>
      <p><strong>💳 Payment:</strong> Paid with Love ❤️</p>
    `;

    logResponse('checkout', 'Order placed', JSON.stringify({
      items: cart.map(p => p.name),
      total: '₹' + total.toLocaleString('en-IN'),
    }));

    show(dom.deliveryModal);
  }

  // ============================================
  // WEEK COMPLETE
  // ============================================
  function showComplete() {
    hide(dom.dialogueArea);
    hide(dom.choiceArea);
    show(dom.completeScreen);
    logResponse('complete', 'Week 1 completed', 'All scenes done');
    saveResponses();
  }

  // ============================================
  // HINT BAR
  // ============================================
  function updateHint(text) {
    if (!text) {
      hide(dom.hintBar);
      return;
    }
    dom.hintText.textContent = text;
    show(dom.hintBar);
  }

  // ============================================
  // RESPONSE LOGGER + NTFY.SH NOTIFICATIONS
  // ntfy.sh = free push notifications, NO signup
  // Subscribe at: https://ntfy.sh/buggu-bday-26apr-hvm
  // or install ntfy app and subscribe to topic:
  //   buggu-bday-26apr-hvm
  // ============================================
  const NTFY_TOPIC = 'buggu-bday-26apr-hvm';

  function logResponse(sceneId, question, answer) {
    const entry = {
      scene: sceneId,
      question: question,
      answer: answer,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };
    responses.push(entry);
    saveResponses();

    // Send push notification for every response
    sendNotification(sceneId, question, answer);
  }

  function saveResponses() {
    localStorage.setItem('week1_responses', JSON.stringify(responses));
  }

  function sendNotification(sceneId, question, answer) {
    var title = 'Buggu responded!';
    var message = '';

    if (sceneId === 'add-to-cart') {
      title = 'Added to Cart!';
      message = 'Perfume: ' + answer;
    } else if (sceneId === 'checkout') {
      title = 'Order Placed!';
      message = answer;
    } else if (sceneId === 'complete') {
      title = 'Week 1 Complete!';
      message = 'She finished all scenes! Total responses: ' + responses.length;
    } else {
      message = 'Q: ' + question + ' | A: ' + answer;
    }

    var url = 'https://ntfy.sh/' + NTFY_TOPIC;
    console.log('[BDay] Sending ntfy:', title, message);

    // Method 1: fetch POST
    try {
      fetch(url, {
        method: 'POST',
        body: message,
        headers: { 'Title': title },
      })
        .then(function (r) { console.log('[BDay] ntfy status:', r.status); })
        .catch(function (e) { console.error('[BDay] ntfy error:', e); });
    } catch (e) {
      console.error('[BDay] ntfy exception:', e);
    }

    // Method 2: Image beacon backup (immune to CORS)
    try {
      var img = new Image();
      img.src = url + '?title=' + encodeURIComponent(title)
        + '&message=' + encodeURIComponent(message)
        + '&t=' + Date.now();
    } catch (e) { /* ignore */ }
  }

})();

