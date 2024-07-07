import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import TypographySpan from "@/components/typography/span";
import TypographyP from "@/components/typography/p";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { User } from "@supabase/supabase-js";
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

const MAX_FILE_SIZE = 3000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const imageSchema = z.object({
  image: z
    .any()
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE,
      `La taille de l'image doit être inférieure à 3 Mo.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Le type de fichier doit être une image (jpeg, jpg, png, webp)."
    )
});

export default function AccountProfile({ data }: { data: { user: User } }) {
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [allowImageUpload, setAllowImageUpload] = useState<boolean>(false);

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
      setImageError(result.error.issues[0].message + " " + result.error.issues[1].message);
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
    <>
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
                  <AvatarImage
                    src={data.user.user_metadata.avatar_url}
                    alt={data.user.user_metadata.name}
                  />
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
                  <Button
                    disabled={!allowImageUpload}
                    onClick={() => {}}
                    variant="default"
                    size="sm"
                  >
                    Télécharger
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col gap-2">
            <Dialog>
              <Label htmlFor="name" className="text-text text-sm font-medium">
                Nom
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  disabled
                  type="text"
                  id="name"
                  name="name"
                  placeholder={data.user.user_metadata.name}
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
                  placeholder={data.user.user_metadata.name}
                />
                <DialogFooter>
                  <Button onClick={() => {}} variant="default" size="sm">
                    Enregistrer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-text text-sm font-medium">
              Email
            </Label>
            <Input disabled type="email" id="email" name="email" placeholder={data.user.email} />
            <TypographyP muted size="sm">
              L&apos;email que vous utilisez pour vous connecter. Elle est privée et ne peut pas
              être modifiée.
            </TypographyP>
          </div>

          <div className="flex flex-col gap-2">
            <Dialog>
              <Label htmlFor="bio" className="text-text text-sm font-medium">
                Bio
              </Label>
              <Textarea
                disabled
                placeholder={data.user.user_metadata.bio ?? "Un grand lecteur."}
                id="bio"
                name="bio"
              />
              <DialogTrigger asChild>
                <Button variant="default" size="sm">
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
                  placeholder={data.user.user_metadata.bio ?? "Un grand lecteur."}
                  id="bio"
                  name="bio"
                />
                <DialogFooter>
                  <Button onClick={() => {}} variant="default" size="sm">
                    Enregistrer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
}
