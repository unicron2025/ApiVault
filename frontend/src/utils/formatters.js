export function formatDate(value) {
	if (!value) {
		return 'Unknown date'
	}

	return new Intl.DateTimeFormat('en', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	}).format(new Date(value))
}

export function getInitials(name) {
	if (!name) {
		return 'A'
	}

	return name
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? '')
		.join('')
}

export function normalizeUser(user) {
	if (!user) {
		return null
	}

	return {
		...user,
		name: user.name ?? user.username ?? 'ApiVault user',
		avatar: user.avatar ?? '',
	}
}

export function normalizeApi(api) {
	return {
		...api,
		favourite: Boolean(api?.favourite),
	}
}

export function toErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
	if (typeof error === 'string' && error.trim()) {
		return error
	}

	const message = error?.response?.data?.message ?? error?.message
	return typeof message === 'string' && message.trim() ? message : fallback
}