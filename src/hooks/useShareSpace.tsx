import useCommon from './useCommon'

export default function useShareSpace() {
	const { showToast } = useCommon()

	const copyShareUrl = (url: string, title: string, text: string): void => {
		if (
			typeof window !== 'undefined' &&
			typeof window.navigator !== 'undefined' &&
			typeof window.location !== 'undefined'
		) {
			navigator.share({
				title,
				text,
				url,
			})

			navigator.clipboard
				.writeText(window.location.origin + url)
				.then(() => {
					showToast({
						message: 'Link has been copied successfully',
						status: 'info',
					})
				})
				.catch((err) => {
					showToast({
						message: 'Failed to copy the link',
						status: 'error',
					})
					console.error('Could not copy text: ', err)
				})
		}
	}

	return copyShareUrl
}
