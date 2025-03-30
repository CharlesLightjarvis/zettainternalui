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
import type { UpdateCertificationData } from "~/types/certification";
import { useCertificationsStore } from "~/hooks/use-certifications-store";

interface EditCertificationFormProps {
  certificationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCertificationForm({
  certificationId,
  open,
  onOpenChange,
}: EditCertificationFormProps) {
  const {
    updateCertification,
    setSelectedCertification,
    selectedCertification,
  } = useCertificationsStore();
  const { formations, getFormations } = useFormationsStore();
  const [prerequisites, setPrerequisites] = useState([""]);
  const [benefits, setBenefits] = useState([""]);
  const [skills, setSkills] = useState([""]);
  const [bestFor, setBestFor] = useState([""]);

  useEffect(() => {
    getFormations();
  }, [getFormations]);

  useEffect(() => {
    if (open && certificationId) {
      const certification = useCertificationsStore
        .getState()
        .certifications.find((c) => c.id === certificationId);
      if (certification) {
        setSelectedCertification(certification);
        setPrerequisites(
          certification.prerequisites?.length
            ? certification.prerequisites
            : [""]
        );
        setBenefits(
          certification.benefits?.length ? certification.benefits : [""]
        );
        setSkills(certification.skills?.length ? certification.skills : [""]);
        setBestFor(
          certification.best_for?.length ? certification.best_for : [""]
        );
      }
    }
  }, [open, certificationId, setSelectedCertification]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedCertification(null);
      setPrerequisites([""]);
      setBenefits([""]);
      setSkills([""]);
      setBestFor([""]);
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);
    const certificationData = {
      // Include required Certification properties
      id: certificationId,
      slug: selectedCertification?.slug || "",
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      image: formData.get("image") as string,
      provider: formData.get("provider") as string,
      validity_period: Number(formData.get("validity_period")),
      level: formData.get("level") as "beginner" | "intermediate" | "advanced",
      formation: {
        id: formData.get("formation_id") as string,
        name:
          formations?.find((f) => f.id === formData.get("formation_id"))
            ?.name || "",
      },
      prerequisites: prerequisites.filter((p) => p.trim() !== ""),
      benefits: benefits.filter((b) => b.trim() !== ""),
      skills: skills.filter((s) => s.trim() !== ""),
      best_for: bestFor.filter((b) => b.trim() !== ""),
      created_at: selectedCertification?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const message = await updateCertification(
        certificationId,
        certificationData
      );
      setSelectedCertification(null);
      onOpenChange(false);

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
      <DialogContent className="sm:max-w-[700px] md:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <form className="w-full" onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-semibold">
              Modifier la certification
            </DialogTitle>
            <DialogDescription>
              Modifiez les informations de la certification.
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
                  defaultValue={selectedCertification?.name}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="formation_id">Formation</Label>
                <Select
                  name="formation_id"
                  required
                  defaultValue={selectedCertification?.formation.id}
                >
                  <SelectTrigger className="w-full">
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
                  defaultValue={selectedCertification?.provider}
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
                  defaultValue={selectedCertification?.validity_period}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="level">Niveau</Label>
                <Select
                  name="level"
                  required
                  defaultValue={selectedCertification?.level}
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

              <div className="space-y-2 col-span-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  placeholder="https://..."
                  defaultValue={selectedCertification?.image}
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
                defaultValue={selectedCertification?.description}
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
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit">Modifier</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
