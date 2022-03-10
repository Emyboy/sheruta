import moment from 'moment'
import React from 'react'

export default function EachSubscribtionUser({ sub }) {
	const user = sub?.users_permissions_user
	const plan = sub?.payment_plan

	if (!user) {
		return
	}
	console.log('EACH SUB USER ---', user);
	return (
		<div className="pb-4">
			<div className="d-flex align-items-center">
				<div className="avatar-md me-4">
					<img
						src={user.avatar_url}
						className="img-fluid rounded-circle"
						alt=""
					/>
				</div>
				<div className="flex-grow-1">
					<h5 className="font-size-15 mb-1">
						<a href="#c" className="text-dark pr-2">
							{user?.first_name?.split(' ')[0]} {user.last_name}
						</a>
					</h5>
					<span className="text-muted">{user.username}</span><br />
					<small>{moment(sub.created_at).fromNow()}</small>
				</div>
				<div className="flex-shrink-0 text-end">
					<div>
						<small className="badge bg-info ml-1 text-dark shadow">
							{plan?.name}
						</small>
						<br />
					</div>
					{/* <div className="dropdown align-self-start">
					<a
						className="dropdown-toggle"
						href="#"
						role="button"
						data-bs-toggle="dropdown"
						aria-haspopup="true"
						aria-expanded="false"
					>
						<i className="bx bx-dots-vertical-rounded font-size-24 text-dark"></i>
					</a>
					<div className="dropdown-menu">
						<a className="dropdown-item" href="#c">
							Copy
						</a>
						<a className="dropdown-item" href="#c">
							Save
						</a>
						<a className="dropdown-item" href="#c">
							Forward
						</a>
						<a className="dropdown-item" href="#c">
							Delete
						</a>
					</div>
				</div> */}
				</div>
			</div>
		</div>
	)
}
