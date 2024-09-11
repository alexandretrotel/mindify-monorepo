"use client";
import "client-only";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import type { Enums } from "@/types/supabase";
import type { UUID } from "crypto";
import { createFeatureRequest } from "@/actions/support.action";
import { useToast } from "@/components/ui/use-toast";
import { Loader2Icon } from "lucide-react";

const FeaturesDialog = ({
  children,
  userId,
  isConnected
}: {
  children: React.ReactNode;
  userId: UUID;
  isConnected: boolean;
}) => {
  const [title, setTitle] = React.useState<string | undefined>(undefined);
  const [type, setType] = React.useState<Enums<"features"> | undefined>(undefined);
  const [description, setDescription] = React.useState<string | undefined>(undefined);
  const [isSending, setIsSending] = React.useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);

  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsSending(true);

    if (!isConnected) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour envoyer un bug.",
        variant: "destructive"
      });
      setIsSending(false);
    }

    if (!title || !type || !description) {
      toast({
        title: "Erreur",
        description: "Vous devez compléter tous les champs",
        variant: "destructive"
      });
      setIsSending(false);
      return;
    }

    try {
      await createFeatureRequest(userId, title, type, description);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue pendant l'envoi du bug.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }

    setIsDialogOpen(false);
    toast({
      title: "Bug reporté !",
      description: "Nous avons bien reçu le bug, nous allons pouvoir le traiter."
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger className="text-sm text-muted-foreground hover:text-black dark:hover:text-white">
        Demander une fonctionnalité
      </DialogTrigger>

      <DialogContent className="max-w-xs md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Demander une fonctionnalité</DialogTitle>

          <DialogDescription>
            Une idée, une envie particulière ? Faîtes-le nous savoir.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Titre de la fonctionnalité"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Select value={type} onValueChange={(value) => setType(value as Enums<"features">)}>
              <SelectTrigger>
                <SelectValue placeholder="Type de la fonctionnalité" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fonctionnalités</SelectLabel>
                  <SelectItem value="summaries">Résumés</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="statistics">Statistiques</SelectItem>
                  <SelectItem value="notifications">Notifications</SelectItem>
                  <SelectItem value="security">Sécurité</SelectItem>
                  <SelectItem value="misc">Divers</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Textarea
            placeholder="Exprimez votre créativité !"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button
            className="flex items-center gap-2"
            onClick={handleSubmit}
            disabled={isSending || !title || !description || !type}
          >
            {isSending && <Loader2Icon className="h-3 w-3 animate-spin" />}
            {isSending ? "Chargement..." : "Envoyer"}
          </Button>
        </div>

        <DialogFooter className="justify-start text-left sm:justify-start">{children}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeaturesDialog;
