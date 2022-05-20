import React from 'react'
import Layout from '../../components/Layout/Layout'
import { useSelector } from 'react-redux'
import EachNotification from './EachNotification'

export default function _Notifications() {
	const { notifications } = useSelector((state) => state.view)

	return (
		<Layout>
			<div className="row justify-content-center">
				<div className="col-sm-12 col-lg-8">
					<div className="card">
						<div className="card-header align-items-center d-flex">
							<h4 className="card-title mb-0 flex-grow-1">Notifications</h4>
						</div>

						<div className="card-body px-0">
							<div
								className="px-3"
								data-simplebar="init"
								// style={{ maxHeight: '386px' }}
							>
								<div
									className="simplebar-wrapper"
									style={{ margin: '0px -16px' }}
								>
									<div
										className="simplebar-content"
										style={{ padding: '0px 16px' }}
									>
										{notifications?.map((val, i) => {
											return (
												<EachNotification data={val} key={`note-${i}`} />
											)
										})}
									</div>
								</div>
								{/* <div
								className="simplebar-placeholder"
								style="width: auto; height: 436px;"
							></div> */}
							</div>
							{/* <div
							className="simplebar-track simplebar-horizontal"
							style="visibility: hidden;"
						>
							<div
								className="simplebar-scrollbar"
								style="transform: translate3d(0px, 0px, 0px); display: none;"
							></div>
						</div>
						<div
							className="simplebar-track simplebar-vertical"
							style="visibility: visible;"
						>
							<div
								className="simplebar-scrollbar"
								style="height: 341px; transform: translate3d(0px, 0px, 0px); display: block;"
							></div>
						</div> */}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}
