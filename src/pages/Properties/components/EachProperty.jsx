import React, { useState } from 'react'
import { DeleteFirebaseImage } from '../../../services/FirebaseService'
import PropertyService from '../../../services/PropertyService'
import { Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function EachProperty({ data }) {
	const [deleted, setDeleted] = useState(false)
	const [askDelete, setAskDelete] = useState(false)
	const [deleteLoading, setDeleteLoading] = useState(false)
	const handleDelete = async () => {
		try {
			setDeleteLoading(true)
			const res = await PropertyService.deleteProperty(data?.id)
			res.data.image_urls.map((_, i) => {
				DeleteFirebaseImage(
					`images/properties/${data?.agent.id}/${data?.uid}/image_${i}`
				)
			})
			if (res) {
				setDeleteLoading(false)
			}
			setDeleted(true)
		} catch (error) {
			setDeleteLoading(false)
			console.log('ERROR --', error)
			return Promise.reject(error)
		}
	}

	if (deleted) {
		return null
	}

	return (
		<div className="card shadow" style={{ zIndex: 0 }}>
			<Modal
				show={askDelete}
				// onHide={() => setAskDelete(false)}
				style={{ paddingTop: '30vh' }}
			>
				<Modal.Body className="text-center">
					<h3>Are you sure you want to delete?</h3>
					<button
						disabled={deleteLoading}
						className="w-50 btn btn-lg btn-danger mb-4 mt-4"
						onClick={handleDelete}
					>
						{deleteLoading ? 'Loading....' : 'Delete'}
					</button>
					<br />
					<button
						disabled={deleteLoading}
						className="w-50 btn btn-lg btn-success"
						onClick={() => setAskDelete(false)}
					>
						Cancel
					</button>
				</Modal.Body>
			</Modal>
			<div className="card-body p-0">
				<div className="pricing-badge">
					<span className="badge text-white bg-primary">
						{data?.service?.name}
					</span>
				</div>
				<div
					className="product-img position-relative"
					style={{
						backgroundImage: `url(${data?.image_urls[0]})`,
						height: '200px',
						backgroundRepeat: 'no-repeat',
						backgroundSize: '100%',
						backgroundPosition: 'center',
					}}
				>
					{/* <img
						src={data.image_urls[0]}
						alt=""
						className="img-fluid mx-auto d-block"
					/> */}
				</div>
				<div className="p-3">
					<div className=" justify-content-between align-items-end mt-4">
						<div>
							<h5 className="mb-3 text-truncate">
								<a href="#c" className="text-dark fw-700">
									{data?.name}
								</a>
							</h5>
							<h5 className="my-0">
								<span className="me-2">
									<small>${data?.price}</small>
								</span>{' '}
								<b className="badge badge-sm bg-primary">
									{data?.categorie?.name}
								</b>
							</h5>
						</div>
					</div>
					<p className="text-muted mb-0 mt-4">
						<div className="d-flex flex-wrap gap-2">
							<Link to={`/properties/edit/${data?.id}`}>
								<button
									type="button"
									className="btn btn-primary waves-effect btn-label waves-light"
								>
									<i className="bx bx-pen label-icon"></i> Edit
								</button>
							</Link>
							<button
								onClick={() => setAskDelete(true)}
								type="button"
								className="btn btn-danger waves-effect btn-label waves-light ml-4"
							>
								<i className="bx bx-trash label-icon"></i> Delete
							</button>
						</div>
					</p>
				</div>
			</div>
		</div>
	)
}
