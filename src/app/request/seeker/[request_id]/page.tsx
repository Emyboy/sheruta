'use client'

import SherutaDB from '@/firebase/service/index.firebase'
import { useEffect, useState } from 'react'
import {
	createSeekerRequestDTO,
	PaymentPlan,
	RequestData,
} from '@/firebase/service/request/request.types'
import {
	DocumentData,
	DocumentReference,
	getDoc,
	Timestamp,
} from 'firebase/firestore'

import MainContainer from '@/components/layout/MainContainer'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import {
	Box,
	Flex,
	Alert,
	AlertIcon,
	Text,
	Button,
	IconButton,
	Input,
	Avatar,
	Badge,
	Heading,
	HStack,
	useDisclosure,
	useColorMode,
} from '@chakra-ui/react'
import { ArrowBackIcon, PhoneIcon } from '@chakra-ui/icons'
import React from 'react'
import MainLeftNav from '@/components/layout/MainLeftNav'
import { DEFAULT_PADDING } from '@/configs/theme'
import MainHeader from '@/components/layout/MainHeader'
import CreateSeekerForm from '@/components/forms/CreateSeekerForm'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import {
	BiBookmark,
	BiChat,
	BiLeftArrow,
	BiMap,
	BiMapPin,
	BiMessage,
	BiPhone,
} from 'react-icons/bi'
import { FaAngleLeft } from 'react-icons/fa'
import { BiLocationPlus } from 'react-icons/bi'
import { TbSend } from 'react-icons/tb'
import { useAuthContext } from '@/context/auth.context'
import { HiEllipsisHorizontal, HiEllipsisVertical } from 'react-icons/hi2'

interface PageParams {
	[key: string]: string | undefined
}

const size = {
	base: '98vw',
	lg: '1000px',
}

function timeAgo(updatedAt: { seconds: number; nanoseconds: number }): string {
	if (typeof updatedAt === 'undefined') return 'unknown'

	const updatedDate = new Date(
		updatedAt.seconds * 1000 + updatedAt.nanoseconds / 1000000,
	)
	const now = new Date()
	const seconds = Math.floor((now.getTime() - updatedDate.getTime()) / 1000)

	const intervals = {
		year: 365 * 24 * 60 * 60,
		month: 30 * 24 * 60 * 60,
		week: 7 * 24 * 60 * 60,
		day: 24 * 60 * 60,
		hour: 60 * 60,
		minute: 60,
		second: 1,
	}

	for (const [unit, value] of Object.entries(intervals)) {
		const result = Math.floor(seconds / value)
		if (result >= 1) {
			return `${result} ${unit}${result > 1 ? 's' : ''} ago`
		}
	}

	return 'just now'
}

///sample object

