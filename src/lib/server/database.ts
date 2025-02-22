import { createClient } from '@supabase/supabase-js'
import { env } from "$env/dynamic/private";

const supabaseUrl = env.SUPABASE_URL
const supabaseKey = env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
	throw new Error('Missing Supabase URL or key')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase