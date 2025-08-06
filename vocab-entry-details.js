import {
	setupPage,
	createTagsList,
	createRatingButtons,
	createSeparator,
	updateActive,
} from "./components.js";

function renderEntryHeader(entryData) {
	console.table(entryData);

	document.querySelector(".entry-word").innerHTML = entryData.word;
	document.querySelector(".entry-hiragana").innerHTML = entryData.hiragana;
	document.querySelector(".entry-romaji").innerHTML = entryData.romaji;
}

function renderDefinitions(definitions) {
	console.table(definitions);
	const definitionList = document.querySelector(".definition-list");
	for (let i = 0; i < definitions.length; i++) {
		const div = document.createElement("div");
		div.classList.add("definition-item");

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
	console.table(sentences);
	const exampleSentencesContainer = document.querySelector(
		".example-sentences-container"
	);

	for (let i = 0; i < sentences.length; i++) {
		const div = document.createElement("div");
		div.classList.add("example-sentences-item");
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

function initializeToggleButtons() {
	const toggleBtns = document.querySelectorAll(".toggle-btn");

	toggleBtns.forEach((btn) => {
		btn.addEventListener("click", () => {
			const currentActive = document.querySelector(".toggle-btn.active");
			if (currentActive && currentActive !== btn) {
				updateActive(currentActive, btn);
			}

			handleTabSwitch(btn.dataset.tab);
		});
	});
}

function handleTabSwitch(tabType) {
	document
		.querySelectorAll(".example-hiragana, .example-romaji")
		.forEach((el) => {
			el.style.display = "none";
		});

	switch (tabType) {
		case "japanese":
			document.querySelectorAll(".example-japanese").forEach((el) => {
                el.style.display = "block";
            });
			break;
		case "hiragana":
			document.querySelectorAll(".example-hiragana").forEach((el) => {
                el.style.display = "block";
            });
			break;
		case "romaji":
			document.querySelectorAll(".example-romaji").forEach((el) => {
                el.style.display = "block";
            });
			break;
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const urlParams = new URLSearchParams(window.location.search);
	const vocabId = urlParams.get("id");
	setupPage("home", " - Entry Details");
	initializeToggleButtons();

	fetch("enhanced_sns_vocab.json")
		.then((res) => res.json())
		.then((data) => {
			const sampleData = data[0];
			const definitions = sampleData.meanings;
			const exampleSentences = sampleData.meanings[0].usage_examples;
			renderEntryHeader(sampleData);
			renderDefinitions(definitions);
			renderExampleSentences(exampleSentences);
		});
});
