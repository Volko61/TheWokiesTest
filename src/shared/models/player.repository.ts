import { Player } from "./player.model";
import { supabase } from "../../config/supabase";
import { Team } from "./team.model";

async function getAllPlayers(): Promise<Player[] | undefined> {
    try {
        const request = await supabase
            .from("player")
            .select("*");

        if (request.error) {
            return undefined;
        }

        return request.data as Player[];
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

async function getPlayersWithoutTeam(): Promise<Player[]> {
    try {
        // Première requête pour obtenir tous les IDs des joueurs qui sont dans une équipe
        const { data: playerTeamData, error: playerTeamError } = await supabase
            .from('player_team')
            .select('player');

        if (playerTeamError) {
            console.error(playerTeamError);
            return [];
        }

        let query = supabase.from("player").select("*");

        // Si player_team n'est pas vide, on filtre les joueurs
        if (playerTeamData && playerTeamData.length > 0) {
            const playerIdsInTeam = playerTeamData.map(item => item.player);
            query = query.not('id', 'in', '(' + playerIdsInTeam + ')');
        }

        // Exécution de la requête
        const { data: playersData, error: playersError } = await query;

        if (playersError) {
            console.error(playersError);
            return [];
        }

        return playersData as Player[];
    } catch (e) {
        console.error(e);
        return [];
    }
}



async function getPlayerById(id: string): Promise<Player | undefined> {
    try {
        const request = await supabase
            .from("player")
            .select()
            .eq("id", id)
            .single();

        if (request.error) {
            return undefined;
        }
        return request.data as Player;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}
async function createPlayerRepo(name: string, mail: string): Promise<number | null> {
    try {
        const { data, error } = await supabase
            .from('player')
            .insert({ name: name, mail: mail })
            .select()
            .single();

        if (error) {
            console.error('Error creating player:', error);
            return null;
        }

        if (data && 'id' in data) {
            return data.id as number;
        } else {
            console.error('Player created but no ID returned');
            return null;
        }
    } catch (e) {
        console.error('Unexpected error:', e);
        return null;
    }
}

export { getAllPlayers, getPlayerById, getPlayersWithoutTeam, createPlayerRepo };