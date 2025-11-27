import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import type { User } from './user';
import type { SoundFile } from './soundboard';

type ViewerRecord = {
	count: number;
	timestamp: number;
};

type Schema = {
	users: User[];
	viewer_history: ViewerRecord[];
	sounds: SoundFile[];
};

const adapter = new JSONFile<Schema>('db.json');
const defaultData: Schema = { users: [], viewer_history: [], sounds: [] };
export const db = new Low<Schema>(adapter, defaultData);

export async function addViewerRecord(entry: ViewerRecord) {
	const FIVE_MIN_IN_MS = 1000 * 60 * 5;
	const MAX_AGE_MS = 1000 * 60 * 60 * 24 + FIVE_MIN_IN_MS; // 24 hours + 5 minutes
	await db.read();
	if (db.data.viewer_history.length != 0) {
		const last = db.data.viewer_history[db.data.viewer_history.length - 1];
		if (entry.timestamp - last.timestamp < FIVE_MIN_IN_MS) return;
	}

	const cutoffTimestamp = entry.timestamp - MAX_AGE_MS;
	const freshHistory = db.data.viewer_history.filter((record) => {
		return record.timestamp >= cutoffTimestamp;
	});
	freshHistory.push(entry);
	db.data.viewer_history = freshHistory;
	await db.write();
}
