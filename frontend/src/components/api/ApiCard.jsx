import { AnimatePresence, motion } from 'framer-motion'
import { FiEdit3, FiExternalLink, FiHeart, FiTrash2 } from 'react-icons/fi'
import { formatDate } from '../../utils/formatters.js'
import Button from '../ui/Button.jsx'
import styles from './ApiCard.module.css'

export default function ApiCard({ api, onEdit, onDelete, onToggleFavourite, isDeleting = false, isUpdatingFavourite = false }) {
	return (
		<motion.article
			layout
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -12, scale: 0.98 }}
			transition={{ duration: 0.24, ease: 'easeOut' }}
			className={`${styles.card} ${api.favourite ? styles.favourite : ''}`.trim()}
		>
			<div className={styles.header}>
				<div>
					<div className={styles.titleRow}>
						<h3>{api.name}</h3>
						<span className={styles.badge}>{api.category}</span>
					</div>
					<p className={styles.description}>{api.description}</p>
				</div>
				<button
					type="button"
					className={`${styles.favButton} ${api.favourite ? styles.favActive : ''}`.trim()}
					onClick={() => onToggleFavourite(api)}
					disabled={isUpdatingFavourite}
					aria-pressed={api.favourite}
					aria-label={api.favourite ? 'Remove from favourites' : 'Add to favourites'}
				>
					<motion.span
						animate={api.favourite ? { scale: [1, 1.18, 1] } : { scale: 1 }}
						transition={{ duration: 0.28 }}
					>
						<FiHeart />
					</motion.span>
				</button>
			</div>

			<div className={styles.meta}>
				<span>{api.baseUrl}</span>
				<span>Created {formatDate(api.createdAt)}</span>
			</div>

			<div className={styles.actions}>
				<Button
					variant="secondary"
					onClick={() => window.open(api.docsUrl, '_blank', 'noopener,noreferrer')}
					icon={<FiExternalLink />}
				>
					Docs
				</Button>
				<Button variant="secondary" onClick={() => onEdit(api)} icon={<FiEdit3 />}>
					Edit
				</Button>
				<Button variant="danger" onClick={() => onDelete(api)} loading={isDeleting} icon={<FiTrash2 />}>
					Delete
				</Button>
			</div>
		</motion.article>
	)
}