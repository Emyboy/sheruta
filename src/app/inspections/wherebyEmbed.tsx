import { useEffect } from 'react';

const WherebyEmbed = ({ roomUrl, hostRoomUrl, user, host_details }: any) => {
    useEffect(() => {
        // Import the Web Component on the client side only
        import('@whereby.com/browser-sdk/embed');
    }, []);

    return (
        // @ts-ignore
        <whereby-embed
            room={user?._id === host_details.id ? hostRoomUrl : roomUrl}
            style={{
                minWidth: '100vw',
                minHeight: '100vh',
                maxWidth: '100vw',
                maxHeight: '100vh',
            }}
        />
    );
};

export default WherebyEmbed;
