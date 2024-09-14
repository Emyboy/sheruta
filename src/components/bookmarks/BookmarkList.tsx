'use client'

import React, { useEffect, useState } from 'react'
import { Box, Heading, Link, Spinner, Text, VStack } from '@chakra-ui/react'
import { BookmarkDataDetails } from '@/firebase/service/bookmarks/bookmarks.types'
import { useAuthContext } from '@/context/auth.context'
import BookmarkService from '@/firebase/service/bookmarks/bookmarks.firebase'
import NextLink from 'next/link'
import EachRequest from '../EachRequest/EachRequest'
import { HostRequestDataDetails } from '@/firebase/service/request/request.types'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import { DocumentReference, getDoc } from 'firebase/firestore'
import { AuthUser } from '@/firebase/service/auth/auth.types'

const BookmarkList = () => {
    const [bookmarks, setBookmarks] = useState<BookmarkDataDetails[]>([])
    const [loading, setLoading] = useState(true)
    const {
        authState: { user },
    } = useAuthContext()

    useEffect(() => {
        const fetchBookmarks = async () => {
            setLoading(true);
            try {
                if (user?._id) {
                    const userBookmarks = await BookmarkService.getUserBookmarks(user._id) as BookmarkDataDetails[];
                    
                    if (!userBookmarks) {
                        setBookmarks([]);
                        return;
                    }
    
                    // Resolve user info for each bookmark request
                    const resolvedBookmarks = await Promise.all(
                        userBookmarks.map(async (bookmark) => {
                            if (bookmark.object_type === 'requests' && bookmark._object_ref?._user_ref) {
                                try {
                                    const userRef = bookmark._object_ref._user_ref as DocumentReference;
                                    const docSnap = await getDoc(userRef);
    
                                    if (docSnap.exists()) {
                                        const docData = docSnap.data() as AuthUser;
                                        const user_info = await UserInfoService.get(docData._id as string);
    
                                        // Resolve DocumentReference fields
                                        const refFields = Object.entries(bookmark._object_ref).filter(
                                            ([, value]) => value instanceof DocumentReference,
                                        );
    
                                        const resolvedRefs = await Promise.all(
                                            refFields.map(async ([key, ref]) => {
                                                const resolvedDoc = await getDoc(ref as DocumentReference);
                                                if (resolvedDoc.exists()) {
                                                    return { [key]: resolvedDoc.data() };
                                                }
                                                return { [key]: null }; // Handle missing data
                                            }),
                                        );
    
                                        return {
                                            ...bookmark,
                                            _object_ref: {
                                                ...bookmark._object_ref,
                                                ...Object.assign({}, ...resolvedRefs), // Merge resolved refs
                                                user_info,
                                            },
                                        };
                                    }
                                } catch (error) {
                                    console.error('Error resolving user reference:', error);
                                    return bookmark; // Return the bookmark even if there's an error
                                }
                            }
                            return bookmark; // Return bookmark if it's not a 'requests' type
                        })
                    );
    
                    setBookmarks(resolvedBookmarks.filter(Boolean) as BookmarkDataDetails[]);
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
        )
    }

    if (bookmarks.length === 0) {
        return (
            <Box textAlign="center" mt="20">
                <Text>No bookmarks found.</Text>
            </Box>
        )
    }

    return (
        <VStack p={6} spacing={4} mt={5} align="start">
            <Heading as="h2" size="lg">
                My Bookmarks
            </Heading>
            {bookmarks.map((bookmark) => {
                let redirectLink: string = '';
                const bookmarkType = bookmark.object_type;

                switch (bookmarkType) {
                    case 'requests':
                        redirectLink = `/request/${bookmark._object_ref?.seeking ? 'seeker' : 'host'}/${bookmark._object_ref?.id ?? ''}`;
                        break;
                    case 'profiles':
                        redirectLink = `/user/${bookmark._object_ref?.id ?? ''}`;
                        break;
                    default:
                        redirectLink = '/';
                        break;
                }

                if (bookmarkType === 'requests') {
                    // const userId = bookmark._object_ref?._user_ref?._id;
                    // const request = async () => {
                    //     if (userId) {
                    //         const user_info = await UserInfoService.get(userId);
                    //         return {
                    //             ...bookmark._object_ref,
                    //             user_info,
                    //         };
                    //     }
                    //     return bookmark._object_ref;
                    // };

                    return (
                        <React.Fragment key={bookmark.id}>
                            <EachRequest request={bookmark._object_ref} />
                        </React.Fragment>
                    );
                }

                return (
                    <a href={redirectLink} key={bookmark.id}>
                        <div>{bookmark.title}</div>
                    </a>
                );
            })}

            })}
        </VStack>
    )
}

export default BookmarkList
