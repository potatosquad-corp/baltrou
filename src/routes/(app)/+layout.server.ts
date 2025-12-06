import { redirect } from '@sveltejs/kit';

export const load = async ({ url, cookies }) => {
	const PUBLIC_PATHS = ['/', '/login'];
	const currentPath = url.pathname;
	const isLoggedIn = cookies.get('user_id') != null;

	if (!isLoggedIn && !PUBLIC_PATHS.includes(currentPath)) {
		throw redirect(302, '/login');
	} else if (isLoggedIn && currentPath === '/login') {
		throw redirect(302, '/');
	}

	return {
		isLoggedIn: isLoggedIn
	};
};
