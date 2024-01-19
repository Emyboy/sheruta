import MainContainer from '@/components/layout/MainContainer'
import MainHeader from '@/components/layout/MainHeader'
import MainLeftNav from '@/components/layout/MainLeftNav'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { Flex } from '@chakra-ui/react'
import React from 'react'
import NotificationsPage from './notifications-page'

type Props = {}

export default function page({}: Props) {
  return (
      <Flex justifyContent={'center'}>
          <MainContainer>
              <ThreeColumnLayout header={<MainHeader />}>
                  <Flex flexDirection={'column'} w="full">
                      <MainLeftNav />
                  </Flex>
                  <NotificationsPage />
              </ThreeColumnLayout>
          </MainContainer>
      </Flex>
  )
}