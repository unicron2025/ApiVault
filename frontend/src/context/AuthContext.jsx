import { createContext, useEffect, useMemo, useState } from 'react'
import { authenticateWithGoogle, restoreAuthState, signOut } from '../services/authService.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [token, setToken] = useState('')
	const [isReady, setIsReady] = useState(false)
	const [authError, setAuthError] = useState('')
	const [authLoading, setAuthLoading] = useState(false)

	useEffect(() => {
		const session = restoreAuthState()
		setUser(session.user)
		setToken(session.token)
		setIsReady(true)
	}, [])

	const loginWithGoogle = async (credential) => {
		setAuthLoading(true)
		setAuthError('')

		try {
			const session = await authenticateWithGoogle(credential)
			setUser(session.user)
			setToken(session.token)
			return session
		} catch (error) {
			const message = error?.response?.data?.message ?? error?.message ?? 'Google login failed.'
			setAuthError(message)
			throw error
		} finally {
			setAuthLoading(false)
		}
	}

	const logout = () => {
		signOut()
		setUser(null)
		setToken('')
	}

	const value = useMemo(
		() => ({
			user,
			token,
			isAuthenticated: Boolean(user && token),
			isReady,
			authLoading,
			authError,
			setAuthError,
			loginWithGoogle,
			logout,
		}),
		[user, token, isReady, authLoading, authError],
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}