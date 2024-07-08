import { LoadingButton } from "@/components/global/buttons/loadingButton";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { userUpdateBio } from "@/actions/user";
import { useToast } from "@/components/ui/use-toast";
import type { UserMetadata } from "@supabase/supabase-js";

export default function AccountBiography({
  userMetadata
}: Readonly<{ userMetadata: UserMetadata }>) {
  const [isBiographyModalOpen, setIsBiographyModalOpen] = useState(false);
  const [biography, setBiography] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-2">
      <Dialog open={isBiographyModalOpen} onOpenChange={setIsBiographyModalOpen}>
        <Label htmlFor="bio" className="text-text text-sm font-medium">
          Bio
        </Label>
        <Textarea
          disabled
          placeholder={userMetadata.biography ?? "Un grand lecteur."}
          id="bio-display"
          name="bio-display"
        />
        <DialogTrigger asChild>
          <Button onClick={() => setIsBiographyModalOpen(true)} variant="default" size="sm">
            Modifier
          </Button>
        </DialogTrigger>
        <TypographySpan muted size="sm">
          Une courte description de vous-même.
        </TypographySpan>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la bio</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <TypographySpan muted>
              Vous pouvez ajouter une courte description de vous-même.
            </TypographySpan>
          </DialogDescription>
          <Textarea
            placeholder={userMetadata.biography ?? "Un grand lecteur."}
            id="bio"
            name="bio"
            maxLength={160}
            value={biography}
            onChange={(event) => setBiography(event.target.value)}
          />
          <DialogFooter>
            <LoadingButton
              onClick={async () => {
                setIsUpdating(true);

                try {
                  const result = await userUpdateBio(biography);

                  if (result) {
                    toast({
                      title: "Succès !",
                      description: result.message
                    });

                    setIsBiographyModalOpen(false);
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
