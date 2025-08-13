import {
	setupPage,
	createTagsList,
	renderPaginationComponent,
	initializePagination,
} from "./components.js";
import { VOCAB_CONFIG, callApi } from "./constants.js";

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
		const x = JSON.parse(entry.meanings);
		console.log(x[0].short);
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
                    <button class="action-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" 
                            stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                        </svg>
                    </button>
                </div>
            </div>
            <span class="entry-hiragana">(${entry.hiragana})</span>
            <span class="entry-romaji">${entry.romaji}</span>
            <p class="entry-meaning">${JSON.parse(entry.meanings)[0].short}</p>

            <div class="entry-meta">
                <span class="entry-views">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
						<path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
					</svg>
                    ${entry.views}
                </span>
            </div>
        `;
		vocabGrid.appendChild(card);
	});
}

document.addEventListener("DOMContentLoaded", async () => {
	const urlParams = new URLSearchParams(window.location.search);
	const vocabSetId = urlParams.get("id");
	const pageTitle = urlParams.get("title");
	setupPage("vocabulary-set", pageTitle);

	try {
		const data = await callApi(`/vocabulary-sets/1`);
		const entries = data["vocabulary_entries"];
		console.table(entries);
		renderHeader(data);
		renderVocabSetTags(["beginner", "common", "slang"]);
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
