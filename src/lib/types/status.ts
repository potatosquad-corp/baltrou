export type ConnexionState = 'connecting' | 'connected' | 'error';

export enum ConnectionStatus {
	'DISCONNECTED',
	'CONNECTING',
	'CONNECTED',
	'ERROR'
}

export const statusNameMap: Record<ConnectionStatus, string> = {
	[ConnectionStatus.DISCONNECTED]: 'Déconnecté',
	[ConnectionStatus.CONNECTING]: 'Connexion...',
	[ConnectionStatus.CONNECTED]: 'Connecté',
	[ConnectionStatus.ERROR]: 'Erreur'
};

export const classMap: Record<ConnectionStatus, string> = {
	[ConnectionStatus.DISCONNECTED]: 'status-disconnected',
	[ConnectionStatus.CONNECTING]: 'status-connecting',
	[ConnectionStatus.CONNECTED]: 'status-connected',
	[ConnectionStatus.ERROR]: 'status-error'
};
