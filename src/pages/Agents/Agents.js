import React, { useCallback, useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import PendingAgents from './PendingAgents'
import { Tab, Tabs } from 'react-bootstrap'
import axios from 'axios'
import AgentList from './AgentList'

export default function Agents() {
	const [agents, setAgents] = useState([])

	const getAllAgents = useCallback(async () => {
		try {
			const res = await axios(process.env.REACT_APP_API_URL + `/users/?role=3`)
			setAgents(res.data)
		} catch (error) {
			return Promise.reject(error)
		}
	}, [])

	useEffect(() => {
		getAllAgents()
	}, [getAllAgents])

	return (
		<Layout pageName={'agent'}>
			<div className="container-flui">
				<Tabs
					defaultActiveKey="all-agents"
					id="uncontrolled-tab-example"
					className="mb-3"
					style={{ fontSize: '20px' }}
				>
					<Tab eventKey="all-agents" title="All Agents">
						<AgentList agents={agents} />
					</Tab>
					<Tab eventKey="pending-agents" title="Pending Agents">
						<PendingAgents />
					</Tab>
				</Tabs>
			</div>
		</Layout>
	)
}
