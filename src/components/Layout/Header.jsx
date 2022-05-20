import React, { useState } from 'react'
import logo from '../../assets/img/logo.png'
import { useEffect } from 'react'
import Global from '../../Global'
import { useDispatch, useSelector } from 'react-redux'
import { logoutAgent } from '../../redux/actions/auth.action'
import { Link } from 'react-router-dom'
import EachNotificationSM from './EachNotificationSM'

export default function Header() {
	const [showNav, setShowNav] = useState(false)
	const [mode, setMode] = useState(localStorage.getItem('mode'))
	const [showNotifications, setShowNotifications] = useState(false)
	const [showProfileOptions, setShowProfileOptions] = useState(false)
	const toggleSideNav = () => {
		setShowNav(!showNav)
	}
	const dispatch = useDispatch()
	const { user } = useSelector((state) => state.auth)
	const { notifications } = useSelector((state) => state.view)
	let body = document.querySelector('body')

	const _setMode = (newMode) => {
		body.setAttribute('data-layout-mode', newMode)
		body.setAttribute('data-sidebar', newMode)
		setMode(newMode)
		localStorage.setItem('mode', newMode)
	}

	const toggleMode = () => {
		const _mode = localStorage.getItem('mode')
		if (!_mode) {
			_setMode('dark')
		} else if (_mode && _mode === 'dark') {
			_setMode('light')
		} else {
			_setMode('dark')
		}
	}

	useEffect(() => {
		if (showNav) {
			body.classList.add('sidebar-enable')
			body.setAttribute('data-sidebar-size', Global.isMobile ? 'lg' : 'sm')
		} else {
			body.classList.remove('sidebar-enable')
			body.setAttribute('data-sidebar-size', 'lg')
		}
	}, [showNav, body])

	useEffect(() => {
		_setMode(mode)
	}, [])

	return (
		<header id="page-topbar">
			<div className="navbar-header">
				<div className="d-flex">
					<div className="navbar-brand-box">
						<a href="index.html" className="logo logo-dark">
							<span className="logo-sm">
								<img src={logo} alt="" height="30" />
							</span>
							<span className="logo-lg">
								<img src={logo} alt="" height="24" />{' '}
								<span className="logo-txt">Sheruta</span>
							</span>
						</a>

						<a href="index.html" className="logo logo-light">
							<span className="logo-sm">
								<img src={logo} alt="" height="30" />
							</span>
							<span className="logo-lg">
								<img src={logo} alt="" height="24" />{' '}
								<span className="logo-txt">Sheruta</span>
							</span>
						</a>
					</div>

					<button
						type="button"
						className="btn btn-sm px-3 font-size-16 header-item"
						onClick={toggleSideNav}
					>
						<i className="fa fa-fw fa-bars"></i>
					</button>

					{/* <form className="app-search d-none d-lg-block">
						<div className="position-relative">
							<input
								type="text"
								className="form-control"
								placeholder="Search..."
							/>
							<button className="btn btn-primary" type="button">
								<i className="bx bx-search-alt align-middle"></i>
							</button>
						</div>
					</form> */}
				</div>

				<div className="d-flex">
					{/* <div className="dropdown d-inline-block d-lg-none ms-2">
						<button
							type="button"
							className="btn header-item"
							id="page-header-search-dropdown"
							data-bs-toggle="dropdown"
							aria-haspopup="true"
							aria-expanded="false"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="feather feather-search icon-lg"
							>
								<circle cx="11" cy="11" r="8"></circle>
								<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
							</svg>
						</button>
						<div
							className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
							aria-labelledby="page-header-search-dropdown"
						>
							<form className="p-3">
								<div className="form-group m-0">
									<div className="input-group">
										<input
											type="text"
											className="form-control"
											placeholder="Search ..."
											aria-label="Search Result"
										/>

										<button className="btn btn-primary" type="submit">
											<i className="mdi mdi-magnify"></i>
										</button>
									</div>
								</div>
							</form>
						</div>
					</div> */}

					<div className="dropdown d-sm-inline-block">
						<button
							type="button"
							className="btn header-item"
							id="mode-setting-btn"
							onClick={toggleMode}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="feather feather-moon icon-lg layout-mode-dark"
							>
								<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
							</svg>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="feather feather-sun icon-lg layout-mode-light"
							>
								<circle cx="12" cy="12" r="5"></circle>
								<line x1="12" y1="1" x2="12" y2="3"></line>
								<line x1="12" y1="21" x2="12" y2="23"></line>
								<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
								<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
								<line x1="1" y1="12" x2="3" y2="12"></line>
								<line x1="21" y1="12" x2="23" y2="12"></line>
								<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
								<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
							</svg>
						</button>
					</div>

					<div className="dropdown d-inline-block">
						<button
							type="button"
							className="btn header-item noti-icon position-relative"
							id="page-header-notifications-dropdown"
							data-bs-toggle="dropdown"
							aria-haspopup="true"
							aria-expanded="false"
							onClick={() => setShowNotifications(!showNotifications)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="feather feather-bell icon-lg"
							>
								<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
								<path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
							</svg>
							<span className="badge bg-danger rounded-pill">
								{notifications?.filter((x) => !x.seen).length}
							</span>
						</button>
						<div
							className={`dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 ${
								showNotifications && 'show'
							}`}
							style={{ left: '-9rem' }}
							aria-labelledby="page-header-notifications-dropdown"
						>
							<div className="p-3">
								<div className="row align-items-center">
									<div className="col">
										<h6 className="m-0"> Notifications </h6>
									</div>
									<div className="col-auto">
										<a
											href="#!"
											className="small text-reset text-decoration-underline"
										>
											{' '}
											Unread (3)
										</a>
									</div>
								</div>
							</div>
							<div data-simplebar="init" style={{ height: '40vh' }}>
								<div className="simplebar-wrapper" style={{ margin: '0px' }}>
									<div className="simplebar-height-auto-observer-wrapper">
										<div className="simplebar-height-auto-observer"></div>
									</div>
									<div className="simplebar-mask p-4 h-50">
										<div
											className="simplebar-offset"
											// style={{ right: '0px', bottom: '0px' }}
										>
											<div
												className="simplebar-content-wrapper"
												// style={{ height: 'auto', overflow: 'hidden' }}
											>
												<div
													className="simplebar-content"
													// style={{ padding: '0px' }}
												>
													
													{notifications?.filter(x => !x.seen).map((val, i) => {
														return <EachNotificationSM key={`not-${i}`} data={val} />
													})}
												</div>
											</div>
										</div>
									</div>
									<div
										className="simplebar-placeholder"
										// style="width: 0px; height: 0px;"
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
									// style="visibility: hidden;"
								>
									<div
										className="simplebar-scrollbar"
										// style="transform: translate3d(0px, 0px, 0px); display: none;"
									></div>
								</div>
							</div>
							<div className="p-2 border-top d-grid">
								<Link
									className="btn btn-sm btn-link font-size-14 text-center"
									to="/notifications"
								>
									<i className="mdi mdi-arrow-right-circle me-1"></i>{' '}
									<span>View More..</span>
								</Link>
							</div>
						</div>
					</div>

					<div className="dropdown d-inline-block">
						<button
							type="button"
							className="btn header-item right-bar-toggle me-2"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="feather feather-settings icon-lg"
							>
								<circle cx="12" cy="12" r="3"></circle>
								<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
							</svg>
						</button>
					</div>

					<div className="dropdown d-inline-block">
						<button
							type="button"
							className="btn header-item bg-soft-light border-start border-end"
							id="page-header-user-dropdown"
							data-bs-toggle="dropdown"
							aria-haspopup="true"
							aria-expanded="false"
							onClick={() => setShowProfileOptions(!showProfileOptions)}
						>
							<img
								className="rounded-circle header-profile-user"
								src={user?.avatar_url}
								alt="Header Avatar"
							/>
							<span className="d-none d-xl-inline-block ms-1 fw-medium">
								{user.first_name}
							</span>
							<i className="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
						</button>
						<div
							className={`dropdown-menu dropdown-menu-end ${
								showProfileOptions && 'show'
							}`}
							style={{ left: '-5rem' }}
						>
							<Link className="dropdown-item" to={`/user/${user?.id}`}>
								<i className="mdi mdi-face-profile font-size-16 align-middle me-1"></i>{' '}
								Profile
							</Link>
							<a className="dropdown-item" href="auth-lock-screen.html">
								<i className="mdi mdi-lock font-size-16 align-middle me-1"></i>{' '}
								Lock screen
							</a>
							<div className="dropdown-divider"></div>
							<Link
								className="dropdown-item"
								to="/"
								onClick={() => dispatch(logoutAgent())}
							>
								<i className="mdi mdi-logout font-size-16 align-middle me-1"></i>{' '}
								Logout
							</Link>
						</div>
					</div>
				</div>
			</div>
		</header>
	)
}
