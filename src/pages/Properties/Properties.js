import React, { useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import { GrAdd } from 'react-icons/gr'
import { Link } from 'react-router-dom'
import EachProperty from './components/EachProperty'
import { useDispatch, useSelector } from 'react-redux'
import { getAgentProperties } from '../../redux/actions/agent.action'

export default function Properties() {
	const dispatch = useDispatch()
	const { properties } = useSelector((state) => state.agent)
	const { agent } = useSelector((state) => state.auth)
	useEffect(() => {
		dispatch(getAgentProperties(agent?.id))
	}, [])

	return (
		<Layout pageName={'properties'}>
			<Link
				to="/properties/create"
				style={{
					position: 'fixed',
					right: '30px',
					bottom: '30px',
					zIndex: 90,
				}}
			>
				<button
					className="btn btn-primary btn-rounded shadow-lg"
					style={{
						borderRadius: '60px',
						fontWeight: 'bold',
						width: '70px',
						height: '70px',
					}}
				>
					<GrAdd size={30} />
				</button>
			</Link>
			<div className="row">
				{properties.map((val, i) => {
					return (
						<div className="col-xl-3 col-sm-4 col-lg-6" key={`prop-${i}`}>
							<EachProperty data={val} />
						</div>
					)
				})}
			</div>
		</Layout>
	)
}
