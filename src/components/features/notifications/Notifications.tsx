"use client";
import "client-only";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  BellIcon,
  CheckIcon,
  EllipsisIcon,
  EyeIcon,
  EyeOffIcon,
  GraduationCapIcon
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
import { getAvatar } from "@/utils/users";

export default function Notifications() {
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
                Tous
              </TabsTrigger>

              <TabsTrigger value="unread" className="relative">
                Non lus
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="mt-4 h-[300px]">
              <TabsContent value="all">
                {notifications?.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </TabsContent>

              <TabsContent value="unread">
                {unreadNotifications?.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function NotificationItem({ notification }: Readonly<{ notification: Tables<"notifications"> }>) {
  const { markAsReadNotif, markAsUnreadNotif, deleteNotif } = React.useContext(NotificationContext);

  const notificationCategory: Enums<"notifications_type"> = notification.type;

  const formattedDate = formatDistanceToNow(parseISO(notification.created_at), {
    addSuffix: true,
    locale: fr
  });

  return (
    <div className="flex flex-col gap-4 border-b pb-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col">
            <Semibold size="sm">{notification.title}</Semibold>
            <P size="sm">{notification.message}</P>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <EllipsisIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="max-w-fit p-2 -mr-8" align="start">
              <div className="flex flex-col items-start gap-2">
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
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Muted size="xs">{formattedDate}</Muted>
      </div>
    </div>
  );
}
