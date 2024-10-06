'use client'

import { creditTable } from '@/constants'
import { useAuthContext } from '@/context/auth.context'
import { useNotificationContext } from '@/context/notifications.context'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import { NotificationsBodyMessage } from '@/firebase/service/notifications/notifications.firebase'
import { HostRequestDataDetails } from '@/firebase/service/request/request.types'
import useCommon from '@/hooks/useCommon'
import { createNotification } from '@/utils/actions'
import {
    Box,
    Button,
    Circle,
    Flex,
    HStack,
    Icon,
    Text,
    useColorModeValue,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BiQuestionMark, BiSolidIdCard, BiSolidLock, BiSolidTimer } from 'react-icons/bi'
import { BsExclamationTriangle } from 'react-icons/bs'
import { FaSadTear } from 'react-icons/fa'
import { FaQuestion } from 'react-icons/fa6'
import { IconType } from 'react-icons/lib'

type ButtonProps = {
    active: boolean;
    label: string;
    onClick?: () => void;
    href?: string;
    isLoading?: boolean;
};

interface AlertBoxProps {
    icon: IconType;
    title: string;
    message: string;
    button?: ButtonProps;
}

const AlertBox: React.FC<AlertBoxProps> = ({ icon, title, message, button }) => {
    const circleBgColor = useColorModeValue('#e4faa85c', '#e4faa814');

    return (
        <Box py={12} px={10}>
            <Flex
                flexDir="column"
                justifyContent="center"
                width="100%"
                minH="50dvh"
            >
                <Flex alignItems="center" flexDir="column" gap="15px">
                    <Circle
                        borderRadius="full"
                        bgColor={circleBgColor}
                        minW="100px"
                        minH="100px"
                    >
                        <Icon as={icon} w={16} h={16} color="green.400" />
                    </Circle>
                    <HStack gap="15px" alignItems="center" flexDir="column">
                        <Text fontWeight="600">{title}</Text>
                        <Text textAlign="center">{message}</Text>
                        {button && button.active && (
                            button.href ? (
                                <Link href={button.href}>
                                    <Button variant="subtle" bgColor="brand">
                                        {button.label}
                                    </Button>
                                </Link>
                            ) : (
                                <Button isLoading={button.isLoading} isDisabled={button.isLoading} onClick={button.onClick} variant="subtle" bgColor="brand">
                                    {button.label}
                                </Button>
                            )
                        )}
                    </HStack>
                </Flex>
            </Flex>
        </Box>
    );
};
export default function VerificationComponent({
    request,
}: {
    request: HostRequestDataDetails
}) {

    const {
        authState: { user, user_info, flat_share_profile },
    } = useAuthContext()

    const { showToast } = useCommon();

    const [hasEnoughCredits, setHasEnoughCredits] = useState<boolean>(false)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        if ((flat_share_profile?.credits as number) >= creditTable.BACKGROUND_CHECK) {
            setHasEnoughCredits(true)
        }
    }, [flat_share_profile])

    const handleClick = async () => {
        try {
            setIsLoading(true)
            if (!user) {
                return showToast({
                    message: 'Please login to request background checks',
                    status: 'error',
                })
            }

            if (!hasEnoughCredits) {
                return showToast({
                    status: 'info',
                    message: "You don't have enough credits",
                })
            }


            const backgroundChecks = request?.background_checks || {};

            if (backgroundChecks?.[user._id]) {
                return showToast({
                    message: 'You have already requested a background check',
                    status: 'error',
                })
            }

            backgroundChecks[user._id] = {
                is_approved: 'pending'
            }

            await SherutaDB.update({
                collection_name: DBCollectionName.flatShareRequests,
                data: {
                    background_checks: { ...backgroundChecks },
                },
                document_id: request.id,
            });

            await createNotification({
                is_read: false,
                message: NotificationsBodyMessage.background_check,
                recipient_id: request._user_ref._id,
                type: 'background_check',
                sender_details: user
                    ? {
                        avatar_url: user.avatar_url,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        id: user._id,
                    }
                    : null,
                action_url: `/user/${request._user_ref._id}`,
            })

            showToast({
                message: 'Background check request submitted successfully.',
                status: 'success',
            });

            setIsLoading(false);
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false);
        }
    }

    if (!user || !user_info) {
        return (
            <AlertBox
                icon={BiSolidLock}
                title="Authorization Required"
                message="Please login to proceed with this request" />
        )
    }

    if (user_info?.is_verified === false) {
        return (
            <AlertBox icon={BsExclamationTriangle}
                title="Account Verification Required"
                message="Please verify your account to proceed"
                button={{ active: true, label: 'Verify account', href: '/verification' }} />
        )
    }

    if (request.user_info.is_verified === false) {
        return (
            <AlertBox icon={FaQuestion} title="Feature currently unavailable" message="This host's account is not verified yet." />
        )
    }

    // request not initiated
    if (typeof request?.background_checks?.[user?._id] === 'undefined') {
        return <AlertBox
            icon={BiSolidIdCard}
            title="Request A Backgound Check"
            message="Click on the button to request a backgound check of the host"
            button={{ active: true, label: 'Request check', onClick: handleClick, isLoading }}
        />
    }

    //request initiated but not approved
    if (request?.background_checks?.[user?._id]?.is_approved === 'pending') {
        return <AlertBox
            icon={BiSolidTimer}
            title="Request In Progress"
            message="Relax, the host is yet to approve your background check request"
        />
    }

    //request initiated but not approved
    if (request?.background_checks?.[user?._id]?.is_approved === false) {
        return <AlertBox
            icon={FaSadTear}
            title="Request Not Approved"
            message="We're sorry, but the host did not approve your request"
        />
    }

    return (
        <AlertBox
            icon={FaSadTear}
            title="Request Not Approved"
            message="We're sorry, but the host did not approve your request"
        />
    )

}
