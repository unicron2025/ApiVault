import Button from './Button.jsx'
import styles from './EmptyState.module.css'

export default function EmptyState({ title, description, actionLabel, onAction }) {
	return (
		<div className={styles.empty}>
			<div className={styles.illustration} aria-hidden="true">
				<span />
				<span />
				<span />
			</div>
			<h3>{title}</h3>
			<p>{description}</p>
			{actionLabel ? (
				<Button onClick={onAction} icon={<span>+</span>}>
					{actionLabel}
				</Button>
			) : null}
		</div>
	)
}