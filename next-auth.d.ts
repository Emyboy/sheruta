import 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session
    {
        user: {
            _id: string;
            email: string;
        };
        token: string;
    }

    interface User
    {
        _id: string;
        email: string;
        token: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT
    {
        user: {
            _id: string;
            email: string;
        };
        token: string;
    }
}
