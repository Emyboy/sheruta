import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

export default function EachReport({ data }) {
    const [showDetails, setShowDetails] = useState(false);
	return (
		<tr>
			<Modal show={showDetails} size={'lg'}>
				<Modal.Body>
					<h6 class="text-success text-uppercase">20 % Off</h6>
					<h5 class="mb-4">
						Price :{' '}
						<span class="text-muted me-2">
							<del>$240 USD</del>
						</span>{' '}
						<b>$225 USD</b>
					</h5>
					<p class="text-muted mb-4">
						To achieve this, it would be necessary to have uniform grammar
						pronunciation and more common words If several languages coalesce
					</p>
				</Modal.Body>
			</Modal>
			<td>
				<img src={data?.user?.avatar_url} alt="" className="avatar-md p-1" />
			</td>
			<td>
				<h5 className="font-size-15"> {data?.user?.first_name}</h5>
				<p className="text-muted mb-0">
					<i className="mdi mdi-account me-1"></i> {data?.user?.username}
				</p>
			</td>
			<td>{data?.reporter?.email}</td>
			{/* <td>4</td>
			<td>
				<span class="badge badge-pill badge-soft-danger font-size-12">
					Chargeback
				</span>
			</td> */}
			<td>
				{data?.user ? "Profile Report" : "Request Report"}
			</td>
		</tr>
	)
}
