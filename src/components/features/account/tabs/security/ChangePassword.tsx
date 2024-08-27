"use client";
import "client-only";

import { Label } from "@/components/ui/label";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Muted } from "@/components/typography/muted";
import { useToast } from "@/components/ui/use-toast";
import Span from "@/components/typography/span";
import { updatePassword } from "@/actions/auth";
import { Loader2Icon } from "lucide-react";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = React.useState<string | undefined>(undefined);
  const [confirmPassword, setConfirmPassword] = React.useState<string | undefined>(undefined);
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false);

  const { toast } = useToast();

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
      return;
    }

    setIsUpdating(true);

    try {
      await updatePassword(newPassword, confirmPassword);
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de votre mot de passe.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }

    toast({
      title: "Mot de passe modifié",
      description: "Votre mot de passe a été modifié avec succès."
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <Label htmlFor="old-password" className="flex items-center gap-2 text-sm font-medium">
          Mot de passe
        </Label>

        <Muted size="sm">Entrez votre nouveau mot de passe.</Muted>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="password"
          id="new-password"
          name="new-password"
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
        />

        <Input
          type="password"
          id="confirm-password"
          name="confirm-password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
      </div>

      {newPassword && confirmPassword && newPassword !== confirmPassword && (
        <Span size="sm" isRed>
          Les mots de passe ne correspondent pas.
        </Span>
      )}

      <Button
        size="sm"
        className="flex items-center gap-1"
        disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword || isUpdating}
        onClick={handleChangePassword}
      >
        {isUpdating && <Loader2Icon className="h-3 w-3 animate-spin" />}
        Changer le mot de passe
      </Button>
    </div>
  );
};

export default ChangePassword;
