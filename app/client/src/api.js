const API_URL = import.meta.env.VITE_API_URL;

/**
 * A helper function for making API requests.
 * It automatically sets the base URL and JSON headers.
 *
 * @param {string} endpoint The API endpoint to call (e.g., '/auth/login').
 * @param {object} options The options for the fetch call (method, body, etc.).
 * @returns {Promise<any>} The JSON response from the API.
 */
async function apiFetch(endpoint, options = {}) {
    const { body, ...restOptions } = options;

    const response = await fetch(`${API_URL}${endpoint}`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        ...restOptions,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'An API error occurred');
    }

    return response.json();
}

export default apiFetch;
