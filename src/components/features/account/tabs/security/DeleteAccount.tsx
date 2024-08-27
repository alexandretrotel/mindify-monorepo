"use client";
import "client-only";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React from "react";
import { Loader2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogAction,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";
import type { UUID } from "crypto";
import { deleteUser } from "@/actions/users";
import { Muted } from "@/components/typography/muted";

const DeleteAccount = ({ userId }: { userId: UUID }) => {
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false);

  const handleDeleteAccount = async () => {
    setIsUpdating(true);

    try {
      await deleteUser(userId);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
          Supprimer le compte
        </Label>

        <Muted size="sm">Vos données seront supprimées et vous ne pourrez pas les récupérer.</Muted>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="destructive" className="w-fit">
            Supprimer le compte
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le compte</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Vous allez perdre vos amis, vos résumés et toutes vos
              données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="secondary" onClick={() => setIsUpdating(false)}>
                Annuler
              </Button>
            </AlertDialogCancel>

            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isUpdating}
                className="flex items-center gap-2"
              >
                {isUpdating && <Loader2Icon className="h-3 w-3 animate-spin" />}
                Supprimer
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteAccount;
