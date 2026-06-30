import { AnimatePresence, motion } from 'framer-motion'
import styles from './Modal.module.css'

export default function Modal({ open, onClose, children, width = 'min(100%, 720px)' }) {
	const handleOverlayMouseDown = () => {
		onClose?.()
	}

	const handleModalMouseDown = (event) => {
		event.stopPropagation()
	}

	return (
		<AnimatePresence>
			{open ? (
				<motion.div
					className={styles.overlay}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onMouseDown={handleOverlayMouseDown}
				>
					<motion.div
						className={styles.modal}
						style={{ width }}
						initial={{ opacity: 0, y: 18, scale: 0.98 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 18, scale: 0.98 }}
						transition={{ duration: 0.22, ease: 'easeOut' }}
						onMouseDown={handleModalMouseDown}
					>
						{children}
					</motion.div>
				</motion.div>
			) : null}
		</AnimatePresence>
	)
}