import React, { useCallback, useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import CreatePropertyForm from './components/CreatePropertyForm'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import PropertyService from '../../services/PropertyService'
import { useParams } from 'react-router-dom'

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

export default function EditProperty() {
	const { property_id } = useParams()
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState(null)

	const getPropertyDetails = useCallback(async () => {
		try {
			setLoading(true)
			const res = await PropertyService.getPropertyById(property_id)
			setData(res.data)
		} catch (error) {
			return Promise.reject(error)
		}
	}, [property_id])

	useEffect(() => {
		getPropertyDetails()
	}, [getPropertyDetails])

	return (
		<Layout>
			{loading && !data ? (
				<div className="row justify-content-center h-100 align-items-center p-5 mt-5">
					<Spin indicator={antIcon} />
				</div>
			) : (
				<CreatePropertyForm data={data} />
			)}
		</Layout>
	)
}
