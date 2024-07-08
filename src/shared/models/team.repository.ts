import { Player } from "./player.model";
import { supabase } from "../../config/supabase";
import { Team } from "./team.model";

const createTeamRepo = async (name: string) => {
    console.log(name)
    const { error } = await supabase
        .from('team')
        .insert({ name: name })
}

async function getAllTeams(): Promise<Team[] | undefined> {
    try {
        const request = await supabase
            .from("team")
            .select("*");

        if (request.error) {
            return undefined;
        }

        return request.data as Team[];
    } catch (e) {
        console.error(e);
        return undefined;
    }
}


export { createTeamRepo, getAllTeams };