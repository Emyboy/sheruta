import React from 'react'
import { Link } from 'react-router-dom'

export default function PageNotFound() {
	return (
		<div className="my-5 pt-5">
			<div className="container">
				<div className="row">
					<div className="col-lg-12">
						<div className="text-center mb-5 pt-5">
							<h1 className="error-title mt-5">
								<span>404!</span>
							</h1>
							<h4 className="text-uppercase mt-5">Sorry, page not found</h4>
							<p className="font-size-15 mx-auto text-muted w-50 mt-4">
								It will be as simple as Occidental in fact, it will Occidental
								to an English person
							</p>
							<div className="mt-5 text-center">
								<Link
									to="/"
									className="btn btn-primary waves-effect waves-light"
									href="index.html"
								>
									Back to Home
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
