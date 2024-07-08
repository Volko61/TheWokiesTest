import { useEffect, useState } from "react";
import { Player } from "../../../shared/models/player.model";
import { getAllPlayers, getPlayerById } from "../../../shared/models/player.repository";
import { notification } from "antd";
import { supabase } from "../../../config/supabase";
import { PlayerState } from "../../../shared/models/invitation.model";
import { acceptInvitationRepo, declineInvitationRepo, getStatusOfPlayerByIdRepo } from "../../../shared/models/invitation.repository";

export default function useInvite() {
    const fetchPlayerById = async (id: string) => {
        const player = await getPlayerById(id);
        return player
    }

    const acceptInvitation = async (playerId: string) => {
        try {
            const error = await acceptInvitationRepo(playerId);
            notification.success({ message: "You accepted the invitation" });
        } catch (error) {
            console.error("Error accepting invitation:", error)
        }
    }

    const declineInvitation = async (playerId: string) => {
        try {
            const error = await declineInvitationRepo(playerId);
            notification.success({ message: "You declined the invitation" });
        } catch (error) {
            console.error("Error declining invitation:", error)
        }
    }

    const getStatusOfPlayerById = async (playerId: string) => {
        try {
            const status = await getStatusOfPlayerByIdRepo(playerId)
            return status as PlayerState
        } catch (error) {
            console.error("Error getting player status:", error)
        }
    }


    return {
        fetchPlayerById,
        acceptInvitation,
        declineInvitation,
        getStatusOfPlayerById
    }
}
