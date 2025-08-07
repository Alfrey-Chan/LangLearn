import {
	setupPage,
	createRatingButtons,
	createSeparator,
	createBackButton,
	updateActive,
} from "./components.js";

function renderEntryHeader(entryData) {
	document.querySelector(".entry-word").innerHTML = entryData.word;
	document.querySelector(
		".entry-hiragana"
	).innerHTML = `(${entryData.hiragana})`;
	document.querySelector(".entry-romaji").innerHTML = entryData.romaji;
}

function renderDefinitions(definitions) {
	const definitionList = document.querySelector(".definition-list");
	for (let i = 0; i < definitions.length; i++) {
		const div = document.createElement("div");
		div.classList.add("definition-item");1

		if (i > 0) {
			definitionList.appendChild(createSeparator());
		}

		const definitionHTML = `
            <span class="definition-number">${i + 1}.</span>
            <span class="definition-short">${
							definitions[i].short_translation
						}</span>
            <p class="definition-detail">${definitions[i].detailed_meaning}</p>
        `;
		div.innerHTML = definitionHTML;
		definitionList.appendChild(div);
	}
}

function renderExampleSentences(sentences) {
	const exampleSentencesContainer = document.querySelector(
		".example-sentences-container"
	);

	for (let i = 0; i < sentences.length; i++) {
		const div = document.createElement("div");
		div.classList.add("card");
		div.dataset.index = i;

		const ratingBtns = createRatingButtons();
		const exampleSentenceHTML = `
            <p class="example-japanese">${sentences[i].japanese}</p>
            <p class="example-hiragana">${sentences[i].hiragana}</p>
            <p class="example-romaji">${sentences[i].romaji}</p>
            <p class="example-translation">${sentences[i].translation}</p>
            ${ratingBtns}
        `;
		div.innerHTML = exampleSentenceHTML;
		exampleSentencesContainer.appendChild(div);
	}
}

function renderContextualUsageExamples(contextualExamples) {
	// console.table(contextualExamples);
	const container = document.querySelector(".contextual-usage-examples");

	contextualExamples.forEach((example) => {
		const dialogueDiv = document.createElement("div");
		dialogueDiv.classList.add("card");

		for (let i = 0; i < example.dialogue.length; i++) {
			if (i > 0) {
				dialogueDiv.appendChild(createSeparator());
			}

			const speakerHTML = `
                <span class="dialogue-speaker">${example.dialogue[i].speaker}:</span>
                <span class="dialogue-japanese">${example.dialogue[i].japanese}</span>
                <p class="dialogue-hiragana">${example.dialogue[i].hiragana}</p>
                <p class="dialogue-romaji">${example.dialogue[i].romaji}</p>
                <p class="dialogue-translation">${example.dialogue[i].translation}</p>
            `;
			dialogueDiv.innerHTML += speakerHTML;
		}

		dialogueDiv.innerHTML += createRatingButtons();
		container.appendChild(dialogueDiv);
	});
}

function renderAdditionalNotes(additionalNotes) {
    console.table(additionalNotes);
    document.querySelector(".additional-notes-text").innerHTML = additionalNotes;
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

document.addEventListener("DOMContentLoaded", () => {
	const urlParams = new URLSearchParams(window.location.search);
	const vocabId = urlParams.get("id");
	setupPage("home", " - Entry Details");
	initializeToggleButtons();

	fetch("../data/enhanced_sns_vocab.json")
		.then((res) => res.json())
		.then((data) => {
			const sampleData = data[0];
			const definitions = sampleData.meanings;
			const exampleSentences = sampleData.meanings[0].usage_examples;
			const contextualExamples = sampleData.meanings[0].contextual_usage;
            const additionalNotes = sampleData.meanings[0].additional_notes;
			renderEntryHeader(sampleData);
			renderDefinitions(definitions);
			renderExampleSentences(exampleSentences);
			renderContextualUsageExamples(contextualExamples);
            renderAdditionalNotes(additionalNotes);
		});
});
