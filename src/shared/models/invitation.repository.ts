import { supabase } from "../../config/supabase";

const createInvitationRepo = async (receiver: string) => {
    console.log(receiver)
    const { error } = await supabase
        .from('invitation')
        .insert({ receiver: receiver, state: "RECEIVED_INVITE" })
}

const getStatusOfPlayerByIdRepo = async (id: string): Promise<string> => {
    try {
        const { data, error } = await supabase
            .from('invitation')
            .select('state')
            .eq('receiver', id)
            .single();

        if (error) {
            console.error('Error fetching player status:', error);
            return '';
        }

        return data?.state || null;
    } catch (e) {
        console.error('Unexpected error:', e);
        return '';
    }
}

const acceptInvitationRepo = async (playerId: string) => {
    const { data: playerData, error: playerError } = await supabase
       .from("invitation")
       .update({ state: "ACCEPTED" })
       .eq("receiver", playerId)
       .single()
}

const declineInvitationRepo = async (playerId: string) => {
    const { data: playerData, error: playerError } = await supabase
       .from("invitation")
       .update({ state: "REJECTED" })
       .eq("receiver", playerId)
       .single()
}

    


export { createInvitationRepo, getStatusOfPlayerByIdRepo, acceptInvitationRepo, declineInvitationRepo };