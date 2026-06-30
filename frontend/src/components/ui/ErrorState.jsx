import Button from './Button.jsx'
import styles from './ErrorState.module.css'

export default function ErrorState({ title, description, onRetry }) {
	return (
		<div className={styles.errorCard}>
			<div className={styles.icon}>!</div>
			<h3>{title}</h3>
			<p>{description}</p>
			<Button variant="secondary" onClick={onRetry}>
				Retry
			</Button>
		</div>
	)
}