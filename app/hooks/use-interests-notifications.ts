import { create } from "zustand";
import { api } from "~/api";
import echo from "~/echo";
import { useAuth } from "~/hooks/use-auth";

export interface Category {
  id: string;
  name: string;
}

export interface Formation {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  description: string;
  duration: number;
  level: string;
  price: number;
  category: Category;
}

export interface FormationInterest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  formation: Formation;
}

// Mise à jour de l'interface pour refléter la structure exacte pour les notifs
export interface FormationInterestPayload {
  interest: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    message: string;
    status: "pending" | "accepted" | "rejected";
    created_at: string;
    updated_at: string;
    formation: {
      id: string;
      name: string;
      slug: string;
      image: string | null;
      description: string;
      duration: number;
      level: string;
      price: number;
      category: Category;
    };
  };
}

// Définir les chemins des sons pour chaque rôle
const NOTIFICATION_SOUNDS = {
  admin: "/sounds/notification.mp3",
  teacher: "/sounds/teacher-notification.mp3",
  student: "/sounds/student-notification.mp3",
} as const;

// Map des sons préchargés par rôle
const notificationSounds: Record<string, HTMLAudioElement | null> = {
  admin: null,
  teacher: null,
  student: null,
};

// Fonction pour initialiser le son pour un rôle spécifique
const initializeSound = (role: keyof typeof NOTIFICATION_SOUNDS) => {
  if (typeof window === "undefined" || notificationSounds[role]) return;

  const audio = new Audio(NOTIFICATION_SOUNDS[role]);
  audio.load();
  audio.volume = 0.5;
  notificationSounds[role] = audio;
};

// Initialiser les sons pour tous les rôles
if (typeof window !== "undefined") {
  Object.keys(NOTIFICATION_SOUNDS).forEach((role) => {
    initializeSound(role as keyof typeof NOTIFICATION_SOUNDS);
  });
}

interface InterestNotificationStore {
  notifications: FormationInterest[];
  interests: FormationInterest[];
  unreadCount: number;
  channel: any | null;
  soundEnabled: boolean;
  selectedNotification: FormationInterest | null;
  isLoading: boolean;

  initializeChannel: () => void;
  addNotification: (notification: FormationInterest) => void;
  markAllAsRead: () => void;
  removeNotification: (index: number) => void;
  cleanup: () => void;
  toggleSound: () => void;
  setSelectedNotification: (notification: FormationInterest | null) => void;
  fetchInterests: () => Promise<void>;
}

export const useInterestsNotifications = create<InterestNotificationStore>(
  (set, get) => ({
    notifications: [],
    interests: [],
    unreadCount: 0,
    channel: null,
    soundEnabled: true,
    selectedNotification: null,
    isLoading: false,

    setSelectedNotification: (notification) => {
      set({ selectedNotification: notification });
    },

    fetchInterests: async () => {
      set({ isLoading: true });
      try {
        const response = await api.get("/api/v1/admin/interests");
        const interests = response.data.interests; // Récupère directement le tableau
        set({ interests }); // Stocke le tableau correctement
      } catch (error) {
        console.error("Error fetching interests:", error);
      } finally {
        set({ isLoading: false });
      }
    },

    // Dans la méthode initializeChannel
    initializeChannel: () => {
      if (typeof window === "undefined" || !window.Pusher || !echo) return;
      if (get().channel) return;

      try {
        const channel = echo.channel("formation-interests");
        channel.subscribe();

        channel.listen(
          "NewFormationInterest",
          (e: FormationInterestPayload) => {
            // Accéder aux données via e.interest
            get().addNotification(e.interest);
          }
        );

        set({ channel });
      } catch (error) {
        console.error("Error initializing Echo channel:", error);
      }
    },
    addNotification: (notification) => {
      const { user } = useAuth.getState();

      // Jouer le son si activé et si l'utilisateur a un rôle valide
      if (get().soundEnabled && user?.role && notificationSounds[user.role]) {
        try {
          const sound = notificationSounds[user.role];
          if (sound) {
            sound.currentTime = 0;
            const playPromise = sound.play();

            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  console.log(`Son ${user.role} joué avec succès`);
                })
                .catch((error) => {
                  console.warn(
                    `Erreur lors de la lecture du son ${user.role}:`,
                    error
                  );
                  sound.load();
                });
            }
          }
        } catch (error) {
          console.error(
            "Erreur lors de la tentative de lecture du son:",
            error
          );
        }
      }

      set((state) => ({
        notifications: [notification, ...state.notifications].slice(0, 5),
        unreadCount: state.unreadCount + 1,
      }));
      console.log(notification);
    },

    toggleSound: () => {
      const { user } = useAuth.getState();
      if (user?.role && !notificationSounds[user.role]) {
        initializeSound(user.role as keyof typeof NOTIFICATION_SOUNDS);
      }
      set((state) => ({ soundEnabled: !state.soundEnabled }));
    },

    markAllAsRead: () => {
      set({ unreadCount: 0 });
    },

    removeNotification: (index: number) => {
      set((state) => {
        const newNotifications = state.notifications.filter(
          (_, i) => i !== index
        );
        // Réduire le unreadCount si la notification n'était pas lue
        const newUnreadCount = Math.max(0, state.unreadCount - 1);
        return {
          notifications: newNotifications,
          unreadCount: newUnreadCount,
        };
      });
    },

    cleanup: () => {
      const channel = get().channel;
      if (channel) {
        channel.stopListening("NewFormationInterest");
        channel.unsubscribe();
      }
      set({ channel: null, notifications: [], unreadCount: 0 });
    },
  })
);
