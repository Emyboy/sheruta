import React from 'react'
import Layout from '../../components/Layout/Layout'
import EachTopCard from './EachTopCard'
import UserFeedback from './UserFeedback/UserFeedback'
import UserSubscriptionList from './UserSubscriptionList/UserSubscriptionList'

export default function Home() {
	return (
		<Layout pageName="home">
			<div className="row">
				<div className="col-12">
					<div className="page-title-box d-sm-flex align-items-center justify-content-between">
						<h4 className="mb-sm-0 font-size-18">Welcome !</h4>

						<div className="page-title-right">
							<ol className="breadcrumb m-0">
								<li className="breadcrumb-item">
									<a href="#c">Dashboard</a>
								</li>
								<li className="breadcrumb-item active">Welcome !</li>
							</ol>
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<EachTopCard
					api_route="/property-requests/count"
					heading={'P2P Requests'}
					sub_heading="List of p2p flats"
				/>
				<EachTopCard
					api_route="/users/count/?confirmed=true"
					heading={'Users'}
					sub_heading={'List of active users'}
				/>
				<EachTopCard
					api_route={`/transactions/count/?status=success`}
					heading={'Subscriptions'}
					sub_heading={'Active subscriptions'}
				/>
				<EachTopCard
					api_route={`/users/count/?role=3`}
					heading={'Agents'}
					sub_heading={'List of active agents'}
				/>
				<EachTopCard
					api_route={`/properties/count/?is_available=true`}
					heading={'Properties'}
					sub_heading={'List of available properties'}
				/>
				<EachTopCard
					api_route={`/conversations/count`}
					heading={'Conversations'}
					sub_heading={'List of conversation'}
				/>
				<EachTopCard
					api_route={`/property-inspections/count`}
					heading={'Inspections'}
					sub_heading={'List of active inspection'}
				/>
			</div>
			<div>
				<hr />
				<div className="row">
					<div className="col-xl-4">
						<UserSubscriptionList />
					</div>
					<div className="col-xl-4">
						<UserFeedback />
					</div>
				</div>
			</div>
		</Layout>
	)
}
