import React from 'react'
import ConversationList from './ConversationList';
import Layout from '../../components/Layout/Layout';
import MessageDetails from './MessageDetails';

export default function Messages() {
	return (
		<Layout pageName={'messages'}>
			<div className="d-lg-flex">
				<ConversationList />
				<MessageDetails />
			</div>
		</Layout>
	)
}
