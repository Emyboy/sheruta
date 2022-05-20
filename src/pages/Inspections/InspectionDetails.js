import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router'
import Layout from '../../components/Layout/Layout'
import InspectionService from '../../services/InspectionService'
import { AiFillPhone } from 'react-icons/ai'

export default function InspectionDetails(props) {
	const [data, setData] = useState(null)
	const navigate = useNavigate()
	const params = useParams()
	const location = useLocation()
	// console.log('DETAILS PROPS ---', props)
	// console.log('LOCATION ---', location)
	// console.log('PARAMS --', params)

	const getInspectionData = useCallback(async () => {
		try {
			const res = await InspectionService.getInspectionByID(
				params?.inspection_id
			)
			console.log('RES -', res.data)
		} catch (error) {
			return Promise.reject(error)
		}
	}, [])

	useEffect(() => {
		if (location.state) {
			console.log('DATA --', location.state)
			setData(location.state)
		} else {
			getInspectionData()
		}
	}, [location.state, getInspectionData])

	if (!data) {
		return null
	}

	return (
		<Layout>
			<div>
				<h3>Members</h3>
				<div
					className="d-flex"
					style={{ overflow: 'scroll', overflowY: 'hidden' }}
				>
					{data?.guests?.map((val, i) => {
                        console.log('VAL --', val)
						return (
							<div
								className="m-1 col-7 col-md-6 col-xl-3 col-sm-12"
								key={`guest-${i}`}
							>
								<div className="card text-center">
									<div className="card-body">
										<div className="mb-3">
											<img
												src={val?.avatar_url}
												alt="Guest User"
												className="avatar-lg rounded-circle img-thumbnail"
											/>
										</div>
										<div className="flex-1 ms-3">
											<h5 className="font-size-15 mb-1">
												<a href="#" className="text-dark">
													Phyllis Gatlin
												</a>
											</h5>
											<p className="text-muted mb-0">{val?.budget}</p>
										</div>
										<button
											type="button"
											className="mt-4 btn btn-success waves-effect waves-light"
											style={{ borderRadius: '50%', height: '50px' }}
										>
											<AiFillPhone size={25} />
										</button>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</Layout>
	)
}
