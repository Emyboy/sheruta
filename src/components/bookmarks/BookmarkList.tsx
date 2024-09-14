'use client'

import { useEffect, useState } from 'react';
import { Box, Heading, Link, Spinner, Text, VStack } from '@chakra-ui/react';
import { BookmarkDataDetails } from '@/firebase/service/bookmarks/bookmarks.types';
import { useAuthContext } from '@/context/auth.context';
import BookmarkService from '@/firebase/service/bookmarks/bookmarks.firebase';
import NextLink from 'next/link';


const BookmarkList = () => {
    const [bookmarks, setBookmarks] = useState<BookmarkDataDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const { authState: { user } } = useAuthContext()

    useEffect(() => {
        const fetchBookmarks = async () => {
            setLoading(true); 
            try {
                if (user?._id) {
                    const userBookmarks = await BookmarkService.getUserBookmarks(user._id);
                    setBookmarks(userBookmarks || []);
                } else {
                    setBookmarks([]); 
                }
            } catch (error) {
                console.error('Error fetching bookmarks:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchBookmarks();
    }, [user?._id]); 

    if (loading) {
        return (
            <Box textAlign="center" mt="20">
                <Spinner size="xl" />
                <Text mt="4">Loading your bookmarks...</Text>
            </Box>
        );
    }

    if (bookmarks.length === 0) {
        return (
            <Box textAlign="center" mt="20">
                <Text>No bookmarks found.</Text>
            </Box>
        );
    }

    return (
        <VStack p={6} spacing={4} mt={5} align="start">
            <Heading as="h2" size="lg">
                My Bookmarks
            </Heading>
            {bookmarks.map((bookmark) => {

                const redirectLink = `/${bookmark.object_type}/${bookmark._object_ref.uuid}`;

                return (
                    <Box
                        key={bookmark.id}
                        p={4}
                        w="100%"
                        borderWidth={1}
                        borderRadius="md"
                        _hover={{ shadow: 'md' }}
                    >
                        <NextLink href={redirectLink} passHref>
                            <Link fontSize="lg" color="blue.500" fontWeight="bold">
                                {/* {bookmark.title || bookmark.request_id} Replace with bookmark title if available */}
                                NO TITLE
                            </Link>
                        </NextLink>
                    </Box>
                );
            })}

        </VStack>
    );
};

export default BookmarkList;
