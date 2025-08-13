import {
	setupPage,
	createRatingButtons,
	createSeparator,
	updateActive,
} from "./components.js";
import { fetchData, callApi, VOCAB_CONFIG } from "./constants.js";

function renderEntryHeader(entryData) {
	document.querySelector(".entry-word").innerHTML = entryData["word"];
	document.querySelector(
		".entry-hiragana"
	).innerHTML = `(${entryData["hiragana"]})`;
	document.querySelector(".entry-romaji").innerHTML = entryData["romaji"];
}

function renderDefinitions(definitions) {
	// console.table("")
	definitions = JSON.parse(definitions);
	// console.log("definitions type:", typeof definitions);
	// console.log("definitions length:", definitions?.length);
	// console.log("first item keys:", Object.keys(definitions[0] || {}));
	const definitionList = document.querySelector(".definition-list");
	for (let i = 0; i < definitions.length; i++) {
		const div = document.createElement("div");
		div.classList.add("definition-item");

		if (i > 0) {
			definitionList.appendChild(createSeparator());
		}

		const definitionHTML = `
            <span class="definition-number">${i + 1}.</span>
            <span class="definition-short">${definitions[i]["short"]}</span>
            <p class="definition-detail">${definitions[i]["long"]}</p>
        `;
		div.innerHTML = definitionHTML;
		definitionList.appendChild(div);
	}
}

function renderExampleSentences(sentences) {
	const sentencesContainer = document.querySelector(
		".example-sentences-container"
	);

	for (let i = 0; i < sentences.length; i++) {
		const sentenceId = sentences[i]["id"];
		const upvotes = sentences[i]["upvotes"];
		const downvotes = sentences[i]["downvotes"];
		const exampleType = "sentence";
		const textData = JSON.parse(sentences[i]["sentence_data"]);

		const div = document.createElement("div");
		div.classList.add("card");
		div.dataset.index = i;

		const ratingBtns = createRatingButtons(
			sentenceId,
			exampleType,
			upvotes,
			downvotes
		);

		const sentenceHTML = `
            <p class="example-japanese">${textData["example"]}</p>
            <p class="example-hiragana">${textData["translation"]["hiragana"]}</p>
            <p class="example-romaji">${textData["translation"]["romaji"]}</p>
            <p class="example-translation">${textData["translation"]["translation"]}</p>
            ${ratingBtns}
        `;
		div.innerHTML = sentenceHTML;
		sentencesContainer.appendChild(div);
	}
}

function renderDialogueExamples(examples) {
	const container = document.querySelector(".example-dialogues-container");

	for (let i = 0; i < examples.length; i++) {
		const id = examples[i].id;
		const sentenceType = "dialogue";
		const upvotes = examples[i].upvotes;
		const downvotes = examples[i].downvotes;
		const textData = JSON.parse(examples[i].dialogue_data);
		const div = document.createElement("div");
		div.classList.add("card");

		for (let j = 0; j < textData.length; j++) {
			const translation = textData[j].translation;

			if (j > 0) {
				div.appendChild(createSeparator());
			}

			const dialogueHTML = `
		 	    <span class="dialogue-speaker">${textData[j].speaker}:</span>
		 	    <span class="dialogue-japanese">${textData[j].line}</span>
		 	    <p class="dialogue-hiragana">${translation.hiragana}</p>
		 	    <p class="dialogue-romaji">${translation.romaji}</p>
		 	    <p class="dialogue-translation">${translation.translation}</p>
		 	`;

			div.innerHTML += dialogueHTML;
		}

		div.innerHTML += createRatingButtons(id, sentenceType, upvotes, downvotes);
		container.appendChild(div);
	}
}

function renderAdditionalNotes(additionalNotes) {
	console.table(additionalNotes);
	document.querySelector(".additional-notes-text").innerHTML = additionalNotes;
}

function updateRatingDisplay(result, exampleType) {
	const id = result["id"];
	const upvotes = result["upvotes"];
	const downvotes = result["downvotes"];

	const upvoteBtn = document.querySelector(
		`[data-action="upvote"][data-id="${id}"][data-type=${exampleType}]`
	);
	const downvoteBtn = document.querySelector(
		`[data-action="downvote"][data-id="${id}"][data-type=${exampleType}]`
	);
	const upvoteSpan = upvoteBtn.querySelector(".rating-count");
	const downvoteSpan = downvoteBtn.querySelector(".rating-count");

	if (upvoteBtn && downvoteBtn && upvoteSpan && downvoteSpan) {
		upvoteSpan.textContent = upvotes;
		downvoteSpan.textContent = downvotes;
	}
}

