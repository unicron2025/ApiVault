import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth.js'
import LoginPage from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

function ProtectedRoute({ children }) {
	const { isAuthenticated, isReady } = useAuth()

	if (!isReady) {
		return <div className="route-loader" aria-label="Loading application" />
	}

	return isAuthenticated ? children : <Navigate to="/login" replace />
}

function PublicOnlyRoute({ children }) {
	const { isAuthenticated, isReady } = useAuth()

	if (!isReady) {
		return <div className="route-loader" aria-label="Loading application" />
	}

	return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}

function AnimatedRoutes() {
	const location = useLocation()

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={location.pathname}
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -12 }}
				transition={{ duration: 0.28, ease: 'easeOut' }}
			>
				<Routes location={location}>
					<Route
						path="/"
						element={<Navigate to="/dashboard" replace />}
					/>
					<Route
						path="/login"
						element={
							<PublicOnlyRoute>
								<LoginPage />
							</PublicOnlyRoute>
						}
					/>
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<DashboardPage />
							</ProtectedRoute>
						}
					/>
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</motion.div>
		</AnimatePresence>
	)
}

export default function App() {
	return <AnimatedRoutes />
}

