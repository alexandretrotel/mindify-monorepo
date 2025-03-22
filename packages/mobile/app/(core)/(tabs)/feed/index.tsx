import NoHeaderPageContainer from "@/components/containers/NoHeaderPageContainer";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { RefreshControl, StyleSheet, ViewToken, View, Dimensions } from "react-native";
import { useNotifications } from "@/providers/NotificationsProvider";
import CenteredContainer from "@/components/containers/CenteredContainer";
import VideoItem from "@/components/features/feed/VideoItem";
import FeedHeader from "@/components/features/feed/FeedHeader";
import useFetchMinds from "@/hooks/features/feed/useFetchMinds";
import type { Tables } from "@/types/supabase";
import { Asset } from "expo-asset";
import { FlatList } from "react-native-gesture-handler";
import { useTheme } from "@/providers/ThemeProvider";
import ThemedActivityIndicator from "@/components/ui/ThemedActivityIndicator";
import { usePostHog } from "posthog-react-native";

export default function Feed() {
  const [activeItem, setActiveItem] = useState<number>(0);

  const { unreadCount } = useNotifications();
  const { minds, loading, refreshing, onRefresh } = useFetchMinds();
  const { colorStyles, colors } = useTheme();
  const posthog = usePostHog();

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      viewableItems?.forEach((viewableItem) => {
        if (viewableItem?.isViewable && viewableItem?.index !== null) {
          setActiveItem(viewableItem.index);

          posthog.capture("user_scrolled_video_item", {
            mind_id: viewableItem.item.id,
            item_index: viewableItem.index,
          });
        }
      });
    },
    [posthog],
  );

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig,
      onViewableItemsChanged,
    },
  ]);

  const windowHeight = useMemo(() => Dimensions.get("window").height, []);

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: Tables<"minds"> & {
        summaries: Tables<"summaries"> & {
          authors: Tables<"authors">;
          topics: Tables<"topics">;
        };
        videoAsset: Asset;
      };
      index: number;
    }) => {
      return <VideoItem item={item} shouldPlay={activeItem === index} />;
    },
    [activeItem],
  );

  if (loading) {
    return (
      <CenteredContainer>
        <ThemedActivityIndicator />
      </CenteredContainer>
    );
  }

  if (!minds.length) {
    return (
      <CenteredContainer>
        <ThemedActivityIndicator />
      </CenteredContainer>
    );
  }

  return (
    <NoHeaderPageContainer noPadding noSafeArea>
      <View style={[styles.container, colorStyles.bgBackground]}>
        <FlatList
          data={minds}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          snapToInterval={windowHeight}
          snapToAlignment="start"
          decelerationRate={"fast"}
          removeClippedSubviews={true}
          refreshControl={
            <RefreshControl
              tintColor={colors.foreground}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          getItemLayout={(_, index) => ({
            length: windowHeight,
            offset: windowHeight * index,
            index,
          })}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          windowSize={3}
          showsVerticalScrollIndicator={false}
          viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        />

        <FeedHeader unreadCount={unreadCount} />
      </View>
    </NoHeaderPageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
