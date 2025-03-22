import React from "react";
import { SectionList, RefreshControl, ScrollView, View } from "react-native";
import ThemedText from "@/components/typography/ThemedText";
import NotificationItem from "@/components/features/notifications/NotificationItem";
import { useNotifications } from "@/providers/NotificationsProvider";
import Separator from "@/components/ui/Separator";
import CenteredContainer from "@/components/containers/CenteredContainer";
import HeaderPageContainer from "@/components/containers/HeaderPageContainer";
import { useTheme } from "@/providers/ThemeProvider";
import { categorizeNotifications } from "@/utils/notifications";
import SectionHeader from "@/components/features/notifications/SectionHeader";
import tw from "@/lib/tailwind";

export default function NotificationsFeed() {
  const [refreshing, setRefreshing] = React.useState(false);

  const { colors } = useTheme();
  const { notifications, handleRefresh } = useNotifications();

  const sections = categorizeNotifications(notifications);

  if (sections?.every((section) => section.data.length === 0)) {
    return (
      <CenteredContainer>
        <ScrollView
          style={tw`w-full`}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
          refreshControl={
            <RefreshControl
              tintColor={colors.foreground}
              refreshing={refreshing}
              onRefresh={() => handleRefresh(setRefreshing)}
            />
          }>
          <ThemedText>Aucune notification</ThemedText>
        </ScrollView>
      </CenteredContainer>
    );
  }

  return (
    <HeaderPageContainer noPadding>
      <SectionList
        sections={sections?.filter((section) => section.data.length > 0)}
        keyExtractor={(index) => index.id.toString()}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        contentContainerStyle={{ paddingVertical: 16 }}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl
            tintColor={colors.foreground}
            refreshing={refreshing}
            onRefresh={() => handleRefresh(setRefreshing)}
          />
        }
        renderSectionHeader={({ section: { title } }) => (
          <View style={tw`pb-2`}>
            <SectionHeader sections={sections} title={title} />
          </View>
        )}
        ItemSeparatorComponent={({ section, index }) =>
          index === section.data.length - 1 ? null : <Separator />
        }
        showsVerticalScrollIndicator={false}
      />
    </HeaderPageContainer>
  );
}
