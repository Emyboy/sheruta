import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import AliceService from '../../services/AliceService'
import EachRequest from './EachRequest'

export default function RequestList({ user_id, userData }) {
	const [user] = useState(userData || null)
	const [data, setData] = useState([])

	const getUserContacts = useCallback(async () => {
		try {
			const res = await axios(
				process.env.REACT_APP_API_URL +
					`/property-requests/?users_permissions_user=${
						user_id || userData?.id
					}`
			)
            console.log('ALL REQUEST ---', res.data)
			setData(res.data)
		} catch (error) {
			return Promise.reject(error)
		}
	}, [user_id, userData])

	useEffect(() => {
		getUserContacts()
	}, [getUserContacts])

	return (
		<div className="card">
			<div className="card-header align-items-center d-flex">
				<h4 className="card-title mb-0 flex-grow-1">Requests</h4>
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
										{data.map((val, i) => {
											return <EachRequest key={`con-${i}`} data={val} />
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
