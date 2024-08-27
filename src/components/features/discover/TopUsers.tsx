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
import { getTopUsers } from "@/actions/users";
import { getAvatar } from "@/utils/users";
import UserCard from "@/components/global/UserCard";

const TopUsers = async () => {
  const topUsers = await getTopUsers();

  if (!topUsers) {
    return null;
  }

  const finalTopUsers = topUsers?.slice(0, 20);

  const userPictures =
    finalTopUsers?.map((user) => {
      const picture = getAvatar(user?.user_metadata);
      return picture;
    }) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <H3>Les plus grands lecteurs</H3>
        <Muted>Explorez les esprits les plus brillants de notre communauté.</Muted>
      </div>

      <Carousel
        opts={{
          align: "start",
          slidesToScroll: "auto"
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4 flex">
          {finalTopUsers?.map((user, index) => (
            <CarouselItem key={user?.id} className="pl-4 md:basis-1/3 lg:basis-1/4">
              <UserCard user={user} userPicture={userPictures[index]} heightFull />
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="hidden lg:block">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
};

export default TopUsers;
