import { Player } from "./player.model";
import { supabase } from "../../config/supabase";
import { Team } from "./team.model";
import { Player_Team } from "./player_team.model";
import { get } from "http";
import { getPlayerById } from "./player.repository";
import { useState } from "react";
import useHome from "../../pages/home/callbacks/useHome";
import { notification } from "antd";


const assignPlayerToTeamRepo = async (playerId: string, teamId: string) => {
    const { error } = await supabase
        .from('player_team')
        .insert({ player: playerId, team: teamId })
    return error
}

async function getAllPlayer_Team(): Promise<{ [teamId: string]: Player[] }> {
    try {
        const { data, error } = await supabase
            .from('player_team')
            .select(`
                *,
                team:team(*),
                player:player(*)
            `);

        if (error) {
            throw error;
        }

        const teamPlayers: { [teamId: string]: Player[] } = {};

        data?.forEach((entry) => {
            const teamId = entry.team.id.toString();
            const player = entry.player;

            if (!teamPlayers[teamId]) {
                teamPlayers[teamId] = [];
            }

            teamPlayers[teamId].push(player);
        });

        return teamPlayers;
    } catch (e) {
        console.error(e);
        return {};
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
        const playersIds = request.data
        const players: Player[] = []
        playersIds.forEach(async playerId => {
            const player = await getPlayerById(playerId.player)
            players.push(player as Player)
        })
        return players;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

export { assignPlayerToTeamRepo, getAllPlayer_Team, getAllPlayersByTeam };