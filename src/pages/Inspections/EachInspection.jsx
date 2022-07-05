import React, { useState } from 'react'
import MomentHelper from '../../helpers/MomentHelper'
import { Modal } from 'react-bootstrap'
import InspectionService from '../../services/InspectionService'
import { useDispatch, useSelector } from 'react-redux'
import { getAllInspections } from '../../redux/actions/view.action'
import { Link } from 'react-router-dom'
import { AiFillPhone } from 'react-icons/ai'
import toast from 'react-hot-toast'

export const renderInspectionStatus = (status) => {
	switch (status) {
		case 'pending':
			return 'warning'
		case 'open':
			return 'secondary'
		case 'ongoing':
			return 'success'
		case 'ended':
			return 'danger'
		default:
			return 'danger'
	}
}

export const calculateGroupBudget = (data) => {
	let holder = parseInt(data?.owner?.budget)

	data?.guests?.forEach((val, i) => {
		if (val?.budget) {
			holder = parseInt(val?.budget) + holder
		}
	})
	return holder
}

export default function EachInspection({ data }) {
	const [showReason, setShowReason] = useState(false)
	const [reason, setReason] = useState(null)
	const [status, setStatus] = useState('accepted')
	const [loading, setLoading] = useState(false)
	const dispatch = useDispatch()
	const { agent } = useSelector((state) => state.auth)
	const [showUsers, setShowUsers] = useState(false)

	const takeAction = async () => {
		setLoading(true)
		try {
			const res = await InspectionService.acceptOrRejectInspection(
				data?.id,
				status,
				reason
			)
			if (res.data) {
				dispatch(getAllInspections(agent?.id))
				setLoading(false)
				setShowReason(false)
				toast.success('Your message was sent')
			}
			console.log('RES --', res.data)
		} catch (error) {
			toast.error('Error, please try again')
			setLoading(false)
			return Promise.reject(error)
		}
	}

	const handleButtonClick = (stats) => {
		setStatus(stats)
		setReason(null)
		setShowReason(true)
	}

	return (
		<div className="card task-box" id="cmptask-2">
			<Modal show={showUsers}  onHide={() => setShowUsers(false)}>
				<Modal.Body>
					<div className="text-center">
						<h3>Users</h3>
						<h6>Reach out to users to make sure they are on schedule.</h6>
					</div>
					<hr />
					{[data?.owner, ...data.guests].map((val, i) => {
						return (
							<div className="border-bottom-3 border-gray border pt-3 pb-3">
								<div className="container-fluid">
									<div className="row">
										<div className="col-3 col-sm-3 d-flex justify-content-end">
											<img
												src={val?.avatar_url}
												alt="User Pics"
												class="avatar-lg rounded-circle img-thumbnail"
											/>
										</div>
										<div className="col-7 col-md-6">
											<h5>{val?.first_name}</h5>
											{val?.id === data?.owner?.id && (
												<span
													className="badge bg-success"
													style={{
														position: 'absolute',
														top: '-10px',
														left: '-90px',
													}}
												>
													Group Admin
												</span>
											)}
											<h6>
												<strong>Budget: </strong>₦
												{window.formattedPrice.format(val?.budget)}
											</h6>
										</div>
										<a
											href={`tel:${val?.phone_number}`}
											className="btn text-success"
											style={{
												position: 'absolute',
												left: '80%',
												width: '50px',
											}}
										>
											<AiFillPhone size={30} />
										</a>
									</div>
								</div>
							</div>
						)
					})}
					<button
						className="btn btn-lg w-100 text-danger mt-5"
						onClick={() => setShowUsers(false)}
					>
						Close
					</button>
				</Modal.Body>
			</Modal>
			<Modal show={showReason} size="lg">
				<Modal.Body className="text-center">
					<h3>
						{status === 'accept'
							? 'Please leave them a message'
							: 'Please give them a reason why you rejected.'}
					</h3>
					<h6 className="text-danger">Required *</h6>
					<textarea
						className="form-control mt-4 mb-5"
						rows={'5'}
						placeholder={
							status === 'accept'
								? 'Ex. Please come on time.'
								: "Because I won't be available"
						}
						onChange={(e) => setReason(e.target.value)}
					/>
					<button
						className="btn btn-lg btn-primary w-50"
						disabled={loading || !reason}
						onClick={takeAction}
					>
						Send
					</button>
					<br />
					<button
						className="btn text-danger mt-4"
						onClick={() => setShowReason(false)}
					>
						Cancel
					</button>
				</Modal.Body>
			</Modal>
			<div className="card-body">
				<div className="float-end ms-2">
					<span
						className={`badge rounded-pill badge-soft-${renderInspectionStatus(
							data?.status
						)} font-size-12`}
						id="task-status"
						style={{ textTransform: 'capitalize' }}
					>
						{data?.status}
					</span>
				</div>
				<div>
					<h5 className="font-size-14">
						<a className="text-dark" id="task-name">
							{data?.date
								? new Date(data?.date)
										.toDateString()
										.split(new Date().getFullYear())[0]
								: 'No Date Set'}
						</a>
					</h5>
					<p className="text-muted">
						{MomentHelper.convertTimeTo12Hurs(data?.time)}
					</p>
				</div>

				<ul className="list-inline mb-4">
					<li className="list-inline-item">
						<a href="javascript: void(0);">
							<div>
								<img
									src={data?.property?.image_urls[0]}
									className="rounded"
									alt="Property"
									height="48"
								/>
							</div>
						</a>
					</li>
					<li className="list-inline-item">
						<a>
							<div>
								<img
									src={data?.property?.image_urls[1]}
									className="rounded"
									alt="Property"
									height="48"
								/>
							</div>
						</a>
					</li>
					<li className="list-inline-item">
						<a>
							<div>
								<img
									src={data?.property?.image_urls[2]}
									className="rounded"
									alt="Property"
									height="48"
								/>
							</div>
						</a>
					</li>
					<li className="list-inline-item">
						<a>
							<div>
								<img
									src={data?.property?.image_urls[3]}
									className="rounded"
									alt="Property"
									height="48"
								/>
							</div>
						</a>
					</li>
				</ul>

				<div className="avatar-group float-start task-assigne">
					<div className="avatar-group-item">
						<a className="d-inline-block" value="member-4">
							<img
								src={data?.owner?.avatar_url}
								alt="group owner"
								className="rounded-circle avatar-sm"
							/>
						</a>
					</div>
					{data?.guests?.map((val, i) => {
						if (i < 2) {
							return (
								<div className="avatar-group-item" key={`guest-${i}`}>
									<a
										href="javascript: void(0);"
										className="d-inline-block"
										value="member-4"
									>
										<img
											src={val?.avatar_url}
											alt="user"
											className="rounded-circle avatar-sm"
										/>
									</a>
								</div>
							)
						}
					})}

					{data?.guests?.length > 2 && (
						<div className="avatar-group-item">
							<a href="javascript: void(0);" className="d-inline-block">
								<div className="avatar-sm">
									<span className="avatar-title rounded-circle bg-pink text-white font-size-16">
										{data?.guests?.length - 2}+
									</span>
								</div>
							</a>
						</div>
					)}
				</div>
				<div className="text-end">
					<p className="mb-0 text-muted">Total Group Budget</p>
					<h5 className="font-size-15 mb-1" id="task-budget">
						₦ {window.formattedPrice.format(calculateGroupBudget(data))}
					</h5>
				</div>
				<div className="text-center d-grid mt-4">
					<div className="btn-group">
						{data?.status === 'pending' && (
							<>
								<button
									onClick={() => handleButtonClick('reject')}
									disabled={loading}
									className="btn btn-danger waves-effect waves-light addtask-btn"
									data-bs-toggle="modal"
									data-bs-target=".bs-example-modal-lg"
									data-id="#complete-task"
								>
									<i className="mdi mdi-close me-1"></i> Reject
								</button>
								<button
									onClick={() => handleButtonClick('accept')}
									disabled={loading}
									className="btn btn-primary waves-effect waves-light addtask-btn"
									data-bs-toggle="modal"
									data-bs-target=".bs-example-modal-lg"
									data-id="#complete-task"
								>
									<i className="mdi mdi-check me-1"></i> Accept
								</button>
							</>
						)}
						{data?.status === 'ongoing' && (
							<>
								<span
									onClick={() => setShowUsers(true)}
									className="btn btn-lg text-primary waves-effect waves-light addtask-btn"
								>
									<i className="mdi mdi-eye me-1"></i> Show Users
								</span>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
