import React from 'react'
import CreatePropertyForm from './components/CreatePropertyForm'
import Layout from '../../components/Layout/Layout'

export default function CreateProperty(props) {
	return (
		<Layout pageName={'properties_create'}>
			<CreatePropertyForm data={null} />
		</Layout>
	)
}
