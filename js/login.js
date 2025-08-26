import { callApi } from "./constants.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	sendEmailVerification,
	GoogleAuthProvider,
	signInWithPopup,
	OAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
	apiKey: "AIzaSyDWxZ_wMLKKHa0edWlBKhWoRe_K65cNGq8",
	authDomain: "langlearn-a53cd.firebaseapp.com",
	projectId: "langlearn-a53cd",
	storageBucket: "langlearn-a53cd.firebasestorage.app",
	messagingSenderId: "25224987204",
	appId: "1:25224987204:web:8bc2db10b69b0437843211",
	measurementId: "G-C8WY87KE1V",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
	// --- Simple view/state manager ---
	const views = {
		login: document.querySelector(".login-view"),
		signup: document.querySelector(".create-account-view"),
	};

	function show(viewName) {
		// Hide all views
		Object.values(views).forEach((view) => {
			view.classList.remove("active");
			view.classList.add("hidden");
			view.setAttribute("aria-hidden", "true");
		});

		// Show the requested view
		views[viewName].classList.add("active");
		views[viewName].classList.remove("hidden");
		views[viewName].setAttribute("aria-hidden", "false");
	}

	// View navigation
	document
		.querySelector(".signup-link")
		.addEventListener("click", () => show("signup"));
	document
		.querySelector(".login-link")
		.addEventListener("click", () => show("login"));

	// Password visibility toggles
	document.querySelectorAll("[data-toggle]").forEach((btn) => {
		btn.addEventListener("click", () => {
			const input = document.querySelector(btn.getAttribute("data-toggle"));
			const type =
				input.getAttribute("type") === "password" ? "text" : "password";
			input.setAttribute("type", type);
			btn.setAttribute(
				"aria-label",
				type === "password" ? "Show password" : "Hide password"
			);
		});
	});

	// Firebase Authentication
	async function handleLogin(email, password) {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			console.log("Login successful:", userCredential.user);

			// Optional: Check if email is verified
			if (!userCredential.user.emailVerified) {
				alert("Please verify your email before logging in. Check your inbox!");
				return;
			}

			// Redirect to home page or dashboard
			window.location.href = "home.html";
		} catch (error) {
			console.error("Login error:", error.message);
			alert("Login failed: " + error.message);
		}
	}

	async function handleSignup(email, password) {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			console.log("Signup successful:", userCredential.user);

			// Send verification email
			await sendEmailVerification(userCredential.user);
			console.log("Verification email sent");

			alert(
				"Account created successfully! Please check your email for verification."
			);
		} catch (error) {
			console.error("Signup error:", error.message);
			alert("Signup failed: " + error.message);
		}
	}

	async function signInWithSocial(providerOption) {
		const providersMap = {
			google: new GoogleAuthProvider(),
			apple: new OAuthProvider("apple.com"),
		};

		const provider = providersMap[providerOption];
		try {
			const response = await signInWithPopup(auth, provider);

			await authenticate(response.user);
		} catch (error) {
			console.error("Signup error: ", error.message);
		}
	}

	async function authenticate(firebaseUser) {
		try {
			const firebaseToken = await firebaseUser.getIdToken();
			console.log("Token length:", firebaseToken.length);

			await callApi("/auth/firebase-login", firebaseToken, {
				method: "POST",
			});

			window.location.href = "home.html";
		} catch (error) {
			console.error("Authentication failed: ", error.message);
			// display error
		}
	}

	// async function signInWithApple() {
	//     const provider = new OAuthProvider("apple.com");
	//     try {
	//         const result = await signInWithPopup(auth, provider);
	//         if (result) console.log(result);
	//     } catch (error) {
	//         console.error("Signup error: ", error.message);
	//     }
	// }

	function displayError(message) {}

	// Form submission handlers
	document.querySelector(".signin-btn").addEventListener("click", (e) => {
		e.preventDefault();
		const email = document.querySelector("#login-email").value;
		const password = document.querySelector("#login-password").value;
		handleLogin(email, password);
	});

	document
		.querySelector(".create-account-btn")
		.addEventListener("click", (e) => {
			e.preventDefault();
			const email = document.querySelector("#signup-email").value;
			const password = document.querySelector("#signup-password").value;
			const confirmPassword = document.querySelector(
				"#signup-password-confirm"
			).value;

			if (password !== confirmPassword) {
				alert("Passwords don't match!");
				return;
			}

			handleSignup(email, password);
		});

	document.querySelectorAll(".socials-btn").forEach((btn) => {
		btn.addEventListener("click", () => {
			const signInOption = btn.dataset.type;
			signInWithSocial(signInOption);
		});
	});
});
