import CenteredContainer from "@/components/containers/CenteredContainer";
import HeaderPageContainer from "@/components/containers/HeaderPageContainer";
import ThemedText from "@/components/typography/ThemedText";

export default function SummaryChat() {
  return (
    <HeaderPageContainer>
      <CenteredContainer>
        <ThemedText>Cette fonctionnalité est en bêta et n'est pas encore disponible.</ThemedText>
      </CenteredContainer>
    </HeaderPageContainer>
  );
}
