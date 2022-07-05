import React, { useState } from 'react'
import { DeleteFirebaseImage } from '../../../services/FirebaseService'
import PropertyService from '../../../services/PropertyService'
import { Modal, OverlayTrigger } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function EachProperty({ val }) {
	const [data, setData] = useState(val)
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
			toast.error('Error, please try again')
			console.log('ERROR --', error)
			return Promise.reject(error)
		}
	}

	const toggleAvailability = async () => {
		setDeleteLoading(true)
		try {
			const res = await PropertyService.toggleAvailability(
				!data?.is_available,
				data?.id
			)
			console.log(res.data)
			if (res.data) {
				setData(res.data)
				setDeleteLoading(false)
			}
		} catch (error) {
			toast.error('Error, please try again')
			setDeleteLoading(false)
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
									<small>
										₦ {window.formattedPrice.format(data.price)}
									</small>
								</span>{' '}
								<b className="badge badge-sm bg-primary">
									{data?.categorie?.name}
								</b>
							</h5>
						</div>
					</div>
					{!data?.is_available && (
						<h6 className="text-danger">Click Unavailable to make Available</h6>
					)}
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

							<button
								disabled={deleteLoading}
								onClick={() => toggleAvailability()}
								type="button"
								className={`btn btn-${
									data?.is_available ? 'success' : 'danger'
								} waves-effect waves-light ml-4`}
							>
								{data?.is_available ? 'Available' : 'Unavailable'}
							</button>
						</div>
					</p>
				</div>
			</div>
		</div>
	)
}
