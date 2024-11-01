'use client'
import { DEFAULT_PADDING } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import { Button, Flex, Text, Image, flexbox } from '@chakra-ui/react'
import React from 'react'
import { UpdateProfilePopup } from '@/app/user/[user_id]/(user-profile)/promoteProfileModal/updateProfileSnippet'


type Props = {}

export default function PromoteProfile({}: Props) {
	
	const { authState } = useAuthContext()
    const firebaseImageUrl =
  "https://firebasestorage.googleapis.com/v0/b/sheruta-1368d.appspot.com/o/new-sheruta-images%2FSheruta%20corpers%20community.jpg?alt=media&token=2f071aa7-a8c1-4165-a72f-01baf0de4c3b";
  const user_id = authState.user?._id;

	return (
		<>
			{authState?.user && (
				<Flex
					justifyContent={'center'}
					h={{base: "600px", md: '300px'}}
					backgroundPosition={'center'}
					backgroundSize={'cover'}
					mb={DEFAULT_PADDING}
					position={'relative'}
					overflow={'hidden'}
                    flexDirection={{base: "column", md: 'row'}}
                   
				>
                    	<Image
										objectFit="cover"
										// maxW={{ base: '100%', sm: '500px' }}
										w={{ md: '300px'}}
										src={`${firebaseImageUrl}`}
										alt="Profile Image"
									/>
					<Flex
						// zIndex={10}
						justifyContent={'center'}
						alignItems={'center'} 
                        m={5}
					>
						<Flex 
                        flexDirection={'column'}
                        >
                        <Text fontWeight={'700'} fontSize={{base: "large", md: 'x-large'}} m={{ base: 6, md: 0 }} px={5} pb={3}>
						Get seen by most
						</Text>
                       <Flex>
                      
                       </Flex>
                       <Flex
                       justifyContent={'center'}
                       alignItems={'center'} 
                       >
                       {/* <Button
							colorScheme=""
							px={30}
							bg="dark_lighter"
							color={'dark'}
						>
							Promote profile
						</Button> */}
                        <UpdateProfilePopup profileOwnerId={user_id} buttonBgColor={"dark_lighter"} buttonColor={'dark'}/>
                       </Flex>
                        </Flex>
						
					</Flex>
					{/* <Flex
						position={'absolute'}
						h="110%"
						w="110%"
						// className="overlay"
						zIndex={0}
					/> */}
                     
				</Flex>
               
			)}
		</>
	)
}