function initializeRatingButtons() {
	document.addEventListener("click", async (e) => {
		const btn = e.target.closest(".rating-btn");
		if (!btn) return;

		const isUpvote = btn.dataset.action === "upvote" ? true : false; // 'upvote' or 'downvote'
		const exampleId = btn.dataset.id;
		const exampleType = btn.dataset.type;
		console.log("Button data:", { exampleId, exampleType, isUpvote });

		try {
			const result = await callApi(
				`/vocabulary-entries/${exampleId}/vote-example`,
				{
					method: "POST",
					data: {
						user_id: "test123",
						example_id: parseInt(exampleId),
						example_type: exampleType,
						is_upvote: isUpvote,
					},
				}
			);

			updateRatingDisplay(result["example"], exampleType);
		} catch (err) {
			console.error("Failed to update rating: ", err);
		}
	});
}

function initializeToggleButtons() {
	document.querySelectorAll(".toggle-btns").forEach((container) => {
		// example-sentences or contextual-examples
		const section = container.dataset.section;

		container.addEventListener("click", (e) => {
			const btn = e.target.closest(".toggle-btn");
			if (!btn) return;

			const currentActive = container.querySelector(".toggle-btn.active");
			if (currentActive !== btn) {
				updateActive(currentActive, btn);
			}

			handleTabSwitch(btn.dataset.tab, section);
		});
	});
}

function handleTabSwitch(tabType, section) {
	const sectionMap = {
		"example-sentences": [".example-hiragana", ".example-romaji"],
		"contextual-examples": [".dialogue-hiragana", ".dialogue-romaji"],
	};

	const selectors = sectionMap[section];
	// Hide all elements
	selectors.forEach((selector) => {
		document
			.querySelectorAll(selector)
			.forEach((el) => (el.style.display = "none"));
	});

	// Show elements specified by tab type
	const targetSelector = selectors.find((selector) =>
		selector.includes(tabType)
	);
	document
		.querySelectorAll(targetSelector)
		.forEach((el) => (el.style.display = "block"));
}

function initializeShowMoreButtons(sentences, dialogues) {
	const showMoreSentencesBtn = document.getElementById("showMoreSentences");
	const showMoreDialoguesBtn = document.getElementById("showMoreDialogues");

	showMoreSentencesBtn.addEventListener("click", () => {
		const exampleSentencesContainer = document.querySelector(
			".example-sentences-container"
		);
		const sentenceCards = exampleSentencesContainer.querySelectorAll(".card");
		const currentIndex = sentenceCards.length;
		const upperBound = currentIndex + VOCAB_CONFIG.loadMoreExamples;

		const sentencesToDisplay = sentences.slice(currentIndex, upperBound);
		renderExampleSentences(sentencesToDisplay);

		if (upperBound >= sentencesToDisplay.length) {
			showMoreSentencesBtn.classList.add("hidden");
		}
	});

	showMoreDialoguesBtn.addEventListener("click", () => {
		const exampleDialoguesContainer = document.querySelector(
			".example-dialogues-container"
		);
		const dialogueCards = exampleDialoguesContainer.querySelectorAll(".card");
		const currentIndex = dialogueCards.length;
		const upperBound = currentIndex + VOCAB_CONFIG.loadMoreExamples;

		const dialoguesToDisplay = dialogues.slice(currentIndex, upperBound);
		renderDialogueExamples(dialoguesToDisplay);

		if (upperBound >= dialoguesToDisplay.length) {
			showMoreDialoguesBtn.classList.add("hidden");
		}
	});
}

document.addEventListener("DOMContentLoaded", async () => {
	const urlParams = new URLSearchParams(window.location.search);
	const entryId = urlParams.get("id");
	setupPage(`vocabulary-set/${entryId}`, " - Entry Details");
	initializeToggleButtons();

	try {
		const data = await callApi(`/vocabulary-entries/${entryId}`);
		const definitions = data["meanings"];
		const sentenceExamples = data["sentence_examples"];
		const dialogueExamples = data["dialogue_examples"];
		const additionalNotes = data["additional_notes"];

		const sentencesToDisplay = sentenceExamples.slice(
			0,
			VOCAB_CONFIG.sentencesToDisplay
		);
		const dialoguesToDisplay = dialogueExamples.slice(
			0,
			VOCAB_CONFIG.dialoguesToDisplay
		);
		const loadMoreCount = VOCAB_CONFIG.loadMoreExamples;

		renderEntryHeader(data);
		renderDefinitions(definitions);
		renderExampleSentences(sentencesToDisplay);
		renderDialogueExamples(dialoguesToDisplay);
		initializeRatingButtons();
		renderAdditionalNotes(additionalNotes);
		initializeShowMoreButtons(sentenceExamples, dialogueExamples);
	} catch (err) {
		console.error("Error fetching data: ", err);
	}
});
