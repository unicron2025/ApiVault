import axios from 'axios'
import { normalizeUser } from '../utils/formatters.js'
import { clearAuth, persistAuth, readStoredAuth } from '../utils/storage.js'
import { getApiBaseUrl } from './httpClient.js'

const authClient = axios.create({
	baseURL: getApiBaseUrl(),
	headers: {
		'Content-Type': 'application/json',
	},
})

export async function authenticateWithGoogle(credential) {
	const response = await authClient.post('/api/auth/google', { credential })
	const token = response.data?.token ?? ''
	const user = normalizeUser(response.data?.user)

	if (token && user) {
		persistAuth(token, user)
	}

	return { token, user }
}

export function restoreAuthState() {
	const { token, user } = readStoredAuth()
	return { token, user: normalizeUser(user) }
}

export function signOut() {
	clearAuth()
}
