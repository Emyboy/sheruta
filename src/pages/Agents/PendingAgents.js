import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPendingAgents } from '../../redux/actions/agent.action'
import EachPendingAgents from './EachPendingAgent'

export default function PendingAgents() {
	const { pending_agents } = useSelector(state => state.agent);
    const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getPendingAgents());
	}, [])

	return (
		<div className='container-fluid'>
			<div className="row">
				{pending_agents.map((val, i) => {
					return (
						<EachPendingAgents key={`agent-${i}`} data={val} />
					)
				})}
			</div>
		</div>
	)
}
