import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import MainContainer from './MainContainer'

type Props = {}

export default function MainPageBody({ children }: any) {
    return (
        <Flex justifyContent={'center'}>
            <MainContainer>
                <Box pt={'60px'} minH={'calc(100vh)'}>
                    {children}
                </Box>
            </MainContainer>
        </Flex>
    )
}