// Mobile-First Language Learning App JavaScript

// Data
const words = [
  { word: '안녕하세요', phrase: 'Hello', emoji: '👋' },
  { word: '감사합니다', phrase: 'Thank you', emoji: '🙏' },
  { word: '사랑해요', phrase: 'I love you', emoji: '❤️' },
  { word: '맛있어요', phrase: 'It\'s delicious', emoji: '😋' },
  { word: '행복해요', phrase: 'I\'m happy', emoji: '😊' },
  { word: '미안해요', phrase: 'I\'m sorry', emoji: '😔' },
  { word: '안녕히 가세요', phrase: 'Goodbye', emoji: '👋' },
];

const vocabularySets = [
  { title: 'SNS Essentials', entries: 156, rating: 4.8, image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=200&fit=crop' },
  { title: 'Pets Essentials', entries: 89, rating: 4.9, image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=200&fit=crop' },
  { title: 'Cooking Essentials', entries: 234, rating: 4.7, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop' },
  { title: 'Travel Essentials', entries: 312, rating: 4.9, image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=200&fit=crop' },
  { title: 'School Essentials', entries: 178, rating: 4.6, image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=200&fit=crop' },
  { title: 'Gaming Essentials', entries: 145, rating: 4.8, image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=200&fit=crop' },
  { title: 'Business Essentials', entries: 267, rating: 4.7, image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=200&fit=crop' },
  { title: 'Health Essentials', entries: 198, rating: 4.9, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop' },
];

// State
let currentCarouselIndex = 0;
let displayedVocabCards = 4; // Start with 4 cards on mobile
let activeSection = 'home';

// DOM Elements
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebarClose');
const overlay = document.getElementById('overlay');
const carouselContainer = document.getElementById('carouselContainer');
const carouselDots = document.getElementById('carouselDots');
const vocabGrid = document.getElementById('vocabGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');

// ================================
// MOBILE-FIRST CAROUSEL
// ================================

function initializeCarousel() {
  renderCarousel();
  renderCarouselDots();
  setupCarouselScroll();
}

function renderCarousel() {
  carouselContainer.innerHTML = words.map((item, index) => `
    <div class="carousel-card" data-index="${index}">
      <span class="carousel-emoji">${item.emoji}</span>
      <div class="carousel-word">${item.word}</div>
      <div class="carousel-phrase">${item.phrase}</div>
    </div>
  `).join('');
}

function renderCarouselDots() {
  carouselDots.innerHTML = `
    <button class="carousel-nav-arrow" id="carouselPrev" aria-label="Previous">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15,18 9,12 15,6"></polyline>
      </svg>
    </button>
    <div class="carousel-dots-container">
      ${words.map((_, index) => `
        <button class="carousel-dot ${index === currentCarouselIndex ? 'active' : ''}" 
                data-index="${index}" 
                aria-label="Go to slide ${index + 1}"></button>
      `).join('')}
    </div>
    <button class="carousel-nav-arrow" id="carouselNext" aria-label="Next">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9,6 15,12 9,18"></polyline>
      </svg>
    </button>
  `;
  
  // Add click handlers to dots
  carouselDots.querySelectorAll('.carousel-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      scrollToCarouselCard(index);
    });
  });
  
  // Add click handlers to arrows
  const prevBtn = carouselDots.querySelector('#carouselPrev');
  const nextBtn = carouselDots.querySelector('#carouselNext');
  
  prevBtn.addEventListener('click', () => {
    const newIndex = currentCarouselIndex > 0 ? currentCarouselIndex - 1 : words.length - 1;
    scrollToCarouselCard(newIndex);
  });
  
  nextBtn.addEventListener('click', () => {
    const newIndex = currentCarouselIndex < words.length - 1 ? currentCarouselIndex + 1 : 0;
    scrollToCarouselCard(newIndex);
  });
  
  // Update arrow states
  updateArrowStates();
}

function setupCarouselScroll() {
  let isScrolling = false;
  
  carouselContainer.addEventListener('scroll', () => {
    if (isScrolling) return;
    
    // Debounce scroll updates
    clearTimeout(carouselContainer.scrollTimeout);
    carouselContainer.scrollTimeout = setTimeout(() => {
      updateActiveCarouselCard();
    }, 100);
  });
}

function updateActiveCarouselCard() {
  const containerRect = carouselContainer.getBoundingClientRect();
  const cards = carouselContainer.querySelectorAll('.carousel-card');
  let closestIndex = 0;
  let closestDistance = Infinity;
  
  cards.forEach((card, index) => {
    const cardRect = card.getBoundingClientRect();
    const cardCenter = cardRect.left + cardRect.width / 2;
    const containerCenter = containerRect.left + containerRect.width / 2;
    const distance = Math.abs(cardCenter - containerCenter);
    
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });
  
  if (closestIndex !== currentCarouselIndex) {
    currentCarouselIndex = closestIndex;
    updateCarouselDots();
  }
}

function updateCarouselDots() {
  const dots = carouselDots.querySelectorAll('.carousel-dot');
  
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentCarouselIndex);
  });
  
  updateArrowStates();
}

function updateArrowStates() {
  const prevBtn = carouselDots.querySelector('#carouselPrev');
  const nextBtn = carouselDots.querySelector('#carouselNext');
  
  if (prevBtn && nextBtn) {
    // Optional: disable arrows at ends (remove if you want infinite loop)
    // prevBtn.disabled = currentCarouselIndex === 0;
    // nextBtn.disabled = currentCarouselIndex === words.length - 1;
  }
}

function scrollToCarouselCard(index) {
  const card = carouselContainer.querySelector(`[data-index="${index}"]`);
  if (card) {
    const containerRect = carouselContainer.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const scrollLeft = carouselContainer.scrollLeft + 
                      (cardRect.left - containerRect.left) - 
                      (containerRect.width - cardRect.width) / 2;
    
    carouselContainer.scrollTo({
      left: scrollLeft,
      behavior: 'smooth'
    });
  }
}

// ================================
// VOCABULARY GRID
// ================================

function renderVocabularyGrid() {
  const cardsToShow = vocabularySets.slice(0, displayedVocabCards);
  
  vocabGrid.innerHTML = cardsToShow.map((set, index) => `
    <div class="vocab-card animate-fade-in" style="animation-delay: ${index * 0.1}s">
      <img src="${set.image}" alt="${set.title}" class="vocab-image" loading="lazy">
      <div class="vocab-content">
        <h3 class="vocab-title">${set.title}</h3>
        <div class="vocab-meta">
          <span>${set.entries} entries</span>
          <div class="vocab-rating">
            <span class="vocab-star">★</span>
            <span>${set.rating}</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');
  
  // Show/hide load more button
  loadMoreBtn.style.display = displayedVocabCards >= vocabularySets.length ? 'none' : 'block';
}

function loadMoreVocabCards() {
  displayedVocabCards = Math.min(displayedVocabCards + 4, vocabularySets.length);
  renderVocabularyGrid();
  
  // Add haptic feedback on mobile
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }
}

// ================================
// NAVIGATION
// ================================

function initializeNavigation() {
  // Bottom navigation
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const page = btn.dataset.page;
      setActivePage(page, 'bottom');
      
      // Add ripple effect
      addRippleEffect(btn, e);
    });
  });
  
  // Sidebar navigation
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      setActivePage(page, 'sidebar');
      closeSidebar();
    });
  });
}

function setActivePage(page, source) {
  activeSection = page;
  
  // Update bottom nav
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });
  
  // Update sidebar nav
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });
  
  // Here you would typically show/hide different sections
  console.log(`Navigated to: ${page} from ${source}`);
}

// ================================
// SIDEBAR FUNCTIONALITY
// ================================

function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('visible');
  document.body.style.overflow = 'hidden'; // Prevent background scroll
}

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('visible');
  document.body.style.overflow = '';
}

function initializeSidebar() {
  menuBtn.addEventListener('click', openSidebar);
  sidebarClose.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);
  
  // Close sidebar on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });
}

// ================================
// TOUCH INTERACTIONS
// ================================

function addRippleEffect(element, event) {
  const ripple = document.createElement('div');
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  
  // Calculate position relative to the element
  const x = (event.clientX || event.touches?.[0]?.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
  const y = (event.clientY || event.touches?.[0]?.clientY || rect.top + rect.height / 2) - rect.top - size / 2;
  
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
    z-index: 1000;
  `;
  
  // Ensure element has relative positioning
  if (getComputedStyle(element).position === 'static') {
    element.style.position = 'relative';
  }
  element.style.overflow = 'hidden';
  
  element.appendChild(ripple);
  
  // Remove ripple after animation
  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple);
    }
  }, 600);
}

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ================================
// PERFORMANCE OPTIMIZATIONS
// ================================

