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
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useFormationsStore } from "~/hooks/use-formations-store";
import { useModulesStore } from "~/hooks/use-modules-store";

interface EditModuleFormProps {
  moduleId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditModuleForm({
  moduleId,
  open,
  onOpenChange,
}: EditModuleFormProps) {
  const { updateModule, setSelectedModule, selectedModule } = useModulesStore();
  const { formations, getFormations } = useFormationsStore();

  useEffect(() => {
    if (open) {
      getFormations();
    }
  }, [open, getFormations]);

  useEffect(() => {
    if (open && moduleId) {
      const module = useModulesStore
        .getState()
        .modules.find((m) => m.id === moduleId);
      if (module) {
        setSelectedModule(module);
      }
    } else {
      setSelectedModule(null);
    }
  }, [open, moduleId, setSelectedModule]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);
    const moduleData = {
      formation_id: formData.get("formation_id") as string,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    };

    try {
      const message = await updateModule(moduleId, moduleData);
      setSelectedModule(null);
      onOpenChange(false);

      toast.success("Succès", {
        description: message || "Module modifié avec succès",
      });
    } catch (error) {
      toast.error("Erreur", {
        description:
          error instanceof Error
            ? error.message
            : "Une erreur inattendue s'est produite",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <form className="w-full" onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-semibold">
              Modifier le module
            </DialogTitle>
            <DialogDescription>
              Modifiez les informations du module ci-dessous.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="w-full space-y-2">
              <Label htmlFor="formation_id">Formation</Label>
              <Select
                name="formation_id"
                required
                defaultValue={selectedModule?.formation.id}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une formation" />
                </SelectTrigger>
                <SelectContent>
                  {formations?.map((formation) => (
                    <SelectItem key={formation.id} value={formation.id}>
                      {formation.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full space-y-2">
              <Label htmlFor="name">Nom du module</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Nom du module"
                className="w-full"
                defaultValue={selectedModule?.name}
              />
            </div>

            <div className="w-full space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                required
                placeholder="Description du module"
                className="w-full min-h-24 resize-y"
                defaultValue={selectedModule?.description}
              />
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
