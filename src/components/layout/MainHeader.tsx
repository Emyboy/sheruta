import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import MainContainer from './MainContainer'

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
      w="100vw"
      height={'60px'}
    >
      <MainContainer>
        <Flex justifyContent={'space-between'} h={'100%'} w={'100%'} alignItems={'center'}>
          <div>MainHeader</div>
          <div>MainHeader</div>
          <div>MainHeader</div>
        </Flex>
      </MainContainer>
    </Flex>
  )
}
