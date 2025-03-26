import { create } from "zustand";
import echo from "~/echo";

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

interface NotificationStore {
  notifications: FormationInterest[];
  unreadCount: number;
  channel: any | null;
  initializeChannel: () => void;
  addNotification: (notification: FormationInterest) => void;
  markAllAsRead: () => void;
  removeNotification: (index: number) => void;
  cleanup: () => void;
}

export const useNotificationsStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  channel: null,

  initializeChannel: () => {
    if (typeof window === "undefined" || !window.Pusher || !echo) return;

    // Vérifie si le channel n'est pas déjà initialisé
    if (get().channel) return;

    try {
      const channel = echo.channel("formation-interests");

      // Souscription explicite au canal
      channel.subscribe();

      channel.listen("NewFormationInterest", (e: FormationInterest) => {
        get().addNotification(e);
      });

      set({ channel });
    } catch (error) {
      console.error("Error initializing Echo channel:", error);
    }
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 5),
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAllAsRead: () => {
    set({ unreadCount: 0 });
  },

  removeNotification: (index) => {
    set((state) => ({
      notifications: state.notifications.filter((_, i) => i !== index),
    }));
  },

  cleanup: () => {
    const channel = get().channel;
    if (channel) {
      channel.stopListening("NewFormationInterest");
      channel.unsubscribe();
    }
    set({ channel: null, notifications: [], unreadCount: 0 });
  },
}));
