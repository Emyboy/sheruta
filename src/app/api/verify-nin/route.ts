import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(req: Request) {
	const { nin } = await req.json()

	if (!nin) {
		return NextResponse.json({ error: 'NIN is required' }, { status: 400 })
	}

	try {
		const response = await axios.post(
			// `https://vapi.verifyme.ng/v1/verifications/identities/nin/${nin}`,
			`https://api.prembly.com/identitypass/verification/vnin`,
			{
				number_nin: nin,
			},
			{
				headers: {
					'x-api-key': process.env.PREMBLY_APP_KEY,
					'app-id': process.env.PREMBLY_APP_ID,
				},
			},
		)

		return NextResponse.json(response.data, {
			status: 200,
			statusText: 'NIN Account Lookup Successful',
		})
	} catch (error: any) {
		// console.log(error)
		console.error('Error verifying NIN:', error.response?.data || error.message)

		return NextResponse.json(
			{ error: error.response?.data || 'Internal Server Error' },
			{ status: error.response?.status || 500 },
		)
	}
}
