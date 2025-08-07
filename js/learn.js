import {
	setupPage,
	createHeader,
	createBottomNav,
	initializePagination,
	renderPaginationComponent,
} from "./components.js";
import { VOCAB_CONFIG } from "./constants.js";

function initializeProgressBars() {
	const progressRings = document.querySelectorAll(".progress-ring");

	progressRings.forEach((ring) => {
		const progressValue = parseInt(ring.dataset.progress) || 0;

		setTimeout(() => {
			updateProgressRing(ring, progressValue);
		}, 200);
	});
}

function updateProgressRing(ring, progressValue) {
	const progressBar = ring.querySelector(".progress-bar");
	const progressText = ring.querySelector(".progress-text");
	const circumference = 2 * Math.PI * 26; // radius = 26

	if (progressValue === 0) {
		// No stroke for 0%
		progressBar.style.stroke = "transparent";
		progressBar.style.strokeDashoffset = circumference;
		progressText.textContent = "0%";
	} else if (progressValue === 100) {
		// Green color and checkmark for 100%
		progressBar.style.stroke = "#22c55e"; // green
		progressBar.style.strokeDashoffset = 0;
		progressText.innerHTML = `
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
      `;
		progressText.style.color = "#22c55e";
		progressText.style.display = "flex";
		progressText.style.alignItems = "center";
		progressText.style.justifyContent = "center";
	} else {
		// Dynamic color based on percentage
		const color = getProgressColor(progressValue);
		progressBar.style.stroke = color;

		const offset = circumference - (progressValue / 100) * circumference;
		progressBar.style.strokeDashoffset = offset;

		progressText.textContent = `${progressValue}%`;
		progressText.style.color = color;
	}
}

function getProgressColor(percentage) {
	if (percentage >= 80) return "#22c55e"; // green
	if (percentage >= 60) return "#3b82f6"; // blue
	if (percentage >= 40) return "#f59e0b"; // orange
	if (percentage >= 20) return "#ef4444"; // red
	return "#6b7280"; // gray
}

function renderVocabSetGrid(vocabSets, currentPage = 1) {
	const vocabSetsGrid = document.querySelector(".vocab-sets-grid");
	vocabSetsGrid.innerHTML = ""; // reset

	const itemsPerPage = VOCAB_CONFIG.itemsPerPage;
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const itemsToDisplay = vocabSets.slice(startIndex, endIndex);

	for (let i = 0; i < itemsToDisplay.length; i++) {
		const div = document.createElement("div");
		div.classList.add("card");

		const html = `
            <div class="entry-header">
                <h2 class="vocab-set-title">${itemsToDisplay[i].title}</h2>
                <button class="delete-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                </button>
            </div>

            <p class="vocab-set-meta">${itemsToDisplay[i].entries} entries</p>
            <div class="progress-container">
                <div class="progress-ring" data-progress="100">
                    <svg class="progress-svg" width="60" height="60">
                        <circle class="progress-background" cx="30" cy="30" r="26"></circle>
                        <circle class="progress-bar" cx="30" cy="30" r="26"></circle>
                    </svg>
                    <div class="progress-text">65%</div>
                </div>
            </div>
            <button class="start-quiz-btn">Start Quiz</button>
        `;

		div.innerHTML += html;
		vocabSetsGrid.appendChild(div);
	}
}

document.addEventListener("DOMContentLoaded", () => {
	setupPage("learn", "Learn");
	createBottomNav();

	fetch("../data/vocab.json")
		.then((res) => res.json())
		.then((data) => {
			// TEMP
			const sampleData = data.slice(0, 5);
			renderVocabSetGrid(sampleData);
			initializeProgressBars();

			// Pagination set up
			renderPaginationComponent(
				sampleData.length,
				VOCAB_CONFIG.itemsPerPage,
				VOCAB_CONFIG.maxPagesToDisplay
			);
			initializePagination(
				sampleData,
				renderVocabSetGrid,
				initializeProgressBars
			);
		});
});
