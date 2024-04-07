interface GoogleAuthURLProps {
	clientId: string;
	redirectUri: string;
	responseType: string;
	scope: string;
	prompt: string;
	accessType?: string;
	state?: string;
}

export const getGoogleAuthUrl = (props: GoogleAuthURLProps) => {
	const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
	url.searchParams.set('client_id', props.clientId);
	url.searchParams.set('redirect_uri', props.redirectUri);
	url.searchParams.set('response_type', props.responseType);
	url.searchParams.set('scope', props.scope);
	url.searchParams.set('prompt', props.prompt);
	if (props?.accessType) {
		url.searchParams.set('access_type', props.accessType);
	}
	if (props?.state) {
		url.searchParams.set('state', props.state);
	}
	return url.toString();
};

export const exchangeCodeForToken = async (code: string, redirectUri: string) => {
	try {
		const url = new URL('https://oauth2.googleapis.com/token');
		url.searchParams.set('code', code);
		url.searchParams.set('redirect_uri', redirectUri);
		url.searchParams.set('grant_type', 'authorization_code');
		url.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID!);
		url.searchParams.set('client_secret', process.env.GOOGLE_CLIENT_SECRET!);
		const res = await fetch(url.toString(), { method: 'POST' });
		const data = await res.json();
		return data?.access_token ?? null;
	} catch (err) {
		console.log('error in exchanging auth code for refresh token:', err);
		return null;
	}
};

export const exchangeTokenForUserInfo = async (token: string) => {
	try {
		const res = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`);
		const data = await res.json();
		return data;
	} catch (err) {
		console.log(err);
		return null;
	}
};
