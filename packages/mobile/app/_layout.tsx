// global styles
import "../global.css";

// dev
import "expo-dev-client";

import React, { useEffect, useState } from "react";
import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { AppState, AppStateStatus, Platform, StyleSheet } from "react-native";
import NotificationsProvider, { useNotifications } from "@/providers/NotificationsProvider";
import SessionProvider, { useSession } from "@/providers/SessionProvider";
import { Stack, useNavigationContainerRef, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import SearchProvider from "@/providers/SearchProvider";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import ThemeProvider, { useTheme } from "@/providers/ThemeProvider";
import { PostHogProvider } from "posthog-react-native";
import { EllipsisIcon, XIcon } from "lucide-react-native";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";
import * as Notifications from "expo-notifications";
import PushNotificationsProvider from "@/providers/PushNotificationsProvider";
import FeedProvider from "@/providers/FeedProvider";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import * as NavigationBar from "expo-navigation-bar";
import { supabase } from "@/lib/supabase";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

SplashScreen.preventAutoHideAsync();

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  dsn: "https://791830bf1ad7068a2cf8abf96e8602eb@o4507676594601984.ingest.de.sentry.io/4508148629569616",
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation,
      enableNativeFramesTracking: !isRunningInExpoGo(),
    }),
  ],
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
}); // foregrounded notifications behavior

