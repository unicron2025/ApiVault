import { getInitials } from '../../utils/formatters.js'
import styles from './Avatar.module.css'

export default function Avatar({ user }) {
	if (user?.avatar) {
		return <img className={styles.avatar} src={user.avatar} alt={user.name ?? 'User avatar'} />
	}

	return <div className={styles.fallback}>{getInitials(user?.name)}</div>
}