import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import PendingAgents from './PendingAgents'

export default function Agents() {
  const tabs = ['All Agents', 'Pending Agents'];
	const [currentTab, setCurrentTab] = useState(tabs[0])

	return (
		<Layout pageName={'agent'}>
			<ul
				className="nav nav-tabs nav-tabs-custom nav-justified mb-3"
				role="tablist"
			>
				{tabs.map((val, i) => {
					return (
						<li className="nav-item" onClick={() => setCurrentTab(val)}>
							<a
								className={`nav-link ${currentTab === val && 'active'}`}
								data-bs-toggle="tab"
								href="#home1"
								role="tab"
							>
								<span className="d-block d-sm-none">
									<i className="fas fa-home"></i>
								</span>
								<span className="d-none d-sm-block">{val}</span>
							</a>
						</li>
					)
				})}
				
			</ul>
			<PendingAgents />
		</Layout>
	)
}
