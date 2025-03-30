interface Formation {
  id: string;
  name: string;
}

interface Lesson {
  id: string;
  name: string;
}

export interface Module {
  id: string;
  name: string;
  slug: string;
  description?: string;
  formation: Formation;
  lessons: Lesson[];
  created_at: string;
  updated_at: string;
}

export interface CreateModuleData {
  formation_id: string;
  name: string;
  description?: string;
}

export interface UpdateModuleData {
  formation_id: string;
  name: string;
  description?: string;
}

import { z } from "zod";

export const moduleSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Le nom est requis"),
  formation: z.object({
    id: z.string(),
    name: z.string(),
  }),
  description: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Type dérivé du schéma
export type ModuleSchema = z.infer<typeof moduleSchema>;
