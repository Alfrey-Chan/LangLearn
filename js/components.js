// Reusable UI components for LangLearn app

export function createHeader(title = "LangLearn", showMenu = false) {
	return `
        <header class="header">
            <h1 class="header-title">LangLearn</h1>
            ${
							showMenu
								? `
                <button class="menu-button" id="menuBtn">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            `
								: ""
						}
        </header>
    `;
}

export function createBottomNav(activePage = "home") {
	const navItems = [
		{
			page: "home",
			icon: `<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9,22 9,12 15,12 15,22" />`,
			label: "Home",
		},
		{
			page: "learn",
			icon: `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />`,
			label: "Learn",
		},
		{
			page: "search",
			icon: `<circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />`,
			label: "Search",
		},
		{
			page: "quiz",
			icon: `<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />`,
			label: "Quiz",
		},
		{
			page: "profile",
			icon: `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />`,
			label: "Profile",
		},
	];

	const navButtons = navItems
		.map(
			(item) => `
        <button class="nav-btn ${
					activePage === item.page ? "active" : ""
				}" data-page="${item.page}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${item.icon}
            </svg>
            <span>${item.label}</span>
        </button>
    `
		)
		.join("");

	return `
        <nav class="bottom-nav">
            ${navButtons}
        </nav>
    `;
}

export function createTagsList(tagsList) {
	let allTagsHTML = "";

	tagsList.forEach((tag) => {
		const btn = `<button class="tags">${tag}</button>`;
		allTagsHTML += btn;
	});

	return allTagsHTML;
}

export function createPagination(numItems, itemsPerPage, numPagesDisplay) {
	let paginationHTML = "";
	let pagesHTML = "";
	const numPages = Math.ceil(numItems / itemsPerPage);

	// Numbered page buttons
	for (let page = 1; page <= numPages; page++) {
		const isFirstPage = page === 1;
		const activeClass = isFirstPage ? "page-btn active" : "page-btn";

		pagesHTML += `
            <button class="${activeClass}" data-page="${page}">${page}</button>
        `;
	}

	// Prev/next buttons (if needed)
	if (numPages > numPagesDisplay) {
		// Add prev button (disabled initially since we start at page 1)
		paginationHTML += `
			<button class="prev-btn disabled">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<polyline points="15,18 9,12 15,6"></polyline>
				</svg>
			</button>
		`;

		// Add pages
		paginationHTML += pagesHTML;

		// Add next button
		paginationHTML += `
			<button class="next-btn">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<polyline points="9,6 15,12 9,18"></polyline>
				</svg>
			</button>
		`;
	} else {
		// Just pages, no prev/next needed
		paginationHTML = pagesHTML;
	}

	return paginationHTML;
}

export function updateActive(currentActive, newActive) {
	currentActive.classList.remove("active");
	newActive.classList.add("active");
}

export function initializePagination(data, renderFunction, initializeFunction = null) {
	const pageButtons = document.querySelectorAll(".page-btn");
	const prevBtn = document.querySelector(".prev-btn");
	const nextBtn = document.querySelector(".next-btn");

	// Page number button clicks
	pageButtons.forEach((btn) => {
		btn.addEventListener("click", () => {
			const pageNumber = parseInt(btn.dataset.page);

			// Update active state
			document.querySelector(".page-btn.active")?.classList.remove("active");
			btn.classList.add("active");

			// Re-render with provided functions
			renderFunction(data, pageNumber);
			if (initializeFunction) initializeFunction();

			// Update prev/next button states
			updatePaginationButtons();
		});
	});

	// Previous button
	if (prevBtn) {
		prevBtn.addEventListener("click", () => {
			const currentActive = document.querySelector(".page-btn.active");
			const currentPage = parseInt(currentActive.dataset.page);

			if (currentPage > 1) {
				const prevButton = document.querySelector(
					`[data-page="${currentPage - 1}"]`
				);
				prevButton?.click();
			}
		});
	}

	// Next button
	if (nextBtn) {
		nextBtn.addEventListener("click", () => {
			const currentActive = document.querySelector(".page-btn.active");
			const currentPage = parseInt(currentActive.dataset.page);
			const totalPages = pageButtons.length;

			if (currentPage < totalPages) {
				const nextButton = document.querySelector(
					`[data-page="${currentPage + 1}"]`
				);
				nextButton?.click();
			}
		});
	}

	// Initialize button states
	updatePaginationButtons();
}

export function updatePaginationButtons() {
	const prevBtn = document.querySelector(".prev-btn");
	const nextBtn = document.querySelector(".next-btn");
	const currentActive = document.querySelector(".page-btn.active");

	if (!currentActive) return;

	const currentPage = parseInt(currentActive.dataset.page);
	const totalPages = document.querySelectorAll(".page-btn").length;

	// Update previous button
	if (prevBtn) {
		prevBtn.disabled = currentPage <= 1;
		prevBtn.style.opacity = currentPage <= 1 ? "0.5" : "1";
	}

	// Update next button
	if (nextBtn) {
		nextBtn.disabled = currentPage >= totalPages;
		nextBtn.style.opacity = currentPage >= totalPages ? "0.5" : "1";
	}
}

export function renderPaginationComponent(
	numItems,
	itemsPerPage,
	maxPages,
	targetSelector = ".pagination"
) {
	const pagination = document.querySelector(targetSelector);
	const paginationHTML = createPagination(numItems, itemsPerPage, maxPages);
	pagination.innerHTML = paginationHTML;
}

export function createBackButton(text = "Back") {
	return `
        <button class="back-button" onclick="history.back()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
            ${text}
        </button>
    `;
}

export function createRatingButtons() {
	return `
		<div class="ratings">
            <button class="rating-btn" data-type="upvote" data-count="12">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7 10v12"/>
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/>
                </svg>
                <span class="rating-count">12</span>
            </button>
            <button class="rating-btn" data-type="downvote" data-count="0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 14V2"/>
                    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/>
                </svg>
                <span class="rating-count">0</span>
            </button>
        </div>
	`;
}

export function createSeparator() {
	const separator = document.createElement("div");
	separator.classList.add("separator");
	return separator;
}

// Initialize navigation functionality for bottom nav
export function initializeBottomNavigation() {
	const navBtns = document.querySelectorAll(".nav-btn");

	navBtns.forEach((btn) => {
		btn.addEventListener("click", () => {
			// Remove active class from all buttons
			navBtns.forEach((btn) => {
				btn.classList.remove("active");
			});
			// Add active class to clicked button
			btn.classList.add("active");

			// Here you can add navigation logic
			const page = btn.dataset.page;
			console.log(`Navigating to: ${page}`);

			// For now, just log. Later you can add actual navigation
			// Example: window.location.href = `${page}.html`;
		});
	});
}

// Convenience function to set up any page with header and navigation
export function setupPage(activePage, pageTitle) {
	const app = document.querySelector(".app");
	document.title = pageTitle + " - LangLearn";

	// Insert header and navigation
	app.insertAdjacentHTML("afterbegin", createHeader(pageTitle));
	app.insertAdjacentHTML("beforeend", createBottomNav(activePage));

	// Initialize navigation functionality
	initializeBottomNavigation();
}
