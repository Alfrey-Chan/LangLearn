/**
 * LangLearn - Learn Page JavaScript Module
 * Handles filtering, progress animations, and user interactions
 */

class LearnPage {
  constructor() {
    this.initializeElements();
    this.bindEvents();
    this.initializeProgressRings();
    this.setActiveFilter('my'); // Default to "My Sets"
  }

  /**
   * Initialize DOM elements
   */
  initializeElements() {
    this.filterButtons = {
      mySets: document.getElementById('filterMySets'),
      preMade: document.getElementById('filterPreMade')
    };
    
    this.setsContainer = document.getElementById('setsContainer');
    this.emptyState = document.getElementById('emptyState');
    this.setCards = document.querySelectorAll('.set-card');
    this.deleteButtons = document.querySelectorAll('.delete-button');
    this.quizButtons = document.querySelectorAll('.quiz-button');
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Filter button events
    this.filterButtons.mySets.addEventListener('click', () => {
      this.setActiveFilter('my');
    });

    this.filterButtons.preMade.addEventListener('click', () => {
      this.setActiveFilter('pre-made');
    });

    // Delete button events
    this.deleteButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleDeleteSet(e.currentTarget);
      });
    });

    // Quiz button events
    this.quizButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleQuizAction(e.currentTarget);
      });
    });

    // Keyboard accessibility
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e);
    });
  }

  /**
   * Set active filter and update UI
   * @param {string} filterType - 'my' or 'pre-made'
   */
  setActiveFilter(filterType) {
    // Update button states
    Object.values(this.filterButtons).forEach(btn => {
      btn.classList.remove('active');
    });

    if (filterType === 'my') {
      this.filterButtons.mySets.classList.add('active');
    } else {
      this.filterButtons.preMade.classList.add('active');
    }

    // Filter cards
    this.filterSets(filterType);
  }

  /**
   * Filter vocabulary sets based on type
   * @param {string} type - Filter type ('my' or 'pre-made')
   */
  filterSets(type) {
    let visibleCount = 0;

    this.setCards.forEach(card => {
      const cardType = card.dataset.type;
      
      if (cardType === type) {
        this.showCard(card);
        visibleCount++;
      } else {
        this.hideCard(card);
      }
    });

    // Show/hide empty state
    this.toggleEmptyState(visibleCount === 0);
  }

  /**
   * Show a card with animation
   * @param {HTMLElement} card - Card element to show
   */
  showCard(card) {
    card.style.display = 'flex';
    card.classList.add('fade-in');
    card.classList.remove('fade-out');
  }

  /**
   * Hide a card with animation
   * @param {HTMLElement} card - Card element to hide
   */
  hideCard(card) {
    card.classList.add('fade-out');
    card.classList.remove('fade-in');
    
    setTimeout(() => {
      card.style.display = 'none';
    }, 300);
  }

  /**
   * Toggle empty state visibility
   * @param {boolean} show - Whether to show empty state
   */
  toggleEmptyState(show) {
    if (show) {
      this.emptyState.classList.add('visible');
    } else {
      this.emptyState.classList.remove('visible');
    }
  }

  /**
   * Initialize progress ring animations
   */
  initializeProgressRings() {
    const progressRings = document.querySelectorAll('.progress-ring');
    
    progressRings.forEach(ring => {
      const progressBar = ring.querySelector('.progress-bar');
      const progressValue = parseInt(ring.dataset.progress) || 0;
      
      // Calculate stroke-dashoffset based on progress
      const circumference = 2 * Math.PI * 26; // radius = 26
      const offset = circumference - (progressValue / 100) * circumference;
      
      // Animate progress bar
      setTimeout(() => {
        progressBar.style.strokeDashoffset = offset;
      }, 100);
    });
  }

  /**
   * Handle delete set action
   * @param {HTMLElement} deleteButton - Clicked delete button
   */
  handleDeleteSet(deleteButton) {
    const setCard = deleteButton.closest('.set-card');
    const setTitle = setCard.querySelector('.set-title').textContent;
    
    // Confirm deletion
    if (confirm(`Are you sure you want to remove "${setTitle}" from your sets?`)) {
      this.removeSet(setCard);
    }
  }

  /**
   * Remove a vocabulary set
   * @param {HTMLElement} setCard - Set card to remove
   */
  removeSet(setCard) {
    setCard.classList.add('fade-out');
    
    setTimeout(() => {
      setCard.remove();
      this.updateEmptyState();
    }, 300);
  }

  /**
   * Handle quiz button actions
   * @param {HTMLElement} quizButton - Clicked quiz button
   */
  handleQuizAction(quizButton) {
    const action = quizButton.dataset.action;
    const setCard = quizButton.closest('.set-card');
    const setTitle = setCard.querySelector('.set-title').textContent;
    
    // Simulate quiz navigation (replace with actual navigation logic)
    console.log(`${action} quiz for: ${setTitle}`);
    
    // Show loading state
    this.setQuizButtonLoading(quizButton, true);
    
    // Simulate API call or navigation
    setTimeout(() => {
      this.setQuizButtonLoading(quizButton, false);
      // Navigate to quiz page
      // window.location.href = `/quiz/${setId}?action=${action}`;
    }, 1000);
  }

  /**
   * Set quiz button loading state
   * @param {HTMLElement} button - Quiz button
   * @param {boolean} isLoading - Loading state
   */
  setQuizButtonLoading(button, isLoading) {
    if (isLoading) {
      button.textContent = 'Loading...';
      button.disabled = true;
      button.style.opacity = '0.7';
    } else {
      // Restore original text based on action
      const action = button.dataset.action;
      const actionText = {
        start: 'Start Quiz',
        continue: 'Continue Quiz',
        retake: 'Retake Quiz'
      };
      
      button.textContent = actionText[action] || 'Start Quiz';
      button.disabled = false;
      button.style.opacity = '1';
    }
  }

  /**
   * Update empty state based on visible cards
   */
  updateEmptyState() {
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    const visibleCards = document.querySelectorAll(`.set-card[data-type="${activeFilter}"]`);
    
    this.toggleEmptyState(visibleCards.length === 0);
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeyboardNavigation(e) {
    // Tab navigation between filter buttons
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const activeButton = document.querySelector('.filter-btn:focus');
      
      if (activeButton) {
        e.preventDefault();
        const buttons = Array.from(document.querySelectorAll('.filter-btn'));
        const currentIndex = buttons.indexOf(activeButton);
        
        let nextIndex;
        if (e.key === 'ArrowLeft') {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
        } else {
          nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
        }
        
        buttons[nextIndex].focus();
        buttons[nextIndex].click();
      }
    }
  }

  /**
   * Get current filter state
   * @returns {string} Current filter type
   */
  getCurrentFilter() {
    return document.querySelector('.filter-btn.active').dataset.filter;
  }

  /**
   * Add new vocabulary set (for future API integration)
   * @param {Object} setData - Set data object
   */
  addVocabularySet(setData) {
    // This method would be used when integrating with backend API
    console.log('Adding vocabulary set:', setData);
    // Create new set card and append to container
    // Update UI accordingly
  }

  /**
   * Update set progress (for future API integration)
   * @param {string} setId - Set identifier
   * @param {number} progress - Progress percentage
   */
  updateSetProgress(setId, progress) {
    // This method would be used when progress is updated
    console.log(`Updating progress for set ${setId}: ${progress}%`);
    // Find set card and update progress ring
    // Update progress text
  }
}

// Utility functions
const Utils = {
  /**
   * Debounce function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Animate number counting
   * @param {HTMLElement} element - Element to animate
   * @param {number} start - Start value
   * @param {number} end - End value
   * @param {number} duration - Animation duration in milliseconds
   */
  animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentValue = Math.floor(start + (end - start) * progress);
      element.textContent = `${currentValue}%`;
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    }
    
    requestAnimationFrame(updateNumber);
  }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const learnPage = new LearnPage();
  
  // Expose to global scope for debugging (remove in production)
  window.LearnPage = learnPage;
  window.Utils = Utils;
});