import moment from 'moment'
import React from 'react'

export default function EachNotificationSM({ data }) {
	const user = data.users_permissions_user

	return (
		<a href="#!" className="text-reset notification-item">
			<div className="d-flex">
				<div className="flex-shrink-0 me-3">
					<img
						src={user?.avatar_url || 'https://picsum.photos/200/200'}
						className="rounded-circle avatar-sm"
						alt="user-pic"
					/>
				</div>
				<div className="flex-grow-1">
					<h6 className="mb-1">{user?.first_name || "Someone"}</h6>
					<div className="font-size-13 text-muted">
						<p className="mb-1">{data?.title}</p>
						<p className="mb-0">
							<i className="mdi mdi-clock-outline"></i> <span>{moment(data?.created_at).fromNow()}</span>
						</p>
					</div>
				</div>
			</div>
		</a>
	)
}