const s = {
	_state_ref: {
		converter: null,
		_key: {
			path: {
				segments: [
					'projects',
					'sheruta-dev-2d4f1',
					'databases',
					'(default)',
					'documents',
					'states',
					'b639b939-5965-480a-abad-60a40e4ac7771707571804780',
				],
				offset: 5,
				len: 2,
			},
		},
		type: 'document',
		firestore: {
			app: {
				_isDeleted: false,
				_options: {
					apiKey: 'AIzaSyDTd4f0CSzNGj7KzIa4rAPX6MeUJw62D6Q',
					authDomain: 'sheruta-dev-2d4f1.firebaseapp.com',
					projectId: 'sheruta-dev-2d4f1',
					storageBucket: 'sheruta-dev-2d4f1.appspot.com',
					messagingSenderId: '932622767496',
					appId: '1:932622767496:web:15d5531caa1b324993563d',
				},
				_config: {
					name: '[DEFAULT]',
					automaticDataCollectionEnabled: false,
				},
				_name: '[DEFAULT]',
				_automaticDataCollectionEnabled: false,
				_container: {
					name: '[DEFAULT]',
					providers: {},
				},
			},
			databaseId: {
				projectId: 'sheruta-dev-2d4f1',
				database: '(default)',
			},
			settings: {
				host: 'firestore.googleapis.com',
				ssl: true,
				ignoreUndefinedProperties: false,
				cacheSizeBytes: 41943040,
				experimentalForceLongPolling: false,
				experimentalAutoDetectLongPolling: true,
				experimentalLongPollingOptions: {},
				useFetchStreams: true,
			},
		},
	},
	deleteDate: {
		seconds: 1727185941,
		nanoseconds: 542000000,
	},
	_user_ref: {
		converter: null,
		_key: {
			path: {
				segments: [
					'projects',
					'sheruta-dev-2d4f1',
					'databases',
					'(default)',
					'documents',
					'users',
					'b4Sx53cu5oNHNSbfwtYNG4Cy3TR2',
				],
				offset: 5,
				len: 2,
			},
		},
		type: 'document',
		firestore: {
			app: {
				_isDeleted: false,
				_options: {
					apiKey: 'AIzaSyDTd4f0CSzNGj7KzIa4rAPX6MeUJw62D6Q',
					authDomain: 'sheruta-dev-2d4f1.firebaseapp.com',
					projectId: 'sheruta-dev-2d4f1',
					storageBucket: 'sheruta-dev-2d4f1.appspot.com',
					messagingSenderId: '932622767496',
					appId: '1:932622767496:web:15d5531caa1b324993563d',
				},
				_config: {
					name: '[DEFAULT]',
					automaticDataCollectionEnabled: false,
				},
				_name: '[DEFAULT]',
				_automaticDataCollectionEnabled: false,
				_container: {
					name: '[DEFAULT]',
					providers: {},
				},
			},
			databaseId: {
				projectId: 'sheruta-dev-2d4f1',
				database: '(default)',
			},
			settings: {
				host: 'firestore.googleapis.com',
				ssl: true,
				ignoreUndefinedProperties: false,
				cacheSizeBytes: 41943040,
				experimentalForceLongPolling: false,
				experimentalAutoDetectLongPolling: true,
				experimentalLongPollingOptions: {},
				useFetchStreams: true,
			},
		},
	},
	seeking: true,
	_service_ref: {
		converter: null,
		_key: {
			path: {
				segments: [
					'projects',
					'sheruta-dev-2d4f1',
					'databases',
					'(default)',
					'documents',
					'services',
					'carry-over',
				],
				offset: 5,
				len: 2,
			},
		},
		type: 'document',
		firestore: {
			app: {
				_isDeleted: false,
				_options: {
					apiKey: 'AIzaSyDTd4f0CSzNGj7KzIa4rAPX6MeUJw62D6Q',
					authDomain: 'sheruta-dev-2d4f1.firebaseapp.com',
					projectId: 'sheruta-dev-2d4f1',
					storageBucket: 'sheruta-dev-2d4f1.appspot.com',
					messagingSenderId: '932622767496',
					appId: '1:932622767496:web:15d5531caa1b324993563d',
				},
				_config: {
					name: '[DEFAULT]',
					automaticDataCollectionEnabled: false,
				},
				_name: '[DEFAULT]',
				_automaticDataCollectionEnabled: false,
				_container: {
					name: '[DEFAULT]',
					providers: {},
				},
			},
			databaseId: {
				projectId: 'sheruta-dev-2d4f1',
				database: '(default)',
			},
			settings: {
				host: 'firestore.googleapis.com',
				ssl: true,
				ignoreUndefinedProperties: false,
				cacheSizeBytes: 41943040,
				experimentalForceLongPolling: false,
				experimentalAutoDetectLongPolling: true,
				experimentalLongPollingOptions: {},
				useFetchStreams: true,
			},
		},
	},
	stateId: 'b639b939-5965-480a-abad-60a40e4ac7771707571804780',
	google_location_object: {
		geometry: {
			location: {
				lat: 6.464587400000001,
				lng: 3.5725244,
			},
		},
		formatted_address: 'Aja, Lekki 106104, Lagos, Nigeria',
	},
	uuid: '10ea2048-7eb2-451e-a4d4-e39a83fb6f30',
	_location_keyword_ref: {
		converter: null,
		_key: {
			path: {
				segments: [
					'projects',
					'sheruta-dev-2d4f1',
					'databases',
					'(default)',
					'documents',
					'location_keywords',
					'ajah',
				],
				offset: 5,
				len: 2,
			},
		},
		type: 'document',
		firestore: {
			app: {
				_isDeleted: false,
				_options: {
					apiKey: 'AIzaSyDTd4f0CSzNGj7KzIa4rAPX6MeUJw62D6Q',
					authDomain: 'sheruta-dev-2d4f1.firebaseapp.com',
					projectId: 'sheruta-dev-2d4f1',
					storageBucket: 'sheruta-dev-2d4f1.appspot.com',
					messagingSenderId: '932622767496',
					appId: '1:932622767496:web:15d5531caa1b324993563d',
				},
				_config: {
					name: '[DEFAULT]',
					automaticDataCollectionEnabled: false,
				},
				_name: '[DEFAULT]',
				_automaticDataCollectionEnabled: false,
				_container: {
					name: '[DEFAULT]',
					providers: {},
				},
			},
			databaseId: {
				projectId: 'sheruta-dev-2d4f1',
				database: '(default)',
			},
			settings: {
				host: 'firestore.googleapis.com',
				ssl: true,
				ignoreUndefinedProperties: false,
				cacheSizeBytes: 41943040,
				experimentalForceLongPolling: false,
				experimentalAutoDetectLongPolling: true,
				experimentalLongPollingOptions: {},
				useFetchStreams: true,
			},
		},
	},
	serviceId: 'carry-over',
	createdAt: {
		seconds: 1721829142,
		nanoseconds: 589000000,
	},
	google_location_text: 'Aja, Lekki 106104, Lagos, Nigeria',
	budget: 10000,
	updatedAt: {
		seconds: 1721829142,
		nanoseconds: 589000000,
	},
	description: 'Just testing baba',
	payment_type: 'weekly',
	locationKeywordId: 'ajah',
}

