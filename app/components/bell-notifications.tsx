import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { BellIcon } from "lucide-react";
import { useNotificationsStore } from "../hooks/use-notifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { XIcon } from "lucide-react";

export default function BellNotifications() {
  const { unreadCount, notifications, markAllAsRead, removeNotification } =
    useNotificationsStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          onClick={markAllAsRead}
          aria-label="Notifications"
        >
          <BellIcon size={16} aria-hidden="true" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Aucune notification
          </div>
        ) : (
          notifications.map((notif, index) => (
            <DropdownMenuItem key={index} className="relative p-4">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => removeNotification(index)}
              >
                <XIcon className="h-4 w-4" />
              </Button>
              <div className="space-y-1">
                <div className="font-medium">{notif.interest.fullName}</div>
                <div className="text-sm text-muted-foreground">
                  est intéressé par: {notif.interest.formation.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {notif.interest.email} • {notif.interest.phone}
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
