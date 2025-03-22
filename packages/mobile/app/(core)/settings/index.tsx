import React from "react";
import { View } from "react-native";
import HeaderPageContainer from "@/components/containers/HeaderPageContainer";
import LegalSection from "@/components/features/settings/LegalSection";
import AccountSection from "@/components/features/settings/AccountSection";
import LogoutSection from "@/components/features/settings/LogoutSection";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "@/lib/tailwind";

export default function Settings() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <HeaderPageContainer>
      <View
        style={[
          { paddingBottom: safeAreaInsets.bottom + 18 },
          tw`h-full flex-col justify-between pt-8`,
        ]}>
        <View style={tw`flex-col gap-16`}>
          <AccountSection />
          <LegalSection />
        </View>

        <LogoutSection />
      </View>
    </HeaderPageContainer>
  );
}
