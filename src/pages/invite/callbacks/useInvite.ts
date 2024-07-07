import { useEffect, useState } from "react";
import { Player } from "../../../shared/models/player.model";
import { getAllPlayers, getPlayerById } from "../../../shared/models/player.repository";
import { notification } from "antd";
import { supabase } from "../../../config/supabase";

export default function useInvite() {
    const fetchPlayerById = async (id: string) => {
        const player = await getPlayerById(id);
        return player
    }

    return {
        fetchPlayerById
    }
}
