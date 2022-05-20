import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPendingAgents } from '../../redux/actions/agent.action'
import EachAgent from './EachPendingAgent'

export default function PendingAgents() {
	const { pending_agents } = useSelector(state => state.agent);
    const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getPendingAgents());
	}, [])

	return (
		<div>
			<div className="row">
				<div className="col-12">
					<div className="page-title-box d-sm-flex align-items-center justify-content-between">
						<h4 className="mb-sm-0 font-size-18">Pending Agents</h4>
					</div>
				</div>
			</div>
			<div className="row">
				{pending_agents.map((val, i) => {
					return (
						<EachAgent key={`agent-${i}`} data={val} />
					)
				})}
			</div>
		</div>
	)
}
