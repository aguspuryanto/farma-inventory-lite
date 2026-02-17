
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabaseUrl = 'https://iogmwyyuljvloducehzx.supabase.co';
const supabaseKey = 'sb_publishable_hpcuG5tnm3lshKfPEITtsQ_YmRYuYd8_';

export const supabase = createClient(supabaseUrl, supabaseKey);
