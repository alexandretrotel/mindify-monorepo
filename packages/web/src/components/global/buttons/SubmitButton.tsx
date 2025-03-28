"use client";
import "client-only";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";

export function SubmitButton({
  children,
  outline
}: Readonly<{ children: React.ReactNode; outline?: boolean }>) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full"
      variant={outline ? "outline" : "default"}
      disabled={pending}
    >
      {pending && (
        <React.Fragment>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Chargement...
        </React.Fragment>
      )}
      {!pending && children}
    </Button>
  );
}
