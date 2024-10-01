import { DocumentReference } from 'firebase/firestore'
import { z } from 'zod'
import { LocationKeywordData } from '../options/location-keywords/location-keywords.types'

export const AnalyticsDTO = z.object({
	uuid: z.string(),
	calls: z.number(),
	messages: z.number(),
	posts: z.number(),
	_location_keyword_ref: z.custom<DocumentReference | undefined>(
		(val) => val instanceof DocumentReference,
		{
			message: 'Must be a DocumentReference',
		},
	),
})

export type AnalyticsData = z.infer<typeof AnalyticsDTO>

export type AnalyticsDataDetails = Omit<
	AnalyticsData,
	'_location_keyword_ref'
> & {
	id: string
	_location_keyword_ref: LocationKeywordData
}
