const BASE_URL = "http://127.0.0.1:8000/api";

export const CAROUSEL_CONFIG = {
	cardWidthPercent: 0.75,
	gap: 16,
	autoAdvanceDelay: 5000,
	pauseAfterInteraction: 3000,
};

export const VOCAB_CONFIG = {
	itemsPerPage: 3,
	loadMoreIncrement: 4, // for home page
	maxPagesToDisplay: 5, // if more than this number of pages, show prev and next pagination btns
};

export const fetchData = async (endpoint) => {
	try {
		const res = await fetch(`${BASE_URL}${endpoint}`);
		if (!res.ok) throw new Error(`Error: ${res.status}`);
		return await res.json();
	} catch (err) {
		console.error("Fetch failed: ", err.message);
		throw err;
	}
};

export const callApi = async (endpoint, options = {}) => {
	const config = {
		method: options.method || 'GET',
		headers: {
			'Content-Type': 'application/json',
			...options.headers
		},
		...options
	}

	if (options.data && config.method !== 'GET') {
		config.body = JSON.stringify(options.data);
	}

	try {
		const res = await fetch(`${BASE_URL}${endpoint}`, config);
		if (!res.ok) throw new Error(`Error: ${res.status}`);
		return await res.json();
	} catch (err) {
		console.error('API call failed: ', err.message);
	}

}