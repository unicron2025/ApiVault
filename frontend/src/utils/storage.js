const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export function readStoredAuth() {
	if (typeof window === 'undefined') {
		return { token: '', user: null }
	}

	const token = window.localStorage.getItem(TOKEN_KEY) ?? ''
	const rawUser = window.localStorage.getItem(USER_KEY)

	if (!rawUser) {
		return { token, user: null }
	}

	try {
		return { token, user: JSON.parse(rawUser) }
	} catch {
		window.localStorage.removeItem(TOKEN_KEY)
		window.localStorage.removeItem(USER_KEY)
		return { token: '', user: null }
	}
}

export function persistAuth(token, user) {
	window.localStorage.setItem(TOKEN_KEY, token)
	window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth() {
	window.localStorage.removeItem(TOKEN_KEY)
	window.localStorage.removeItem(USER_KEY)
}