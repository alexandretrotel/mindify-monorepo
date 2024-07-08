import TypographySpan from "@/components/typography/span";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import type { UserMetadata } from "@supabase/supabase-js";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { userUpdateAvatar } from "@/actions/user";
import { LoadingButton } from "@/components/global/buttons/loadingButton";

const MAX_FILE_SIZE = 2000000; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const avatarSchema = z.object({
  image: z
    .any()
    .refine(
      (file: File) => file?.size <= MAX_FILE_SIZE,
      `La taille de l'image doit être inférieure à ${MAX_FILE_SIZE / 1000000} Mo.`
    )
    .refine(
      (file: File) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Le type de fichier doit être une image (jpeg, jpg, png, webp)."
    )
});

export default function AccountAvatar({ userMetadata }: Readonly<{ userMetadata: UserMetadata }>) {
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [allowImageUpload, setAllowImageUpload] = useState<boolean>(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const { toast } = useToast();

  useEffect(() => {
    // reset the image error
    setImageError(null);

    // do nothing if no file is accepted
    if (acceptedFiles.length === 0) return;

    // accept only images file
    const acceptedImageFiles = acceptedFiles.filter((file) => file.type.includes("image"));

    // keep only the first image file
    const imageFile = acceptedImageFiles[0];

    // use zod to validate the image file
    const result = avatarSchema.safeParse({ image: imageFile });

    if (!result.success) {
      setImageError("L'image doit être de type jpeg, jpg, png ou webp et faire moins de 500 Ko.");
    } else {
      setImageFile(imageFile);
      setAllowImageUpload(true);
    }
  }, [acceptedFiles]);

  useEffect(() => {
    if (!imageError) return;

    toast({
      title: "Une erreur est survenue !",
      description: imageError,
      variant: "destructive"
    });
  }, [imageError, toast]);

  return (
    <div className="flex flex-col gap-2">
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <Label htmlFor="username" className="text-text text-sm font-medium">
          Avatar
        </Label>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={userMetadata.avatar_url} alt={userMetadata.name} />
            <AvatarFallback>{userMetadata.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <DialogTrigger asChild>
            <Button disabled variant="ghost" size="sm">
              Modifier
            </Button>
          </DialogTrigger>
        </div>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l&apos;avatar</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <TypographySpan muted>
              Vous pouvez modifier votre avatar en choisissant une image de votre choix.
            </TypographySpan>
          </DialogDescription>

          <div
            {...getRootProps({ className: "dropzone" })}
            className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed p-4 text-center text-sm"
          >
            <input {...getInputProps()} />
            Glissez et déposez une image ou cliquez pour en choisir une.
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-text text-sm font-medium">Nouvel avatar</span>
            {imageFile ? (
              <Image
                key={imageFile.name}
                src={URL.createObjectURL(imageFile)}
                alt={imageFile.name}
                className="h-24 w-24 rounded-lg"
                width={96}
                height={96}
              />
            ) : (
              <TypographySpan muted size="sm">
                Aucune image sélectionnée.
              </TypographySpan>
            )}
          </div>

          <DialogFooter>
            <LoadingButton
              onClick={async () => {
                if (!imageFile) {
                  setImageError("Veuillez sélectionner une image.");
                  toast({
                    title: "Une erreur est survenue !",
                    description: "Veuillez sélectionner une image.",
                    variant: "destructive"
                  });
                  return;
                }

                setIsUpdating(true);

                try {
                  const formData = new FormData();
                  formData.append("image", imageFile);

                  const result = await userUpdateAvatar(formData);

                  if (result) {
                    toast({
                      title: "Succès !",
                      description: "Votre avatar a été mis à jour."
                    });
                    setIsImageModalOpen(false);
                  }
                } catch (error) {
                  console.error(error);
                  toast({
                    title: "Une erreur est survenue !",
                    description: "Impossible de mettre à jour votre avatar.",
                    variant: "destructive"
                  });
                } finally {
                  setIsUpdating(false);
                }
              }}
              variant="default"
              size="sm"
              disabled={!allowImageUpload}
              pending={isUpdating}
            >
              Télécharger
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
