import NoHeaderModalContainer from "@/components/containers/modals/expo/NoHeaderModalContainer";
import FriendItem from "@/components/global/friends/FriendItem";
import useUserFriends from "@/hooks/global/friends/useUserFriends";
import useProfileMetadata from "@/hooks/global/user/useProfileMetadata";
import tw from "@/lib/tailwind";
import { Stack, useGlobalSearchParams } from "expo-router";
import React from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TopicsModal() {
  const { userId } = useGlobalSearchParams<Readonly<{ userId: string }>>();

  const { username } = useProfileMetadata(userId);
  const { friends } = useUserFriends(userId);
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <NoHeaderModalContainer noSafeArea>
      <View style={[tw`flex h-full px-4`]}>
        <FlatList
          data={friends}
          keyExtractor={(item) => item.friend_id.toString()}
          renderItem={({ item }) => <FriendItem friend={item} />}
          contentContainerStyle={{ paddingVertical: 16, paddingBottom: safeAreaInsets.bottom + 16 }}
          ItemSeparatorComponent={() => <View style={tw`my-2`} />}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <StackScreen userName={username} />
    </NoHeaderModalContainer>
  );
}

function StackScreen({ userName }: Readonly<{ userName: string }>) {
  return (
    <Stack.Screen
      options={{
        headerShown: true,
        title: `Amis de ${userName}`,
        headerTitle: `Amis de ${userName}`,
      }}
    />
  );
}
