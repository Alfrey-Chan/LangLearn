document.addEventListener("DOMContentLoaded", () => {
	const loginView = document.querySelector(".login-view");
	const createAccountView = document.querySelector(".create-account-view");
    const signupLink = document.querySelector(".signup-link");
    const loginLink = document.querySelector(".login-link");

	loginLink.addEventListener("click", () => {
		loginView.classList.toggle("hidden");
		createAccountView.classList.toggle("hidden");
	});

    signupLink.addEventListener("click", () => {
		loginView.classList.toggle("hidden");
		createAccountView.classList.toggle("hidden");
	});

	// Password toggle functionality
	const eyeIcons = document.querySelectorAll(".input-icon");
	
	eyeIcons.forEach(icon => {
		icon.addEventListener("click", () => {
			const inputGroup = icon.closest(".input-group");
			const passwordInput = inputGroup.querySelector("input[type='password'], input[type='text']");
			
			if (passwordInput.type === "password") {
				passwordInput.type = "text";
				// Switch to "hide" icon (eye with slash)
				icon.innerHTML = `
					<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
					<line x1="1" y1="1" x2="23" y2="23"/>
				`;
			} else {
				passwordInput.type = "password";
				// Switch to "show" icon (normal eye)
				icon.innerHTML = `
					<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
					<circle cx="12" cy="12" r="3"/>
				`;
			}
		});
	});
});
