import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useCallback, useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import EachReport from './EachReport'

export default function RedFlags() {
	const [reports, setReports] = useState([])
	const [loading, setLoading] = useState(false);

	const getAllRedFlags = useCallback(async () => {
		try {
			setLoading(true)
			const res = await axios(process.env.REACT_APP_API_URL + `/red-flags`, {
				headers: {
					Authorization: `Bearer ${Cookies.get('token')}`,
				},
			})
			
			setReports(res.data)
			if (res.data) {
				setLoading(false)
			}
		} catch (error) {
			setLoading(false)
			return Promise.reject(error)
		}
	}, [])

	useEffect(() => {
		getAllRedFlags()
	}, [getAllRedFlags])


	return (
		<Layout pageName={'reports'}>
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="page-title-box d-sm-flex align-items-center justify-content-between">
							<h4 className="mb-sm-0 font-size-18">Reported Users / Posts</h4>
							<div className="page-title-right">
								<ol className="breadcrumb m-0">
									<li className="breadcrumb-item">
										<a href="">
											{loading && (
												<a href="#c" className="text-success">
													<i className="bx bx-loader bx-spin font-size-18 align-middle me-2"></i>{' '}
													Loading...{' '}
												</a>
											)}
										</a>
									</li>
									{/* <li className="breadcrumb-item active">Shops</li> */}
								</ol>
							</div>
						</div>
					</div>
				</div>
				<div className="row justify-content-center">
					<div>
						<div className="card">
							<div className="card-body">
								<div className="table-responsive">
                                    <input className='form-control w-50 mb-2' placeholder='Search for username' />
									<table className="table table-centered align-middle table-nowrap table-hover mb-0">
										<thead>
											<tr>
												<th scope="col">Preview</th>
												<th scope="col">User</th>
												<th scope="">Reporter</th>
												{/* <th scope="col">Level</th>
												<th scope="col">Status</th> */}
												<th scope="col">Type</th>
											</tr>
										</thead>
										<tbody>
											{reports.sort((a, b) => b.id - a.id).map((val, i) => {
												return <EachReport data={val} key={val?.id} />
											})}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}
