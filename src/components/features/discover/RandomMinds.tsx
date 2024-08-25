import React from "react";
import H3 from "@/components/typography/h3";
import { Carousel } from "@/components/ui/carousel";
import { Muted } from "@/components/typography/muted";
import { areMindsSaved, getRandomMinds } from "@/actions/minds";
import MindsClient from "@/components/global/MindsClient";
import { UUID } from "crypto";

const RandomMinds = async ({
  userId,
  isConnected,
  userName
}: {
  userId: UUID;
  isConnected: boolean;
  userName: string;
}) => {
  const allRandomMinds = await getRandomMinds();
  const randomMinds = allRandomMinds?.slice(0, 10);

  const randomMindsIds = randomMinds?.map((mind) => mind?.id);

  let areMindsSavedArray = Array<boolean>(randomMindsIds.length).fill(false);
  if (isConnected) {
    areMindsSavedArray = await areMindsSaved(randomMindsIds, userId);
  }

  return (
    <Carousel
      opts={{
        align: "start",
        slidesToScroll: "auto"
      }}
      className="w-full"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <H3>Quelques MINDS au hasard</H3>
          <Muted>De quoi vous inspirer.</Muted>
        </div>

        <MindsClient
          minds={randomMinds}
          initialAreSaved={areMindsSavedArray}
          userId={userId}
          isConnected={isConnected}
          userName={userName}
        />
      </div>
    </Carousel>
  );
};

export default RandomMinds;
