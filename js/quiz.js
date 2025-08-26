import { ensureAuth } from "./auth-guard.js";

class QuizState {
	constructor(questions, id) {
		// quiz id
		this.id = id;

		// shuffle questions
		this.questions = shuffle(questions);

		// shuffle options
		this.questions.forEach((question) => {
			question.items.options = shuffle(question.items.options);
		});

		this.index = 0;
		this.answers = []; // Store user answers
	}

	get numQuestions() {
		return this.questions.length;
	}
	get currentQuestionNum() {
		return this.index + 1;
	}
	get currentQuestion() {
		return this.questions[this.index]["items"];
	}
	get progressPct() {
		return Math.round((this.currentQuestionNum / this.numQuestions) * 100);
	}
	get isLast() {
		return this.index === this.numQuestions - 1;
	}

	nextQuestion() {
		if (this.index < this.numQuestions - 1) {
			this.index++;
			return true;
		}
		return false;
	}

	recordAnswer(selectedOption, isCorrect) {
		this.answers[this.index] = {
			selectedOption: selectedOption,
			isCorrect: isCorrect,
		};
	}
}

// Shuffle questions and also the options
function shuffle(array) {
	const shuffled = array.slice();
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

function updateProgressBar(state) {
	const fill = document.querySelector(".progress-bar-fill");
	const now = state.progressPct;
	fill.style.width = now + "%";
}

function renderQuestionContents(state) {
	const current = state.currentQuestion;
	document.querySelector("#question-current").textContent =
		state.currentQuestionNum;
	document.querySelector("#question-end").textContent = state.numQuestions;
	document.querySelector(".next-question-btn").disabled = true;

	const options = current["options"];

	const optionsContainer = document.querySelector(".question-options");
	document.querySelector(".quiz-question").textContent = current.question;

	optionsContainer.innerHTML = options
		.map(
			(option) => `
        <div class='option-container'>
            <button class='quiz-option-btn' data-index='${state.index}' data-correct='${option.is_correct}'>
                ${option.text}
            </button>
            <p class='quiz-option-explanation'>${option.explanation}>
        </div>
        `
		)
		.join("");

	document.querySelector(".next-question-btn").disabled = true;
	document.querySelector(".complete-quiz-btn").disabled = true;

	updateProgressBar(state);
	initializeQuizOptionBtns(state);
}

function initializeQuizOptionBtns(state) {
	const nextBtn = document.querySelector(".next-question-btn");
	const completeBtn = document.querySelector(".complete-quiz-btn");

	// reset selected styles
	document.querySelectorAll(".quiz-option-btn").forEach((btn) => {
		btn.classList.remove("selected");
		btn.setAttribute("aria-pressed", "false");
	});

	document.querySelectorAll(".quiz-option-btn").forEach((btn) => {
		btn.addEventListener("click", () => {
			// Remove selected from all buttons
			document.querySelectorAll(".quiz-option-btn").forEach((b) => {
				b.classList.remove("selected");
				b.setAttribute("aria-pressed", "false");
			});

			// Add selected to clicked button
			btn.classList.add("selected");
			btn.setAttribute("aria-pressed", "true");

			// Record answer
			const selectedText = btn.textContent.trim();
			const isCorrect = btn.dataset.correct;
			state.recordAnswer(selectedText, isCorrect);

			nextBtn.disabled = false;
			if (completeBtn) completeBtn.disabled = false;
		});
	});
}

function setupNextBtnListener(state) {
	document
		.querySelector(".next-question-btn")
		.addEventListener("click", function () {
			if (state.nextQuestion()) {
				renderQuestionContents(state);
			}

			if (state.isLast) {
				// hide next button
				this.classList.add("hidden");
				document.querySelector(".complete-quiz-btn").classList.remove("hidden");
			}
		});
}

function setupCompleteQuizBtnListener(state, session) {
	document
		.querySelector(".complete-quiz-btn")
		.addEventListener("click", async function () {
			try {
				const correctAnswers = state.answers.filter(
					(answer) => answer.isCorrect === "true"
				).length;
				const totalQuestions = state.answers.length;
				const score = ((correctAnswers / totalQuestions) * 100).toFixed(1);
				const res = await session.fetchJSON(
					"http://127.0.0.1:8000/api/submit-quiz",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							firebase_uid: session.user.uid,
							score_percent: score,
							quiz_id: state.id,
						}),
					}
				);

				showResults(state, totalQuestions, correctAnswers);
			} catch (err) {
				console.error("Error recording quiz results: ", err);
			}
		});
}

