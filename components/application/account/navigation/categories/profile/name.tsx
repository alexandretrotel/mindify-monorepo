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
import { useState } from "react";
import { userUpdateName } from "@/actions/user";
import type { UserMetadata } from "@supabase/supabase-js";

export default function AccountName({ userMetadata }: Readonly<{ userMetadata: UserMetadata }>) {
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [name, setName] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-2">
      <Dialog open={isNameModalOpen} onOpenChange={setIsNameModalOpen}>
        <Label htmlFor="name" className="text-text text-sm font-medium">
          Nom
        </Label>
        <div className="flex items-center gap-2">
          <Input
            disabled
            type="text"
            id="name-display"
            name="name-display"
            placeholder={userMetadata.name}
          />
          <DialogTrigger asChild>
            <Button variant="default" size="sm">
              Modifier
            </Button>
          </DialogTrigger>
        </div>
        <TypographyP muted size="sm">
          Le nom que les autres verront sur le site.
        </TypographyP>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le nom</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <TypographySpan muted>
              Vous pouvez modifier votre nom pour qu&apos;il soit plus personnel.
            </TypographySpan>
          </DialogDescription>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder={userMetadata.name}
            minLength={2}
            maxLength={30}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <DialogFooter>
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

                    setIsNameModalOpen(false);
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
