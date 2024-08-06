import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { userUpdateName } from "@/actions/users";
import type { UserMetadata } from "@supabase/supabase-js";
import { Loader2Icon } from "lucide-react";
import { Muted } from "@/components/typography/muted";

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
      <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
        Nom
        {isUpdating && <Loader2Icon className="h-3 w-3 animate-spin" />}
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
          <Button
            onClick={async () => {
              setIsUpdating(true);

              if (name === userMetadata.name) {
                setIsUpdating(false);
                setIsEditing(false);
                return;
              }

              try {
                const result = await userUpdateName(name);

                if (result) {
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
          >
            Enregistrer
          </Button>
        ) : (
          <Button onClick={() => setIsEditing(true)} variant="default" size="sm">
            Modifier
          </Button>
        )}
      </div>
      <Muted size="sm">Comment voulez-vous que l&apos;on vous appelle ?</Muted>
    </div>
  );
}
