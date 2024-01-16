import { Box, Flex, Image } from '@chakra-ui/react'
import React from 'react'
import MainContainer from './MainContainer'
import { NAV_HEIGHT } from '@/configs/theme'

type Props = {}

export default function MainHeader({ }: Props) {
  return (
    <Flex
      justifyContent={'center'}
      as="nav"
      bg="dark"
      color="white"
      position={'fixed'}
      top={0}
      left={0}
      right={0}
      height={NAV_HEIGHT}
      maxH={NAV_HEIGHT}
      zIndex={100}
    >
      <MainContainer>
        <Flex justifyContent={'space-between'} h={'100%'} w={'100%'} alignItems={'center'} gap={{
          lg: '50px'
        }}>
          <Flex gap={4} alignItems={'center'}>
            <img src='/icon_green.png' alt='sheruta ng' width={30} />
            <img  src='/logo_text_white.png' alt='sheruta ng' width={130}  />
          </Flex>
          <Flex flex={1} justifyContent={'center'}>
            <div>MainHeader</div>
          </Flex>
          <Flex>
            <div>MainHeader</div>
          </Flex>
        </Flex>
      </MainContainer>
    </Flex>
  )
}
