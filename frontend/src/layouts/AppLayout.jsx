import { motion } from 'framer-motion'
import { FiLogOut } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import Avatar from '../components/ui/Avatar.jsx'
import Logo from '../components/ui/Logo.jsx'
import Button from '../components/ui/Button.jsx'
import styles from './AppLayout.module.css'

export default function AppLayout({ children, onCreate }) {
	const { user, logout } = useAuth()
	const navigate = useNavigate()

	const handleLogout = () => {
		logout()
		navigate('/login', { replace: true })
	}

	return (
		<div className={styles.shell}>
			<header className={styles.navbar}>
				<Logo />
				<div className={styles.actions}>
					<Button variant="ghost" onClick={onCreate} icon={<span className={styles.plus}>+</span>}>
						Create API
					</Button>
					<div className={styles.profile}>
						<Avatar user={user} />
						<div className={styles.profileMeta}>
							<strong>{user?.name ?? 'ApiVault User'}</strong>
							<span>{user?.email ?? 'Signed in'}</span>
						</div>
						<button className={styles.logout} type="button" onClick={handleLogout} aria-label="Logout">
							<FiLogOut />
						</button>
					</div>
				</div>
			</header>

			<motion.div className={styles.content} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
				{children}
			</motion.div>
		</div>
	)
}