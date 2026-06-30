import axios from 'axios'
import { clearAuth, readStoredAuth } from '../utils/storage.js'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

export const apiClient = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
})

apiClient.interceptors.request.use((config) => {
	const { token } = readStoredAuth()

	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}

	return config
})

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error?.response?.status === 401) {
			clearAuth()

			if (!window.location.pathname.startsWith('/login')) {
				window.location.replace('/login')
			}
		}

		return Promise.reject(error)
	},
)

export function getApiBaseUrl() {
	return baseURL
}