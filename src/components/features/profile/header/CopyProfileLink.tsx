"use client";
import "client-only";

import { UUID } from "crypto";
import { Button } from "@/components/ui/button";
import React from "react";
import { useToast } from "@/components/ui/use-toast";

const CopyProfileLink = ({ userId }: { userId: UUID }) => {
  const [origin, setOrigin] = React.useState<string>();
  const [isNavigatorShareSupported, setIsNavigatorShareSupported] = React.useState<boolean>(false);

  const { toast } = useToast();

  React.useEffect(() => {
    setOrigin(window.location.origin);

    setIsNavigatorShareSupported(!!navigator.share);
  }, []);

  const handleCopyLink = () => {
    if (isNavigatorShareSupported) {
      navigator.share({
        title: "Partager le lien de votre profil",
        text: "Découvrez mon profil sur Mindify",
        url: `${origin}/profile/${userId}`
      });
      return;
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${origin}/profile/${userId}`);

      toast({
        title: "Lien copié",
        description: "Le lien de votre profil a été copié dans le presse-papier."
      });
    } else {
      toast({
        title: "Erreur",
        description: "Votre navigateur ne supporte pas la copie automatique du lien.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button size="sm" variant="outline" onClick={handleCopyLink}>
      {isNavigatorShareSupported ? "Partager" : "Copier le lien"}
    </Button>
  );
};

export default CopyProfileLink;
