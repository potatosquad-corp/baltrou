import { mkdir, rm, stat, writeFile } from 'fs/promises';
import { db } from './db';
import { createHash } from 'crypto';

export type SoundFile = {
	id: string;
	extension: string;
	userAliases: Record<string, string>;
};

export async function initSoundboardFolder() {
	const OUT_FOLDER = './files/soundboard';
	await mkdir(OUT_FOLDER, { recursive: true });
}

export async function getUserSounds(userId: string) {
	await db.read();

	return db.data.sounds
		.filter((s) => userId in s.userAliases)
		.map((s) => ({
			id: s.id,
			name: s.userAliases[userId]
		}));
}

export async function getSound(soundId: string) {
	await db.read();
	return db.data.sounds.find(s=>s.id == soundId);
}

export async function processAndSaveSound(file: File, userId: string) {
	const arrayBuffer = await file.arrayBuffer();
	const fileData = new Uint8Array(arrayBuffer);

	const fileHash = createHash('md5').update(fileData).digest('hex');

	const extension = file.name.split('.').pop() || 'mp3';
	const filePath = `./files/soundboard/${fileHash}.${extension}`;

	try {
		await stat(filePath);
	} catch {
		await writeFile(filePath, fileData);
	}
	const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
	const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9 ]/g, '');

	await addSoundToUser(fileHash, cleanName, userId, extension);

	return { id: fileHash, name: cleanName };
}

async function addSoundToUser(
	fileHash: string,
	originalName: string,
	userId: string,
	extension: string
) {
	await db.read();

	const existingFile = db.data.sounds.find((s) => s.id === fileHash);

	if (existingFile) {
		existingFile.userAliases[userId] = originalName;
		await db.write();
		return;
	}
	db.data.sounds.push({
		id: fileHash,
		extension,
		userAliases: {
			[userId]: originalName
		}
	});

	await db.write();
}

export async function deleteUserSound(userId: string, soundId: string) {
	await db.read();

	const existingFile = db.data.sounds.find((s) => s.id === soundId && userId in s.userAliases);

	if (!existingFile) return;
	if (Object.keys(existingFile.userAliases).length === 1) {
		await rm(`./files/soundboard/${existingFile.id}.${existingFile.extension}`);
		db.data.sounds = db.data.sounds.filter((s) => s.id !== soundId);
	} else {
		delete existingFile.userAliases[userId];
	}
	await db.write();
}


export async function renameSound(userId:string,soundId:string,newName:string){
	await db.read();
	const existingFile = db.data.sounds.find((s) => s.id === soundId && userId in s.userAliases);
	if (!existingFile) return;
	const nameWithoutExt = newName.replace(/\.[^/.]+$/, '');
	const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9 ]/g, '');
	existingFile.userAliases[userId] = cleanName;
	await db.write();
	return cleanName;
}