import { useEffect, useState } from "react";
import { Player } from "../../../shared/models/player.model";
import { getAllPlayers, getAllTeams } from "../../../shared/models/player.repository";
import { notification } from "antd";
import { supabase } from "../../../config/supabase";
import { Team } from "../../../shared/models/team.model";

export default function useHome() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchPlayers = async () => {
        const players = await getAllPlayers()
        setLoading(false);

        if (!players) {
            return notification.error({ message: "Error while fetching players" });
        }

        setPlayers(players);
    }

    useEffect(() => {
        fetchPlayers();
    }, [])

    const fetchPlayersByTeam = async (teamId: string) => {
        const players = await getAllPlayersByTeam(teamId)
        setLoading(false);

        if (!players) {
            return notification.error({ message: "Error while fetching players" });
        }

        setPlayers(players);
    }

    useEffect(() => {
        fetchPlayers();
    }, [])

    const fetchTeams = async () => {
        const teams = await getAllTeams()
        setLoading(false);

        if (!teams) {
            return notification.error({ message: "Error while fetching teams" });
        }

        setTeams(teams);
    }

    useEffect(() => {
        fetchPlayers();
        fetchTeams();
    }, [])

    const addPlayer = async (name: string, mail: string) => {
        console.log(name, mail)
        const { error } = await supabase
            .from('player')
            .insert({ name: name, mail: mail,  })
    }

    const addTeam = async (name: string) => {
        console.log(name)
        const { error } = await supabase
            .from('team')
            .insert({ name: name })
    }

    const notify_error = async (message: string) => {
        notification.error({ message: message });
    }

    return {
        players,
        loading,
        addPlayer,
        notify_error,
        addTeam,
        fetchTeams
    }
}
