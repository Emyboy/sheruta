"use client";

import { Box, Button, VStack, HStack, Text, Icon, Flex, Circle, theme, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { MdPhone, MdCreditCard, MdVerifiedUser } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { IconType } from 'react-icons/lib';
import VerifyNIN from './VerifyNIN';
console.log(theme.colors.gray)
const UserVerification = () => {

    const headingColor = useColorModeValue("#111717", "#fff");
    const descriptionColor = useColorModeValue("#11171799", "#fff");

    const { isOpen, onOpen, onClose } = useDisclosure();

    const router = useRouter();

    const handleContinue = () => {
        // Handle continue button logic
    };

    return (
        <Flex direction="column" align="center" justify="center" px={4} bg="gray.50">
            <VStack spacing={2} textAlign="center">

                <Circle bgColor={"#E4FAA866"} minW={"130px"} minH={"130px"}>
                    <Icon as={MdVerifiedUser} w={16} h={16} color="green.400" />
                </Circle>
                <Text fontSize="3xl" color={headingColor} fontWeight="500">Users Verification</Text>
                <Text fontSize="md" color={descriptionColor}>
                    Sheruta requires you to input and upload the right information and government-issued ID.
                </Text>

                {/* Verification Options */}
                <HStack
                    spacing={2}
                    mt={"10"}
                    w="full"
                    justify="center"
                    flexWrap={["wrap", "nowrap"]} // wrap on mobile, nowrap on larger screens
                >
                    <VerificationCard onOpen={() => {}} icon={MdPhone} text="Verify Phone" subText='coming soon...' />
                    <VerificationCard onOpen={onOpen} icon={MdCreditCard} text="Verify NIN" subText='National Identification Number' />
                </HStack>

            </VStack>
            <VerifyNIN isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
        </Flex>
    );
};

const VerificationCard = ({ icon, text, subText, onOpen }: {
    icon: IconType,
    text: string,
    subText: string,
    onOpen: () => void,
}) => {

    const headingColor = useColorModeValue("#111717", "#fff");
    const descriptionColor = useColorModeValue("#11171799", "#fff");

    return (
        <VStack
            border="1px"
            borderColor="#00BC73"
            borderRadius="lg"
            p={4}
            w="237px"
            minH="245px"
            justify="center"
            align="center"
            spacing={4}
            _hover={{ borderColor: 'green.400' }}
            cursor={"pointer"}
            onClick={onOpen}
        >
            <Circle bgColor={"#00BC731A"} minW={"50px"} minH={"50px"}>
                <Icon as={icon} w={8} h={8} color="green.400" />
            </Circle>
            <Text mt="2" fontSize="18px" fontWeight="400" color="gray.300">
                {text}
            </Text>

            <Text color={"gray"} fontSize={"sm"}>
                {subText}
            </Text>

        </VStack>
    );
}

export default UserVerification;
