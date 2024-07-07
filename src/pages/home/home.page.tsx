import { Button, Flex, Space } from "antd";
import { BannerHome } from "./components/banner.home";
import { PlusSquareOutlined } from "@ant-design/icons";
import useHome from "./callbacks/useHome";
import AddNewPlayerButton from "./components/add_player.home";
import AddNewTeamButton from "./components/add_team.home";

export function HomePage() {
    const home = useHome();

    return (
        <Flex vertical>
            <BannerHome icon={<PlusSquareOutlined />} title={"Create invitations"} />
            <Flex justify={"space-between"} align={"center"} className={"w-full mt-4 pl-4 pr-4 box-border"}>
                <Flex vertical gap={"middle"} className={"ml-3"}>
                    <AddNewPlayerButton />
                    <AddNewTeamButton />
                </Flex>
                <p>{home.players.length} invited player(s)</p>
            </Flex>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Flex justify={"center"} align={"center"} className={"w-full mt-4 pl-4 pr-4 box-border"}>
                    {home.players.map(player => (
                        <p key={player.id}>{player.name}</p>
                    ))}
                </Flex>
            </Space>
        </Flex>
    )
}
