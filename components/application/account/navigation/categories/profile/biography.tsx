import { LoadingButton } from "@/components/global/buttons/loadingButton";
import TypographySpan from "@/components/typography/span";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { userUpdateBiography } from "@/actions/user";
import { useToast } from "@/components/ui/use-toast";
import type { UserMetadata } from "@supabase/supabase-js";

export default function AccountBiography({
  userMetadata
}: Readonly<{ userMetadata: UserMetadata }>) {
  const [biography, setBiography] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    setBiography(userMetadata.biography ?? "Pas de biographie.");
  }, [userMetadata.biography]);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="bio" className="text-text text-sm font-medium">
        Biographie
      </Label>

      <Textarea
        disabled={!isEditing || isUpdating}
        placeholder={userMetadata.biography ?? "Pas de biographie."}
        id="biography"
        name="biography"
        value={biography}
        onChange={(event) => setBiography(event.target.value)}
      />

      {isEditing ? (
        <LoadingButton
          onClick={async () => {
            setIsUpdating(true);

            if (biography === userMetadata.biography) {
              setIsUpdating(false);
              setIsEditing(false);
              return;
            }

            try {
              const result = await userUpdateBiography(biography);

              if (result) {
                setIsEditing(false);
              }
            } catch (error) {
              console.error(error);
              toast({
                title: "Une erreur est survenue !",
                description: "Impossible de mettre à jour la bio.",
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

      <TypographySpan muted size="sm">
        Décrivez-vous pour interagir avec des profils qui vous ressemblent.
      </TypographySpan>
    </div>
  );
}
