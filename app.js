let displayVocabSetCount = 4;
let vocabDataset = [];

const loadMoreBtn = document.getElementById("loadMoreBtn");

function initializeNavigation() {
	const navBtns = document.querySelectorAll(".nav-btn");

	navBtns.forEach((btn) => {
		btn.addEventListener("click", () => {
			navBtns.forEach((btn) => {
				btn.classList.remove("active");
			});
			btn.classList.add("active");
			console.log(btn.dataset.page);
		});
	});
}

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
                <div class="vocab-set-card">
                    <img src="${set.image}" alt="vocabulary set image">
                    <h3 class="vocab-set-title">${set.title}</h3>
                    <div class="vocab-set-meta">
                        <span class="vocab-entries-count">${set.entries}</span>
                        <p class="vocab-set-rating">★${set.rating}</p>
                    </div>
                </div>
            `
				)
				.join("");
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

			// generate dots for each word
			for (let i = 0; i < data.length; i++) {
				const carouselDot = document.createElement("button");
				carouselDot.classList.add("carousel-btn");
				carouselDot.dataset.page = i; // word index

				carouselDot.addEventListener("click", () => {
					// TODO: CSS to handle horizontal scroll
					document
						.querySelector(".carousel-btn.active")
						.classList.remove("active");
					carouselDot.classList.add("active");
				});

				carouselDots.appendChild(carouselDot);
			}
		})
		.catch((error) =>
			console.error("Error fetching words of the week: ", error)
		);
}

function loadMoreVocabSets() {
	displayVocabSetCount += 4;
	if (displayVocabSetCount >= vocabDataset.length) {
		loadMoreBtn.classList.add("hidden");
	}

	renderVocabularyGrid();
}

document.addEventListener("DOMContentLoaded", () => {
	initializeNavigation();
	renderWordsOfTheWeek();
	renderVocabularyGrid();

	loadMoreBtn.addEventListener("click", () => {
		loadMoreVocabSets();
	});
});
