import { env } from '$env/dynamic/private';
import type { TwitchUser } from '$lib/types';
import { db } from './db';

export type User = {
	id: string;
	user_login: string;
	credentials: Credentials;
};

export type Credentials = {
	access_token: string;
	expires_in: Date;
	refresh_token: string;
};

export async function getTwitchUserInfo(accessToken: string): Promise<TwitchUser | null> {
	const response = await fetch('https://api.twitch.tv/helix/users', {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Client-ID': env.TWITCH_CLIENT_ID
		}
	});

	if (!response.ok) {
		console.error('Twitch API request failed:', await response.text());
		return null;
	}

	const data = await response.json();
	return data.data[0];
}

export async function addUser(user: User) {
	await db.read();
	db.data.users.push(user);
	await db.write();
	return user.id;
}

export async function getUser(userId: string): Promise<User | null> {
	await db.read();
	return db.data.users.find((usr) => usr.id == userId) || null;
}

export async function updateCredentials(user_id: string, credentials: Credentials) {
	await db.read();
	db.data.users.forEach((usr) => {
		if (usr.id != user_id) return;
		usr.credentials = credentials;
	});
	await db.write();
}

export async function getAllUsers() {
	await db.read();
	return db.data.users;
}
