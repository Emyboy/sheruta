import moment from 'moment'
import React, { useEffect } from 'react';
import NotificationService from '../../services/NotificationsService'

export default function EachNotification({ data }) {
	const user = data.users_permissions_user
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(async () => {
		try {
			if (!data?.seen) {
				setTimeout(() => {
					NotificationService.markNotificationAsSeen(data?.id)
				}, 2000)
			}
		} catch (error) {
			return Promise.reject(error)
		}
	}, [data])
	return (
		<div className="d-flex align-items-center pb-4">
			<div className="avatar-md me-4">
				<img
					src={user?.avatar_url || 'https://picsum.photos/200/200'}
					className="img-fluid rounded-circle"
					alt=""
				/>
			</div>
			<div className="flex-grow-1">
				<h5 className="font-size-15 mb-1">
					<a href="#c" className="text-dark">
						{user?.first_name || "Someone"}
					</a>
				</h5>
				<span className="text-muted">{data?.title}</span>{' '}
				<span className="text-muted">
					<b>{moment(data?.created_at).fromNow()}</b>
				</span>
			</div>
			{!data?.seen && (
				<div className="flex-shrink-0 text-end">
					<div className="dropdown align-self-start">
						<a className="badge shadow bg-primary" href="#c">
							<b>NEW</b>
						</a>
					</div>
				</div>
			)}
		</div>
	)
}
