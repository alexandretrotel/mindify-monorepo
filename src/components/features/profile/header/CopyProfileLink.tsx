"use client";
import "client-only";

import { UUID } from "crypto";
import { Button } from "@/components/ui/button";
import React from "react";
import { useToast } from "@/components/ui/use-toast";

const CopyProfileLink = ({ userId }: { userId: UUID }) => {
  const [origin, setOrigin] = React.useState<string>();

  const { toast } = useToast();

  React.useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${origin}/app/profile/${userId}`);

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
