"use client";
import "client-only";

import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/features/home/client/AnimatedListClient";
import Semibold from "@/components/typography/semibold";
import { Muted } from "@/components/typography/muted";

interface Item {
  name: string;
  description: string;
}

let notifications = [
  {
    name: "Révision de la semaine",
    description: "Nous avons sélectionné 4 MINDS pour vous"
  },
  {
    name: "Apprenez vos MINDS enregistrés",
    description: "Vous avez 5 MINDS en attente"
  },
  {
    name: "Hop, hop, hop !",
    description: "Il vous reste 3 MINDS à apprendre dans votre deck"
  },
  { name: "Nouveau MIND", description: "Découvrez le MIND du jour" }
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const Notification = ({ name, description }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div className="flex flex-col overflow-hidden">
          <Semibold>{name}</Semibold>
          <Muted>{description}</Muted>
        </div>
      </div>
    </figure>
  );
};

export function NotificationsClient({ className }: Readonly<{ className?: string }>) {
  return (
    <div
      className={cn(
        "relative flex h-56 w-full flex-col overflow-hidden rounded-lg border bg-background p-6",
        className
      )}
    >
      <AnimatedList>
        {notifications.map((item, index) => (
          <Notification {...item} key={index} />
        ))}
      </AnimatedList>
    </div>
  );
}
