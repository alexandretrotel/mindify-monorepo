import { Card, CardBody, CardFooter, CardHeader } from "@/components/global/card/Card";
import GenericHapticButton from "@/components/ui/GenericHapticButton";
import ThemedText from "@/components/typography/ThemedText";
import useUserLevel from "@/hooks/global/user/useUserLevel";
import { useTheme } from "@/providers/ThemeProvider";
import type { Friend } from "@/types/friends";
import { getAvatar } from "@/utils/avatars";
import { useRouter } from "expo-router";
import { View, Image } from "react-native";
import tw from "@/lib/tailwind";
import { type UserMetadata } from "@supabase/supabase-js";
import { UserIcon } from "lucide-react-native";

export default function FriendItem({ friend }: Readonly<{ friend: Friend }>) {
  const router = useRouter();
  const { colorStyles, colors } = useTheme();
  const { level, xp } = useUserLevel(friend.friend_id);

  const metadata = JSON.parse(JSON.stringify(friend?.raw_user_meta_data)) as UserMetadata;
  const avatar = getAvatar(metadata);

  return (
    <Card>
      <CardHeader>
        <View style={tw`flex-row items-center gap-2`}>
          <View
            style={[
              colorStyles.bgMuted,
              tw`h-12 w-12 overflow-hidden rounded-full border flex items-center justify-center`,
            ]}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={tw`h-full w-full`} />
            ) : (
              <UserIcon size={24} color={colors.foreground} />
            )}
          </View>

          <View>
            <ThemedText semibold style={[colorStyles.textForeground, tw`text-base`]}>
              {metadata?.name}
            </ThemedText>
            <ThemedText style={[colorStyles.textMutedForeground, tw`text-sm`]}>
              Niveau {level} / {xp} XP
            </ThemedText>
          </View>
        </View>
      </CardHeader>
      <CardBody>
        <ThemedText style={colorStyles.textMutedForeground}>
          {!metadata?.biography || metadata?.biography === ""
            ? "Aucune biographie"
            : metadata?.biography}
        </ThemedText>
      </CardBody>
      <CardFooter>
        <GenericHapticButton
          variant="black"
          textVariant="textBlack"
          event="user_opened_friend_profile"
          eventProps={{ friend_id: friend?.friend_id }}
          onPress={() => {
            if (!friend?.friend_id) {
              return;
            }

            router.push(`/profile/${friend?.friend_id}`);
          }}>
          Voir le profil
        </GenericHapticButton>
      </CardFooter>
    </Card>
  );
}
