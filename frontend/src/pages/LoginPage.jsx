import { useEffect, useRef } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { motion } from 'framer-motion'
import { FcGoogle } from 'react-icons/fc'
import { FiShield, FiSearch, FiStar } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout.jsx'
import Logo from '../components/ui/Logo.jsx'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { toErrorMessage } from '../utils/formatters.js'
import styles from './LoginPage.module.css'

const features = [
	{ icon: FiShield, title: 'JWT protected vault', copy: 'Every saved API stays tied to the authenticated user with automatic token handling.' },
	{ icon: FiSearch, title: 'Fast discovery', copy: 'Debounced search keeps the list responsive while you type through a large vault.' },
	{ icon: FiStar, title: 'Premium workflow', copy: 'Create, edit, favourite, and delete APIs in a polished dashboard built for daily use.' },
]

export default function LoginPage() {
	const { loginWithGoogle, authLoading, authError, setAuthError } = useAuth()
	const navigate = useNavigate()
	const googleButtonRef = useRef(null)

	const handleSuccess = async (credentialResponse) => {
		const credential = credentialResponse?.credential

		if (!credential) {
			setAuthError('Google did not return a credential. Please try again.')
			return
		}

		if (cancelTimeoutRef.current) {
			clearTimeout(cancelTimeoutRef.current)
			cancelTimeoutRef.current = null
		}

		try {
			setAuthError('')
			await loginWithGoogle(credential)
			navigate('/dashboard', { replace: true })
		} catch (error) {
			setAuthError(error?.response?.data?.message || 'Failed to sign in. Please try again.')
		}
	}

	const handleError = () => {
		setAuthError('Google sign-in was cancelled. Please try again.')
	}

	useEffect(() => {
		setAuthError('')
	}, [setAuthError])

	const handleGoogleSignIn = () => {
		const googleButton = googleButtonRef.current?.querySelector('button')

		if (!googleButton) {
			handleError()
			return
		}

		setAuthError('')
		googleButton.click()
	}

	return (
		<AuthLayout>
			<div className={styles.page}>
				<motion.section
					className={styles.hero}
					initial={{ opacity: 0, y: 18 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: 'easeOut' }}
				>
					<Logo size={64} subtitle="Secure API command center" />
					<p className={styles.eyebrow}>Developer API vault</p>
					<h1>Store the APIs you trust in a calm, high-end workspace.</h1>
					<p className={styles.lead}>
						ApiVault helps teams save, search, and maintain the APIs they depend on with a secure
						Google sign-in flow and a dashboard that feels like a premium internal tool.
					</p>

					<div className={styles.metrics}>
						<div>
							<strong>1 login</strong>
							<span>Google auth</span>
						</div>
						<div>
							<strong>0 refreshes</strong>
							<span>Live search</span>
						</div>
						<div>
							<strong>All actions</strong>
							<span>Protected by JWT</span>
						</div>
					</div>

					<div className={styles.featureList}>
						{features.map(({ icon: Icon, title, copy }) => (
							<div key={title} className={styles.featureCard}>
								<Icon />
								<div>
									<h3>{title}</h3>
									<p>{copy}</p>
								</div>
							</div>
						))}
					</div>
				</motion.section>

				<motion.section
					className={styles.card}
					initial={{ opacity: 0, y: 22 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
				>
					<div className={styles.cardHeader}>
						<p className={styles.cardEyebrow}>Sign in</p>
						<h2>Enter your vault</h2>
						<p>Continue with Google to unlock your API dashboard.</p>
					</div>

					<div className={styles.loginButtonWrap} aria-busy={authLoading}>
						<div ref={googleButtonRef} style={{ position: 'absolute', left: '-9999px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
							<GoogleLogin onSuccess={handleSuccess} onError={handleError} />
						</div>
						<Button
							type="button"
							variant="secondary"
							className={styles.googleButton}
							icon={<FcGoogle className={styles.googleIcon} />}
							onClick={handleGoogleSignIn}
							aria-label="Continue with Google"
						>
							Continue with Google
						</Button>
					</div>

					{authError ? <p className={styles.error}>{toErrorMessage(authError)}</p> : null}

					<div className={styles.security}>
						<FiShield />
						<span>JWT is stored securely in localStorage and attached automatically to protected requests.</span>
					</div>
				</motion.section>
			</div>
		</AuthLayout>
	)
}