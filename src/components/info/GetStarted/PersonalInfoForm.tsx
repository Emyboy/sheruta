'use client'
import { DEFAULT_PADDING } from '@/configs/theme'
import { Button, Divider, Flex, Input, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

type Props = {
    done?: () => void
}

export default function PersonalInfoForm({ }: Props) {
    const [isLoading, setIsLoading] = useState(false)
    return (
        <>
            <Flex mt='500px' flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
                <Text
                    textAlign={'center'}
                    as={'h1'}
                    fontSize={'3xl'}
                    className={'animate__animated animate__fadeInUp animate__faster'}
                >
                    {`Update personal information`}
                </Text>
                <Text
                    textAlign={'center'}
                    color={'dark_lighter'}
                    className={'animate__animated animate__fadeInUp'}
                >
                    {`Let you're potential match know more about you`}
                </Text>
                <VStack mt={'60px'} w={'full'} spacing={DEFAULT_PADDING}>
                    <Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
                        <Flex
                            justifyContent={'flex-start'}
                            flexDir={'column'}
                            w="full"
                            gap={2}
                        >
                            <Text color={'text_muted'} fontSize={'sm'}>
                                Occupation
                            </Text>
                            <Input
                                required
                                borderColor={'border_color'}
                                _dark={{ borderColor: 'dark_light' }}
                                placeholder="Ex. Jane"
                            />
                        </Flex>
                        <Flex
                            justifyContent={'flex-start'}
                            flexDir={'column'}
                            w="full"
                            gap={2}
                        >
                            <Text color={'text_muted'} fontSize={'sm'}>
                                Employment Status
                            </Text>
                            <Input
                                required
                                borderColor={'border_color'}
                                _dark={{ borderColor: 'dark_light' }}
                                placeholder="Ex. Doe"
                            />
                        </Flex>
                    </Flex>
                    <Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
                        <Flex
                            justifyContent={'flex-start'}
                            flexDir={'column'}
                            w="full"
                            gap={2}
                        >
                            <Text color={'text_muted'} fontSize={'sm'}>
                                Work Industry
                            </Text>
                            <Input
                                required
                                borderColor={'border_color'}
                                _dark={{ borderColor: 'dark_light' }}
                                placeholder="Ex. Jane"
                            />
                        </Flex>
                        <Flex
                            justifyContent={'flex-start'}
                            flexDir={'column'}
                            w="full"
                            gap={2}
                        >
                            <Text color={'text_muted'} fontSize={'sm'}>
                                Religion
                            </Text>
                            <Input
                                required
                                borderColor={'border_color'}
                                _dark={{ borderColor: 'dark_light' }}
                                placeholder="Ex. Doe"
                            />
                        </Flex>
                    </Flex>
                    <Divider my={DEFAULT_PADDING} />
                    <Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
                        <Flex
                            justifyContent={'flex-start'}
                            flexDir={'column'}
                            w="full"
                            gap={2}
                        >
                            <Text color={'text_muted'} fontSize={'sm'}>
                                Tiktok Username
                            </Text>
                            <Input
                                required
                                borderColor={'border_color'}
                                _dark={{ borderColor: 'dark_light' }}
                                placeholder="Ex. Jane"
                            />
                        </Flex>
                        <Flex
                            justifyContent={'flex-start'}
                            flexDir={'column'}
                            w="full"
                            gap={2}
                        >
                            <Text color={'text_muted'} fontSize={'sm'}>
                                Facebook Username
                            </Text>
                            <Input
                                required
                                borderColor={'border_color'}
                                _dark={{ borderColor: 'dark_light' }}
                                placeholder="Ex. Doe"
                            />
                        </Flex>
                    </Flex>
                    <Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
                        <Flex
                            justifyContent={'flex-start'}
                            flexDir={'column'}
                            w="full"
                            gap={2}
                        >
                            <Text color={'text_muted'} fontSize={'sm'}>
                                Instagram Username
                            </Text>
                            <Input
                                required
                                borderColor={'border_color'}
                                _dark={{ borderColor: 'dark_light' }}
                                placeholder="Ex. Jane"
                            />
                        </Flex>
                        <Flex
                            justifyContent={'flex-start'}
                            flexDir={'column'}
                            w="full"
                            gap={2}
                        >
                            <Text color={'text_muted'} fontSize={'sm'}>
                                Twitter Username
                            </Text>
                            <Input
                                required
                                borderColor={'border_color'}
                                _dark={{ borderColor: 'dark_light' }}
                                placeholder="Ex. Doe"
                            />
                        </Flex>
                    </Flex>
                    <Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
                        <Flex
                            justifyContent={'flex-start'}
                            flexDir={'column'}
                            w="full"
                            gap={2}
                        >
                            <Text color={'text_muted'} fontSize={'sm'}>
                                Linkedin URL
                            </Text>
                            <Input
                                required
                                borderColor={'border_color'}
                                _dark={{ borderColor: 'dark_light' }}
                                placeholder="Ex. Jane"
                            />
                        </Flex>
                    </Flex>
                    <br />
                    <Button type={'submit'} isLoading={isLoading}>{`Next`}</Button>
                </VStack>
            </Flex>
        </>
    )
}