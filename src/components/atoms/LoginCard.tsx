'use client'
import { DEFAULT_PADDING } from '@/configs/theme'
import { useAppContext } from '@/context/app.context'
import { useAuthContext } from '@/context/auth.context'
import { getRandomNumber } from '@/utils/index.utils'
import { Box, Button, Center, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { BiCheckCircle } from 'react-icons/bi'

type Props = {
    Icon?: any
}

export default function LoginCard({ Icon }: Props) {
    const { setAppState } = useAppContext();
    const { authState } = useAuthContext();

    if (authState.user) {
        return null;
    }

    return (
        <Flex justifyContent={'center'} w="full" h="full" alignItems={'center'}>
            <Box
                backgroundImage={`url('/assets/pintrest/${getRandomNumber(1, 10)}.jpg')`}
                minH={'500px'}
                rounded="lg"
                border={'1px'}
                minW={'60%'}
                maxW={`calc(100% - ${DEFAULT_PADDING})`}
                borderColor={'border_color'}
                _dark={{
                    borderColor: 'dark_light',
                }}
                m={10}
                position={'relative'}
            >
                <Flex
                    w="full"
                    h="full"
                    minH={'500px'}
                    justifyContent={'space-between'}
                    flex={1}
                    flexDir={'column'}
                    zIndex={40}
                    p={DEFAULT_PADDING}
                >
                    <Flex flexDirection={'column'} alignItems={'center'} zIndex={30} textAlign={'center'}>
                        {Icon && (
                            <Center opacity={'0.4'} mb={DEFAULT_PADDING}>
                                <Icon size={70} />
                            </Center>
                        )}
                        <Text fontSize={'xx-large'} fontWeight={'bold'}>
                            Join the community today
                        </Text>
                        <Text>Join the sheruta family today and <br />get access to:</Text>
                    </Flex>
                    <Flex flexDir={'column'} zIndex={30}>
                        <Flex alignItems={'center'} gap={2} fontSize={'lg'}>
                            <BiCheckCircle /> Messaging
                        </Flex>
                        <Flex alignItems={'center'} gap={2} fontSize={'lg'}>
                            <BiCheckCircle /> Find matches
                        </Flex>
                        <Flex alignItems={'center'} gap={2} fontSize={'lg'}>
                            <BiCheckCircle /> Book inspections
                        </Flex>
                        <Flex alignItems={'center'} gap={2} fontSize={'lg'}>
                            <BiCheckCircle /> Flat share updates
                        </Flex>
                        <Flex alignItems={'center'} gap={2} fontSize={'lg'}>
                            <BiCheckCircle />
                            and more...
                        </Flex>
                    </Flex>
                    <Button w="full" zIndex={30} onClick={() => setAppState({ show_login: true })}>
                        Get Started
                    </Button>
                </Flex>
                <Flex
                    h="full"
                    w="full"
                    top={0}
                    zIndex={0}
                    className="overlay"
                    position={'absolute'}
                />
            </Box>
        </Flex>
    )
}
