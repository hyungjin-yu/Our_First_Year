import { createClient } from "@/utils/supabase/client";

export async function uploadToSupabase(file: File, userId: string) {
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from("memories")
        .upload(fileName, file);

    if (error) {
        throw error;
    }

    const { data: { publicUrl } } = supabase.storage
        .from("memories")
        .getPublicUrl(fileName);

    return publicUrl;
}
