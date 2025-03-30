export interface Formation {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: number;
  price: number;
  category: Categorie;
  prerequisites?: string[];
  objectives?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateFormationData {
  name: string;
  description?: string;
  image?: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: number;
  price: number;
  category_id: string;
  prerequisites?: string[];
  objectives?: string[];
}

export interface UpdateFormationData {
  name: string;
  description?: string;
  image?: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: number;
  price: number;
  category_id: string;
  prerequisites?: string[];
  objectives?: string[];
}

import { z } from "zod";
import type { Categorie } from "./categorie";

export const formationSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string().min(1, "Le nom est requis"),
  image: z.string().url("URL invalide").optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  duration: z.number().min(1, "La durée est requise"),
  price: z.number().min(0, "Le prix est requis"),
  category: z.object({
    id: z.string(),
    name: z.string(),
  }),
  prerequisites: z.array(z.string()).optional(),
  objectives: z.array(z.string()).optional(),
  description: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Type dérivé du schéma
export type FormationSchema = z.infer<typeof formationSchema>;