function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });
  const ref = useNavigationContainerRef();

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        await requestTrackingPermissionsAsync();
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const setupNavBar = async () => {
      await NavigationBar.setPositionAsync("absolute");
      await NavigationBar.setBackgroundColorAsync("transparent");
    };

    if (Platform.OS === "android") {
      setupNavBar();
    }
  }, []);

  useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref);
    }
  }, [ref]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider>
        <PostHogProvider
          apiKey="phc_OyxH0ubyDKXCs9BmQZXN2KWwiqV5mRrWBWP0hfl0R6Z"
          options={{
            host: "https://eu.i.posthog.com",
            disabled: __DEV__,
            enableSessionReplay: true,
            sendFeatureFlagEvent: true,
            preloadFeatureFlags: true,
            sessionReplayConfig: {
              maskAllTextInputs: true,
              captureLog: true,
              captureNetworkTelemetry: true,
            },
            ...(__DEV__ && {
              bootstrap: {
                featureFlags: {
                  mindify_ai: true,
                },
              },
            }),
          }}>
          <ActionSheetProvider>
            <SessionProvider>
              <NotificationsProvider>
                <PushNotificationsProvider>
                  <SearchProvider>
                    <FeedProvider>
                      <BottomSheetModalProvider>
                        <NavigationLayout />
                      </BottomSheetModalProvider>
                    </FeedProvider>
                  </SearchProvider>
                </PushNotificationsProvider>
              </NotificationsProvider>
            </SessionProvider>
          </ActionSheetProvider>
        </PostHogProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function NavigationLayout() {
  const [isMounted, setIsMounted] = useState(false);

  const { colors } = useTheme();
  const { handleNotificationsActionSheet } = useNotifications();
  const { session } = useSession();
  const router = useRouter();

  const headerObject = {
    headerStyle: {
      backgroundColor: colors.card,
      shadowColor: colors.border,
    },
    headerTitleStyle: {
      color: colors.foreground,
    },
    headerTintColor: colors.foreground,
  };

  useEffect(() => {
    if (session && !isMounted) {
      router.navigate("/feed");
      setIsMounted(true);
    }

    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.navigate("/feed");
      }
    });

    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        router.navigate("/welcome");
      }
    });
  }, [isMounted, router, session]);

  return (
    <Stack>
      <Stack.Screen
        name="(core)/(tabs)"
        options={{
          headerShown: false,
          headerTitle: "",
          headerTitleStyle: {
            color: "transparent",
          },
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          title: "",
          headerShown: false,
          headerTitle: "",
          ...headerObject,
        }}
      />
      <Stack.Screen
        name="welcome/index"
        options={{
          title: "Bienvenue",
          headerShown: false,
          headerTitle: "Bienvenue",
          ...headerObject,
        }}
      />
      <Stack.Screen
        name="(auth)/login/index"
        options={{
          title: "Se connecter",
          headerShown: false,
          headerTitle: "Se connecter",
          headerBackButtonMenuEnabled: true,
          presentation: "fullScreenModal",
          ...headerObject,
        }}
      />
      <Stack.Screen
        name="(auth)/register/index"
        options={{
          title: "S'inscrire",
          headerShown: false,
          headerTitle: "S'inscrire",
          headerBackButtonMenuEnabled: true,
          presentation: "fullScreenModal",
          ...headerObject,
        }}
      />
      <Stack.Screen
        name="(core)/summary/[summaryId]"
        options={{
          title: "Résumé",
          headerShown: true,
          headerTitle: "Résumé",
          headerBackButtonMenuEnabled: true,
          ...headerObject,
        }}
      />
      <Stack.Screen
        name="(core)/add-friends/index"
        options={{
          title: "Ajouter des amis",
          headerShown: true,
          headerTitle: "Ajouter des amis",
          headerBackButtonMenuEnabled: true,
          ...headerObject,
        }}
      />
      <Stack.Screen
        name="(core)/search"
        options={{
          title: "Rechercher",
          headerTitle: "Rechercher",
          ...headerObject,
        }}
      />
      <Stack.Screen
        name="(core)/chat/index"
        options={{
          title: "Mindify AI",
          headerShown: true,
          ...headerObject,
        }}
      />
      <Stack.Screen
        name="(core)/chat/summary/[summaryId]"
        options={{
          title: "Mindify AI",
          headerShown: true,
          ...headerObject,
        }}
      />
      <Stack.Screen
        name="(core)/notifications"
        options={{
          title: "Notifications",
          headerShown: true,
          headerTitle: "Notifications",
          headerBackButtonMenuEnabled: true,
          headerRight: () => {
            return (
              <HapticTouchableOpacity
                onPress={() => handleNotificationsActionSheet()}
                event="user_opened_notifications_menu">
                <EllipsisIcon size={24} color={colors.foreground} />
              </HapticTouchableOpacity>
            );
          },
          ...headerObject,
        }}
      />
      <Stack.Screen
        name="(core)/minds/summary/[summaryId]"
        options={{
          title: "Minds",
          headerShown: true,
          headerTitle: "Minds",
          headerBackButtonMenuEnabled: true,
          ...headerObject,
        }}
      />
      <Stack.Screen
        name="(core)/topic/[topicId]"
        options={{
          title: "Thème",
          headerShown: true,
          headerTitle: "Thème",
          headerBackButtonMenuEnabled: true,
          ...headerObject,
        }}
      />
      <Stack.Screen
        name="(core)/saved-summaries/index"
        options={{
          title: "Résumés sauvegardés",
          headerShown: true,
          headerTitle: "Résumés sauvegardés",
          headerBackButtonMenuEnabled: true,
          ...headerObject,
        }}
      />
      <Stack.Screen
        name="(modals)/summary/preview/[summaryId]"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="(core)/summary/end/[topicId]"
        options={{
          title: "Récapitulatif",
          headerShown: true,
          headerTitle: "Récapitulatif",
          headerRight: () => {
            return (
              <HapticTouchableOpacity
                onPress={() => router.replace("/feed")}
                event="user_pressed_continue_after_reading">
                <XIcon size={24} color={colors.foreground} />
              </HapticTouchableOpacity>
            );
          },
          headerBackVisible: false,
          ...headerObject,
        }}
      />
      <Stack.Screen
        name="(core)/user/topics/[userId]"
        options={{
          headerShown: true,
          headerBackButtonMenuEnabled: true,
          ...headerObject,
        }}
      />
      <Stack.Screen
        name="(core)/user/read-summaries/[userId]"
        options={{
          headerShown: true,
          headerBackButtonMenuEnabled: true,
          ...headerObject,
        }}
      />
      <Stack.Screen
        name="(core)/user/friends/[userId]"
        options={{
          headerShown: true,
          headerBackButtonMenuEnabled: true,
          ...headerObject,
        }}
      />
      <Stack.Screen
        name="(core)/my-account/appearance"
        options={{
          title: "Apparence",
          headerShown: true,
          headerTitle: "Apparence",
          ...headerObject,
        }}
      />
      <Stack.Screen
        name="(core)/my-account/profile"
        options={{
          title: "Profil",
          headerShown: true,
          headerTitle: "Profil",
          ...headerObject,
        }}
      />
      <Stack.Screen
        name="(core)/my-account/security"
        options={{
          headerShown: true,
          headerTitle: "Sécurité",
          title: "Sécurité",
          ...headerObject,
        }}
      />
      <Stack.Screen
        name="(core)/my-account/personalization"
        options={{
          headerShown: true,
          headerTitle: "Personnalisation",
          title: "Personnalisation",
          ...headerObject,
        }}
      />
      <Stack.Screen
        name="(core)/settings"
        options={{
          title: "Réglages",
          headerShown: true,
          headerTitle: "Réglages",
          headerBackVisible: true,
          ...headerObject,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Sentry.wrap(RootLayout);
