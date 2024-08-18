"use client";
import "client-only";

import { UUID } from "crypto";
import { Button } from "@/components/ui/button";
import React from "react";
import { useToast } from "@/components/ui/use-toast";

const CopyProfileLink = ({ userId }: { userId: UUID }) => {
  const { toast } = useToast();

  let window;
  if (typeof window === "undefined") {
    return null;
  }

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/profile/${userId}`);

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
