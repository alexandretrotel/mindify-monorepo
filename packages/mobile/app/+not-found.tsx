import ThemedText from "@/components/typography/ThemedText";
import { Link } from "expo-router";
import { useTheme } from "@/providers/ThemeProvider";
import CenteredContainer from "@/components/containers/CenteredContainer";

export default function NotFoundScreen() {
  const { colorStyles } = useTheme();

  return (
    <CenteredContainer>
      <ThemedText style={colorStyles.textForeground}>Cette page n'existe pas</ThemedText>
      <Link href="/">
        <ThemedText style={colorStyles.textPrimary}>Retour à l'accueil</ThemedText>
      </Link>
    </CenteredContainer>
  );
}
