import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function EachContact({ data }) {
	const user = data?.users_permissions_user

	const [showMenu, setShowMenu] = useState(false)

	return (
		<div className="d-flex align-items-center pb-4">
			<div className="avatar-md me-4">
				<img
					src={user?.avatar_url}
					className="img-fluid rounded-circle"
					alt=""
				/>
			</div>
			<div className="flex-grow-1">
				<h5 className="font-size-15 mb-1">
					<Link to={`/user/${user?.id}`} className="text-dark">
						{user?.first_name?.split(' ')[0]}
					</Link>
				</h5>
				<span className="text-muted">@{user?.username}</span>
			</div>
			<div className="flex-shrink-0 text-end">
				<div className="dropdown align-self-start">
					<a
						onClick={() => setShowMenu(!showMenu)}
						className="dropdown-toggle"
						role="button"
						data-bs-toggle="dropdown"
						aria-haspopup="true"
						aria-expanded="false"
					>
						<i className="bx bx-dots-vertical-rounded font-size-24 text-dark"></i>
					</a>
					<div
						className={`dropdown-menu ${showMenu && 'show'}`}
						style={{ right: '30px' }}
					>
						<a className="dropdown-item" href={`tel: ${user?.phone_number}`}>
							Call Me
						</a>
						
					</div>
				</div>
			</div>
		</div>
	)
}
