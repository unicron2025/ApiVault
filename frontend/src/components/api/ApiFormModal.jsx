import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { API_CATEGORIES } from '../../constants/apiCategories.js'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import styles from './ApiFormModal.module.css'

const EMPTY_FORM = {
	name: '',
	baseUrl: '',
	docsUrl: '',
	category: API_CATEGORIES[0],
	description: '',
}

export default function ApiFormModal({
	open,
	mode = 'create',
	initialValues = EMPTY_FORM,
	onClose,
	onSubmit,
	isSubmitting = false,
	error = '',
}) {
	const [form, setForm] = useState(initialValues)
	const [formError, setFormError] = useState('')

	useEffect(() => {
		if (open) {
			setForm({ ...EMPTY_FORM, ...initialValues })
			setFormError('')
		}
	}, [initialValues, open])

	const title = mode === 'create' ? 'Create API' : 'Edit API'

	const submitDisabled = useMemo(
		() => !form.name.trim() || !form.baseUrl.trim() || !form.docsUrl.trim() || !form.category.trim() || !form.description.trim(),
		[form],
	)

	const updateField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }))

	const handleSubmit = async (event) => {
		event.preventDefault()

		if (submitDisabled) {
			setFormError('All fields are required.')
			return
		}

		setFormError('')
		await onSubmit(form)
	}

	return (
		<Modal open={open} onClose={isSubmitting ? undefined : onClose}>
			<div className={styles.wrapper}>
				<div className={styles.header}>
					<div>
						<p className={styles.eyebrow}>{mode === 'create' ? 'New integration' : 'Update integration'}</p>
						<h2>{title}</h2>
					</div>
					<button type="button" className={styles.close} onClick={onClose} disabled={isSubmitting} aria-label="Close modal">
						×
					</button>
				</div>

				<form className={styles.form} onSubmit={handleSubmit}>
					<div className={styles.grid}>
						<label>
							<span>Name</span>
							<input value={form.name} onChange={updateField('name')} placeholder="Stripe APIs" />
						</label>
						<label>
							<span>Category</span>
							<select value={form.category} onChange={updateField('category')}>
								{API_CATEGORIES.map((category) => (
									<option key={category} value={category}>
										{category}
									</option>
								))}
							</select>
						</label>
					</div>

					<label>
						<span>Base URL</span>
						<input value={form.baseUrl} onChange={updateField('baseUrl')} placeholder="https://api.stripe.com" />
					</label>

					<label>
						<span>Documentation URL</span>
						<input value={form.docsUrl} onChange={updateField('docsUrl')} placeholder="https://docs.stripe.com/api" />
					</label>

					<label>
						<span>Description</span>
						<textarea value={form.description} onChange={updateField('description')} placeholder="Short description for quick recall..." rows={5} />
					</label>

					{error || formError ? <motion.p className={styles.error} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error || formError}</motion.p> : null}

					<div className={styles.footer}>
						<Button variant="secondary" type="button" onClick={onClose} disabled={isSubmitting}>
							Cancel
						</Button>
						<Button type="submit" loading={isSubmitting} disabled={submitDisabled && !isSubmitting}>
							{mode === 'create' ? 'Create API' : 'Save changes'}
						</Button>
					</div>
				</form>
			</div>
		</Modal>
	)
}