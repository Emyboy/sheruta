import React from 'react'
import { Table } from 'react-bootstrap'

export default function AgentList({ agents }) {
	return (
		<div className="row">
			<div className="col-lg-12">
				<div className="card">
					<div className="card-body">
						<div className="row align-items-center">
							<div className="col-md-6">
								<div className="mb-3">
									<h5 className="card-title">
										Agent List{' '}
										<span className="text-muted fw-normal ms-2">
											({agents?.length})
										</span>
									</h5>
								</div>
							</div>

							{/* <div className="col-md-6">
								<div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
									<div>
										<a href="#" className="btn btn-light">
											<i className="bx bx-plus me-1"></i> Add New
										</a>
									</div>

									<div className="dropdown">
										<a
											className="btn btn-link text-muted py-1 font-size-16 shadow-none dropdown-toggle"
											href="#"
											role="button"
											data-bs-toggle="dropdown"
											aria-expanded="false"
										>
											<i className="bx bx-dots-horizontal-rounded"></i>
										</a>

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
							</div> */}
						</div>
						<div className="table-responsive mb-4">
							<div
								id="DataTables_Table_0_wrapper"
								className="dataTables_wrapper dt-bootstrap4 no-footer"
							>
								{/* <div className=" d-flex">
									<div className="col-sm-12 col-md-6">
										<div
											className="dataTables_length"
											id="DataTables_Table_0_length"
										>
											<label>
												Show{' '}
												<select
													name="DataTables_Table_0_length"
													aria-controls="DataTables_Table_0"
													className="custom-select custom-select-sm form-control form-control-sm form-select form-select-sm"
												>
													<option value="10">10</option>
													<option value="25">25</option>
													<option value="50">50</option>
													<option value="100">100</option>
												</select>{' '}
												entries
											</label>
										</div>
									</div>
									<div className="col-sm-12 col-md-6">
										<div
											id="DataTables_Table_0_filter"
											className="dataTables_filter"
										>
											<label>
												Search:
												<input
													type="search"
													className="form-control form-control-sm"
													placeholder=""
													aria-controls="DataTables_Table_0"
												/>
											</label>
										</div>
									</div>
								</div> */}
								<div className="row">
									<div className="col-sm-12">
										<Table striped bordered>
											<thead>
												<tr>
													<th>ID</th>
													<th>Avatar</th>
													<th>First Name</th>
													<th>Last Name</th>
													<th>Email</th>
													<th>Phone NO</th>
												</tr>
											</thead>
											<tbody>
												{agents?.map((val, i) => {
													return (
														<EachAgent key={`each-agent-${i}`} data={val} />
													)
												})}
											</tbody>
										</Table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export function EachAgent({ data }) {
	return (
		<tr className="odd">
			<th className="pt-3">{data?.id}</th>
			<td>
				<img
					src={data?.avatar_url}
					alt=""
					className="avatar-sm rounded-circle me-2"
				/>
			</td>
			<td className="pt-3">{data?.first_name}</td>
			<td className="pt-3">{data?.last_name}</td>
			<td className="pt-3">{data?.email}</td>
			<td className="pt-3">
				<div className="d-flex gap-2">{data?.phone_number}</div>
			</td>
			<td>
				<div className="dropdown">
					<button
						className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle"
						type="button"
						data-bs-toggle="dropdown"
						aria-expanded="false"
					>
						<i className="bx bx-dots-horizontal-rounded"></i>
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
			</td>
		</tr>
	)
}
