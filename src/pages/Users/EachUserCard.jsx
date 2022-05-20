import moment from 'moment'
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AdminMessager from '../../components/AdminMessager/AdminMessager'
import ProfileComponent from '../../components/Profile/ProfileComponent'

export default function EachUserCard({ user }) {
	// const [showEmail, setShowEmail] = useState(false)
	const [showMessaer, setShowMessager] = useState(false)
	const [showProfile, setShowProfile] = useState(false)
	return (
		<div className="card">
			<Modal show={showMessaer} onExit={() => setShowMessager(false)}>
				<Modal.Body>
					<AdminMessager user={user} done={() => setShowMessager(false)} />
					<button
						className="btn text-danger mt-3"
						onClick={() => setShowMessager(false)}
					>
						Cancel
					</button>
				</Modal.Body>
			</Modal>
			<Modal show={showProfile} onExit={() => setShowProfile(false)}>
				<Modal.Header>
					<button
						className="btn btn-danger"
						onClick={() => setShowProfile(false)}
					>
						Close
					</button>
				</Modal.Header>
				<div className="container">
					<ProfileComponent standalone _user_id={user?.id} />
				</div>
				<button
					className="btn text-danger mt-3"
					onClick={() => setShowProfile(false)}
				>
					Cancel
				</button>
			</Modal>
			<div className="card-body">
				<div className="dropdown float-end">
					<a
						className="text-muted dropdown-toggle font-size-16"
						href="#c"
						role="button"
						data-bs-toggle="dropdown"
						aria-haspopup="true"
					>
						<i className="bx bx-dots-horizontal-rounded"></i>
					</a>
					<div className="dropdown-menu dropdown-menu-end">
						<a className="dropdown-item" href="#c">
							Edit
						</a>
						<a className="dropdown-item" href="#c">
							Action
						</a>
						<a className="dropdown-item" href="#c">
							Remove
						</a>
					</div>
				</div>
				<div
					className="d-flex align-items-center"
					onClick={() => setShowProfile(true)}
				>
					<img
						src={user?.avatar_url}
						alt=""
						width="60"
						className=" rounded-circle img-thumbnail"
						loading="lazy"
					/>
					<div className="flex-1 ms-3">
						<h5 className="font-size-15 mb-1">
							{user?.first_name} {user?.last_name}
						</h5>
						<p className="text-muted mb-0">@{user?.username}</p>
					</div>
				</div>
				<div className="mt-3 pt-1">
					<p className="text-muted mb-0 mt-2">
						<i className=" font-size-15 align-middle pe-2 text-primary">#</i>
						{user?.id}
					</p>
					<p className="text-muted mb-0">
						<i className="mdi font-size-15 align-middle pe-2 text-primary">
							Joined
						</i>
						{moment(user?.created_at).fromNow()}
					</p>
					<p className="text-muted mb-0 mt-2">
						<i className="mdi mdi-email font-size-15 align-middle pe-2 text-primary"></i>
						{user?.email}
					</p>
					<p className="text-muted mb-0 mt-2">
						<i className="mdi mdi-send font-size-15 align-middle pe-2 text-primary"></i>
						N {window.formatedPrice.format(user?.budget)}
					</p>
				</div>
			</div>

			<div className="btn-group" role="group">
				<button
					type="button"
					className="btn btn-outline-light text-truncate"
					onClick={() => setShowMessager(true)}
				>
					<i className="uil uil-user me-1"></i> Message
				</button>
				<button type="button" className="btn btn-outline-light text-truncate">
					<i className="uil uil-envelope-alt me-1"></i> Call
				</button>
			</div>
		</div>
	)
}
