"use client";
import "client-only";

import { UUID } from "crypto";
import { Button } from "@/components/ui/button";
import React from "react";
import { useToast } from "@/components/ui/use-toast";

const CopyProfileLink = ({ userId, userName }: { userId: UUID; userName: string }) => {
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
        title: `Partager le profil de ${userName}`,
        text: `Découvrez le profil de ${userName} sur Mindify, l'application pour développer votre esprit.`,
        url: `${origin}/profile/${userId}`
      });
      return;
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${origin}/profile/${userId}`);

      toast({
        title: "Lien copié",
        description: `Le lien du profil de ${userName} a été copié dans le presse-papier.`
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
      Partager le profil
    </Button>
  );
};

export default CopyProfileLink;
