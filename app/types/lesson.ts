interface Module {
  id: string;
  name: string;
}

export interface Lesson {
  id: string;
  name: string;
  slug: string;
  module: Module;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLessonData {
  module_id: string;
  name: string;
  description?: string;
}

export interface UpdateLessonData {
  module_id: string;
  name: string;
  description?: string;
}

import { z } from "zod";

export const lessonSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Le nom est requis"),
  module: z.object({
    id: z.string(),
    name: z.string(),
  }),
  description: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Type dérivé du schéma
export type LessonSchema = z.infer<typeof lessonSchema>;