const _ref = {
	_id: 'b4Sx53cu5oNHNSbfwtYNG4Cy3TR2',
	last_seen: {
		seconds: 1721564202,
		nanoseconds: 825000000,
	},
	account_status: 'active',
	avatar_url:
		'https://lh3.googleusercontent.com/a/ACg8ocIVE9jB8NYZgDB5vSnIJXDsMh6s-jQmdRopwOeTU9HygNIsN9Hp=s96-c',
	email: 'ugorji757@gmail.com',
	first_name: 'simon',
	providerId: 'google',
	updatedAt: {
		seconds: 1721564202,
		nanoseconds: 825000000,
	},
	last_name: 'ugorji',
	deleteDate: {
		seconds: 1726920956,
		nanoseconds: 985000000,
	},
	createdAt: {
		seconds: 1721564202,
		nanoseconds: 825000000,
	},
}

interface Props {
	postData: DocumentData
}

const getDataFromRef = async (docRef: DocumentReference): Promise<any> => {
	const recordSnap = await getDoc(docRef)

	return recordSnap.exists() ? recordSnap.data() : null
}

const Post = ({ postData }: Props) => {
	const { colorMode } = useColorMode()

	//destructure
	const {
		updatedAt,
		description,
		google_location_text,
		userDoc,
		serviceTypeDoc,
		budget,
	} = postData || {}

	console.log(serviceTypeDoc, userDoc, google_location_text)

	//show more / hide text
	const { isOpen, onOpen, onClose } = useDisclosure()

	return (
		<>
			<Box>
				<Flex alignItems="center" justifyContent="space-between">
					<Flex alignItems="center">
						<Avatar
							size="lg"
							src={userDoc?.avatar_url || 'https://via.placeholder.com/150'}
						/>
						<Box ml={2}>
							<Heading as="h3" size="md">
								New Apartment
							</Heading>
							<Text
								fontWeight={'300'}
								fontSize="sm"
								color={colorMode === 'light' ? '#11171766' : '#ddd'}
							>
								Posted {timeAgo(updatedAt)}
							</Text>
						</Box>
					</Flex>
					<HStack>
						<IconButton
							fontSize={'24px'}
							aria-label="se"
							icon={<HiEllipsisHorizontal />}
						/>
						<IconButton
							fontSize={'24px'}
							aria-label="se"
							icon={<BiBookmark />}
						/>
					</HStack>
				</Flex>

				<Flex gap={2} mt={2} p={2} alignItems={'center'} color="#00BC73">
					<Text fontSize={'25px'}>
						<BiMap />
					</Text>{' '}
					<Text fontSize={'15px'}> {google_location_text} </Text>
				</Flex>

				{/* <Text mt={4} mb={4} color={"#111717CC"}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer consequat
                    fringilla dolor, non feugiat nunc fringilla non. Sed a orci lobortis, Lorem
                    ipsum dolor sit amet, consectetur adipiscing elit. Integer consequat
                    fringilla dolor Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Integer consequat. Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit. Integer consequat. {isOpen ? (
                        <>Show more...</>
                    ) : (
                        <Button color="#00BC73" onClick={onOpen} size="sm" variant="link" textDecoration={"underline"}>
                            Show more...
                        </Button>
                    )}
                </Text> */}

				<Text mt={5} mb={5}>
					{isOpen ? description : `${description?.substring(0, 100)}... `}
					{isOpen ? (
						<Button
							color="#00BC73"
							onClick={onClose}
							size="sm"
							variant="link"
							textDecoration={'underline'}
						>
							{' '}
							Show less
						</Button>
					) : (
						description &&
						description?.length >= 100 && (
							<Button
								color="#00BC73"
								onClick={onOpen}
								size="sm"
								variant="link"
								textDecoration={'underline'}
							>
								{' '}
								Show more
							</Button>
						)
					)}
				</Text>

				<HStack color="#11171799">
					<IconButton
						variant="outline"
						aria-label="Call Sage"
						border="none"
						// justifyContent="flex-start"
						fontSize={'24px'}
						icon={<BiChat />}
					/>

					<IconButton
						variant="outline"
						aria-label="Call Sage"
						border="none"
						// justifyContent="flex-start"
						fontSize={'24px'}
						icon={<BiPhone />}
					/>
				</HStack>
				{/* //#515151 --dark */}
				{/* //#1117171A --light */}
				<HStack
					mt={2}
					mb={2}
					borderBottom={`.5px solid ${colorMode === 'light' ? '#1117171A' : '#515151'}`}
				></HStack>
				<HStack mt={4} spacing={2}>
					<Flex
						width={'100%'}
						direction={'row'}
						justifyContent={'space-between'}
					>
						<Text>
							<Badge
								fontSize={'15px'}
								padding={'4.67px 9.35px 4.67px 9.35px'}
								textTransform={'capitalize'}
								bgColor={'#E4FAA866'}
								borderRadius={'15px'}
								variant="subtle"
								fontWeight={300}
							>
								{serviceTypeDoc?.title}
							</Badge>
						</Text>
						<Text fontSize={'1.4rem'} fontWeight={'700'}>
							N{budget?.toLocaleString()}
						</Text>
					</Flex>
				</HStack>
			</Box>
		</>
	)
}

