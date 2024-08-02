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
    Tooltip,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    VStack,
    Icon,
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
    BiBadgeCheck,
    BiBookmark,
    BiChat,
    BiDotsHorizontal,
    BiDotsHorizontalRounded,
    BiEnvelope,
    BiLeftArrow,
    BiMap,
    BiMapPin,
    BiMessage,
    BiMessageRoundedDetail,
    BiPencil,
    BiPhone,
    BiPhoneCall,
    BiPhoneOutgoing,
    BiShare,
    BiSolidBadgeCheck,
    BiTrash,
} from 'react-icons/bi'
import { FaAngleLeft } from 'react-icons/fa'
import { BiLocationPlus } from 'react-icons/bi'
import { TbSend } from 'react-icons/tb'
import { useAuthContext } from '@/context/auth.context'
import { HiEllipsisHorizontal, HiEllipsisVertical } from 'react-icons/hi2'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import { capitalizeString, timeAgo } from '@/utils/index.utils'
import useCommon from '@/hooks/useCommon'

interface PageParams {
    [key: string]: string | undefined
}

const size = {
    base: '98vw',
    lg: '1000px',
}

interface Props {
    // postData: DocumentData
    [key: string]: any // Allows for arbitrary properties
}

const getDataFromRef = async (docRef: DocumentReference): Promise<any> => {
    const recordSnap = await getDoc(docRef)

    return recordSnap.exists() ? recordSnap.data() : null
}

const Post = ({ postData }: Props) => {
    const { colorMode } = useColorMode()

    const { showToast } = useCommon()
    // Destructure
    const {
        updatedAt,
        description,
        google_location_text,
        userDoc,
        userInfoDoc,
        serviceTypeDoc,
        locationKeywordDoc,
        budget,
        payment_type,
        loggedInUser,
    } = postData || {}

    // Handle redirect
    const router = useRouter()

    const handleRedirect = (url: string) => {
        return () => {
            router.replace(url)
        }
    }

    // Function to check if user is post admin
    const isPostAdmin = (): boolean => loggedInUser?._id === userInfoDoc?._user_id

    const generateShareUrl = (): void => {
        if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
            window.navigator.clipboard.writeText(window.location.href)
                .then(() => {
                    showToast({
                        message: 'Link has been copied successfully',
                        status: 'info',
                    });
                })
                .catch(err => {
                    showToast({
                        message: 'Failed to copy the link',
                        status: 'error',
                    });
                    console.error('Could not copy text: ', err);
                });
        }
    };

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
                    <HStack flexWrap={'wrap'}>
                        <Popover>
                            <PopoverTrigger>
                                <IconButton
                                    fontSize={'24px'}
                                    aria-label="Options"
                                    icon={<BiDotsHorizontalRounded />}
                                />
                            </PopoverTrigger>
                            <PopoverContent
                                color={colorMode === 'dark' ? '#F0F0F0' : '#000'}
                                bg={colorMode === 'dark' ? '#202020' : '#fff'}
                                width={'100%'}
                                padding={4}
                            >
                                <PopoverBody p={0}>
                                    <VStack spacing={2} align="flex-start">
                                        {isPostAdmin() && (
                                            <Box
                                                cursor={'pointer'}
                                                display="flex"
                                                alignItems="center"
                                                padding={1}
                                                _hover={{ bg: 'gray.700' }}
                                                width={'100%'}
                                            >
                                                <BiPencil />
                                                <Text marginLeft={2}>Edit</Text>
                                            </Box>
                                        )}
                                        <Box
                                            cursor={'pointer'}
                                            display="flex"
                                            alignItems="center"
                                            padding={1}
                                            _hover={{ bg: 'gray.700' }}
                                            width={'100%'}
                                            onClick={() => {
                                                generateShareUrl()
                                            }}
                                        >
                                            <BiShare />
                                            <Text marginLeft={2}>Share</Text>
                                        </Box>
                                        {isPostAdmin() && (
                                            <Box
                                                cursor={'pointer'}
                                                display="flex"
                                                alignItems="center"
                                                padding={1}
                                                _hover={{ bg: 'gray.700' }}
                                                width={'100%'}
                                                color={'red.400'}
                                            >
                                                <BiTrash />
                                                <Text marginLeft={2}>Delete</Text>
                                            </Box>
                                        )}
                                    </VStack>
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>
                        <IconButton
                            fontSize={'24px'}
                            aria-label="se"
                            icon={<BiBookmark />}
                        />
                    </HStack>
                </Flex>

                <Flex justifyContent={'space-between'} alignItems={'center'}>
                    <Flex gap={2} mt={2} p={2} alignItems={'center'} color="#00BC73">
                        <Text fontSize={'25px'}>
                            <BiMap />
                        </Text>{' '}
                        <Text fontSize={'15px'}> {locationKeywordDoc?.name} </Text>
                    </Flex>

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
                </Flex>

                <Text mt={5} mb={5} whiteSpace={'pre-wrap'}>
                    {description}
                </Text>

                <HStack>
                    <Flex
                        flexWrap={'wrap'}
                        width={'100%'}
                        direction={'row'}
                        justifyContent={'space-between'}
                    >
                        <Box>
                            <Tooltip
                                bgColor={colorMode === 'dark' ? '#fff' : 'gray.300'}
                                hasArrow
                                label={`Call ${userDoc?.first_name}`}
                                color={colorMode === 'dark' ? 'black' : 'black'}
                            >
                                <IconButton
                                    variant="outline"
                                    aria-label={`Call ${userDoc?.first_name}`}
                                    border="none"
                                    fontSize={'24px'}
                                    icon={<BiPhone />}
                                    onClick={() => {
                                        if (userInfoDoc?.primary_phone_number) {
                                            handleRedirect(`tel:${userInfoDoc.primary_phone_number}`)
                                        }
                                    }}
                                />
                            </Tooltip>
                            <Tooltip
                                bgColor={colorMode === 'dark' ? '#fff' : 'gray.300'}
                                hasArrow
                                label={`Message ${userDoc?.first_name}`}
                                color={colorMode === 'dark' ? 'black' : 'black'}
                            >
                                <IconButton
                                    variant="outline"
                                    aria-label={`Message ${userDoc?.first_name}`}
                                    border="none"
                                    fontSize="24px"
                                    icon={<BiMessageRoundedDetail />}
                                    onClick={handleRedirect(`/messages/${userDoc?._id}`)}
                                />
                            </Tooltip>
                        </Box>
                        <Flex flexWrap={'wrap'}>
                            <Text fontSize={'1.4rem'} fontWeight={'700'}>
                                &#8358;{budget?.toLocaleString()}
                            </Text>
                            <Text fontSize={20} fontWeight={200}>
                                {'/'}
                                {payment_type}
                            </Text>
                        </Flex>
                    </Flex>
                </HStack>
                <HStack
                    mt={2}
                    mb={2}
                    borderBottom={`.5px solid ${colorMode === 'light' ? '#1117171A' : '#515151'}`}
                ></HStack>
            </Box>
            <Box marginTop={10}>
                <UserCard
                    handleRedirect={handleRedirect}
                    name={capitalizeString(userDoc?.first_name) + ' ' + userDoc?.last_name}
                    handle={userDoc?.first_name}
                    profilePicture={userDoc?.avatar_url}
                    bio={"A well renowed Software Engineer with 99 years of experience."}
                />
            </Box>
        </>
    )
}

