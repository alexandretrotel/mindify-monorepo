import React from "react";
import H3 from "@/components/typography/h3";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Muted } from "@/components/typography/muted";
import { getStorageAvatar, getTopUsers } from "@/actions/users";
import UserCard from "@/components/global/UserCard";
import type { UUID } from "crypto";

const TopUsers = async () => {
  const topUsers = await getTopUsers();

  if (!topUsers) {
    return null;
  }

  const finalTopUsers = topUsers?.slice(0, 20);

  const userPictures = await Promise.all(
    finalTopUsers?.map(async (user) => {
      const picture = await getStorageAvatar(user?.id as UUID, user?.user_metadata);
      return picture;
    }) ?? []
  );

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
          <H3>Les plus grands lecteurs</H3>
          <Muted>Explorez les esprits les plus brillants de notre communauté.</Muted>
        </div>

        <CarouselContent className="-ml-4">
          {finalTopUsers?.map((user, index) => (
            <CarouselItem key={user?.id} className="pl-4 md:basis-1/3 lg:basis-1/4">
              <UserCard user={user} userPicture={userPictures[index]} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </div>

      <div className="hidden lg:block">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  );
};

export default TopUsers;
