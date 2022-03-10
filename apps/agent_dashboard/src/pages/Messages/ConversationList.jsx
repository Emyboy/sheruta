import React from 'react'
import { useSelector } from 'react-redux'
import EachConversation from './EachConversation'

export default function ConversationList() {
	const { user } = useSelector((state) => state.auth)
	const { conversations } = useSelector(state => state.message);
	return (
		<div className="chat-leftsidebar card">
			<div className="p-3 px-4 border-bottom">
				<div className="d-flex align-items-start ">
					<div className="flex-shrink-0 me-3 align-self-center">
						<img
							src={user?.avatar_url}
							className="avatar-sm rounded-circle"
							alt=""
						/>
					</div>

					<div className="flex-grow-1">
						<h5 className="font-size-16 mb-1">
							<a href="#c" className="text-dark">
								{user?.first_name?.split()[0]}{' '}
								<i className="mdi mdi-circle text-success align-middle font-size-10 ms-1"></i>
							</a>
						</h5>
						<p className="text-muted mb-0">Available</p>
					</div>

					<div className="flex-shrink-0">
						<div className="dropdown chat-noti-dropdown">
							{/* <button
								className="btn dropdown-toggle p-0"
								type="button"
								data-bs-toggle="dropdown"
								aria-haspopup="true"
								aria-expanded="false"
							>
								<i className="bx bx-dots-horizontal-rounded"></i>
							</button> */}
							<div className="dropdown-menu dropdown-menu-end">
								<a className="dropdown-item" href="#c">
									Profile
								</a>
								<a className="dropdown-item" href="#c">
									Edit
								</a>
								<a className="dropdown-item" href="#c">
									Add Contact
								</a>
								<a className="dropdown-item" href="#c">
									Setting
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="p-3">
				<div className="search-box position-relative">
					<input
						type="text"
						className="form-control rounded border"
						placeholder="Search..."
					/>
					<i className="bx bx-search search-icon"></i>
				</div>
			</div>

			<div className="chat-leftsidebar-nav">
				{/* <ul className="nav nav-pills nav-justified bg-light p-1">
					<li className="nav-item">
						<a
							href="#chat"
							data-bs-toggle="tab"
							aria-expanded="true"
							className="nav-link active"
						>
							<i className="bx bx-chat font-size-20 d-sm-none"></i>
							<span className="d-none d-sm-block">Chat</span>
						</a>
					</li>
					<li className="nav-item">
						<a
							href="#groups"
							data-bs-toggle="tab"
							aria-expanded="false"
							className="nav-link"
						>
							<i className="bx bx-group font-size-20 d-sm-none"></i>
							<span className="d-none d-sm-block">Groups</span>
						</a>
					</li>
					<li className="nav-item">
						<a
							href="#contacts"
							data-bs-toggle="tab"
							aria-expanded="false"
							className="nav-link"
						>
							<i className="bx bx-book-content font-size-20 d-sm-none"></i>
							<span className="d-none d-sm-block">Contacts</span>
						</a>
					</li>
				</ul> */}
				<div className="tab-content">
					<div className="tab-pane show active" id="chat">
						<div
							className="chat-message-list"
							data-simplebar="init"
							style={{ maxHeight: '500px' }}
						>
							<div className="simplebar-wrapper" style={{ margin: '0px' }}>
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
											style={{ height: '100%', overflow: 'hidden scroll' }}
										>
											<div className="simplebar-content p-0">
												<div className="pt-3">
													<div className="px-3">
														<h5 className="font-size-14 mb-3">Recent</h5>
													</div>
													<ul className="list-unstyled chat-list">
														{conversations?.map((val,i) => {
															return <EachConversation data={val} key={`conv-1`} />
														})}
														
													</ul>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div
									className="simplebar-placeholder"
									style={{ width: 'auto', height: '662px' }}
								></div>
							</div>
							<div
								className="simplebar-track simplebar-horizontal"
								style={{ visibility: 'hidden' }}
							>
								<div
									className="simplebar-scrollbar"
									style={{
										transform: 'translate3d(0px, 0px, 0px)',
										display: 'none',
									}}
								></div>
							</div>
							<div
								className="simplebar-track simplebar-vertical"
								style={{ visibility: 'visible' }}
							>
								<div
									className="simplebar-scrollbar"
									style={{
										height: '377px',
										transform: 'translate3d(0px, 0px, 0px)',
										display: 'block',
									}}
								></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
