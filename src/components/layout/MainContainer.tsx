import { Box } from '@chakra-ui/react'
import React from 'react'

type Props = {}

export default function MainContainer({ children }: any) {
    return (
        <Box flex={1} height={'100%'} maxW={{
            base: '95vw',
            lg: '1000px'
        }}>
            {children}
        </Box>
    )
}