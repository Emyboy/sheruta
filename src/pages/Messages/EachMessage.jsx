import React from 'react'
import { useSelector } from 'react-redux'

export default function EachMessage() {
	const { user } = useSelector((state) => state.auth)

	return (
		<div>
			<li>
				<div className="conversation-list">
					<div className="d-flex">
						<img
							src="assets/images/users/avatar-3.jpg"
							className="rounded-circle avatar-sm"
							alt=""
						/>
						<div className="flex-1">
							<div className="ctext-wrap">
								<div className="ctext-wrap-content">
									<div className="conversation-name">
										<span className="time">10:00 AM</span>
									</div>
									<p className="mb-0">
										Good Morning Lorem ipsum dolor, sit amet consectetur
										adipisicing elit. Nulla beatae, hic iure culpa doloremque
										qui laudantium facilis architecto perferendis doloribus
										corrupti quos ex voluptates? Voluptatem aperiam est aliquid
										excepturi repellat.
									</p>
								</div>
								<div className="dropdown align-self-start">
									<a
										className="dropdown-toggle"
										href="#"
										role="button"
										data-bs-toggle="dropdown"
										aria-haspopup="true"
										aria-expanded="false"
									>
										<i className="bx bx-dots-vertical-rounded"></i>
									</a>
									<div className="dropdown-menu">
										<a className="dropdown-item" href="#">
											Copy
										</a>
										<a className="dropdown-item" href="#">
											Save
										</a>
										<a className="dropdown-item" href="#">
											Forward
										</a>
										<a className="dropdown-item" href="#">
											Delete
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</li>

			{/* SENT  */}
			<li className="right">
				<div className="conversation-list">
					<div className="d-flex">
						<div className="flex-1">
							<div className="ctext-wrap">
								<div className="ctext-wrap-content">
									<div className="conversation-name">
										<span className="time">10:02 AM</span>
									</div>
									<p className="mb-0">Good morning</p>
								</div>
								<div className="dropdown align-self-start">
									<a
										className="dropdown-toggle"
										href="#"
										role="button"
										data-bs-toggle="dropdown"
										aria-haspopup="true"
										aria-expanded="false"
									>
										<i className="bx bx-dots-vertical-rounded"></i>
									</a>
									<div className="dropdown-menu">
										<a className="dropdown-item" href="#">
											Copy
										</a>
										<a className="dropdown-item" href="#">
											Save
										</a>
										<a className="dropdown-item" href="#">
											Forward
										</a>
										<a className="dropdown-item" href="#">
											Delete
										</a>
									</div>
								</div>
							</div>
						</div>
						<img
							src={user?.avatar_url}
							className="rounded-circle avatar-sm"
							alt=""
						/>
					</div>
				</div>
			</li>
		</div>
	)
}
