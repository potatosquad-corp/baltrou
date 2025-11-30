import { env } from '$env/dynamic/private';
import { TWITCH_SCOPE } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export async function GET({ url }) {

	const oauthURL = new URL('https://id.twitch.tv/oauth2/authorize');
	oauthURL.searchParams.set('client_id', env.TWITCH_CLIENT_ID);
	oauthURL.searchParams.set('response_type', 'code');
	oauthURL.searchParams.set('scope', TWITCH_SCOPE);
	oauthURL.searchParams.set('force_verify', 'true');
	oauthURL.searchParams.set('redirect_uri', `${url.origin}/api/auth/callback`);

    return redirect(302,oauthURL);	
}
