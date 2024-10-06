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

const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		CredentialsProvider({
			name: 'Credentials',
			id: 'credentials',

			async authorize(credentials)
			{
				if (!credentials || !credentials.email || !credentials.password) {
					throw new Error('Email and password are required');
				}
				try {
					const { data } = await axios.post(
						`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
						{
							email: credentials.email,
							password: credentials.password,
						},
					);

					console.log("This the result", data);

					return {
						user: { ...data?.data?.user },
						token: data?.data?.token
					};

				} catch (error) {

					if (axios.isAxiosError(error)) {
						throw new Error(error?.response?.data?.message);
					} else {
						throw new Error('Something went wrong');
					}
				}
			},
		}),
	],
	callbacks: {
		signIn: async ({ user, account, profile, email, credentials }) =>
		{
			if (account?.provider === 'google') {
				try {
					const { data } = await axios.post(
						`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/callback`,
						{
							...profile,
						},
					);

					console.log('This is the data', data);
					return true;
				} catch (error) {
					return false;
				}
			} else {
				return true;

			}


		},
		jwt: async ({ user, token }) =>
		{
			if (user) {
				console.log("This the user ", user);
				token.user = user?.user;
				token.token = user?.token;
			}
			return token;
		},
		session: async ({ session, token }) =>
		{
			console.log("This is the token", token);
			session.user = token.user;
			session.token = token.token;


			return session;
		},
	},
	pages: {
		signIn: '/',
	},
	secret: process.env.NEXTAUTH_SECRET,
};



export default authOptions;
