import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useCategoriesStore } from "~/hooks/use-categories-store";
import { useFormationsStore } from "~/hooks/use-formations-store";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface EditFormationFormProps {
  formationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditFormationForm({
  formationId,
  open,
  onOpenChange,
}: EditFormationFormProps) {
  const { updateFormation, setSelectedFormation, selectedFormation } =
    useFormationsStore();
  const { categories, getCategories } = useCategoriesStore();
  const [prerequisites, setPrerequisites] = useState<string[]>([""]);
  const [objectives, setObjectives] = useState<string[]>([""]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  // Charger la formation sélectionnée quand le dialogue s'ouvre
  useEffect(() => {
    if (open && formationId) {
      const formation = useFormationsStore
        .getState()
        .formations.find((f) => f.id === formationId);
      if (formation) {
        setSelectedFormation(formation);
        // Initialiser les prérequis et objectifs avec les données existantes
        setPrerequisites(
          formation.prerequisites?.length ? formation.prerequisites : [""]
        );
        setObjectives(
          formation.objectives?.length ? formation.objectives : [""]
        );
      }
    }
  }, [open, formationId, setSelectedFormation]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedFormation(null);
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);
    const formationData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      category_id: formData.get("category") as string,
      level: formData.get("level") as "beginner" | "intermediate" | "advanced",
      duration: Number(formData.get("duration")),
      price: Number(formData.get("price")),
      prerequisites: prerequisites.filter((p) => p.trim() !== ""),
      objectives: objectives.filter((o) => o.trim() !== ""),
    };

    try {
      const message = await updateFormation(formationId, formationData);
      setSelectedFormation(null);
      onOpenChange(false);

      toast.success("Success", {
        description: message,
      });
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  const handleAddPrerequisite = () => {
    setPrerequisites([...prerequisites, ""]);
  };

  const handleAddObjective = () => {
    setObjectives([...objectives, ""]);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[700px] md:max-w-[800px] max-h-[90vh] overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <form className="w-full" onSubmit={handleSubmit}>
          <DialogHeader className="mb-6 w-full">
            <DialogTitle className="text-xl font-semibold">
              Modifier la formation
            </DialogTitle>
            <DialogDescription>
              Modifiez les informations de la formation.
            </DialogDescription>
          </DialogHeader>

          <div className="w-full space-y-6 py-4">
            <div className="w-full grid grid-cols-2 gap-4">
              <div className="space-y-2 w-full">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Développement Web Frontend"
                  required
                  defaultValue={selectedFormation?.name}
                  className="w-full"
                />
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="category">Catégorie</Label>
                <Select
                  name="category"
                  required
                  defaultValue={selectedFormation?.category.id}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="level">Niveau</Label>
                <Select
                  name="level"
                  required
                  defaultValue={selectedFormation?.level}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Débutant</SelectItem>
                    <SelectItem value="intermediate">Intermédiaire</SelectItem>
                    <SelectItem value="advanced">Avancé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="duration">Durée (heures)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="1"
                  placeholder="100"
                  required
                  defaultValue={selectedFormation?.duration}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="price">Prix (DT)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                placeholder="99.99"
                required
                defaultValue={selectedFormation?.price}
                className="w-full"
              />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Description détaillée de la formation..."
                className="min-h-[100px] w-full"
                required
                defaultValue={selectedFormation?.description}
              />
            </div>

            <div className="space-y-2 w-full">
              <Label>Prérequis</Label>
              {prerequisites.map((prerequisite, index) => (
                <div key={index} className="flex gap-2 mt-2 w-full">
                  <Input
                    value={prerequisite}
                    onChange={(e) => {
                      const newPrerequisites = [...prerequisites];
                      newPrerequisites[index] = e.target.value;
                      setPrerequisites(newPrerequisites);
                    }}
                    placeholder="Prérequis..."
                    className="w-full"
                  />
                  {index === prerequisites.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddPrerequisite}
                      className="shrink-0"
                    >
                      +
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2 w-full">
              <Label>Objectifs</Label>
              {objectives.map((objective, index) => (
                <div key={index} className="flex gap-2 mt-2 w-full">
                  <Input
                    value={objective}
                    onChange={(e) => {
                      const newObjectives = [...objectives];
                      newObjectives[index] = e.target.value;
                      setObjectives(newObjectives);
                    }}
                    placeholder="Objectif..."
                    className="w-full"
                  />
                  {index === objectives.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddObjective}
                      className="shrink-0"
                    >
                      +
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Modifier
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
