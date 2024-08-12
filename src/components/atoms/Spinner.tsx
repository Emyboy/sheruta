import { useEffect } from 'react'

export default function Spinner() {
	useEffect(() => {
		async function getLoader() {
			const { lineSpinner } = await import('ldrs')
			lineSpinner.register()
		}
		getLoader()
	}, [])

	return (
		<l-line-spinner
			size="40"
			stroke="3"
			speed="1"
			color="#80FF00"
		></l-line-spinner>
	)
}
