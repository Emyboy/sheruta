import axios from 'axios'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'

export default function PersonalInfo({ userData, user_id }) {
	const [user, setUser] = useState(userData || null)
	const [data, setData] = useState([])

	const getPersonalInfo = useCallback(async () => {
		try {
			const res = await axios(
				process.env.REACT_APP_API_URL +
					`/personal-infos/?users_permissions_user=${user_id || userData?.id}`
			)
			console.log('ALL REQUEST ---', res.data[0])
			setUser(res.data[0]?.users_permissions_user)
			setData(res.data[0])
		} catch (error) {
			return Promise.reject(error)
		}
	}, [user_id, userData])

	useEffect(() => {
		getPersonalInfo()
	}, [getPersonalInfo])

	if (!data) {
		return null
	}
	return (
		<div className="card p-3 rounded">
			<h5 className="mb-3">
				{user?.first_name}{' '}
				{data?.looking_for ? 'is looking for' : ' has for share'} :
			</h5>
			<div className="table-responsive">
				<table className="table mb-0 table-bordered">
					<tbody>
						<tr>
							<th scope="row" style={{ width: '250px' }}>
								Gender
							</th>
							<td>{data?.gender?.toUpperCase()}</td>
						</tr>
						<tr>
							<th scope="row">Local Gov of origin</th>
							<td>{data?.lgaOfOrigin?.toUpperCase()}</td>
						</tr>
						<tr>
							<th scope="row">State of origin</th>
							<td>{data?.stateOfOrigin?.toUpperCase()}</td>
						</tr>
						<tr>
							<th scope="row">Looking for ages</th>
							<td>{data?.looking_for_age_range}</td>
						</tr>
						<tr>
							<th scope="row">Looking for gender</th>
							<td>{data?.looking_for_gender?.toUpperCase()}</td>
						</tr>
						<tr>
							<th scope="row">Occupation</th>
							<td>{data?.occupation?.toUpperCase()}</td>
						</tr>
						{data?.work_industry && (
							<tr>
								<th scope="row">Work Industry</th>
								<td>{data?.work_industry?.name?.toUpperCase()}</td>
							</tr>
						)}
						<tr>
							<th scope="row">Religion</th>
							<td>{data?.religion?.toUpperCase()}</td>
						</tr>
						<tr>
							<th scope="row" style={{ width: '250px' }}>
								Joined
							</th>
							<td>{moment(user?.created_at).fromNow()}</td>
						</tr>
						<tr>
							<th scope="row" style={{ width: '250px' }}>
								Last Seen
							</th>
							<td>{moment(user?.last_seen).fromNow()}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	)
}
