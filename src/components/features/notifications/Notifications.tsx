"use client";
import "client-only";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BellIcon, CheckIcon } from "lucide-react";
import { NotificationContext } from "@/providers/NotificationsProvider";
import { Button } from "@/components/ui/button";
import Semibold from "@/components/typography/semibold";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Enums, Tables } from "@/types/supabase";
import P from "@/components/typography/p";

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

            <ScrollArea className="mt-2 h-[300px]">
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

  if (notificationCategory === "new_summary") {
    return (
      <div className="flex flex-col gap-4 border-b pb-4">
        <P size="sm">{notification.message}</P>

        <div className="grid gap-4 md:grid-cols-2">
          <Button
            size="sm"
            className="text-sm"
            variant={notification.is_read ? "default" : "outline"}
            onClick={() => {
              if (!notification.is_read) {
                markAsReadNotif(notification.id);
              } else {
                markAsUnreadNotif(notification.id);
              }
            }}
          >
            {notification.is_read ? "Marquer comme non lu" : "Marquer comme lu"}
            {notification.is_read && <CheckIcon className="ml-2 h-4 w-4" />}
          </Button>

          <Button variant="destructive" size="sm" className="text-sm" onClick={() => deleteNotif}>
            Supprimer
          </Button>
        </div>
      </div>
    );
  }
}
