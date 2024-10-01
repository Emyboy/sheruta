'use client'

import { useAuthContext } from '@/context/auth.context'
import { useState } from 'react'
import AnalyticsService from '@/firebase/service/analytics/analytics.firebase'
import { DocumentData } from 'firebase/firestore'
import { AnalyticsDataDetails } from '@/firebase/service/analytics/analytics.types'

export default function useAnalytics() {
	const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false)

	const {
		authState: { user },
	} = useAuthContext()

	const addAnalyticsData = async (
		type: 'posts' | 'calls' | 'messages',
		location_keyword_id: string,
	): Promise<DocumentData | undefined> => {
		try {
			if (!user) return undefined

			//check if analytics data exists for this location
			const locationExists =
				await AnalyticsService.getDataByLocationKeyword(location_keyword_id)

			//update if location exists
			if (locationExists) {
				return await AnalyticsService.updateData({
					[type]: 1,
					location_keyword_id,
				})
			} else {
				return await AnalyticsService.addData({
					[type]: 1,
					location_keyword_id,
					uuid: crypto.randomUUID(),
				})
			}
		} catch (err) {
			console.log(err)
		}
	}

	const getTrendingLocations = async (): Promise<
		AnalyticsDataDetails[] | null
	> => {
		try {
			setIsAnalyticsLoading(true)

			//Fetch all analytics
			const counters = await AnalyticsService.getAllData()

			if (!counters) {
				return null
			}

			// Process the counters and accumulate totals
			const processedCounters = counters.map((counter) => {
				const { calls = 0, messages = 0, posts = 0 } = counter // Destructure and provide default values
				const total = calls + messages + posts // Accumulate the total

				return { ...counter, total } // Add the total to the counter object
			})

			// Sort the counters based on the total (descending order)
			const sortedCounters = processedCounters.sort((a, b) => b.total - a.total)

			return sortedCounters
		} catch (err) {
			console.error('Error fetching trending locations:', err)
			return null
		} finally {
			setIsAnalyticsLoading(false)
		}
	}

	const getAnalyticsData = async (location_keyword_id: string) => {
		try {
			setIsAnalyticsLoading(true)
			return await AnalyticsService.getDataByLocationKeyword(
				location_keyword_id,
			)
		} catch (err) {
			console.log(err)
		} finally {
			setIsAnalyticsLoading(false)
		}
	}

	return {
		addAnalyticsData,
		getAnalyticsData,
		getTrendingLocations,
		isAnalyticsLoading,
	}
}
