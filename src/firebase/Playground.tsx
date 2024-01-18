'use client'
import React, { useEffect, useState } from 'react'
import {
	collection,
	query,
	getDocs,
	setDoc,
	doc,
	Timestamp,
	getDoc,
	where,
} from 'firebase/firestore'
import { db } from '@/firebase'

type Props = {
	theList: any[]
}

export default function HomePage({ theList }: Props) {
	const [name, setName] = useState('')
	const [active, setActive] = useState(theList[0].id)
	const [body, setBody] = useState('')

	const addRequest = async () => {
		try {
			const currentTime = Timestamp.fromDate(new Date())
			const serviceRef = await getDoc(doc(db, 'services', active))
			await setDoc(doc(db, 'requests', crypto.randomUUID()), {
				name: 'Los Angeles 2',
				state: 'CA',
				country: 'USA',
				body,
				createdAt: currentTime,
				service_ref: serviceRef.ref,
			})
		} catch (e) {
			console.error('Error adding document: ', e)
		}
	}

	const fetchData = async () => {
		try {
			const requestsRef = collection(db, 'requests')
			const serviceRef = await getDoc(doc(db, 'services', active))
			const q = query(requestsRef, where('service_ref', '==', serviceRef.ref))
			const querySnapshot = await getDocs(q)

			const promises = querySnapshot.docs.map(async (doc) => {
				let data: any = { id: doc.id, ...doc.data() }

				const serviceRef = await doc.data()['service_ref']
				const serviceDoc = await getDoc(serviceRef)
				const serviceData = await serviceDoc.data()

				data.service_ref = serviceData

				console.log('SERVICE DOC::', data)
				return data
			})

			const _list = await Promise.all(promises)

			console.log('THE LIST::', _list)
		} catch (e) {
			console.error('Error fetching data:', e)
		}
	}

	const createService = async () => {
		try {
			const currentTime = Timestamp.fromDate(new Date())
			await setDoc(doc(db, 'services', crypto.randomUUID()), {
				name,
				slug: name.toLocaleLowerCase().trim().replaceAll(' ', '-'),
				createdAt: currentTime,
			})
		} catch (e) {
			console.error('Error adding document: ', e)
		}
	}

	return (
		<div>
			<h1>The Heading</h1>
			<p>The sub heading</p>
			<button onClick={fetchData}>Fetch Data</button>
			<br />
			<div>
				<input onChange={(e) => setBody(e.target.value)} />
				<button onClick={addRequest} disabled={!body || !active}>
					Post Data
				</button>
				Active ID: {active}
			</div>
			<hr />
			<input onChange={(e) => setName(e.target.value)} value={name} />
			<button onClick={createService}>Create Service</button>
			<hr />
			<p>Service List</p>
			<ul>
				{theList.map((item) => {
					return (
						<li key={item.id} onClick={() => setActive(item.id)}>
							{item.name} {`ID:: ${item.id}`}
						</li>
					)
				})}
			</ul>
		</div>
	)
}
