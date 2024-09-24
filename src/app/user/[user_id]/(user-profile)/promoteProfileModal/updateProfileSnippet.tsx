"use client"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Box, Button, Center, Flex, Text ,
    useColorMode,
	Textarea
  
 
  } from '@chakra-ui/react'
  import ProfilePictureSelector from '@/components/info/GetStarted/ProfilePictureSelector';
  import React, { useState } from 'react'
  import { ImageSelector } from './imageSelector';


export const UpdateProfilePopup = ()=>{

    const {colorMode} = useColorMode()

    const [isOpen, setIsOpen] = useState(false);

    const onOpen = () => setIsOpen(true);
    const onClose = () => setIsOpen(false);

    
	

  return (
    <>
      <Button onClick={onOpen}>Promote profile on feeds</Button>

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent background={colorMode === 'dark' ? 'dark' : "accent_lighter"} >
          <Text
		  mt={4}
		  textAlign={'center'}
		  as={'h1'}
		  fontSize={'xl'}
		  className={'animate__animated animate__fadeInUp animate__faster'}
		  fontWeight={'400'}
		  >{`Profile picture`}</Text>
          <ModalCloseButton />
          <Flex>
		  <ImageSelector/>
		  <Textarea
		  w={'70%'}
		  display={'flex'}
		  justifyContent={"center"}
								placeholder="Ex: Searching for a vacant space in Lekki, go through my profile"
								// onChange={(e) => {
								// 	setBio(e.target.value)
								// }}
								// value={bio}
							/>
		  </Flex>
						
          <ModalBody>
            <Text  
             className={'animate__animated animate__fadeInUp'}
             textAlign={'center'}
            >
            
            </Text>
          
          </ModalBody>

          <ModalFooter>
            <Button color='brand' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Promote now</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}