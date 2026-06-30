import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiAlertTriangle, FiPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout.jsx'
import SearchInput from '../components/ui/SearchInput.jsx'
import Button from '../components/ui/Button.jsx'
import SkeletonCard from '../components/ui/SkeletonCard.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import ApiCard from '../components/api/ApiCard.jsx'
import ApiFormModal from '../components/api/ApiFormModal.jsx'
import DeleteConfirmModal from '../components/api/DeleteConfirmModal.jsx'
import { useDebounce } from '../hooks/useDebounce.js'
import { useAuth } from '../hooks/useAuth.js'
import { createApi, deleteApi, getApis, searchApis, toggleFavourite, updateApi } from '../services/apiService.js'
import { normalizeApi, toErrorMessage } from '../utils/formatters.js'
import styles from './DashboardPage.module.css'

const EMPTY_FORM = {
	name: '',
	baseUrl: '',
	docsUrl: '',
	category: 'Authentication',
	description: '',
}

export default function DashboardPage() {
	const { isAuthenticated } = useAuth()
	const navigate = useNavigate()
	const [apis, setApis] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebounce(search, 300)
	const [modalOpen, setModalOpen] = useState(false)
	const [modalMode, setModalMode] = useState('create')
	const [activeApi, setActiveApi] = useState(null)
	const [formSubmitting, setFormSubmitting] = useState(false)
	const [formError, setFormError] = useState('')
	const [deleteTarget, setDeleteTarget] = useState(null)
	const [deleteLoading, setDeleteLoading] = useState(false)
	const [favouriteLoadingId, setFavouriteLoadingId] = useState('')
	const [optimisticRemovingIds, setOptimisticRemovingIds] = useState(new Set())
	const requestIdRef = useRef(0)

	useEffect(() => {
		if (!isAuthenticated) {
			navigate('/login', { replace: true })
		}
	}, [isAuthenticated, navigate])

	const visibleApis = useMemo(() => {
		return [...apis]
			.filter((api) => !optimisticRemovingIds.has(api._id))
			.sort((left, right) => {
				if (left.favourite !== right.favourite) {
					return Number(right.favourite) - Number(left.favourite)
				}

				return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
			})
	}, [apis, optimisticRemovingIds])

	const stats = useMemo(() => {
		const favourites = visibleApis.filter((api) => api.favourite).length
		return {
			total: visibleApis.length,
			favourites,
			categories: new Set(visibleApis.map((api) => api.category)).size,
		}
	}, [visibleApis])

	const refreshApis = async (query = debouncedSearch) => {
		const requestId = ++requestIdRef.current
		setLoading(true)
		setError('')

		try {
			const result = query.trim() ? await searchApis(query.trim()) : await getApis()
			if (requestId !== requestIdRef.current) {
				return
			}
			setApis(result.map(normalizeApi))
		} catch (requestError) {
			if (requestId !== requestIdRef.current) {
				return
			}
			setError(toErrorMessage(requestError, 'Unable to load your vault right now.'))
		} finally {
			if (requestId !== requestIdRef.current) {
				return
			}
			setLoading(false)
		}
	}

	useEffect(() => {
		void refreshApis(debouncedSearch)
	}, [debouncedSearch])

	const openCreateModal = () => {
		setActiveApi(null)
		setModalMode('create')
		setFormError('')
		setModalOpen(true)
	}

	const openEditModal = (api) => {
		setActiveApi(api)
		setModalMode('edit')
		setFormError('')
		setModalOpen(true)
	}

	const closeModals = () => {
		if (formSubmitting) {
			return
		}

		setModalOpen(false)
		setDeleteTarget(null)
		setFormError('')
	}

	const handleSubmit = async (form) => {
		setFormSubmitting(true)
		setFormError('')

		const payload = {
			name: form.name.trim(),
			baseUrl: form.baseUrl.trim(),
			docsUrl: form.docsUrl.trim(),
			category: form.category.trim(),
			description: form.description.trim(),
		}

		if (modalMode === 'create') {
			try {
				await createApi(payload)
				setModalOpen(false)
				await refreshApis(debouncedSearch)
			} catch (requestError) {
				setFormError(toErrorMessage(requestError, 'Could not create this API.'))
			} finally {
				setFormSubmitting(false)
			}

			return
		}

		const nextApi = { ...activeApi, ...payload }
		setApis((current) => current.map((item) => (item._id === activeApi._id ? normalizeApi(nextApi) : item)))
		setModalOpen(false)

		try {
			const savedApi = await updateApi(activeApi._id, payload)
			if (savedApi) {
				setApis((current) => current.map((item) => (item._id === activeApi._id ? normalizeApi(savedApi) : item)))
			}
		} catch (requestError) {
			setApis((current) => current.map((item) => (item._id === activeApi._id ? activeApi : item)))
			setFormError(toErrorMessage(requestError, 'Could not update this API.'))
			setModalOpen(true)
		} finally {
			setFormSubmitting(false)
		}
	}

	const handleDeleteRequest = (api) => {
		setDeleteTarget(api)
	}

	const confirmDelete = async () => {
		if (!deleteTarget) {
			return
		}

		const target = deleteTarget
		setDeleteLoading(true)
		setOptimisticRemovingIds((current) => new Set(current).add(target._id))

		try {
			await deleteApi(target._id)
			setApis((current) => current.filter((item) => item._id !== target._id))
			setDeleteTarget(null)
		} catch (requestError) {
			setOptimisticRemovingIds((current) => {
				const next = new Set(current)
				next.delete(target._id)
				return next
			})
			setDeleteTarget(null)
			setError(toErrorMessage(requestError, 'Could not delete this API.'))
		} finally {
			setDeleteLoading(false)
		}
	}

	const handleToggleFavourite = async (api) => {
		setFavouriteLoadingId(api._id)
		setApis((current) => current.map((item) => (item._id === api._id ? { ...item, favourite: !item.favourite } : item)))

		try {
			const savedApi = await toggleFavourite(api._id)
			if (savedApi) {
				setApis((current) => current.map((item) => (item._id === api._id ? normalizeApi(savedApi) : item)))
			}
		} catch (requestError) {
			setApis((current) => current.map((item) => (item._id === api._id ? api : item)))
			setError(toErrorMessage(requestError, 'Could not update favourite status.'))
		} finally {
			setFavouriteLoadingId('')
		}
	}

	return (
		<AppLayout onCreate={openCreateModal}>
			<div className={styles.page}>
				<section className={styles.hero}>
					<div>
						<p className={styles.eyebrow}>Workspace</p>
						<h1>Your API vault, organized for speed.</h1>
						<p>
							Search, save, and manage the APIs your team reaches for every day. Favourites stay
							within reach, edits are instantaneous, and every request stays authenticated.
						</p>
					</div>
					<div className={styles.stats}>
						<div>
							<strong>{stats.total}</strong>
							<span>Saved APIs</span>
						</div>
						<div>
							<strong>{stats.favourites}</strong>
							<span>Favourites</span>
						</div>
						<div>
							<strong>{stats.categories}</strong>
							<span>Categories</span>
						</div>
					</div>
				</section>

				<section className={styles.toolbar}>
					<SearchInput value={search} onChange={(event) => setSearch(event.target.value)} />
					<Button onClick={openCreateModal} icon={<FiPlus />}>
						Create API
					</Button>
				</section>

				{error ? (
					<ErrorState
						title="We hit a vault sync issue"
						description={error}
						onRetry={() => refreshApis(debouncedSearch)}
					/>
				) : null}

				{loading ? (
					<div className={styles.grid}>
						{Array.from({ length: 6 }).map((_, index) => (
							<SkeletonCard key={index} />
						))}
					</div>
				) : visibleApis.length ? (
					<AnimatePresence mode="popLayout">
						<div className={styles.grid}>
							{visibleApis.map((api) => (
								<ApiCard
									key={api._id}
									api={api}
									onEdit={openEditModal}
									onDelete={handleDeleteRequest}
									onToggleFavourite={handleToggleFavourite}
									isDeleting={optimisticRemovingIds.has(api._id)}
									isUpdatingFavourite={favouriteLoadingId === api._id}
								/>
							))}
						</div>
					</AnimatePresence>
				) : (
					<EmptyState
						title={search.trim() ? 'No APIs matched your search' : 'Your vault is empty'}
						description={
							search.trim()
								? 'Try a broader query or clear the search to see every saved API.'
								: 'Save your most-used APIs here so the team can find them instantly.'
						}
						actionLabel="Create API"
						onAction={openCreateModal}
					/>
				)}
			</div>

			<ApiFormModal
				open={modalOpen}
				mode={modalMode}
				initialValues={activeApi ?? EMPTY_FORM}
				onClose={closeModals}
				onSubmit={handleSubmit}
				isSubmitting={formSubmitting}
				error={formError}
			/>

			<DeleteConfirmModal
				open={Boolean(deleteTarget)}
				api={deleteTarget}
				onClose={closeModals}
				onConfirm={confirmDelete}
				isDeleting={deleteLoading}
			/>
		</AppLayout>
	)
}