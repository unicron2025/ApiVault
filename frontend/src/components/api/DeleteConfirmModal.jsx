import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import styles from './DeleteConfirmModal.module.css'

export default function DeleteConfirmModal({ open, api, onClose, onConfirm, isDeleting = false }) {
	return (
		<Modal open={open} onClose={isDeleting ? undefined : onClose} width="min(100%, 520px)">
			<div className={styles.wrapper}>
				<div className={styles.badge}>Delete API</div>
				<h2>Remove {api?.name ?? 'this API'}?</h2>
				<p>
					This will permanently delete the saved API and remove it from your vault.
					The action can’t be undone.
				</p>
				<div className={styles.footer}>
					<Button variant="secondary" type="button" onClick={onClose} disabled={isDeleting}>
						Cancel
					</Button>
					<Button variant="danger" type="button" onClick={onConfirm} loading={isDeleting}>
						Delete
					</Button>
				</div>
			</div>
		</Modal>
	)
}