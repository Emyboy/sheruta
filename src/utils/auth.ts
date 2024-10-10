import { NextAuthOptions, getServerSession } from 'next-auth';
import axios from 'axios';
import
{
	GetServerSidePropsContext,
	NextApiRequest,
	NextApiResponse,
} from 'next';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

interface User
{

	_id: string;

	email: string;

}

interface CustomSession
{
	user: User;
	token: string;
}

const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" }
			},
			// @ts-ignore
			async authorize(credentials)
			{
				if (!credentials || !credentials.email || !credentials.password) {
					throw new Error('Email and password are required');
				}
				try {
					const { data } = await axios.post<{ data: { user: User; token: string; }; }>(
						`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
						{
							email: credentials.email,
							password: credentials.password,
						},
					);



					return {
						...data.data.user,
						token: data.data.token,
					};
				} catch (error) {
					if (axios.isAxiosError(error)) {
						throw new Error(error.response?.data?.message || 'An error occurred');
					} else {
						throw new Error('Something went wrong');
					}


				}
			},
		}),
	],
	callbacks: {
		async signIn({ user, account, profile })
		{
			if (account?.provider === 'google') {
				try {
					const { data } = await axios.post(
						`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/callback`,
						profile,
					);

					console.log('This is the data', data);
					return true;
				} catch (error) {
					return false;
				}
			}
			return true;
		},
		async jwt({ token, user })
		{
			if (user) {

				token.user = user as unknown as User;
				token.token = (user as unknown as { token: string; }).token;
			}
			return token;
		},
		async session({ session, token })
		{

			return {
				...session,
				user: token.user as User,
				token: token.token as string,
			};
		},
	},
	pages: {
		signIn: '/',
	},
	secret: process.env.NEXTAUTH_SECRET,
	debug: process.env.NODE_ENV === 'development',
};

export default authOptions;

export const serverSession = (
	...args:
		| [ GetServerSidePropsContext[ 'req' ], GetServerSidePropsContext[ 'res' ] ]
		| [ NextApiRequest, NextApiResponse ]
		| []
) =>
{
	return getServerSession(...args, authOptions);
};
