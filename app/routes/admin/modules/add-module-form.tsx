import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
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
import { PlusIcon } from "lucide-react";
import { useFormationsStore } from "~/hooks/use-formations-store";
import { useModulesStore } from "~/hooks/use-modules-store";

export function AddModuleForm() {
  const [open, setOpen] = useState(false);
  const { createModule } = useModulesStore();
  const { formations, getFormations } = useFormationsStore();
  const [selectedFormation, setSelectedFormation] = useState<string>("");

  // Charger les formations si nécessaire
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      getFormations();
    }
    setOpen(newOpen);
  };

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
      const message = await createModule(moduleData);
      form.reset();
      setSelectedFormation("");
      setOpen(false);

      toast.success("Succès", {
        description: message || "Module créé avec succès",
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusIcon size={16} />
          <span>Ajouter</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <form className="w-full" onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-semibold">
              Ajouter un nouveau module
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour créer un nouveau
              module.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="w-full space-y-2">
              <Label htmlFor="formation_id">Formation</Label>
              <Select
                name="formation_id"
                required
                value={selectedFormation}
                onValueChange={setSelectedFormation}
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
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit">Créer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
