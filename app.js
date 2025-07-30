document.addEventListener("DOMContentLoaded", () => {
	let navBtns = document.querySelectorAll(".nav-btn");

	navBtns.forEach((btn) => {
		btn.addEventListener("click", () => {
			navBtns.forEach((btn) => {
				btn.classList.remove("active");
			});
			btn.classList.add("active");
			console.log(btn.dataset.page);
		});
	});

	fetch("words.json")
		.then((res) => res.json())
		.then((words) => {
			let carouselCardsContainer = document.getElementById(
				"carouselCardsContainer"
			);
			let carouselDots = document.getElementById("carouselDots");

            // loop through words and dynamically create & display card for each
			words.forEach((word) => {
				const carouselCard = document.createElement("div");
				carouselCard.classList.add("carouselCard");

				const jp = document.createElement("p");
				jp.classList.add("carouselWord");
				jp.textContent = word["jp"];

				const en = document.createElement("p");
				en.classList.add("carouselWordTranslated");
				en.textContent = word["en"];

				carouselCard.appendChild(jp);
                carouselCard.appendChild(en);
				carouselCardsContainer.appendChild(carouselCard);
			});

            // generate dots for each word
            for (i = 0; i < words.length; i++) {
                const carouselDot = document.createElement("button");
                carouselDot.classList.add("carouselBtn");
                carouselDot.dataset.page = i; // word index

                carouselDot.addEventListener("click", () => {
                    // TODO: CSS to handle horizontal scroll
                    document.querySelector(".carouselBtn.active").classList.remove("active");
                    carouselDot.classList.add("active");
                })

                carouselDots.appendChild(carouselDot);
            }
		})
		.catch((error) =>
			console.error("Error fetching words of the week: ", error)
		);
});
