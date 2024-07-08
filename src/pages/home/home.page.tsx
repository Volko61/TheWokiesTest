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

const DraggablePlayer: React.FC<{ player: Player }> = ({ player }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: player.id,
    });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;
    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <Card
                title={player.name}
                bordered={false}
                style={{ width: 300 }}
                className={"w-full"}
            >
                <p>{player.name}</p>
            </Card>
        </div>
    );
};

const DroppableTeam: React.FC<{ team: Team; children: React.ReactNode }> = ({ team, children }) => {
    const { setNodeRef } = useDroppable({
        id: team.id,
    });

    return (
        <div ref={setNodeRef} style={{ padding: '10px', border: '1px dashed #ccc', marginBottom: '10px' }}>
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
            const teamId = over.id;
            home.handlePlayerAssignment(playerId, teamId);
        }

        setDraggedPlayer(null);
    };

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Flex vertical>
                <BannerHome icon={<PlusSquareOutlined />} title={"Create invitations"} />
                <Flex justify={"space-between"} align={"center"} className={"w-full mt-4 pl-4 pr-4 box-border"}>
                    <div></div>
                    <p>{home.players.length} invited player(s)</p>
                </Flex>
                <Flex gap={"middle"}>
                    <Flex vertical gap={"small"} justify={"center"} align={"center"} className={"w-full mt-4 pl-4 pr-4 box-border"}>
                        <AddNewPlayerButton />
                        {home.playersWithoutTeams.map((player) => (
                            <DraggablePlayer key={player.id} player={player} />
                        ))}
                    </Flex>
                    <Flex vertical gap="5px" justify={"center"} align={"center"} className={"w-full mt-4 pl-4 pr-4 box-border"}>
                        <AddNewTeamButton />
                        {home.teams.map((team) => (
                            <DroppableTeam key={team.id} team={team}>
                                {home.player_team_map[team.id]?.map((player) => (
                                    <Card
                                        key={player.id}
                                        title={player.name}
                                        bordered={false}
                                        style={{ width: 300, marginBottom: '5px' }}
                                        className={"w-full"}
                                    >
                                        <p>{player.name}</p>
                                    </Card>
                                ))}
                            </DroppableTeam>
                        ))}
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
