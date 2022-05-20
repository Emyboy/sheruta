import axios from 'axios'
import Cookies from 'js-cookie'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'

export default function UserFeedback() {
	const [list, setList] = useState([])
	const getAllFeedback = useCallback(async () => {
		try {
			const res = await axios(
				process.env.REACT_APP_API_URL +
					`/user-feedbacks/?&_start=0&_sort=created_at:DESC`,
				{
					headers: {
						Authorization: `Bearer ${Cookies.get('token')}`,
					},
				}
			)
			setList(res?.data)
		} catch (error) {
			return Promise.reject(error)
		}
	}, [])

	useEffect(() => {
		getAllFeedback()
	}, [getAllFeedback])

	return (
		<div className="card">
			<div className="card-header align-items-center d-flex">
				<h4 className="card-title mb-0 flex-grow-1">User Feedback</h4>
				<div className="flex-shrink-0">
					<div className="dropdown align-self-start">
						<a
							className="dropdown-toggle"
							href="#"
							role="button"
							data-bs-toggle="dropdown"
							aria-haspopup="true"
							aria-expanded="false"
						>
							<i className="bx bx-dots-horizontal-rounded font-size-18 text-dark"></i>
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

			<div className="card-body px-0 pt-2">
				<div
					className="table-responsive px-3"
					data-simplebar="init"
					// style="max-height: 395px;"
				>
					<div
						className="simplebar-wrapper"
						// style="margin: 0px -16px;"
					>
						<div className="simplebar-height-auto-observer-wrapper">
							<div className="simplebar-height-auto-observer"></div>
						</div>
						<div className="simplebar-mask">
							<div
								className="simplebar-offset"
								// style="right: -17px; bottom: -17px;"
							>
								<div
									className="simplebar-content-wrapper"
									style={{ height: 'auto', overflow: 'scroll' }}
								>
									<div
										className="simplebar-content"
										style={{ padding: '0px 16px' }}
									>
										{list.map((val, i) => {
											return (
												<div className="d-flex align-items-center pb-4">
													<img
														src={val?.users_permissions_user?.avatar_url}
														className="img-fluid rounded-circle m-3"
														alt=""
														width={'60'}
													/>
													<div className="flex-grow-1">
														<h5 className="font-size-15 mb-1">
															<a href="#" className="text-dark">
																{val?.users_permissions_user?.first_name}
															</a>
														</h5>
														<div className="d-flex justify-content-between">
															<ul className="mb-1 ps-0">
																{Array.from(Array(val?.rating).keys()).map(
																	(val, i) => {
																		return (
																			<li className="bx bxs-star text-warning"></li>
																		)
																	}
																)}
															</ul>
															<small className='text-muted'>{moment(val?.created_at).fromNow()}</small>
														</div>
														<span>{val?.heading}</span><br />
														<span className="text-muted">{val?.body}</span>
													</div>
													<div className="flex-shrink-0 text-end">
														<div className="dropdown align-self-start">
															{/* <a
																className="dropdown-toggle"
																href="#"
																role="button"
																data-bs-toggle="dropdown"
																aria-haspopup="true"
																aria-expanded="false"
															>
																<i className="bx bx-dots-vertical-rounded font-size-24 text-dark"></i>
															</a> */}
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
											)
										})}
									</div>
								</div>
							</div>
						</div>
						<div
							className="simplebar-placeholder"
							style={{ width: 'auto', height: '454px' }}
						></div>
					</div>
					<div
						className="simplebar-track simplebar-horizontal"
						style={{ visibility: 'visible' }}
					>
						<div
							className="simplebar-scrollbar"
							style={{
								width: '263px',
								transform: 'translate3d(0px, 0px, 0px)',
								display: 'block',
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
								height: '343px',
								transform: 'translate3d(0px, 0px, 0px)',
								display: 'block',
							}}
						></div>
					</div>
				</div>
			</div>
		</div>
	)
}
