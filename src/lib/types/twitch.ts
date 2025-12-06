export class TwitchApiError extends Error {
	status: number;
	// Ajout d'un champ pour contenir les détails de l'erreur JSON de Twitch
	details: string;

	constructor(status: number, message: string, details?: string) {
		super(message);
		this.status = status;
		this.details = details || 'unknown error';
		this.name = 'TwitchApiError';
	}
}

export interface TwitchChatResponse {
	message_id: string;
	is_sent: boolean;
}
export interface TwitchGetStreamsRes {
	data: {
		id: string;
		user_id: string;
		user_login: string;
		user_name: string;
		game_id: string;
		game_name: string;
		title: string;
		tags: string;
		viewer_count: number;
		started_at: string;
	}[];
}
