import { Link } from "react-router-dom"

export default class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true }
	}

	componentDidCatch(error, errorInfo) {
		// You can also log the error to an error reporting service
		logErrorToMyService(error, errorInfo)
	}

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return (
				<div className="my-5 pt-5">
					<div className="container">
						<div className="row">
							<div className="col-lg-12">
								<div className="text-center mb-5 pt-5">
									<h1 className="error-title mt-5">
										<span>500!</span>
									</h1>
									<h4 className="text-uppercase mt-5">Internal Server Error</h4>
									<p className="font-size-15 mx-auto text-muted w-50 mt-4">
										This might be due to slow network connection or
										an error occurred within the application 
									</p>
									<div className="mt-5 text-center">
										<Link
											className="btn btn-primary waves-effect waves-light"
											to="/"
										>
											Back to Dashboard
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		}

		return this.props.children
	}
}
