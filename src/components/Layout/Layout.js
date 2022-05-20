import React from 'react'
import { useSelector } from 'react-redux'
import Header from './Header'
import SideNav from './SideNav'

export default function Layout({ children, pageName }) {

	const { user } = useSelector(state => state.auth)

	if(!user){
		return null
	}

	return (
		<div id="layout-wrapper">
			<Header />
			<SideNav pageName={pageName} />
			<div className="main-content">
				<div className="page-content">{children}</div>
			</div>
		</div>
	)
}
