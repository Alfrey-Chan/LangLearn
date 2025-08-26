import {
	setupPage,
	createTagsList,
	renderPaginationComponent,
	initializePagination,
} from "./components.js";
import { VOCAB_CONFIG, callApi } from "./constants.js";
import { ensureAuth } from "./auth-guard.js";

function renderHeader(data) {
	const img = document.querySelector(".vocab-set-image");
	const title = document.querySelector(".vocab-set-title");
	const entries = document.querySelector(".vocab-set-entries");
	const views = document.querySelector(".view-count");
	const rating = document.querySelector(".vocab-set-rating");

	img.src = data["image_url"];
	title.textContent = data["title"];
	rating.innerHTML += ` ${data["rating"]}`;
	entries.textContent = data["vocabulary_entries"].length + " entries";
	views.textContent = data.views + " views";
}

function renderVocabSetTags(tagsList) {
	const tagsDiv = document.querySelector(".tags-list");
	tagsDiv.innerHTML = createTagsList(tagsList);
}

function renderVocabSetGrid(vocabSetData, currentPage = 1) {
	const vocabGrid = document.querySelector(".vocab-list-grid");
	vocabGrid.innerHTML = ""; // reset

	const itemsPerPage = VOCAB_CONFIG.itemsPerPage;
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const itemsToDisplay = vocabSetData.slice(startIndex, endIndex);

	itemsToDisplay.forEach((entry) => {
		const card = document.createElement("div");
		card.classList.add("entry-card");

		card.addEventListener("click", () => {
			const entryId = entry.id;
			window.location.href = `vocab-entry-details.html?id=${entryId}`;
		});

		card.innerHTML = `
            <div class="entry-header">
                <h2 class="entry-word">${entry.word}</h2>
                <div class="action-btns">
                    <button class="action-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-2">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </svg>
                    </button>
                    <button class="action-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" 
                            stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart">
                            <path d="M20.8 4.6c-1.8-1.7-4.6-1.7-6.3 0L12 7.1l-2.5-2.5c-1.8-1.7-4.6-1.7-6.3 0s-1.7 4.6 0 6.3l8.8 8.8 8.8-8.8c1.8-1.7 1.8-4.5 0-6.3z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <span class="entry-hiragana">(${entry.hiragana})</span>
            <span class="entry-romaji">${entry.romaji}</span>
            <p class="entry-meaning">${entry.meanings[0].short}</p>
        `;
		vocabGrid.appendChild(card);
	});
}

function initializeTakeQuizBtn(vocabSetId) {
	document.querySelector(".quiz-btn").addEventListener("click", () => {
		window.location.href= `quiz.html?id=${vocabSetId}`;
	});
}

document.addEventListener("DOMContentLoaded", async () => {
	const session = await ensureAuth();
	if (!session) return;

	const urlParams = new URLSearchParams(window.location.search);
	const vocabSetId = urlParams.get("id");
	const pageTitle = urlParams.get("title");
	setupPage("vocabulary-set", pageTitle);
	initializeTakeQuizBtn(vocabSetId);
	
	try {
		const data = await session.fetchJSON(`http://127.0.0.1:8000/api/vocabulary-sets/${vocabSetId}`);
		const entries = data["vocabulary_entries"];
		renderHeader(data);
		renderVocabSetTags(data["tags"]);
		renderVocabSetGrid(entries);
		renderPaginationComponent(
			entries.length,
			VOCAB_CONFIG.itemsPerPage,
			VOCAB_CONFIG.maxPagesToDisplay
		);
		initializePagination(entries, renderVocabSetGrid);
	} catch (err) {
		console.error(`Error loading vocab set ${vocabSetId}: `, err);
	}
});
