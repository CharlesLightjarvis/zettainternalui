import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { BellIcon, VolumeX, Volume2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { XIcon } from "lucide-react";
import {
  useInterestsNotifications,
  type FormationInterest,
} from "~/hooks/use-interests-notifications";
import { useNavigate } from "react-router";

export default function AdminNotifications() {
  const navigate = useNavigate();
  const {
    unreadCount,
    notifications,
    markAllAsRead,
    removeNotification,
    soundEnabled,
    toggleSound,
    interests, // Ajout de interests
    fetchInterests, // Ajout de fetchInterests
    setSelectedNotification,
  } = useInterestsNotifications();

  const handleNotificationClick = async (notification: FormationInterest) => {
    // Marquer comme lu avant la navigation
    markAllAsRead();

    // On met à jour la sélection immédiatement avec les données actuelles
    setSelectedNotification(notification);

    // On navigue vers la page
    navigate("/admin/dashboard/notifications");

    // On rafraîchit en arrière-plan
    fetchInterests().then(() => {
      // Une fois les données rafraîchies, on met à jour si nécessaire
      const fullNotification = interests.find(
        (interest) => interest.id === notification.id
      );

      if (fullNotification) {
        setSelectedNotification(fullNotification);
      }
    });
  };

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
        <div className="flex items-center justify-between p-2 border-b">
          <span className="text-sm font-medium">Notifications</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSound}
            className="h-8 w-8"
            aria-label={soundEnabled ? "Désactiver le son" : "Activer le son"}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </Button>
        </div>

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Aucune notification
          </div>
        ) : (
          notifications.map((notif, index) => (
            <DropdownMenuItem
              key={index}
              className="relative p-4"
              onClick={() => handleNotificationClick(notif)}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => removeNotification(index)}
              >
                <XIcon className="h-4 w-4" />
              </Button>
              <div className="space-y-1">
                <div className="font-medium">{notif.fullName}</div>
                <div className="text-sm text-muted-foreground">
                  est intéressé par: {notif.formation.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {notif.email} • {notif.phone}
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
