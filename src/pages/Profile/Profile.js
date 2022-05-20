import React from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../../components/Layout/Layout';
import ProfileComponent from '../../components/Profile/ProfileComponent'

export default function Profile() {
	const params = useParams();
  return (
	<Layout>
		<ProfileComponent _user_id={params?.user_id} />
	</Layout>
  )
}
