import { View } from "react-native";
import TopicsNumber from "@/components/features/profile/numbers/TopicsNumber";
import Separator from "@/components/ui/Separator";
import ReadSummariesNumber from "@/components/features/profile/numbers/ReadSummariesNumber";
import FriendsNumber from "@/components/features/profile/numbers/FriendsNumber";
import { Card } from "@/components/global/card/Card";
import tw from "@/lib/tailwind";

export default function StatisticsCard({ profileId }: Readonly<{ profileId: string }>) {
  return (
    <Card padding="medium">
      <View style={tw`flex-row justify-evenly gap-4 items-center`}>
        <TopicsNumber userId={profileId} />
        <Separator direction="vertical" />
        <ReadSummariesNumber userId={profileId} />
        <Separator direction="vertical" />
        <FriendsNumber userId={profileId} />
      </View>
    </Card>
  );
}
