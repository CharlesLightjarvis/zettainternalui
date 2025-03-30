interface Formation {
  id: string;
  name: string;
}

export interface Certification {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  provider: string;
  validity_period: number;
  level: "beginner" | "intermediate" | "advanced";
  benefits?: string[];
  formation: Formation;
  prerequisites?: string[];
  skills?: string[];
  best_for?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateCertificationData {
  name: string;
  description?: string;
  image?: string;
  provider: string;
  validity_period: number;
  level: "beginner" | "intermediate" | "advanced";
  benefits?: string[];
  formation_id: string;
  prerequisites?: string[];
  skills?: string[];
  best_for?: string[];
}

export interface UpdateCertificationData {
  name: string;
  description?: string;
  image?: string;
  provider: string;
  validity_period: number;
  level: "beginner" | "intermediate" | "advanced";
  benefits?: string[];
  formation_id: string;
  prerequisites?: string[];
  skills?: string[];
  best_for?: string[];
}

import { z } from "zod";

export const certificationSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string().min(1, "Le nom est requis"),
  image: z.string().url("URL invalide").optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  formation: z.object({
    id: z.string(),
    name: z.string(),
  }),
  prerequisites: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  best_for: z.array(z.string()).optional(),
  provider: z.string().min(1, "Le fournisseur est requis"),
  validity_period: z.number().min(1, "La durée de validité est requise"),
  skills: z.array(z.string()).optional(),
  description: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Type dérivé du schéma
export type CertificationSchema = z.infer<typeof certificationSchema>;
