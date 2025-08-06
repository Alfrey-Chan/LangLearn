import { CAROUSEL_CONFIG, VOCAB_CONFIG } from "./constants.js";
import { setupPage } from "./components.js";

// const CAROUSEL_CONFIG = {
// 	cardWidthPercent: 0.75,
// 	gap: 16,
// };
let carouselInterval;
let displayVocabSetCount = VOCAB_CONFIG.initialDisplayCount;
let vocabDataset = [];


// Navigation is now handled by components.js

function renderVocabularyGrid() {
	const vocabGrid = document.getElementById("vocabGrid");

	fetch("vocab.json")
		.then((res) => res.json())
		.then((data) => {
			vocabDataset = data;

			vocabGrid.innerHTML = vocabDataset
				.slice(0, displayVocabSetCount)
				.map(
					(set) => `
                <div class="vocab-set-card" data-vocab-set-id="${set.id}" data-vocab-set-title="${set.title}">
                    <img class="vocab-set-image" src="${set.image}" alt="vocabulary set image">
                    <div class="vocab-content">
						<h3 class="vocab-set-title">${set.title}</h3>
						<div class="vocab-set-meta">
							<span>${set.entries} entries</span>
							<p class="vocab-set-rating"><span class="star">★</span> ${set.rating}</p>
						</div>
					</div>
                </div>
            `
				)
				.join("");

			const vocabCards = document.querySelectorAll('.vocab-set-card');
			vocabCards.forEach(card => {
				card.addEventListener("click", () => {
					const vocabSetId = card.dataset.vocabSetId;
					const vocabSetTitle = card.dataset.vocabSetTitle
					navigateToVocabSetDetails(vocabSetId, vocabSetTitle);
				})
			})
			
		})
		.catch((error) => console.error("Error fetching vocabulary sets: ", error));
}

function renderWordsOfTheWeek() {
	const carousel = document.getElementById("carouselCardsContainer");

	fetch("words.json")
		.then((res) => res.json())
		.then((data) => {
			carousel.innerHTML = data
				.map(
					(word) => `
                    <div class="carousel-card">
                        <p class="jp">${word.jp}</p>
                        <p class="en">${word.en}</p>
                    </div>
                `
				)
				.join("");

			renderCarousel(data, carousel);
			startCarouselAutoAdvance(data, carousel);
		})
		.catch((error) =>
			console.error("Error fetching words of the week: ", error)
		);
}

function navigateToVocabSetDetails(vocabId, vocabSetTitle) {
	window.location.href = `vocab-set-details.html?id=${vocabId}&title=${encodeURIComponent(vocabSetTitle)}`;
}

function scrollToCard(cardIndex, carousel) {
	const containerWidth = carousel.offsetWidth;
	const cardWidth = containerWidth * CAROUSEL_CONFIG.cardWidthPercent;
	const scrollPosition = cardIndex * (cardWidth + CAROUSEL_CONFIG.gap);

	carousel.scrollTo({
		left: scrollPosition,
		behavior: "smooth",
	});
}

function renderCarousel(data, carousel) {
	const container = document.getElementById("carouselDots");

	// Previous Arrow
	const prevArrow = document.createElement("button");
	prevArrow.classList.add("carousel-arrow", "carousel-prev");
	prevArrow.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15,18 9,12 15,6"></polyline>
                </svg>
        `;
	prevArrow.addEventListener("click", () => {
		const currentActive = document.querySelector(".carousel-btn.active");
		const currentIndex = parseInt(currentActive.dataset.page);
		const prevIndex = currentIndex > 0 ? currentIndex - 1 : data.length - 1;
		const prevDot = document.querySelector(`[data-page="${prevIndex}"]`);
		setActiveDot(prevDot);
		scrollToCard(prevIndex, carousel);
		stopCarouselAutoAdvance();
		setTimeout(() => startCarouselAutoAdvance(data, carousel), 3000);
	});

	// Next Arrow
	const nextArrow = document.createElement("button");
	nextArrow.classList.add("carousel-arrow", "carousel-next");
	nextArrow.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9,6 15,12 9,18"></polyline>
                </svg>
        `;
	nextArrow.addEventListener("click", () => {
		const currentActive = document.querySelector(".carousel-btn.active");
		const currentIndex = parseInt(currentActive.dataset.page);
		const nextIndex = currentIndex < data.length - 1 ? currentIndex + 1 : 0;
		const nextDot = document.querySelector(`[data-page="${nextIndex}"]`);
		setActiveDot(nextDot);
		scrollToCard(nextIndex, carousel);
		stopCarouselAutoAdvance();
		setTimeout(
			() => startCarouselAutoAdvance(data, carousel),
			CAROUSEL_CONFIG.pauseAfterInteraction
		);
	});

	// carousel structure
	container.appendChild(prevArrow);
	data.forEach((_, index) => {
		const dot = createCarouselDot(index, carousel, data);
		container.appendChild(dot);
	});
	container.appendChild(nextArrow);
}

function startCarouselAutoAdvance(data, carousel) {
	carouselInterval = setInterval(() => {
		const currentActive = document.querySelector(".carousel-btn.active");
		const currentIndex = parseInt(currentActive.dataset.page);
		const nextIndex = currentIndex < data.length - 1 ? currentIndex + 1 : 0; // wrap around
		const nextDot = document.querySelector(`[data-page="${nextIndex}"]`);
		setActiveDot(nextDot);
		scrollToCard(nextIndex, carousel);
	}, CAROUSEL_CONFIG.autoAdvanceDelay);
}

function stopCarouselAutoAdvance() {
	clearInterval(carouselInterval);
}

function setActiveDot(newActiveDot) {
	const currentActive = document.querySelector(".carousel-btn.active");
	if (currentActive) {
		currentActive.classList.remove("active");
	}
	newActiveDot.classList.add("active");
}

function createCarouselDot(index, carousel, data) {
	const dot = document.createElement("button");
	dot.classList.add("carousel-btn");
	dot.dataset.page = index;

	if (index === 0) {
		// set first one active
		dot.classList.add("active");
	}

	dot.addEventListener("click", () => {
		stopCarouselAutoAdvance();
		setActiveDot(dot);
		scrollToCard(index, carousel);
		setTimeout(
			() => startCarouselAutoAdvance(data, carousel),
			CAROUSEL_CONFIG.pauseAfterInteraction
		);
	});

	return dot;
}

function loadMoreVocabSets() {
	const showMoreBtn = document.getElementById("showMoreBtn");

	displayVocabSetCount += VOCAB_CONFIG.loadMoreIncrement;
	if (displayVocabSetCount >= vocabDataset.length) {
		showMoreBtn.classList.add("hidden");
	}

	renderVocabularyGrid();
}

document.addEventListener("DOMContentLoaded", () => {
	// Set up page with header and navigation
	setupPage('Home');
	
	// Initialize page content
	renderWordsOfTheWeek();
	renderVocabularyGrid();

	const showMoreBtn = document.getElementById("showMoreBtn");
	showMoreBtn.addEventListener("click", () => {
		loadMoreVocabSets();
	});
});
