import React, { useEffect } from 'react';
import type { CollapseProps } from 'antd';
import { Card, Collapse } from 'antd';


interface TeamsContainerProps {
    title: string;
    items: CollapseProps['items']
}

export function TeamsContainer(props: TeamsContainerProps) {
    const onChange = (key: string | string[]) => {
        console.log(key);
    };
    useEffect(() => {
        console.log(props.items)
    })

    return (
        <Card title={props.title} bordered={false} className={"w-full"}>
            <Collapse items={props.items} defaultActiveKey={['1']} onChange={onChange} />
        </Card>
    );
};
