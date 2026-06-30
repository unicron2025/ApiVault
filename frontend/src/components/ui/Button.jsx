import { motion } from 'framer-motion'
import styles from './Button.module.css'

export default function Button({
	variant = 'primary',
	type = 'button',
	loading = false,
	disabled = false,
	icon = null,
	children,
	onClick,
	className = '',
	...rest
}) {
	return (
		<motion.button
			type={type}
			className={`${styles.button} ${styles[variant]} ${className}`.trim()}
			onClick={onClick}
			disabled={disabled || loading}
			whileHover={disabled || loading ? undefined : { y: -1, scale: 1.01 }}
			whileTap={disabled || loading ? undefined : { scale: 0.98 }}
			{...rest}
		>
			{loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
			{icon ? <span className={styles.icon}>{icon}</span> : null}
			<span>{children}</span>
		</motion.button>
	)
}