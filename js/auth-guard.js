import { auth } from "./firebase-init.js";
import {
	onAuthStateChanged,
	getIdToken,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

function authReady() {
	return new Promise((resolve) => {
		const off = onAuthStateChanged(auth, (user) => {
			off();
			resolve(user || null);
		});
	});
}

/** Ensures the user is signed in; otherwise redirects. */
export async function ensureAuth({ redirectTo = "/pages/login.html" } = {}) {
	const user = await authReady();
	if (!user) {
		window.location.replace(redirectTo);
		return null;
	}

	// User is authenticated - show content
	// document.body.classList.remove("auth-pending");

	return {
		user,
		async getBearer() {
			const token = await getIdToken(user);
			return `Bearer ${token}`;
		},
		async fetchJSON(url, options = {}) {
			const token = await getIdToken(user);
			const res = await fetch(url, {
				...options,
				headers: {
					...(options.headers || {}),
					Authorization: `Bearer ${token}`,
				},
			});
			if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
			return res.json();
		},
	};
}

/** Optional: doesn’t redirect; useful for public pages that adapt if logged in. */
export async function optionalAuth() {
	return await authReady(); // returns user or null
}
