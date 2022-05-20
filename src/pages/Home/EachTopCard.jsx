import axios from 'axios'
import React, { useCallback } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

export default function EachTopCard({
	heading,
	sub_heading,
	badge_text,
	api_route,
}) {
	const [count, setCount] = useState(null)

	const getCount = useCallback(async () => {
		console.log('GETTING')
		try {
			const res = await axios(process.env.REACT_APP_API_URL + api_route)
			setCount(res.data)
		} catch (error) {
			console.log(error)
			return Promise.reject(error)
		}
	}, [])

	useEffect(() => {
		if (api_route) {
			getCount()
		}
	}, [api_route, getCount])

	return (
		<div className="col-xl-3 col-md-6">
			<div className="card card-h-100">
				<div className="card-body">
					<div className="d-flex align-items-center">
						<div className="flex-grow-1">
							<span className="text-muted mb-3 lh-1 d-block text-truncate">
								{heading}
							</span>
							<h1 className="mb-3">
								<span className="counter-value" data-target="354.5">
									{count}
								</span>
							</h1>
							<div className="text-nowrap">
								{badge_text && (
									<span className="badge bg-soft-success text-success">
										{badge_text}
									</span>
								)}
								{sub_heading && (
									<span className="ms-1 text-muted font-size-13">
										{sub_heading}
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
