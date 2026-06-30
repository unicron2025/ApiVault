import { apiClient } from './httpClient.js'

function unwrapApiList(response) {
	return response.data?.apis ?? []
}

export async function getApis() {
	const response = await apiClient.get('/api/apis')
	return unwrapApiList(response)
}

export async function searchApis(query) {
	const response = await apiClient.get('/api/apis/search', {
		params: { query },
	})
	return unwrapApiList(response)
}

export async function createApi(payload) {
	const response = await apiClient.post('/api/apis', payload)
	return response.data?.api ?? null
}

export async function updateApi(id, payload) {
	const response = await apiClient.patch(`/api/apis/${id}`, payload)
	return response.data?.api ?? null
}

export async function deleteApi(id) {
	await apiClient.delete(`/api/apis/${id}`)
}

export async function toggleFavourite(id) {
	const response = await apiClient.patch(`/api/apis/${id}/favorite`)
	return response.data?.api ?? null
}