const UserCard = ({ name, handle, bio, profilePicture, userInfoDoc, handleRedirect }: Props) => {
    return (
        <Box bgColor="#202020" borderRadius="15px">
            <Flex bg="brand_darker" p={4} alignItems="center" borderRadius="15px">
                <Avatar size="lg" src={profilePicture} />
                <Box ml={2}>
                    <Flex gap={1} alignItems={'center'}>
                        <Text fontWeight="bold" color="white">
                            {name}
                        </Text>
                        <Icon as={BiSolidBadgeCheck} color="blue.500" ml={1} />
                    </Flex>
                    <Text color="#fff" fontSize="sm">
                        @{handle}
                    </Text>
                    <Text color="#fff" fontSize="sm">
                        {bio}
                    </Text>
                </Box>
            </Flex>

            <HStack
                p={4}
                justifyContent={'space-between'}
                alignItems={'center'}
                bgColor={'gray.600'}
                color={'#fff'}
            >
                <Text fontWeight={"semibold"}>Book Inspection</Text>
                <Flex justifyContent="flex-end">
                    <IconButton
                        aria-label="sese"
                        icon={<BiEnvelope />}
                        variant="ghost"
                        colorScheme="white"
                        size={"md"}
                        onClick={handleRedirect(`/messages/${userInfoDoc?._user_id}`)}
                    />
                    <IconButton
                        aria-label="sese"
                        icon={<BiPhone />}
                        variant="ghost"
                        colorScheme="white"
                        ml={2}
                        size={"md"}
                        onClick={() => {
                            if (userInfoDoc?.primary_phone_number) {
                                handleRedirect(`tel:${userInfoDoc.primary_phone_number}`)
                            }
                        }}
                    />
                </Flex>
            </HStack>
        </Box>
    )
}

export default function Page({ params }: { params: PageParams }) {
    const [isFetching, setIsFetching] = useState<boolean>(false)

    const { authState } = useAuthContext()


    const [requestData, setRequestData] = useState<Partial<DocumentData>>({})

    useEffect(() => {
        if (Object.keys(authState?.user || {}).length) {
            setRequestData((prev) => ({
                ...prev,
                loggedInUser: authState.user
            }))
        }
    }, [authState.user])

    const requestId = params.request_id

    const getRequest = async (): Promise<any> => {
        try {

            setIsFetching(true)

            const result = await SherutaDB.get({
                collection_name: 'requests',
                document_id: requestId as string,
            })

            if (
                result &&
                Object.keys(result) &&
                typeof result?._user_ref !== 'undefined'
            ) {
                let userInfoDoc: DocumentData | undefined = undefined

                //get poster's document from database
                const [userDoc, serviceTypeDoc, locationKeywordDoc] = await Promise.all(
                    [
                        getDataFromRef(result._user_ref),
                        getDataFromRef(result._service_ref),
                        getDataFromRef(result._location_keyword_ref),
                    ],
                )

                if (userDoc?._id) {
                    userInfoDoc = await UserInfoService.get(userDoc?._id)
                }

                setRequestData((prev) => ({
                    ...prev,
                    ...result,
                    userDoc,
                    userInfoDoc,
                    serviceTypeDoc,
                    locationKeywordDoc
                }))

                setIsFetching(false)
            } else {
                //redirect back to homepage
                // Router.push('/')
            }
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
                        <Post postData={requestData} />
                    </Box>
                </ThreeColumnLayout>
            </MainContainer>
        </Flex>
    )
}
