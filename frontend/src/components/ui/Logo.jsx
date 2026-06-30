import styles from './Logo.module.css'

export default function Logo() {
	return (
		<div className={styles.logo}>
			<div className={styles.mark} aria-hidden="true">
				<span />
			</div>
			<div className={styles.text}>
				<strong>ApiVault</strong>
				<span>Secure API command center</span>
			</div>
		</div>
	)
}