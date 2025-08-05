// Vocabulary Detail Page JavaScript

// Initialize page functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeRatingButtons();
    initializePagination();
});

// Rating buttons functionality
function initializeRatingButtons() {
    const ratingButtons = document.querySelectorAll('.rating-btn');
    
    ratingButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            handleRatingClick(button);
        });
    });
}

function handleRatingClick(button) {
    const countSpan = button.querySelector('.rating-count');
    const currentCount = parseInt(countSpan.textContent, 10);
    const action = button.dataset.action;
    
    // Check if already voted
    if (button.classList.contains('voted')) {
        // Remove vote
        countSpan.textContent = Math.max(0, currentCount - 1);
        button.classList.remove('voted');
    } else {
        // Add vote
        countSpan.textContent = currentCount + 1;
        button.classList.add('voted');
        
        // Remove vote from opposite button if exists
        const wordItem = button.closest('.word-item');
        const oppositeAction = action === 'upvote' ? 'downvote' : 'upvote';
        const oppositeButton = wordItem.querySelector(`[data-action="${oppositeAction}"]`);
        
        if (oppositeButton && oppositeButton.classList.contains('voted')) {
            const oppositeCount = oppositeButton.querySelector('.rating-count');
            oppositeCount.textContent = Math.max(0, parseInt(oppositeCount.textContent, 10) - 1);
            oppositeButton.classList.remove('voted');
        }
    }
    
    // Add visual feedback
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
}

// Pagination functionality
function initializePagination() {
    const pageButtons = document.querySelectorAll('.page-btn');
    
    pageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            handlePageClick(button);
        });
    });
}

function handlePageClick(clickedButton) {
    // Remove active class from all buttons
    const allPageButtons = document.querySelectorAll('.page-btn');
    allPageButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    clickedButton.classList.add('active');
    
    // Get page number
    const pageNumber = clickedButton.textContent;
    
    // Here you would typically load new content
    // For now, just log the page change
    console.log(`Loading page ${pageNumber}`);
    
    // Simulate loading with visual feedback
    clickedButton.style.opacity = '0.7';
    setTimeout(() => {
        clickedButton.style.opacity = '';
        // You could call a function to load new word data here
        // loadWordsForPage(pageNumber);
    }, 300);
}

// Function to load words for a specific page (placeholder)
function loadWordsForPage(pageNumber) {
    // This would typically make an API call to get words for the page
    // For now, just a placeholder
    console.log(`Loading words for page ${pageNumber}`);
    
    // You could update the word list here
    // updateWordList(newWords);
}

// Function to update the word list (placeholder)
function updateWordList(words) {
    const wordList = document.querySelector('.word-list');
    
    // This would generate new word items based on the data
    // Similar to how you handle the vocabulary grid in your main app
    
    // Example implementation:
    // wordList.innerHTML = words.map(word => createWordItemHTML(word)).join('');
    // reinitializeRatingButtons(); // Reinitialize event listeners for new buttons
}

// Smooth scroll to top when changing pages
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Star rating hover effects
document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.rating-stars .star');
    
    stars.forEach((star, index) => {
        star.addEventListener('mouseenter', () => {
            // Highlight stars up to hovered star
            stars.forEach((s, i) => {
                if (i <= index) {
                    s.style.fill = '#ffc107';
                } else {
                    s.style.fill = s.classList.contains('filled') ? '#ffc107' : 'var(--text-muted)';
                }
            });
        });
        
        star.addEventListener('mouseleave', () => {
            // Reset to original state
            stars.forEach((s) => {
                s.style.fill = s.classList.contains('filled') ? '#ffc107' : 'var(--text-muted)';
            });
        });
    });
});