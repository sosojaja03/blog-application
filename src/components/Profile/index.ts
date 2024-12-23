import { supabase } from "@/supabase";
import { ProfilePayload } from "./ProfileTypes";

export const getProfileInfo = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId);

  if (error) throw error;
  return data;
};

export const fillProfileInfo = async (
  profileData: ProfilePayload & { id: string },
) => {
  const { data, error } = await supabase.from("profiles").upsert({
    id: profileData.id,
    username: profileData.username,
    email: profileData.email,
    full_name_en: profileData.full_name_en,
    full_name_ka: profileData.full_name_ka,
    phone: profileData.phone,
    avatar_url: profileData.avatar_url,
  });

  if (error) throw error;
  return data;
};
