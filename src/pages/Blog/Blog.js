import React from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import Layout from '../../components/Layout/Layout'
import BlogForm from './BlogForm'
import BlogList from './BlogList'

export default function Blog() {
  return (
		<Layout>
			<div className="container">
				<Tabs
					defaultActiveKey="create-post"
					id="uncontrolled-tab-example"
					className="mb-3"
				>
					<Tab eventKey="create-post" title="Create Post">
						<BlogForm />
					</Tab>
					<Tab eventKey="post-list" title="All Posts">
						<BlogList />
					</Tab>
				</Tabs>
			</div>
		</Layout>
	)
}
