import {Player} from "./player.model";
import {supabase} from "../../config/supabase";
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

async function getAllPlayersByTeam(teamId: string): Promise<Player[] | undefined> {
    try {
        const request = await supabase
            .from("player_team")
            .select("*")
            .eq("team", teamId);

        if (request.error) {
            return undefined;
        }

        return request.data as Player[];
    } catch (e) {
        console.error(e);
        return undefined;
    }
}
async function getAllTeams(): Promise<Team[] | undefined> {
    try {
        const request = await supabase
            .from("teams")
            .select("*");
        
        if (request.error) {
            return undefined;
        }

        return request.data as Team[];
    } catch (e) {
        console.error(e);
        return undefined;
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

export { getAllPlayers, getPlayerById, getAllTeams, getAllPlayersByTeam};