import { motion } from 'framer-motion'
import styles from './AuthLayout.module.css'

export default function AuthLayout({ children }) {
	return (
		<main className={styles.shell}>
			<div className={styles.blobOne} />
			<div className={styles.blobTwo} />
			<div className={styles.blobThree} />
			{children}
		</main>
	)
}