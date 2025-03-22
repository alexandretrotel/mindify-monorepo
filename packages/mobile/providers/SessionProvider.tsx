import type { Session, UserMetadata } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import React, { useCallback, useEffect } from "react";
import { Alert } from "react-native";
import { usePostHog } from "posthog-react-native";

const SessionContext = React.createContext<{
  session: Session | null;
  userId: string | null;
  userMetadata: UserMetadata | null;
  handleLogout: () => Promise<void>;
  handleAddName: (name: string) => Promise<void>;
}>({
  session: null,
  userId: null,
  userMetadata: null,
  handleLogout: async () => {},
  handleAddName: async () => {},
});

export default function SessionProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [userMetadata, setUserMetadata] = React.useState<UserMetadata | null>(null);

  const posthog = usePostHog();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) {
      const userId = session.user?.id;
      const userMetadata = session.user?.user_metadata;

      posthog.identify(userId, {
        email: userMetadata.email,
        name: userMetadata.name,
      });

      setUserId(userId);
      setUserMetadata(userMetadata);
    }
  }, [posthog, session]);

  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      posthog.reset();
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
      Alert.alert("Erreur lors de la déconnexion");
    }
  }, [posthog]);

  const handleAddName = useCallback(async (name: string) => {
    try {
      await supabase.auth.updateUser({
        data: {
          name,
          first_name: name.split(" ")[0],
          last_name: name.split(" ")[1],
          full_name: name,
        },
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur lors de la mise à jour du nom");
    }
  }, []);

  const contextValue = React.useMemo(
    () => ({ session, userId, userMetadata, handleLogout, handleAddName }),
    [handleAddName, handleLogout, session, userId, userMetadata],
  );

  return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>;
}

export const useSession = () => {
  const context = React.useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
};
