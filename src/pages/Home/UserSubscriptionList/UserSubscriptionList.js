import React from 'react'
import { useSelector } from 'react-redux'
import EachSubscribtionUser from '../EachSubscribtionUser'

export default function UserSubscriptionList() {
	const { subscriptions } = useSelector((state) => state.view)

	return (
		<div className="card">
			<div className="card-header align-items-center d-flex">
				<h4 className="card-title mb-0 flex-grow-1">Active Subscribers</h4>
			</div>

			<div className="card-body px-0">
				<div
					className="px-3"
					data-simplebar="init"
					style={{ maxHeight: '386px' }}
				>
					<div className="simplebar-wrapper" style={{ margin: '0px -16px' }}>
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
									<div
										className="simplebar-content"
										style={{ padding: '0px 16px' }}
									>
										{subscriptions &&
											subscriptions?.filter((x) => x.status === 'success')
												.sort(
													(a, b) =>
														new Date(b.created_at) - new Date(a.created_at)
												)
												.map((val, i) => {
													return (
														<EachSubscribtionUser sub={val} key={`sub-${i}`} />
													)
												})}
									</div>
								</div>
							</div>
						</div>
						<div
							className="simplebar-placeholder"
							style={{ width: 'auto', height: '436px' }}
						></div>
					</div>
					<div
						className="simplebar-track simplebar-horizontal"
						style={{ visibility: 'hidden' }}
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
							// style="height: 341px; transform: translate3d(0px, 0px, 0px); display: block;"
						></div>
					</div>
				</div>
			</div>
		</div>
	)
}
