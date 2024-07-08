import { LoadingButton } from "@/components/global/buttons/loadingButton";
import TypographyP from "@/components/typography/p";
import TypographySpan from "@/components/typography/span";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { userUpdateName } from "@/actions/user";
import type { UserMetadata } from "@supabase/supabase-js";

export default function AccountName({ userMetadata }: Readonly<{ userMetadata: UserMetadata }>) {
  const [name, setName] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    setName(userMetadata.name);
  }, [userMetadata.name]);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="name" className="text-text text-sm font-medium">
        Nom
      </Label>

      <div className="flex items-center gap-2">
        <Input
          disabled={!isEditing || isUpdating}
          type="text"
          id="name"
          name="name"
          placeholder={userMetadata.name}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        {isEditing ? (
          <LoadingButton
            onClick={async () => {
              setIsUpdating(true);

              try {
                const result = await userUpdateName(name);

                if (result) {
                  toast({
                    title: "Succès !",
                    description: result.message
                  });

                  setIsEditing(false);
                }
              } catch (error) {
                console.error(error);
                toast({
                  title: "Une erreur est survenue !",
                  description: "Impossible de mettre à jour votre nom.",
                  variant: "destructive"
                });
              } finally {
                setIsUpdating(false);
              }
            }}
            variant="default"
            size="sm"
            pending={isUpdating}
          >
            Enregistrer
          </LoadingButton>
        ) : (
          <Button onClick={() => setIsEditing(true)} variant="default" size="sm">
            Modifier
          </Button>
        )}
      </div>
      <TypographyP muted size="sm">
        Le nom que les autres verront sur le site.
      </TypographyP>
    </div>
  );
}
