"use client";
import "client-only";
import { UUID } from "crypto";
import { Button } from "@/components/ui/button";

import React from "react";
import { useToast } from "@/components/ui/use-toast";

const CopyProfileLink = ({ userId }: { userId: UUID }) => {
  const { toast } = useToast();

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://mindify.fr/app/profile?profileId=${userId}`);

      toast({
        title: "Lien copié",
        description: "Le lien de votre profil a été copié dans le presse-papier."
      });
    }
  };

  return (
    <Button size="sm" variant="outline" onClick={handleCopyLink}>
      Copier le lien du profil
    </Button>
  );
};

export default CopyProfileLink;
