import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import TypographyP from "@/components/typography/p";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { User } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

export default function AccountProfile({ data }: { data: { user: User } }) {
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

            <DialogContent className="z-[2000]">
              <DialogHeader>
                <DialogTitle>Modifier l&apos;avatar</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <TypographyP muted>
                  Vous pouvez modifier votre avatar en téléchargeant une image.
                </TypographyP>
              </DialogDescription>
              <DialogFooter>
                <Button onClick={() => {}} variant="default" size="sm">
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

            <DialogContent className="z-[2000]">
              <DialogHeader>
                <DialogTitle>Modifier le nom</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <TypographyP muted>
                  Vous pouvez modifier votre nom pour qu&apos;il soit plus personnel.
                </TypographyP>
              </DialogDescription>
              <Input type="text" id="name" name="name" placeholder={data.user.user_metadata.name} />
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
            L&apos;email que vous utilisez pour vous connecter. Elle est privée et ne peut pas être
            modifiée.
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
            <TypographyP muted size="sm">
              Une courte description de vous-même.
            </TypographyP>

            <DialogContent className="z-[2000]">
              <DialogHeader>
                <DialogTitle>Modifier la bio</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <TypographyP muted>
                  Vous pouvez ajouter une courte description de vous-même.
                </TypographyP>
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
  );
}
