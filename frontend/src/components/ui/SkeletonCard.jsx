import styles from './SkeletonCard.module.css'

export default function SkeletonCard() {
	return (
		<div className={styles.card} aria-hidden="true">
			<div className={styles.topRow}>
				<div className={styles.lineLg} />
				<div className={styles.pill} />
			</div>
			<div className={styles.lineMd} />
			<div className={styles.lineSm} />
			<div className={styles.lineXs} />
			<div className={styles.footer}>
				<div className={styles.lineButton} />
				<div className={styles.lineButton} />
			</div>
		</div>
	)
}