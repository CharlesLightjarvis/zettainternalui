import { useEffect, useState } from "react";
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
import type { CreateCertificationData } from "~/types/certification";
import { useCertificationsStore } from "~/hooks/use-certifications-store";

export function AddCertificationForm() {
  const [open, setOpen] = useState(false);
  const { formations, getFormations } = useFormationsStore();
  const { createCertification } = useCertificationsStore();
  const [prerequisites, setPrerequisites] = useState([""]);
  const [benefits, setBenefits] = useState([""]);
  const [skills, setSkills] = useState([""]);
  const [bestFor, setBestFor] = useState([""]);

  useEffect(() => {
    getFormations();
  }, [getFormations]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset states when dialog closes
      setPrerequisites([""]);
      setBenefits([""]);
      setSkills([""]);
      setBestFor([""]);
    }
    setOpen(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);
    const certificationData: CreateCertificationData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      image: formData.get("image") as string,
      provider: formData.get("provider") as string,
      validity_period: Number(formData.get("validity_period")),
      level: formData.get("level") as "beginner" | "intermediate" | "advanced",
      formation_id: formData.get("formation_id") as string,
      prerequisites: prerequisites.filter((p) => p.trim() !== ""),
      benefits: benefits.filter((b) => b.trim() !== ""),
      skills: skills.filter((s) => s.trim() !== ""),
      best_for: bestFor.filter((b) => b.trim() !== ""),
    };

    try {
      const message = await createCertification(certificationData);
      form.reset();
      setOpen(false);
      setPrerequisites([""]);
      setBenefits([""]);
      setSkills([""]);
      setBestFor([""]);

      toast.success("Succès", {
        description: message,
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

  const handleAddArrayField = (
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => [...prev, ""]);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusIcon size={16} />
          <span>Ajouter</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] md:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <form className="w-full" onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-semibold">
              Ajouter une nouvelle certification
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour créer une nouvelle
              certification.
            </DialogDescription>
          </DialogHeader>

          <div className="w-full space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nom de la certification"
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                {" "}
                {/* Modification ici */}
                <Label htmlFor="formation_id">Formation</Label>
                <Select name="formation_id" required>
                  <SelectTrigger className="w-full">
                    {" "}
                    {/* Modification ici */}
                    <SelectValue placeholder="Sélectionner une formation" />
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

              <div className="space-y-2">
                <Label htmlFor="provider">Fournisseur</Label>
                <Input
                  id="provider"
                  name="provider"
                  placeholder="Nom du fournisseur"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="validity_period">
                  Période de validité (années)
                </Label>
                <Input
                  id="validity_period"
                  name="validity_period"
                  type="number"
                  min="1"
                  placeholder="1"
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                {" "}
                {/* Modification ici */}
                <Label htmlFor="level">Niveau</Label>
                <Select name="level" required defaultValue="beginner">
                  <SelectTrigger className="w-full">
                    {" "}
                    {/* Modification ici */}
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Débutant</SelectItem>
                    <SelectItem value="intermediate">Intermédiaire</SelectItem>
                    <SelectItem value="advanced">Avancé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Description de la certification..."
                className="min-h-[100px]"
              />
            </div>

            {/* Arrays fields */}
            {[
              {
                label: "Prérequis",
                value: prerequisites,
                setter: setPrerequisites,
                placeholder: "Prérequis...",
              },
              {
                label: "Avantages",
                value: benefits,
                setter: setBenefits,
                placeholder: "Avantage...",
              },
              {
                label: "Compétences",
                value: skills,
                setter: setSkills,
                placeholder: "Compétence...",
              },
              {
                label: "Meilleur pour",
                value: bestFor,
                setter: setBestFor,
                placeholder: "Meilleur pour...",
              },
            ].map(({ label, value, setter, placeholder }) => (
              <div key={label} className="space-y-2">
                <Label>{label}</Label>
                {value.map((item, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={item}
                      onChange={(e) => {
                        const newArray = [...value];
                        newArray[index] = e.target.value;
                        setter(newArray);
                      }}
                      placeholder={placeholder}
                    />
                    {index === value.length - 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAddArrayField(setter)}
                      >
                        +
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ))}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit">Créer</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
