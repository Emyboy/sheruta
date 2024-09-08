"use client";

import { useAuthContext } from "@/context/auth.context";
import FlatShareProfileService from "@/firebase/service/flat-share-profile/flat-share-profile.firebase";
import useCommon from "@/hooks/useCommon";
import { Box, Button, FormControl, FormLabel, Input, Select, VStack, Flex, Text, InputGroup, InputLeftAddon, useColorMode } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const FlatShareProfileForm = () => {
    const [formData, setFormData] = useState<{
        budget: number;
        occupation: string;
        workIndustry: string;
        employment_status: string;
        tiktok: string;
        twitter: string;
        linkedin: string;
        facebook: string;
        instagram: string;
    }>({
        budget: 0,
        occupation: "",
        workIndustry: "",
        employment_status: "",
        tiktok: "",
        twitter: "",
        linkedin: "",
        facebook: "",
        instagram: "",
    });

    const { authState: { flat_share_profile } } = useAuthContext();
    const {colorMode} = useColorMode()
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { showToast } = useCommon();

    useEffect(() => {
        if (flat_share_profile && flat_share_profile._user_id) {
            setFormData({
                budget: flat_share_profile.budget || 0,
                occupation: flat_share_profile.occupation || '',
                workIndustry: flat_share_profile.work_industry || '',
                employment_status: flat_share_profile.employment_status || '',
                tiktok: flat_share_profile.tiktok || '',
                twitter: flat_share_profile.twitter || '',
                linkedin: flat_share_profile.linkedin || '',
                facebook: flat_share_profile.facebook || '',
                instagram: flat_share_profile.instagram || '',
            });
            return;
        }
    }, [flat_share_profile])

    const handleChange = (e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent): Promise<any> => {
        try {
            e.preventDefault();
            setIsLoading(true);
            if (!(flat_share_profile && flat_share_profile._user_id)) {
                return showToast({
                    message: 'Please refresh this page and sign in again',
                    status: 'error',
                });
            }
            await FlatShareProfileService.update({
                document_id: flat_share_profile._user_id,
                data: {
                    ...formData
                }
            })

            setIsLoading(false);

            showToast({
                message: 'Your information has been updated',
                status: 'success',
            });

            return setTimeout(() => {
                window.location.href = '/settings';
            }, 1000);
        } catch (err: any) {
            setIsLoading(false);
            showToast({
                message: 'An error occurred while updating your information',
                status: 'error',
            });
        }
    };

    return (
        <Box maxW="600px" mx="auto" p={6}>
            <Text fontSize={"3xl"} fontWeight={500} mb="6" textAlign={"center"}>
                Update your flat share profile
            </Text>
            <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="stretch">

                    <FormControl id="budget" isRequired>
                        <FormLabel requiredIndicator={null}>Budget</FormLabel>
                        <Input
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            placeholder="Enter your budget"
                        />
                    </FormControl>

                    <Flex gap={4}>
                        <FormControl id="occupation" isRequired>
                            <FormLabel requiredIndicator={null}>Occupation</FormLabel>
                            <Input
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                                placeholder="Enter your occupation"
                            />
                        </FormControl>
                        <FormControl id="workIndustry" isRequired>
                            <FormLabel requiredIndicator={null}>Work Industry</FormLabel>
                            <Input
                                name="workIndustry"
                                value={formData.workIndustry}
                                onChange={handleChange}
                                placeholder="Enter your work industry"
                            />
                        </FormControl>
                    </Flex>

                    <FormControl id="employment_status" isRequired>
                        <FormLabel requiredIndicator={null}>Employment Status</FormLabel>
                        <Select
                            name="employment_status"
                            value={formData.employment_status}
                            onChange={handleChange}
                            placeholder="Select your employment status"
                            bgColor={colorMode}
                        >
                            <option value="employed">Employed</option>
                            <option value="unemployed">Unemployed</option>
                            <option value="self employed">Self employed</option>
                            <option value="student">Student</option>
                            <option value="corps member">{`Corps member (NYSC)`}</option>
                        </Select>
                    </FormControl>

                    <Flex
                        justifyContent={'flex-start'}
                        flexDir={'column'}
                        w="full"
                        gap={2}
                    >
                        <Text color={'text_muted'} fontSize={'sm'}>
                            Tiktok Username
                        </Text>
                        <InputGroup>
                            <InputLeftAddon
                                border="1px"
                                borderColor={'dark_light'}
                            >
                                tiktok.com/
                            </InputLeftAddon>
                            <Input
                                name="tiktok"
                                type="text"
                                placeholder="@johndoe"
                                onChange={handleChange}
                                value={formData.tiktok}
                            />
                        </InputGroup>
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
                        <InputGroup>
                            <InputLeftAddon
                                border="1px"
                                borderColor={'dark_light'}
                            >
                                facebook.com/
                            </InputLeftAddon>
                            <Input
                                name="facebook"
                                type="text"
                                placeholder="johndoe"
                                onChange={handleChange}
                                value={formData.facebook}
                            />
                        </InputGroup>
                    </Flex>

                    <Flex
                        justifyContent={'flex-start'}
                        flexDir={'column'}
                        w="full"
                        gap={2}
                    >
                        <Text color={'text_muted'} fontSize={'sm'}>
                            Instagram Username
                        </Text>
                        <InputGroup>
                            <InputLeftAddon
                                border="1px"
                                borderColor={'dark_light'}
                            >
                                instagram.com/
                            </InputLeftAddon>
                            <Input
                                name="instagram"
                                type="text"
                                placeholder="johndoe"
                                required
                                onChange={handleChange}
                                value={formData.instagram}
                            />
                        </InputGroup>
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
                        <InputGroup>
                            <InputLeftAddon
                                border="1px"
                                borderColor={'dark_light'}
                            >
                                x.com/
                            </InputLeftAddon>
                            <Input
                                name="twitter"
                                type="text"
                                placeholder="johndoe"
                                onChange={handleChange}
                                value={formData.twitter}
                            />
                        </InputGroup>
                    </Flex>

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
                            name='linkedin'
                            required
                            borderColor={'border_color'}
                            _dark={{ borderColor: 'dark_light' }}
                            placeholder="Ex. https://www.linkedin.com/in/xyz"
                            onChange={handleChange}
                            value={formData.linkedin}
                        />
                    </Flex>

                    <Button isLoading={isLoading} type="submit" colorScheme="teal" mt="3" size="lg" width="full">
                        Update Information
                    </Button>
                </VStack>
            </form>
        </Box>
    );
}


export default FlatShareProfileForm;