import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import useInvite from "./callbacks/useInvite";
import { Card, Flex } from "antd";
import { BannerHome } from "../home/components/banner.home";
import { MailOutlined } from "@ant-design/icons";
import { supabase } from "../../config/supabase";

export function InvitePage() {
    const [name, setName] = useState<string | undefined>();
    const [status, setStatus] = useState<string>("");
    const { playerId } = useParams<{ playerId: string }>();

    const inviteUtils = useInvite();

    const fetchPlayerName = useCallback(async () => {
        try {
            if (playerId) {
                const player = await inviteUtils.fetchPlayerById(playerId);
                setName(player?.name);
            }
        } catch (error) {
            console.error("Error fetching player name:", error);
        }
    }, [playerId, inviteUtils]);

    const fetchStatus = useCallback(async () => {
        try {
            if (playerId) {
                const currentStatus = await inviteUtils.getStatusOfPlayerById(playerId);
                if (!currentStatus) return;
                setStatus(currentStatus);
            }
        } catch (error) {
            console.error("Error fetching player status:", error);
        }
    }, [playerId, inviteUtils]);

    useEffect(() => {
        console.log("Player ID:", playerId);

        const invitationSubscription = supabase
            .channel('invitation_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'invitation' },
                (payload) => {
                    fetchStatus();
                }
            )
            .subscribe();

        fetchPlayerName();
        fetchStatus();

        return () => {
            invitationSubscription.unsubscribe();
        };
    }, [playerId, fetchPlayerName, fetchStatus]);

    if (!playerId) {
        return <div>No player ID provided</div>;
    }

    return (
        <>
            <BannerHome icon={<MailOutlined />} title={"Invitations"} />
            <Flex justify="center" align="center" style={{ height: "100vh" }} vertical gap={"middle"}>
                {status === "RECEIVED_INVITE" ? (
                    <Card title="Do you want to accept to join the game ?" style={{ width: 400 }}>
                        <Flex justify="space-between" align="center" style={{ marginTop: 16 }}>
                            <button onClick={() => inviteUtils.acceptInvitation(playerId)}>Accept</button>
                            <button onClick={() => inviteUtils.declineInvitation(playerId)}>Decline</button>
                        </Flex>
                    </Card>
                ) : (
                    <Card title="You selected a response :" style={{ width: 400 }}>
                        {status}
                    </Card>
                )}
            </Flex>
        </>
    );
}