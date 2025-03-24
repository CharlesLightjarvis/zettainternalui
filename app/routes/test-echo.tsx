import { useState, useEffect } from "react";
import echo from "~/echo";
import { Card, CardContent } from "~/components/ui/card";
import { XIcon, BellIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

interface FormationInterest {
  interest: {
    email: string;
    fullName: string;
    phone: string;
    message: string;
    formation: {
      name: string;
      description: string;
      duration: number;
      level: string;
      price: number;
    };
  };
}

export const TestEcho = () => {
  const [notifications, setNotifications] = useState<FormationInterest[]>([]);

  useEffect(() => {
    const channel = echo.channel("formation-interests");

    channel.listen("NewFormationInterest", (e: FormationInterest) => {
      setNotifications((prev) => [e, ...prev].slice(0, 5));
    });

    // Nettoyage de l'écouteur quand le composant est démonté
    return () => {
      channel.stopListening("NewFormationInterest");
    };
  }, []); // tableau de dépendances vide = exécuté une seule fois à l'initialisation

  const removeNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  if (notifications.length === 0) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4">
        <BellIcon className="h-24 w-24 text-muted-foreground/40" />
        <p className="text-muted-foreground text-sm">
          Aucune notification pour le moment
        </p>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-96">
      {notifications.map((notif, index) => (
        <Card
          key={index}
          className="bg-white dark:bg-gray-800 shadow-lg animate-in slide-in-from-right"
        >
          <CardContent className="p-4 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => removeNotification(index)}
            >
              <XIcon className="h-4 w-4" />
            </Button>

            <div className="space-y-2">
              <div className="font-medium">{notif.interest.fullName}</div>
              <div className="text-sm text-muted-foreground">
                est intéressé par: {notif.interest.formation.name}
              </div>
              <div className="text-xs text-muted-foreground">
                Message: {notif.interest.message}
              </div>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>{notif.interest.email}</span>
                <span>•</span>
                <span>{notif.interest.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
