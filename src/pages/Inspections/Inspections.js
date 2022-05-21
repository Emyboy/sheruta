import React from 'react'
import { useSelector } from 'react-redux'
import Layout from '../../components/Layout/Layout'
import EachInspection from './EachInspection'

export default function Inspections() {
	const { inspections } = useSelector((state) => state.view)

	return (
		<Layout>
			<div className="row align-items-center">
				<div className="col-md-6">
					<div className="mb-3">
						<h5 className="card-title">
							Inspections{' '}
							<span className="text-muted fw-normal ms-2">
								({inspections?.length})
							</span>
						</h5>
					</div>
				</div>

				<div className="col-md-6">
					<div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
						<div>
							{/* <ul className="nav nav-pills">
								<li className="nav-item">
									<a
										className="nav-link active"
										href="apps-contacts-grid.html"
										data-bs-toggle="tooltip"
										data-bs-placement="top"
										title=""
										data-bs-original-title="Grid"
										aria-label="Grid"
									>
										<i className="bx bx-grid-alt"></i>
									</a>
								</li>
							</ul> */}
						</div>
						{/* <div>
							<a href="#" className="btn btn-secondary">
								<i className="bx bx-plus me-1"></i> Add New
							</a>
						</div> */}
					</div>
				</div>
			</div>
			<div className="row">
				{inspections.map((val, i) => {
					return (
						<div className="col-sm-12 col-md-6" key={`inspection-${i}`}>
							<EachInspection data={val} />
						</div>
					)
				})}
			</div>
		</Layout>
	)
}
