import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type User, users } from "~/data/users";

interface AuthState {
  user: User | null;
  login: (email: string) => void; // Simplifié sans password
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (email: string) => {
        const foundUser = users.find((u) => u.email === email);
        if (foundUser) {
          set({ user: foundUser });
        }
      },
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage", // nom unique pour le localStorage
    }
  )
);

// Helper pour simuler un login rapide (à utiliser temporairement)
export const quickLogin = (role: "admin" | "teacher" | "student") => {
  const user = users.find((u) => u.role === role);
  if (user) {
    useAuth.getState().login(user.email);
  }
};
