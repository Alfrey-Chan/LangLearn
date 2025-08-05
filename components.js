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

export function updateActivePage(currentActive, newActive) {
	currentActive.classList.remove("active");
	newActive.classList.add("active");
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
