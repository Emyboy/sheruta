import React from 'react'
import EachMessage from './EachMessage'

export default function MessageDetails() {
	return (
		<div className="w-100 user-chat mt-4 mt-sm-0 ms-lg-1">
			<div className="card h-100">
				<div className="p-3 px-lg-4 border-bottom">
					<div className="row">
						<div className="col-xl-4 col-7">
							<div className="d-flex align-items-center">
								<div className="flex-shrink-0 avatar-sm me-3 d-sm-block d-none">
									<img
										src="assets/images/users/avatar-2.jpg"
										alt=""
										className="img-fluid d-block rounded-circle"
									/>
								</div>
								<div className="flex-grow-1">
									<h5 className="font-size-14 mb-1 text-truncate">
										<a href="#" className="text-dark">
											Jennie Sherlock
										</a>
									</h5>
									<p className="text-muted text-truncate mb-0">Online</p>
								</div>
							</div>
						</div>
						<div className="col-xl-8 col-5">
							<ul className="list-inline user-chat-nav text-end mb-0">
								<li className="list-inline-item">
									<div className="dropdown">
										<button
											className="btn nav-btn dropdown-toggle"
											type="button"
											data-bs-toggle="dropdown"
											aria-haspopup="true"
											aria-expanded="false"
										>
											<i className="bx bx-search"></i>
										</button>
										<div className="dropdown-menu dropdown-menu-end dropdown-menu-md p-2">
											<form className="px-2">
												<div>
													<input
														type="text"
														className="form-control border bg-soft-light"
														placeholder="Search..."
													/>
												</div>
											</form>
										</div>
									</div>
								</li>

								<li className="list-inline-item">
									<div className="dropdown">
										<button
											className="btn nav-btn dropdown-toggle"
											type="button"
											data-bs-toggle="dropdown"
											aria-haspopup="true"
											aria-expanded="false"
										>
											<i className="bx bx-dots-horizontal-rounded"></i>
										</button>
										<div className="dropdown-menu dropdown-menu-end">
											<a className="dropdown-item" href="#">
												Profile
											</a>
											<a className="dropdown-item" href="#">
												Archive
											</a>
											<a className="dropdown-item" href="#">
												Muted
											</a>
											<a className="dropdown-item" href="#">
												Delete
											</a>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div
					className="chat-conversation p-3"
					data-simplebar="init"
					style={{ maxHeight: '550px', height: '100%' }}
				>
					<div className="simplebar-wrapper" style={{ margin: '-16px' }}>
						<div className="simplebar-height-auto-observer-wrapper">
							<div className="simplebar-height-auto-observer"></div>
						</div>
						<div className="simplebar-mask">
							<div
								className="simplebar-offset"
								style={{ right: '-17px', bottom: '0px' }}
							>
								<div
									className="simplebar-content-wrapper"
									style={{ height: 'auto', overflow: 'hidden scroll' }}
								>
									<div className="simplebar-content" style={{ padding: '16px' }}>
										<ul className="list-unstyled mb-5">
											<li className="chat-day-title">
												<span className="title">Today</span>
											</li>
                                            <EachMessage />
                                            <EachMessage />
                                            <EachMessage />
                                            <EachMessage />
                                            <EachMessage />
                                            <EachMessage />
                                            <EachMessage />
                                            <EachMessage />
                                            <EachMessage />
                                            <EachMessage />
										</ul>
									</div>
								</div>
							</div>
						</div>
						<div
							className="simplebar-placeholder"
							// style="width: auto; height: 721px;"
						></div>
					</div>
					<div
						className="simplebar-track simplebar-horizontal"
						// style="visibility: hidden;"
					>
						<div
							className="simplebar-scrollbar"
							// style="transform: translate3d(0px, 0px, 0px); display: none;"
						></div>
					</div>
					<div
						className="simplebar-track simplebar-vertical"
						// style="visibility: visible;"
					>
						<div
							className="simplebar-scrollbar"
							// style="height: 419px; transform: translate3d(0px, 0px, 0px); display: block;"
						></div>
					</div>
				</div>

				<div className="p-3 border-top">
					<div className="row">
						<div className="col">
							<div className="position-relative">
								<input
									type="text"
									className="form-control border bg-soft-light"
									placeholder="Enter Message..."
								/>
							</div>
						</div>
						<div className="col-auto">
							<button
								type="submit"
								className="btn btn-primary chat-send w-md waves-effect waves-light"
							>
								<span className="d-none d-sm-inline-block me-2">Send</span>{' '}
								<i className="mdi mdi-send float-end"></i>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