function showResults(state, totalQuestions, correctAnswers) {
    // Hide quiz sections and show results
    document.querySelectorAll(".section").forEach(el => {
        el.classList.add("showing-results");
    });

    const container = document.querySelector(".results-section");
    const questions = state.questions;
    
    // Build complete results HTML
    const headerHTML = createResultsHeader(correctAnswers, totalQuestions);
    const questionsHTML = createQuestionsBreakdown(state, questions, totalQuestions);
    
    container.innerHTML = headerHTML + questionsHTML;
    
    // Add event listener for back button
    setupBackButton();
}

function setupBackButton() {
    const backBtn = document.getElementById('quizBackBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            // Navigate back to the vocab set details page
            const urlParams = new URLSearchParams(window.location.search);
            const vocabSetId = urlParams.get("id");
            window.location.href = `vocab-set-details.html?id=${vocabSetId}`;
        });
    }
}

function createResultsHeader(correctAnswers, totalQuestions) {
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const grade = getLetterGrade(percentage);
    
    return `
        <div class="results-header">
            <div class="score-section">
                <div class="score-label">YOUR SCORE</div>
                <div class="score-percentage">${percentage}%</div>
                <div class="grade-pill">Grade: ${grade}</div>
            </div>
            <button class="retake-quiz-btn">↻ Take Quiz Again</button>
        </div>
    `;
}

function createQuestionsBreakdown(state, questions, totalQuestions) {
    let html = "";
    
    for (let i = 0; i < totalQuestions; i++) {
        const userAnswer = state.answers[i];
        const question = questions[i];
        
        html += createQuestionBlock(question, userAnswer, i);
    }
    
    // Back button
    html += `
        <div class="quiz-back-section">
            <button class="quiz-back-btn" id="quizBackBtn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15,18 9,12 15,6"></polyline>
                </svg>
                Back to Vocab Set
            </button>
        </div>
    `;
    
    return html;
}

function createQuestionBlock(question, userAnswer, index) {
    const questionHeader = createQuestionHeader(question, userAnswer, index);
    const optionsHTML = createOptionsHTML(question.items.options, userAnswer);
    
    return `
        <div class="question-block">
            ${questionHeader}
            <p class="question-translated">Translated: ${question.items.question_translated}</p>
            <div class="options-container">${optionsHTML}</div>
        </div>
    `;
}

function createQuestionHeader(question, userAnswer, index) {
    const resultText = userAnswer.isCorrect === "true" ? "Correct" : "Incorrect";
    
    return `
        <div class="question-header">
            <div class="question-left">
                <span class="question-number">${index + 1}.</span>
                <p class="question-text">${question.items.question}</p>
            </div>
            <span class="result">${resultText}</span>
        </div>
    `;
}

function createOptionsHTML(options, userAnswer) {
    return options.map(option => {
        const isUserSelected = option.text === userAnswer.selectedOption;
        const isCorrect = option.is_correct === true;
        const classes = getOptionClasses(isUserSelected, isCorrect);
        
        // Create pills inline
        let pills = "";
        if (isUserSelected) pills += '<span class="choice-pill">Your choice</span>';
        if (isCorrect) pills += '<span class="correct-icon">✅</span>';
        
        return `
            <div class="${classes}">
                ${pills}
                <p class="option-text">${option.text}</p>
                <p class="option-explanation">Explanation: ${option.explanation}</p>
            </div>
        `;
    }).join("");
}

function getOptionClasses(isUserSelected, isCorrect) {
    let classes = "option-breakdown";
    if (isUserSelected) classes += " user-selected";
    if (isCorrect) classes += " correct-option";
    return classes;
}

function getLetterGrade(percentage) {
    if (percentage >= 97) return "A+";
    if (percentage >= 93) return "A";
    if (percentage >= 90) return "A-";
    if (percentage >= 87) return "B+";
    if (percentage >= 83) return "B";
    if (percentage >= 80) return "B-";
    if (percentage >= 77) return "C+";
    if (percentage >= 73) return "C";
    if (percentage >= 70) return "C-";
    if (percentage >= 67) return "D+";
    if (percentage >= 65) return "D";
    return "F";
}

document.addEventListener("DOMContentLoaded", async () => {
	const session = await ensureAuth();
	if (!session) return;

	try {
		const urlParams = new URLSearchParams(window.location.search);
		const vocabSetId = urlParams.get("id");

		const quizData = await session.fetchJSON(
			`http://127.0.0.1:8000/api/take-quiz/${vocabSetId}`
		);

		const test = quizData["questions"].slice();
		// const state = new QuizState(quizData["questions"], quizData.id);
		const state = new QuizState(test, quizData.id);

		// Render Quiz Title
		document.querySelector(".quiz-title").textContent =
			quizData["title"] + " Quiz";

		renderQuestionContents(state);
		setupNextBtnListener(state);
		setupCompleteQuizBtnListener(state, session);
	} catch (err) {
		console.error(`Error loading quiz ${vocabSetId}: `, err);
	}
});