export default function Page({ params }: { params: PageParams }) {
	const [isFetching, setIsFetching] = useState<boolean>(false)

	const [requestData, setRequestData] = useState<Partial<DocumentData>>({})

	const { authState } = useAuthContext()

	console.log(authState)

	const requestId = params.request_id

	console.log(requestId)

	const getRequest = async (): Promise<any> => {
		try {
			setIsFetching(true)

			//get data from DB
			const result = await SherutaDB.get({
				collection_name: 'requests',
				document_id: requestId as string,
			})

			if (
				result &&
				Object.keys(result) &&
				typeof result?._user_ref !== 'undefined'
			) {
				//get poster's document from database
				const [userDoc, serviceTypeDoc] = await Promise.all([
					getDataFromRef(result._user_ref),
					getDataFromRef(result._service_ref),
				])

				setRequestData({
					...result,
					userDoc,
					serviceTypeDoc,
				})

				// const recordSnap = await getDoc(result._user_ref);

				// if (recordSnap.exists()) {
				//     const result = recordSnap.data();

				//     console.log("recordSnap data", result);

				// } else {
				//     console.log('No such record!');
				// }

				// console.log(recordSnap)
				//  // Assuming result._user_ref is a DocumentReference
				//     const userRef: DocumentReference<DocumentData> = result._user_ref;

				//     userRef.get().then((docSnap) => {
				//       if (docSnap.exists()) {
				//         console.log('Referenced document data:', docSnap.data());
				//       } else {
				//         console.log('No such document!');
				//       }
				//     }).catch((error) => {
				//       console.error('Error getting referenced document:', error);
				//     });
			} else {
				//redirect back to homepage
				// Router.push('/')
			}

			console.log(result)

			// //"10ea2048-7eb2-451e-a4d4-e39a83fb6f30"
		} catch (error: any) {
			console.log(error)
			setIsFetching(false)
		}
	}

	useEffect(() => {
		getRequest()
	}, [])

	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<ThreeColumnLayout header={<MainHeader />}>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					<Box p={DEFAULT_PADDING}>
						<Box marginBottom={5}>
							<Flex align="center" mb={4}>
								<IconButton
									// onClick={rout}
									aria-label="Search database"
									icon={<FaAngleLeft />}
									variant="ghost"
									_hover={{ bg: 'transparent' }}
									_focus={{ boxShadow: 'none' }}
									_active={{ bg: 'transparent' }}
								/>

								<Text fontSize="xl" fontWeight="bold">
									Go Back
								</Text>
							</Flex>
						</Box>
						{/* {requestData && Object.keys(requestData) ? (
                            <>
                                <Box maxWidth="600px" mx="auto">
                                    <Flex
                                        borderBottom={'1px'}
                                        width={'100%'}
                                        // rounded={'lg'}
                                        borderColor={'gray'}
                                        overflow={'hidden'}
                                    >
                                        <Flex
                                            // borderRight={'1px'}
                                            minW={'100%'}
                                            // borderColor={'brand_darker'}
                                            flexFlow={'column'}
                                        >
                                            <Flex p={DEFAULT_PADDING} gap={DEFAULT_PADDING}>
                                                <Avatar src="https://bit.ly/prosper-baba" />
                                                <Flex flexFlow={'column'}>
                                                    <Text>Person first name</Text>
                                                    <Text fontSize={'sm'} color={'text_muted'}>
                                                        Posted {timeAgo(requestData?.updatedAt)}
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                            <Flex flexFlow={'column'} p={DEFAULT_PADDING}>
                                                <Flex
                                                    alignItems={'center'}
                                                    as="address"
                                                    color="brand"
                                                    fontSize={'sm'}
                                                >
                                                    <BiLocationPlus /> Somewhere in town
                                                </Flex>
                                                <Text>{requestData?.description}</Text>
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                    <hr />
                                </Box>
                                <Box>
                                    <Flex>
                                        <Badge variant='solid' colorScheme='green'>
                                            Success
                                        </Badge>
                                    </Flex>

                                </Box>

                            </>
                        ) : (
                            'NO DATA '
                        )} */}
						<Post postData={requestData} />
					</Box>
				</ThreeColumnLayout>
			</MainContainer>
		</Flex>
	)
}
