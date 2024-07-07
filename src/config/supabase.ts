import {createClient} from "@supabase/supabase-js";

export const supabaseConfig = {
    url: <string> process.env.REACT_APP_SUPABASE_URL,
    key: <string> process.env.REACT_APP_SUPABASE_API_KEY
}

export const supabase = createClient(supabaseConfig.url, supabaseConfig.key)
