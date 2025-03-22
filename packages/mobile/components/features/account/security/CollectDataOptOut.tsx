import ThemedText from "@/components/typography/ThemedText";
import useCollectData from "@/hooks/features/account/security/useCollectData";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { Switch, View } from "react-native";

export default function CollectDataOptOut() {
  const { colorStyles } = useTheme();
  const { optedOut, handleToggle } = useCollectData();

  return (
    <View style={tw`flex-col gap-4`}>
      <View>
        <ThemedText semibold style={[colorStyles.textForeground, tw`text-lg`]}>
          Collecte de données
        </ThemedText>
        <ThemedText style={[colorStyles.textMutedForeground, tw`text-sm`]}>
          Je souhaite participer à l'amélioration de l'application en partageant mes données.
        </ThemedText>
      </View>

      <View style={tw`flex-col gap-4`}>
        <View style={tw`flex-row justify-between items-center`}>
          <ThemedText style={[colorStyles.textMutedForeground, tw`text-sm`]}>
            {!optedOut ? "Collecte de données activée" : "Collecte de données désactivée"}
          </ThemedText>
          <Switch onValueChange={handleToggle} value={!optedOut} />
        </View>
      </View>
    </View>
  );
}
