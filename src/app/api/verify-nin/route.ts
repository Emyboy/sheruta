import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(req: Request) {
	const { nin, lastname } = await req.json()

	if (!nin || !lastname) {
		return NextResponse.json({ error: 'NIN is required' }, { status: 400 })
	}

	try {
		const response = await axios.post(
			`https://vapi.verifyme.ng/v1/verifications/identities/nin/${nin}`,
			{
				lastname,
			},
			{
				headers: {
					Authorization: `Bearer ${process.env.VERIFY_ME_API_KEY}`,
					'Content-Type': 'application/json',
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
