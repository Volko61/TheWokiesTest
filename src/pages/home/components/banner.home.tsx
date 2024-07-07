import {Divider, Flex} from "antd";
import {ReactElement} from "react";

interface BannerHomeProps {
    title: string;
    icon: ReactElement;
}

export function BannerHome(props: BannerHomeProps) {
    return (
        <Flex className={"w-full"} vertical>
            <Flex className={"w-full h-14"} align={"center"} justify={"center"}>
                <h1 className={"text-2xl font-bold"}>{props.icon} {props.title}</h1>
            </Flex>
            <Divider className={"m-0"}/>
        </Flex>
    )
}
