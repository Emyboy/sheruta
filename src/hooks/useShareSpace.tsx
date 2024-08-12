import useCommon from './useCommon'

export default function useShareSpace() {
	const { showToast } = useCommon();

	const copyShareUrl = async (url: string, title: string = '', text: string = ''): Promise<void> => {
		if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
			try {
				if (navigator?.share) {
					await navigator.share({
						title,
						text,
						url,
					});
				} else {
					await navigator.clipboard.writeText(window.location.origin + url);
					showToast({
						message: 'Link has been copied successfully',
						status: 'info',
					});
				}
			} catch (error) {
				showToast({
					message: 'Failed to share or copy the link. Please try again.',
					status: 'error',
				});
				console.error('Error sharing or copying URL:', error);
			}
		}
	};

	return copyShareUrl;
}
