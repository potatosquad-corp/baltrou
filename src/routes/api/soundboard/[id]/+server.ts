import { deleteUserSound, getSound } from '$lib/server/soundboard.js';
import { error, json } from '@sveltejs/kit';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';

export async function DELETE({params, cookies}) {
  const userId = cookies.get('user_id');

	if (!userId) {
		throw error(401, 'Non autorisé');
	}

  await deleteUserSound(userId,params.id);
  return json({})
}

export async function GET({ params }) {
	const sound = await getSound(params.id);
	if (!sound) throw error(404, 'Sound not found');

	const filePath = `./files/soundboard/${sound.id}.${sound.extension}`;

	try {
		// Check file stats for Content-Length
		const stats = await stat(filePath);
		
		// Create a readable stream
		const stream = createReadStream(filePath);
        
        // Convert Node stream to Web ReadableStream
		const readable = new ReadableStream({
			start(controller) {
				stream.on('data', (chunk) => controller.enqueue(chunk));
				stream.on('end', () => controller.close());
				stream.on('error', (err) => controller.error(err));
			}
		});

		const mimeType = sound.extension === 'mp3' ? 'audio/mpeg' : 'audio/wav';

		return new Response(readable, {
			headers: {
				'Content-Type': mimeType,
				'Content-Length': stats.size.toString()
			}
		});
	} catch {
		throw error(404, 'File not found');
	}
}