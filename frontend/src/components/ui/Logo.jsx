import styles from './Logo.module.css'

export default function Logo({ size = 44, subtitle = 'Secure API command center' }) {
	return (
		<div className={styles.logo} style={{ '--logo-size': `${size}px` }}>
			<img className={styles.mark} src="/apivault.png" alt="ApiVault logo" width={size} height={size} />
			<div className={styles.text}>
				<strong>ApiVault</strong>
				{subtitle ? <span>{subtitle}</span> : null}
			</div>
		</div>
	)
}