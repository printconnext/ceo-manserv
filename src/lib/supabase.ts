import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadImageToSupabase(file: File, orgId: string, folder: string = 'media'): Promise<string> {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${orgId}/${folder}/${fileName}`;

        const { data, error } = await supabase.storage
            .from('ceoprofile')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            throw error;
        }

        const { data: publicUrlData } = supabase.storage
            .from('ceoprofile')
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
    } catch (error) {
        console.error('Error uploading image to Supabase:', error);
        throw error;
    }
}
