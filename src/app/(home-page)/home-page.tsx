import MainHeader from '@/components/layout/MainHeader'
import MainPageBody from '@/components/layout/MainPageBody'
import { Box } from '@chakra-ui/react'
import React from 'react'

type Props = {}

export default function HomePage({ }: Props) {
    return (
        <>
            <MainHeader />
            <MainPageBody>
                {
                    new Array(20).fill(null).map(_ => {
                        return <Box my='30px' p='20px' bg='white' key={Math.random()}>
                            <div>HomePage</div>
                        </Box>
                    })
                }
            </MainPageBody>
        </>
    )
}
