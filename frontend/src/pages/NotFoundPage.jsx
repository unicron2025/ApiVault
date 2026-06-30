import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'
import Logo from '../components/ui/Logo.jsx'
import AuthLayout from '../layouts/AuthLayout.jsx'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
	const navigate = useNavigate()

	return (
		<AuthLayout>
			<div className={styles.page}>
				<div className={styles.card}>
					<Logo />
					<p className={styles.code}>404</p>
					<h1>The page drifted out of the vault.</h1>
					<p>
						The route you requested does not exist. Return to the dashboard to keep managing your API
						workspace.
					</p>
					<div className={styles.actions}>
						<Button onClick={() => navigate('/dashboard')}>Go to dashboard</Button>
						<Button variant="secondary" onClick={() => navigate('/login')}>
							Back to login
						</Button>
					</div>
				</div>
			</div>
		</AuthLayout>
	)
}