import { useEffect, useState } from "react";
import { Player } from "../../../shared/models/player.model";
import { getAllPlayers, createPlayerRepo, getPlayersWithoutTeam } from "../../../shared/models/player.repository";
import { createTeamRepo, getAllTeams, } from "../../../shared/models/team.repository";
import { createInvitationRepo, getStatusOfPlayerByIdRepo } from "../../../shared/models/invitation.repository";
import { assignPlayerToTeamRepo, getAllPlayer_Team, getAllPlayersByTeam, removePlayerFromTeamRepo } from "../../../shared/models/player_team.repository";
import { notification } from "antd";
import { supabase } from "../../../config/supabase";
import { Team } from "../../../shared/models/team.model";
import { Player_Team } from "../../../shared/models/player_team.model";

export default function useHome() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [playersWithoutTeams, setPlayersWithoutTeams] = useState<Player[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [player_team_map, setPlayer_Team_Map] = useState<{ [teamId: string]: Player[] }>({});
    const [loading, setLoading] = useState<boolean>(true);

    const fetchPlayers = async () => {
        const fetchedPlayers = await getAllPlayers()
        setLoading(false);

        if (!fetchedPlayers) {
            notification.error({ message: "Error while fetching players" });
            return;
        }

        setPlayers(fetchedPlayers);
    }

    const fetchPlayersWihoutTeam = async () => {
        const fetchedPlayers = await getPlayersWithoutTeam()
        setLoading(false)

        if (!fetchedPlayers) {
            notification.error({ message: "Error while fetching players" })
            return
        }
        setPlayersWithoutTeams(fetchedPlayers);
    }

    async function fetchPlayersByTeam(teamId: string): Promise<Player[]> {
        const players = await getAllPlayersByTeam(teamId)
        setLoading(false);

        if (!players) {
            return [];
        }

        return players
    }

    async function assignPlayerToTeam(playerId: string, teamId: string) {
        const error = await assignPlayerToTeamRepo(playerId, teamId)
        setLoading(false);

        if (error) {
            notification.error({ message: error.message })
        }

        return error
    }
    async function removePlayerFromTeam(playerId: string, teamId: string) {
        const error = await removePlayerFromTeamRepo(playerId, teamId)
        setLoading(false);

        if (error) {
            notification.error({ message: error.message })
        }

        return error
    }

    const handlePlayerAssignment = async (playerId: string, newTeamId: string, oldTeamId: string | null) => {
        setLoading(true);
        let error;

        if (oldTeamId) {
            error = await removePlayerFromTeam(playerId, oldTeamId);
            if (error) {
                notify_error(`Failed to remove player from old team: ${error.message}`);
                setLoading(false);
                return;
            }
        }

        error = await assignPlayerToTeam(playerId, newTeamId);
        if (error) {
            notify_error(`Failed to assign player to new team: ${error.message}`);
        } else {
            notification.success({ message: "Player assigned successfully" });
            await fetchPlayers();
            await fetchTeams();
            await fetchPlayer_Team();
            await fetchPlayersWihoutTeam();
        }
        setLoading(false);
    };

    const fetchTeams = async () => {
        const teams = await getAllTeams()
        setLoading(false);

        if (!teams) {
            return [];
        }

        setTeams(teams);
    }

    const fetchPlayer_Team = async () => {
        const player_team = await getAllPlayer_Team()
        setLoading(false);

        if (!player_team) {
            return [];
        }

        setPlayer_Team_Map(player_team);
    }

    const getStatusOfPlayerById = async (playerId: string): Promise<string> => {
        try {
            const status = await getStatusOfPlayerByIdRepo(playerId);
            return status;
        } catch (error) {
            console.error('Error in getStatusOfPlayerById:', error);
            return '';
        }
    }

    const createPlayer = async (name: string, mail: string) => {
        const id = await createPlayerRepo(name, mail)
        if (id) await createInvitationRepo(id.toString())
        notification.success({ message: `Player ${name} created successfully` })
        notification.success({ message: `He can validate via this link : http://localhost:3000/invite/${id}` })
    }

    const createTeam = async (name: string) => {
        createTeamRepo(name)
    }

    const notify_error = async (message: string) => {
        notification.error({ message: message });
    }


    useEffect(() => {
               
        fetchPlayers();
        fetchPlayer_Team();
        fetchPlayersWihoutTeam();
        fetchTeams();
        
        // 1. Create a realtime subscription to the 'player' table
        const playerSubscription = supabase
            .channel('player_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'player' },
                (payload) => {
                    fetchPlayers();
                    fetchPlayersWihoutTeam();
                }
            )
            .subscribe();

        // 2. Create a realtime subscription to the 'team' table
        const teamSubscription = supabase
            .channel('team_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'team' },
                (payload) => {
                    fetchTeams();
                }
            )
            .subscribe();

        // 3. Create a realtime subscription to the 'player_team' table
        const player_teamSubscription = supabase
            .channel('player_team_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'player_team' },
                (payload) => {
                    fetchPlayer_Team();
                    fetchPlayersWihoutTeam();
                    fetchPlayers();
                    fetchTeams();
                }
            )
            .subscribe();
     

        // Cleanup function to remove subscriptions
        return () => {
            playerSubscription.unsubscribe();
            teamSubscription.unsubscribe();
            player_teamSubscription.unsubscribe();
        };
    }, [])

    return {
        players,
        setPlayers,
        loading,
        createPlayer,
        notify_error,
        createTeam,
        fetchTeams,
        fetchPlayersByTeam,
        assignPlayerToTeam,
        handlePlayerAssignment,
        fetchPlayer_Team,
        teams,
        player_team_map,
        playersWithoutTeams,
        getStatusOfPlayerById
    }
}
