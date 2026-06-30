import { FiSearch } from 'react-icons/fi'
import styles from './SearchInput.module.css'

export default function SearchInput({ value, onChange, placeholder = 'Search saved APIs' }) {
	return (
		<label className={styles.search}>
			<FiSearch aria-hidden="true" />
			<input value={value} onChange={onChange} placeholder={placeholder} />
		</label>
	)
}