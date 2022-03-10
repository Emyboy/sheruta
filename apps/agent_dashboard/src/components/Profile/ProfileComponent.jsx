import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Layout from '../Layout/Layout'
import { useParams } from 'react-router-dom'
import PageNotFound from '../../pages/PageNotFound'
import { Tab, Tabs } from 'react-bootstrap'
import ContactList from '../ContactList/ContactList'
import { AiTwotoneMail } from 'react-icons/ai'
import RequestList from '../RequestList/RequestList'
import PersonalInfo from '../PersonalInfo/PersonalInfo'

export default function ProfileComponent({ _user_id, standalone }) {
	const params = useParams()
	const { user } = useSelector((state) => state.auth)
	const [_user, setUser] = useState(
		null
	)
	const [pageState, setPageState] = useState('loading')

	const getUserData = async () => {
		if (params?.user_id !== user?.id) {
			try {
				const res = await axios(
					process.env.REACT_APP_API_URL + `/users/?id=${_user_id}`
				)
				if (res.data.length > 0) {
					setUser(res.data[0])
					setPageState('done')
				} else {
					setPageState('404')
				}
			} catch (error) {
				setPageState('404')
				return Promise.reject(error)
			}
		}
	}

	useEffect(() => {
		getUserData()
	}, [params])

	return (
		<div className={`container `}>
			<div className="row justify-content-center">
				<div className="col-lg-12 col-md-8 col-sm-12 col-xl-8 p-0">
					{pageState === 'loading' && (
						<div className="p-5 d-flex justify-content-center">
							<h4 className="pt-5">Loading..</h4>
						</div>
					)}
					{pageState === '404' && <PageNotFound />}
					{pageState === 'done' && _user && (
						<div>
							<div className={` container p-0`}>
								{!standalone && (
									<div className="row">
										<div>
											<div
												className="profile-user"
												style={{
													backgroundImage: `url('https://picsum.photos/200/100')`,
												}}
											></div>
										</div>
									</div>
								)}
								<div className={`${standalone && 'mt-5'} row`}>
									<div className="profile-content card">
										<div className="row align-items-end">
											<div className="col-sm">
												<div className="d-flex align-items-end mt-3 mt-sm-0">
													<div className="flex-shrink-0">
														<div className="avatar-xxl me-3">
															<img
																src={_user?.avatar_url}
																alt=""
																className="img-fluid rounded-circle d-block img-thumbnail"
															/>
														</div>
													</div>
													<div className="flex-grow-1">
														<div>
															<h5 className="font-size-16 mb-1">
																{_user?.first_name} {_user?.last_name}
															</h5>
															<div className="d-flex align-items-center mb-2">
																<p className="text-muted font-size-13 mb-0">
																	@{_user?.username}
																</p>
																{_user?.is_verified && (
																	<span className="badge bg-success m-2">
																		Verified
																	</span>
																)}
															</div>
														</div>
													</div>
												</div>
											</div>
											<div className="col-sm-auto">
												<div className="d-flex align-items-start justify-content-end gap-2 mb-2">
													<div>
														<a
															href={`tel: ${_user?.phone_number}`}
															className="mr-5"
														>
															<button type="button" className="btn btn-success">
																<i className="fa fa-phone me-1"></i> Call Me
															</button>
														</a>
														<button
															type="button"
															className="btn btn-success m-1"
														>
															<i className="fa-solid fa-message-middle me-1">
																<AiTwotoneMail size={17} />
															</i>{' '}
															Message
														</button>
													</div>
													<div>
														<div className="dropdown">
															<button
																className="btn btn-link font-size-16 shadow-none text-muted dropdown-toggle"
																type="button"
																data-bs-toggle="dropdown"
																aria-expanded="false"
															>
																<i className="bx bx-dots-horizontal-rounded font-size-20"></i>
															</button>
															<ul className="dropdown-menu dropdown-menu-end">
																<li>
																	<a className="dropdown-item" href="#">
																		Action
																	</a>
																</li>
																<li>
																	<a className="dropdown-item" href="#">
																		Another action
																	</a>
																</li>
																<li>
																	<a className="dropdown-item" href="#">
																		Something else here
																	</a>
																</li>
															</ul>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="p-0">
										<div className="card bg-transparent shadow-none">
											<div className="card-body p-0">
												<Tabs
													defaultActiveKey="contacts"
													id="uncontrolled-tab-example"
													className="mb-3 nav nav-tabs-custom card-header-tabs border-top mt-2 rounded shadow"
												>
													<Tab
														eventKey="contacts"
														title="Contacts"
														className="nav-item"
													>
														<ContactList
															user_id={params?.user_id}
															userData={_user}
														/>
													</Tab>
													<Tab eventKey="requests" title="Requests">
														<RequestList
															user_id={params?.user_id}
															userData={_user}
														/>
													</Tab>
													<Tab eventKey="personal-info" title="More Info">
														<PersonalInfo
															user_id={params?.user_id}
															userData={_user}
														/>
													</Tab>
												</Tabs>
												{/* <ul
											className="nav nav-tabs-custom card-header-tabs border-top mt-2"
											id="pills-tab"
											role="tablist"
										>
											<li className="nav-item">
												<a
													className="nav-link px-3 active"
													data-bs-toggle="tab"
													href="#overview"
													role="tab"
												>
													Overview
												</a>
											</li>
											<li className="nav-item">
												<a
													className="nav-link px-3"
													data-bs-toggle="tab"
													href="#post"
													role="tab"
												>
													Post
												</a>
											</li>
										</ul> */}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
