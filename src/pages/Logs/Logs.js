import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Layout from '../../components/Layout/Layout'
import EachLog from './EachLog'

const Logs = (props) => {
	const [logs, setLogs] = useState([])
	useEffect(() => {
		axios(process.env.REACT_APP_API_URL + '/logs/?_sort=created_at:desc')
			.then((res) => {
				setLogs(res.data)
			})
			.catch((err) => {
				console.log(err)
			})
	}, [])

    

	return (
		<Layout pageName={'logs'}>
			{/* <div className="row">
				<div className="col-lg-12">
					<div className="row justify-content-center">
						<div className="col-xl-10">
							<div className="timeline">
								<div className="timeline-container">
									<div className="timeline-end">
										<p>Start</p>
									</div> */}
									<div className="timeline-continue">
										{/**Start Here */}
										{logs.map((log, i) => {
											return <EachLog key={i} log={log} />
										})}
									</div>
									{/* <div className="timeline-start">
										<p>End</p>
									</div>
									<div className="timeline-launch">
										<div className="timeline-box">
											<div className="timeline-text">
												<h3 className="font-size-18">
													Launched our company on 21 June 2021
												</h3>
												<p className="text-muted mb-0">
													Pellentesque sapien ut est.
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div> */}
		</Layout>
	)
}

export default Logs
