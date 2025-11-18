import { db } from '$lib/server/db';
import { json, error, type RequestEvent } from '@sveltejs/kit';

/**
 * Gère la requête GET pour récupérer l'historique
 * des spectateurs (pour le graphique).
 */
export async function GET({ cookies }: RequestEvent) {
  // 1. Authentification
  // S'assurer que seul l'utilisateur connecté peut accéder à ces données.
  const userId = cookies.get('user_id');
  if (!userId) {
    throw error(401, 'Non autorisé');
  }

  try {
    // 2. Lire l'état actuel de la base de données (db.json)
    await db.read();

    // 3. Récupérer le tableau de l'historique
    const viewerHistory = db.data.viewer_history;

    // 4. Renvoyer les données au format JSON
    return json(viewerHistory);

  } catch (err: any) {
    console.error("Erreur lors de la lecture de l'historique des viewers:", err);
    throw error(500, `Erreur interne du serveur: ${err.message}`);
  }
}