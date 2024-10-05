'use client';

import { useAuthContext } from "@/context/auth.context";
import { useNotificationContext } from "@/context/notifications.context";
import { HostRequestDataDetails } from "@/firebase/service/request/request.types";
import { createNotification } from "@/utils/actions";
import { Box, Button, Circle, Flex, HStack, Icon, Link, Text, useColorModeValue } from "@chakra-ui/react";
import { BiQuestionMark, BiSolidIdCard } from "react-icons/bi";
import { BsExclamationTriangle } from "react-icons/bs";
import { FaQuestion } from "react-icons/fa6";
import { IconType } from "react-icons/lib";


const AlertBox = ({ icon, title, message, showButton, onClick }: {
    icon: IconType,
    title: string,
    message: string,
    showButton?: boolean,
    onClick?: () => void
}) => {
    const circleBgColor = useColorModeValue('#e4faa85c', '#e4faa814')

    return (
        <Box py={12} px={10}>
            <Flex
                flexDir={'column'}
                justifyContent={'center'}
                width="100%"
                minH="50dvh"
            >
                <Flex alignItems={'center'} flexDir={'column'} gap="15px">
                    <Circle
                        borderRadius={'full'}
                        bgColor={circleBgColor}
                        minW={'100px'}
                        minH={'100px'}
                    >
                        <Icon as={icon} w={16} h={16} color="green.400" />
                    </Circle>
                    <HStack gap="15px" alignItems={'center'} flexDir={'column'}>
                        <Text fontWeight={'600'}>{title}</Text>
                        <Text textAlign={'center'}>{message}</Text>
                        {(showButton) ? <Button onClick={onClick} variant="subtle" bgColor="brand">Request</Button> : null}
                    </HStack>
                </Flex>
            </Flex>
        </Box>
    )
}

export default function VerificationComponent({ request }: { request: HostRequestDataDetails }) {

    const { authState: { user, user_info } } = useAuthContext()
    const circleBgColor = useColorModeValue('#e4faa85c', '#e4faa814')

    // const handleClick = async () => {
    //     try {
    //         (await createNotification({
    //             is_read: false,
    //             message: NotificationsBodyMessage.profile_view,
    //             recipient_id: request._user_ref._id,
    //             type: 'profile_view',
    //             sender_details: authState.user
    //                 ? {
    //                     avatar_url: authState.user.avatar_url,
    //                     first_name: authState.user.first_name,
    //                     last_name: authState.user.last_name,
    //                     id: authState.user._id,
    //                 }
    //                 : null,
    //             action_url: `/user/${request._user_ref._id}`,
    //         }))
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }
    // if (!user_info?.is_verified) {
    //     return (
    //         <AlertBox icon={BsExclamationTriangle} title="Account Verification Required" message="Please verify your account to proceed" />
    //     )
    // }

    // if (!request.user_info.is_verified) {
    //     return (
    //         <AlertBox icon={FaQuestion} title="Feature currently unavailable" message="This host's account is not verified yet." />
    //     )
    // }

    // BiSolidIdCard



    return (
        <AlertBox icon={BiSolidIdCard} title="Request A Backgound Check" message="Click on the button below to request a backgound check of the host" showButton={true} />

    )
}