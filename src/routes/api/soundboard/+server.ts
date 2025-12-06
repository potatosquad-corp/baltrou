import { getUserSounds, processAndSaveSound } from '$lib/server/soundboard.js';
import { json } from '@sveltejs/kit';
import { error } from 'console';

export async function GET({ cookies }) {
	const userId = cookies.get('user_id');

	// Si aucun cookie, l'utilisateur n'est pas autorisé.
	if (!userId) {
		throw error(401, 'Non autorisé');
	}

	const sounds = await getUserSounds(userId);
	return json(sounds);
}

export async function POST({ request, cookies }) {
	const userId = cookies.get('user_id');

	if (!userId) {
		throw error(401, 'Non autorisé');
	}

	const formData = await request.formData();
	const file = formData.get('file') as File;

	if (!file) {
		throw error(400, 'Aucun fichier fourni');
	}

	try {
		const result = await processAndSaveSound(file, userId);

		return json({ id: result.id, name: result.name }, { status: 201 });
	} catch (err) {
		console.error('Erreur upload:', err);
		throw error(500, 'Erreur lors de la sauvegarde du son');
	}
}
