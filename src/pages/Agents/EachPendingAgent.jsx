import { notification } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { getPendingAgents } from '../../redux/actions/agent.action'
import AgentService from '../../services/AgentService'

export default function EachAgent({ data }) {
	console.log('data --', data)
	const user = data?.users_permissions_user
	const [openReject, setOpenReject] = useState(false)
	const [loading, setLoading] = useState(false)
	const [reason, setReason] = useState(null)
	const [showDetails, setShowDetails] = useState(false)
	const dispatch = useDispatch()
	const { location_keywords, states } = useSelector((state) => state.view)

	const handleReject = async (e) => {
		e.preventDefault()
		setLoading(true)
		console.log('ABOUT TO REJECT --', {
			user: user?.id,
			agent: data?.agent?.id,
			reason,
		})
		try {
			const res = await AgentService.rejectPendingAgent(
				user?.id,
				data?.agent?.id,
				reason
			)
			console.log('RES --', res)
			notification.success({ message: 'Rejection sent' })
			if (res) {
				dispatch(getPendingAgents())
				setOpenReject(false)
				setLoading(false)
			}
		} catch (error) {
			setLoading(false)
			setOpenReject(false)
			notification.error({ message: 'Error, please try again' })
			return Promise.reject(error)
		}
	}

	const acceptAgentRequest = async () => {
		setLoading(true)
		try {
			const res = await AgentService.acceptPendingAgent(user?.id)
			console.log(res)
			if (res) {
				setLoading(false)
				dispatch(getPendingAgents())
				notification.success({ message: 'Accepted' })
			}
		} catch (error) {
			setLoading(false)
			notification.error({ message: 'Error, please try again' })
			return Promise.reject(error)
		}
	}

	return (
		<div className="col-xl-4 col-sm-6 col-md-6">
			<Modal
				show={showDetails}
				onHide={() => setShowDetails(false)}
				size={'lg'}
			>
				<Modal.Header closeButton>
					<Modal.Title>{user?.first_name}'s information</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="row justify-content-evenly">
						<div className="col-md-6 mb-3">
							<div
								className="w-100 rounded"
								style={{
									height: '300px',
									width: '300px',
									backgroundImage: `url(${user?.avatar_url})`,
									backgroundSize: 'cover',
									backgroundPosition: 'top',
								}}
							/>
						</div>
						<div className="col-md-5">
							<div className="">
								<h2>
									{user?.first_name} {user?.last_name}
								</h2>
							</div>
							<ul className="list-inline mb-4">
								<li className="list-inline-item me-3">
									<a href="javascript: void(0);" className="text-muted">
										<i className="bx bx-phone align-middle text-muted me-1"></i>{' '}
										{user?.phone_number}
									</a>
								</li>
								<li className="list-inline-item me-3">
									<a href="javascript: void(0);" className="text-muted">
										<i className="bx bx-comment-dots align-middle text-muted me-1"></i>{' '}
										{user?.email}
									</a>
								</li>
							</ul>
							<h5 className="card-title mb-2">Location Keyword</h5>
							<div>
								{location_keywords && states && (
									<div className="d-flex flex-wrap gap-2 font-size-18">
										<a href="#" className="badge badge-soft-primary">
											{
												location_keywords?.filter(
													(x) => x?.id == data?.agent?.location_keyword
												)[0]?.name
											}
										</a>
										<a
											href="#"
											className="badge badge-soft-primary font-size-1"
										>
											{
												states?.filter((x) => x?.id == data?.agent?.state)[0]
													?.name
											}
										</a>
									</div>
								)}
								<h5 className="mt-2 text-muted" style={{ fontWeight: '400' }}>
									{data?.agent?.location}
								</h5>
							</div>
							<hr />
							<h5 className="card-title mb-2">Brand Information</h5>

							<h5 className="text-muted">{data?.agent?.name} </h5>
							<h5 className="text-muted">
								N {window.formattedPrice.format(data?.agent?.inspection_fee)}{' '}
								<small>Inspection Fee</small>
							</h5>
							<h5 className="text-muted">
								{window.formattedPrice.format(data?.agent?.inspection_count)}{' '}
								<small>Inspections</small>
							</h5>
						</div>
						<hr />
						<h2 className='mb-4'>ID Cards</h2>
						<div className="row">
							<div className="col-md-6 mb-3">
								<div
									className="w-100 rounded"
									style={{
										height: '300px',
										width: '300px',
										backgroundImage: `url(${data?.agent?.id_image_front})`,
										backgroundSize: 'cover',
										backgroundPosition: 'top',
									}}
								/>
							</div>
							<div className="col-md-6 mb-3">
								<div
									className="w-100 rounded"
									style={{
										height: '300px',
										width: '300px',
										backgroundImage: `url(${data?.agent?.id_image_back})`,
										backgroundSize: 'cover',
										backgroundPosition: 'top',
									}}
								/>
							</div>
						</div>
					</div>
				</Modal.Body>
			</Modal>
			<Modal show={openReject}>
				<Modal.Body>
					<h3 className="mb-4">Why are we rejecting?</h3>

					<form onSubmit={handleReject}>
						<p className="mb-0">
							Hi <b>{user?.first_name}</b>, Your agent request was rejected
							because
						</p>
						<textarea
							placeholder="We don't like your face 😂"
							className="form-control"
							rows={6}
							defaultValue={reason}
							onChange={(e) => setReason(e.target.value)}
						/>
						<div className="d-flex">
							<button disabled={loading} className="btn btn-success mt-3 w-100">
								{loading ? 'Loading...' : 'Send'}
							</button>
							<button
								disabled={loading}
								type="button"
								className="btn text-danger mt-3 w-50 fw-bold"
								onClick={() => setOpenReject(false)}
							>
								Cancel
							</button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
			<div className="card">
				<div className="card-body">
					<div className="dropdown float-end">
						<a
							className="text-muted dropdown-toggle font-size-16"
							href="#"
							role="button"
							data-bs-toggle="dropdown"
							aria-haspopup="true"
						>
							<i className="mdi mdi-menu"></i>
						</a>
					</div>
					<div className="d-flex align-items-center">
						<div>
							<img
								src={user?.avatar_url}
								alt=""
								className="avatar-lg rounded-circle img-thumbnail"
							/>
						</div>
						<div className="flex-1 ms-3" onClick={() => setShowDetails(true)}>
							<h5 className="font-size-15 mb-1">
								<a href="#" className="text-dark">
									{user?.first_name} {user?.last_name}
								</a>
							</h5>
							<p className="text-muted mb-0">@{user?.username}</p>
						</div>
					</div>
					<div className="mt-3 pt-1">
						<p>
							<a
								className="text-muted mb-2"
								href={`tel: ${user?.phone_number}`}
							>
								<i className="mdi mdi-phone font-size-15 align-middle pe-2 text-primary"></i>
								{user?.phone_number}
							</a>
						</p>
						<p className="mt-3">
							<a className="text-muted mb-0" href={`mailto: ${user?.email}`}>
								<i className="mdi mdi-email font-size-15 align-middle pe-2 text-primary"></i>
								{user?.email}
							</a>
						</p>
						<p className="text-muted mb-0 mt-2">
							<i className="mdi mdi-calendar font-size-15 align-middle pe-2 text-primary"></i>
							{moment(data?.created_at).fromNow()}
						</p>
					</div>
				</div>

				<div className="btn-group" role="group">
					<button
						onClick={acceptAgentRequest}
						type="button"
						className="btn btn-outline-light text-white btn-success"
					>
						<i className="uil uil-user me-1"></i> Accept
					</button>
					<button
						type="button"
						onClick={() => setOpenReject(true)}
						className="btn btn-outline-light text-white btn-danger"
					>
						<i className="uil uil-envelope-alt me-1"></i> Reject
					</button>
				</div>
			</div>
		</div>
	)
}
