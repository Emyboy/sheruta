"use client"

import { useAuthContext } from '@/context/auth.context';
import { auth } from '@/firebase';
import AuthService from '@/firebase/service/auth/auth.firebase';
import useCommon from '@/hooks/useCommon';
import { Box, Button, Circle, Flex, Icon, Link, Spinner, Text, useColorModeValue } from '@chakra-ui/react';
import { onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { BiSolidBadgeCheck } from 'react-icons/bi';
import { FaTimes } from 'react-icons/fa';
import { IconType } from 'react-icons/lib';

const PUBLIC_URL = process.env.NEXT_PUBLIC_URL

const Progress = ({ icon, message, href }: { icon: IconType, message: string, href: string | null }) => {
    const circleBgColor = useColorModeValue('#e4faa85c', '#e4faa814')

    return (
        <Flex
            flexDir={'column'}
            justifyContent={'center'}
        >
            <Flex alignItems={'center'} flexDir={'column'} gap="20px">
                <Circle
                    borderRadius={'full'}
                    bgColor={circleBgColor}
                    minW={'100px'}
                    minH={'100px'}
                >
                    <Icon as={icon} w={16} h={16} color="green.400" />
                </Circle>
                <Flex gap="20px" alignItems={'center'} flexDir={'column'}>
                    <Text fontSize={"1.2rem"} fontWeight={'600'}>{message}</Text>
                    {(href) ? (
                        <Link href='/'>
                            <Button
                                variant={"outline"}
                                size="md"
                            >
                                Continue
                            </Button>
                        </Link>) : null}
                </Flex>
            </Flex>
        </Flex>
    )
}

const EmailVerification = () => {

    const [isVerified, setIsVerified] = useState<boolean>(false)

    const [isLoading, setIsLoading] = useState<boolean>(true)

    const [isSending, setIsSending] = useState<boolean>(false)

    const { showToast } = useCommon()

    const { logout } = useAuthContext()

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                user.reload().then(async () => {
                    setIsVerified(user.emailVerified);

                    await AuthService.update({
                        document_id: user.uid.toString(),
                        data: {
                            email_verified: true
                        }
                    })

                    setIsLoading(false);
                })
            } else {
                console.log("user is nothing")
                window.location.assign('/')
            }
        })
    }, [])

    const resendVerification = async () => {
        try {
            setIsSending(true);
            const user = auth.currentUser;

            if (!user) {
                return showToast(({
                    message: 'You must be logged in to access this page.',
                    status: 'error'
                }))
            }

            //redirecting to the homepage will trigger the onboarding process
            await sendEmailVerification(user, {
                url: `${PUBLIC_URL}`,
            })

            return showToast({
                message: 'Email verification sent successfully.',
                status: 'success'
            })

        } catch (err: any) {
            console.log(err)
            showToast({
                message: 'Error sending email verification',
                status: 'error'
            })
        } finally {
            setIsSending(false);
        }
    }

    return (
        <Flex
            width="100%"
            minH="50dvh"
            flexDir={'column'}
            justifyContent={'center'}
        >

            {(isLoading) ?

                <Box textAlign="center" mt="4" width="100%">
                    <Spinner size="xl" />
                    <Text mt="4">Verifying email...</Text>
                </Box>

                : (!isVerified) ?
                    <>
                        <Progress message='Email Not Verified' icon={FaTimes} href={null} />
                        <Box textAlign="center" mt="4" width="100%">
                            <Text>Please verify your email address by clicking the link in the email we sent you.</Text>
                        </Box>
                        <Box mt={4} width={'full'} textAlign={'center'}>
                            <Button
                                isLoading={isSending}
                                disabled={isSending}
                                variant={"outline"}
                                size="md"
                                onClick={async () => await resendVerification()}

                            >
                                Resend Verification Email
                            </Button>
                            <Text onClick={logout} textDecoration={"underline"} cursor={"pointer"} mt={4}>Signout from this account</Text>
                        </Box>
                    </> : <Progress message='Email verified successfully' icon={BiSolidBadgeCheck} href={'/'} />
            }

        </Flex >
    )
};

export default EmailVerification;