// Intersection Observer for lazy loading vocab cards
function setupIntersectionObserver() {
  const images = document.querySelectorAll('.vocab-image[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('animate-fade-in');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
}

// Debounce function for resize events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Handle orientation change
function handleOrientationChange() {
  // Recalculate carousel position
  setTimeout(() => {
    scrollToCarouselCard(currentCarouselIndex);
  }, 100);
}

// ================================
// INITIALIZATION
// ================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initializeCarousel();
  renderVocabularyGrid();
  initializeNavigation();
  initializeSidebar();
  
  // Setup performance optimizations
  setupIntersectionObserver();
  
  // Event listeners
  loadMoreBtn.addEventListener('click', loadMoreVocabCards);
  
  // Handle orientation changes
  window.addEventListener('orientationchange', handleOrientationChange);
  window.addEventListener('resize', debounce(() => {
    updateActiveCarouselCard();
  }, 250));
  
  // Auto-advance carousel (optional)
  let autoAdvanceInterval;
  
  function startAutoAdvance() {
    autoAdvanceInterval = setInterval(() => {
      const nextIndex = (currentCarouselIndex + 1) % words.length;
      scrollToCarouselCard(nextIndex);
    }, 5000);
  }
  
  function stopAutoAdvance() {
    clearInterval(autoAdvanceInterval);
  }
  
  // Start auto-advance
  startAutoAdvance();
  
  // Pause auto-advance when user interacts
  carouselContainer.addEventListener('touchstart', stopAutoAdvance);
  carouselContainer.addEventListener('scroll', stopAutoAdvance);
  
  // Resume auto-advance after inactivity
  let inactivityTimer;
  document.addEventListener('touchend', () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(startAutoAdvance, 3000);
  });
  
  console.log('Mobile-first Language Learning App initialized!');
});

// ================================
// SERVICE WORKER (Optional)
// ================================

// Register service worker for offline functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}