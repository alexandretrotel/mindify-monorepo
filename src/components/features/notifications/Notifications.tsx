"use client";
import "client-only";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  BellIcon,
  BookIcon,
  CheckIcon,
  EllipsisIcon,
  EyeIcon,
  EyeOffIcon,
  GraduationCapIcon,
  TrashIcon,
  UserIcon,
  XIcon
} from "lucide-react";
import { NotificationContext } from "@/providers/NotificationsProvider";
import { Button } from "@/components/ui/button";
import Semibold from "@/components/typography/semibold";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Enums, Tables } from "@/types/supabase";
import P from "@/components/typography/p";
import { formatDistanceToNow, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Muted } from "@/components/typography/muted";
import { useToast } from "@/components/ui/use-toast";
import { acceptFriendRequest, rejectFriendRequest } from "@/actions/friends.action";
import type { UUID } from "crypto";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Notifications({ userId }: { userId: UUID }) {
  const [filter, setFilter] = React.useState<"all" | "unread">("all");

  const { notifications } = React.useContext(NotificationContext);

  const unreadNotifications = notifications?.filter((n) => !n.is_read);
  const unreadCount = notifications?.filter((n) => !n.is_read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <BellIcon className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center p-1 text-center"
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Open notifications</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="mr-4 max-w-xs md:min-w-96 md:max-w-lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 md:gap-16">
            <Semibold>Notifications</Semibold>
          </div>

          <Tabs
            defaultValue="all"
            onValueChange={(value) => {
              setFilter(value as "all" | "unread");
            }}
            value={filter}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all" className="relative">
                Toutes
              </TabsTrigger>

              <TabsTrigger value="unread" className="relative">
                Non lus
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="mt-4 h-[300px]">
              <TabsContent value="all">
                {notifications?.length > 0 ? (
                  notifications?.map((notification, index) => {
                    return (
                      <div key={notification.id} className="flex flex-col">
                        <NotificationItem notification={notification} userId={userId} />

                        {index !== notifications.length - 1 && <Separator className="my-4" />}
                      </div>
                    );
                  })
                ) : (
                  <div className="flex h-[250px] flex-col items-center justify-center gap-4">
                    <Muted>Aucune notification</Muted>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="unread">
                {unreadNotifications?.length > 0 ? (
                  unreadNotifications?.map((notification, index) => {
                    return (
                      <div key={notification.id} className="flex flex-col">
                        <NotificationItem notification={notification} userId={userId} />

                        {index !== unreadNotifications.length - 1 && <Separator className="my-4" />}
                      </div>
                    );
                  })
                ) : (
                  <div className="flex h-[250px] flex-col items-center justify-center gap-4">
                    <Muted>Aucune notification</Muted>
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function NotificationItem({
  notification,
  userId
}: Readonly<{
  notification: Tables<"notifications"> & {
    summaries: Tables<"summaries"> & {
      authors: Tables<"authors">;
    };
  };
  userId: UUID;
}>) {
  const { markAsReadNotif, markAsUnreadNotif, deleteNotif } = React.useContext(NotificationContext);

  const { toast } = useToast();

  const notificationCategory: Enums<"notifications_type"> = notification.type;
  const friendId = notification?.friend_id as UUID;
  const authorSlug = notification?.summaries?.authors?.slug as string;
  const summarySlug = notification?.summaries?.slug as string;

  const formattedDate = formatDistanceToNow(parseISO(notification.created_at), {
    addSuffix: true,
    locale: fr
  });

  const acceptFriend = async () => {
    try {
      await acceptFriendRequest(userId, friendId);
      await deleteNotif(notification.id);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'acceptation de la demande",
        variant: "destructive"
      });
    }
  };

  const rejectFriend = async () => {
    try {
      await rejectFriendRequest(userId, friendId);
      await deleteNotif(notification.id);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du rejet de la demande",
        variant: "destructive"
      });
    }
  };

  return (
    <div
      className={`flex flex-col gap-4 rounded-lg p-3 px-4 ${!notification.is_read ? "bg-muted/50" : ""}`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col">
            <Semibold size="sm">{notification.title}</Semibold>
            <P size="sm">{notification.message}</P>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <button>
                <EllipsisIcon className="h-4 w-4 fill-muted hover:fill-muted-foreground" />
              </button>
            </PopoverTrigger>

            <PopoverContent className="-mr-8 max-w-fit p-2" align="start">
              <div className="flex flex-col items-start gap-2">
                {notificationCategory === "friend_request" && (
                  <React.Fragment>
                    <Button
                      variant="ghost"
                      className="flex w-full items-center justify-start gap-2"
                      size="sm"
                      asChild
                    >
                      <Link href={`/profile/${friendId}`}>
                        <UserIcon className="h-4 w-4" />
                        Voir l&apos;utilisateur
                      </Link>
                    </Button>

                    <Button
                      variant="ghost"
                      className="flex w-full items-center justify-start gap-2"
                      size="sm"
                      onClick={acceptFriend}
                    >
                      <CheckIcon className="h-4 w-4" />
                      Accepter la demande
                    </Button>

                    <Button
                      variant="ghost"
                      className="flex w-full items-center justify-start gap-2"
                      size="sm"
                      onClick={rejectFriend}
                    >
                      <XIcon className="h-4 w-4" />
                      Refuser la demande
                    </Button>
                  </React.Fragment>
                )}

                {notificationCategory === "new_summary" ||
                  notificationCategory === "friend_read_summary" ||
                  (notificationCategory === "friend_saved_summary" && (
                    <Button
                      variant="ghost"
                      className="flex w-full items-center justify-start gap-2"
                      size="sm"
                      asChild
                    >
                      <Link href={`/summary/${authorSlug}/${summarySlug}`}>
                        <BookIcon className="h-4 w-4" />
                        Lire le résumé
                      </Link>
                    </Button>
                  ))}

                {notificationCategory === "flashcards_due" && (
                  <Button
                    variant="ghost"
                    className="flex w-full items-center justify-start gap-2"
                    size="sm"
                    asChild
                  >
                    <Link href={`/learn`}>
                      <GraduationCapIcon className="h-4 w-4" />
                      Apprendre
                    </Link>
                  </Button>
                )}

                {!notification.is_read ? (
                  <Button
                    variant="ghost"
                    className="flex w-full items-center justify-start gap-2"
                    size="sm"
                    onClick={() => markAsReadNotif(notification.id)}
                  >
                    <EyeIcon className="h-4 w-4" />
                    Marquer comme lu
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className="flex w-full items-center justify-start gap-2"
                    size="sm"
                    onClick={() => markAsUnreadNotif(notification.id)}
                  >
                    <EyeOffIcon className="h-4 w-4" />
                    Marquer comme non lu
                  </Button>
                )}

                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-start gap-2"
                  size="sm"
                  onClick={() => deleteNotif(notification.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                  Supprimer
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Muted size="xs">{formattedDate}</Muted>
      </div>
    </div>
  );
}
