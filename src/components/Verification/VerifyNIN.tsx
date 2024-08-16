"use client"

import { useState } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    VStack,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    useDisclosure,
    Alert,
    AlertIcon,
    useColorModeValue,
} from "@chakra-ui/react";

const VerifyNIN = ({ isOpen, onOpen, onClose }: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}) => {
    const [nin, setNin] = useState("");
    const [error, setError] = useState("");
    // const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
      // Use background color based on light or dark mode
  const modalBg = useColorModeValue("white", "black");



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple NIN validation: NIN should be 11 digits long
        if (nin.length !== 11 || isNaN(Number(nin))) {
            setError("Please enter a valid 11-digit NIN");
            return;
        }

        // Simulate a success response after submission
        toast({
            title: "NIN Verified.",
            description: "Your National Identification Number has been submitted.",
            status: "success",
            duration: 5000,
            isClosable: true,
        });

        // Clear form after submission
        setNin("");
        setError("");
        onClose(); // Close the modal after submission
    };

    return (
        <>
            {/* Modal for NIN verification */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Verify your NIN</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody  bg={modalBg}>
                        <Box>
                            <Alert mb={5} status='info' variant="subtle">
                                <AlertIcon />
                                Please do well to ensure that the NIN is correct and belongs to you
                            </Alert>

                            <form onSubmit={handleSubmit}>
                                <VStack spacing={4}>
                                    <FormControl id="nin" isInvalid={!!error}>
                                        <FormLabel>Enter your NIN</FormLabel>
                                        <Input
                                            type="text"
                                            value={nin}
                                            onChange={(e) => setNin(e.target.value)}
                                            placeholder="Enter your 11-digit NIN"
                                            maxLength={11}
                                        />
                                        {error && <FormErrorMessage>{error}</FormErrorMessage>}
                                    </FormControl>
                                </VStack>
                            </form>
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="green" onClick={handleSubmit} width="full">
                            Verify NIN
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default VerifyNIN;
