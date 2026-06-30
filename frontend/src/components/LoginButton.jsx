import { GoogleLogin } from '@react-oauth/google'

export default function LoginButton({ loading, onSuccess, onError }) {
	const handleSuccess = async (credentialResponse) => {
		const credential = credentialResponse?.credential

		if (!credential) {
			onError('Google did not return a credential. Please try again.')
			return
		}

		await onSuccess(credential)
	}

	return (
		<div className="login-button-wrap" aria-busy={loading}>
			{/* Google handles the visual login button; we only wire the auth callback. */}
			<GoogleLogin onSuccess={handleSuccess} onError={() => onError('Google sign-in was cancelled.')} />
		</div>
	)
}
