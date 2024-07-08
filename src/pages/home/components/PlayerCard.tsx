import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Card } from 'antd';
import { Player } from '../../../shared/models/player.model';

interface PlayerCardProps {
    player: Player;
  }

export function PlayerCard({ player }: PlayerCardProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: player.id,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <Card
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            key={player.id}
            title={player.name}
            bordered={false}
            className={"w-full"}
        >
            <p>{player.name}</p>
        </Card>
    );
}
