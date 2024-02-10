import React from 'react'
import HomePage from './(home-page)/home-page'

export const revalidate = 50
export default async function page() {
	return <HomePage locations={[]} states={[]} />
}
