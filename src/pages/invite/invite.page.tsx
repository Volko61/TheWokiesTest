import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import useInvite from "./callbacks/useInvite";

export function InvitePage() {
    const { id } = useParams();
    const [name, setName] = useState<string | undefined>();

    const inviteUtils = useInvite();

    useEffect(() => {
        const fetchPlayerName = async () => {
            try {
                if (id) {
                    const player = await inviteUtils.fetchPlayerById(id);
                    setName(player?.name);
                }
            } catch (error) {
                console.error("Error fetching player name:", error);
            }
        };

        fetchPlayerName();
    }, [id]);

    return (
        <h1>Hello, {id}</h1>
    )
}
