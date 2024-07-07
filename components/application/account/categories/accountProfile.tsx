import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import TypographySpan from "@/components/typography/span";
import TypographyP from "@/components/typography/p";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { UserMetadata } from "@supabase/supabase-js";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { userUpdateName, userUpdateBio } from "@/actions/user";
import { LoadingButton } from "@/components/global/buttons/loadingButton";

const MAX_FILE_SIZE = 2000000; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const imageSchema = z.object({
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

export default function AccountProfile({ userMetadata }: Readonly<{ userMetadata: UserMetadata }>) {
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [allowImageUpload, setAllowImageUpload] = useState<boolean>(false);
  const [biography, setBiography] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isBiographyModalOpen, setIsBiographyModalOpen] = useState<boolean>(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

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
    const result = imageSchema.safeParse({ image: imageFile });

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
    <div className="flex flex-col gap-8">
      <div className="flex flex-col">
        <TypographyH3AsSpan>Profil</TypographyH3AsSpan>
        <TypographyP muted>
          Ce sont les informations que les autres verront sur le site.
        </TypographyP>
      </div>

      <Separator className="max-w-lg" />

      <div className="flex max-w-lg flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Dialog>
            <Label htmlFor="username" className="text-text text-sm font-medium">
              Avatar
            </Label>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={userMetadata.avatar_url} alt={userMetadata.name} />
                <AvatarFallback>J</AvatarFallback>
              </Avatar>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
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
                <Button disabled={!allowImageUpload} onClick={() => {}} variant="default" size="sm">
                  Télécharger
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

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

        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-text text-sm font-medium">
            Email
          </Label>
          <Input
            disabled
            type="email"
            id="email-display"
            name="email-display"
            placeholder={userMetadata.email}
          />
          <TypographyP muted size="sm">
            L&apos;email que vous utilisez pour vous connecter. Elle est privée et ne peut pas être
            modifiée.
          </TypographyP>
        </div>

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
      </div>
    </div>
  );
}
