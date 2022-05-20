import moment from 'moment'
import React from 'react'
import { Link } from 'react-router-dom'

export default function EachRequest({ data }) {
	const user = data?.users_permissions_user;
	const lookingFor = data?.is_searching;
	return (
		<div className={`${!lookingFor && 'border-success border-2'} rounded mt-4 border p-4`}>
			<div className="row">
				<div className="col-xl-5 col-md-5">
					<div>
						<div className="d-flex">
							<img
								src={user?.avatar_url}
								className="avatar-sm rounded-circle"
								alt="img"
							/>
							<div className="flex-1 ms-4">
								<Link to={`/user/${user?.id}`}>
									<h5 className="mb-2 font-size-15 text-success">
										{user?.first_name}
									</h5>
								</Link>
								<h5 className="text-muted font-size-15">@{user?.username}</h5>
								<p className="text-muted">65 Followers, 86 Reviews</p>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-7 col-md-7">
					<div>
						<p className="text-muted mb-2">
							<h5>{data?.heading}</h5>
							<span>
								<i className="far fa-calendar-alt text-primary me-1"></i>{' '}
								{moment(data?.created_at).fromNow()}
							</span>
						</p>

						<p className="text-muted">{data?.body}</p>
						<ul className="text-success list-inline float-sm-end mb-sm-0">
							{data?.category && (
								<li className="list-inline-item">
									<a>
										{/* <i className="far fa-thumbs-up me-1"></i>{' '} */}
										{data?.category?.name}
									</a>
								</li>
							)}
							{' | '}
							{data?.service && (
								<li className="pl-2 list-inline-item">
									<a>
										{/* <i className="far fa-comment-dots me-1"></i>{' '} */}
										{data?.service?.name}
									</a>
								</li>
							)}
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}
