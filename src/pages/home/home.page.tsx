import React, { useEffect, useState } from "react";
import { Button, Card, Collapse, Flex, Space } from "antd";
import { BannerHome } from "./components/banner.home";
import { PlusSquareOutlined } from "@ant-design/icons";
import useHome from "./callbacks/useHome";
import AddNewPlayerButton from "./components/add_player.home";
import AddNewTeamButton from "./components/add_team.home";
import { TeamsContainer } from "./components/TeamsContainer.home";
import { DndContext, DragOverlay, useDraggable, useDroppable, closestCenter } from "@dnd-kit/core";
import { Player } from "../../shared/models/player.model";
import { Team } from "../../shared/models/team.model";
import { supabase } from "../../config/supabase";


const DraggablePlayer: React.FC<{ player: Player; teamId: string | null }> = ({ player, teamId }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: player.id,
        data: { teamId },
    });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;
    const [status, setStatus] = useState<string | null>(null);
    const home = useHome();

    useEffect(() => {
        const invitationSubscription = supabase
            .channel('invitation_changes_home')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'invitation' },
                (payload) => {
                    fetchStatus();
                }
            )
            .subscribe();
        const fetchStatus = async () => {
            const playerStatus = await home.getStatusOfPlayerById(player.id);
            setStatus(playerStatus);
        };
        fetchStatus();
    }, [player.id, home]);

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <Card
                title={player.name}
                bordered={false}
                style={{ width: 300 }}
                className={"w-full"}
            >
                <Flex justify={"space-between"} align={"center"}>
                    <p>{player.name}</p>
                    <p>{status}</p>
                </Flex>
            </Card>
        </div>
    );
};

const DroppableTeam: React.FC<{ team: Team; children: React.ReactNode }> = ({ team, children }) => {
    const { setNodeRef } = useDroppable({
        id: team.id,
    });

    return (
        <div ref={setNodeRef} style={{ padding: '10px', border: '1px dashed #ccc', marginBottom: '10px', gap: '10px' }} className={"flex flex-col"}>
            <h3>{team.name}</h3>
            {children}
        </div>
    );
};

export function HomePage() {
    const home = useHome();

    const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null);

    const handleDragStart = (event: any) => {
        const { active } = event;
        const draggedPlayer = home.players.find(p => p.id === active.id);
        if (draggedPlayer) {
            setDraggedPlayer(draggedPlayer);
        }
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const playerId = active.id;
            const newTeamId = over.id;
            const oldTeamId = active.data.current?.teamId;
            home.handlePlayerAssignment(playerId, newTeamId, oldTeamId);
        }

        setDraggedPlayer(null);
    };

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Flex vertical className="min-h-screen">
                <BannerHome icon={<PlusSquareOutlined />} title={"Create invitations"} />
                <Flex justify={"space-between"} align={"center"} className={"w-full mt-4 px-4 box-border"}>
                    <div></div>
                    <p>{home.players.length} invited player(s)</p>
                </Flex>
                <Flex className="flex-grow overflow-hidden">
                    <Flex vertical className="w-full md:w-1/3 p-4 overflow-y-auto">
                        <AddNewPlayerButton />
                        <div className="grid grid-cols-1 gap-4 mt-4">
                            {home.playersWithoutTeams.map((player) => (
                                <DraggablePlayer key={player.id} player={player} teamId={null} />
                            ))}
                        </div>
                    </Flex>
                    <Flex vertical className="w-full md:w-2/3 p-4 overflow-y-auto">
                        <AddNewTeamButton />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            {home.teams.map((team) => (
                                <DroppableTeam key={team.id} team={team}>
                                    {home.player_team_map[team.id]?.map((player) => (
                                        <DraggablePlayer key={player.id} player={player} teamId={team.id} />
                                    ))}
                                </DroppableTeam>
                            ))}
                        </div>
                    </Flex>
                </Flex>
            </Flex>
            <DragOverlay>
                {draggedPlayer && (
                    <Card
                        title={draggedPlayer.name}
                        bordered={false}
                        style={{ width: 300 }}
                        className={"w-full"}
                    >
                        <p>{draggedPlayer.name}</p>
                    </Card>
                )}
            </DragOverlay>
        </DndContext>
    );
}
