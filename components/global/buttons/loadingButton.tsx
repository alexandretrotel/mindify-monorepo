"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function LoadingButton({
  children,
  onClick,
  variant,
  isFull,
  size,
  pending
}: Readonly<{
  children: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
  isFull?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
  pending: boolean;
}>) {
  return (
    <Button
      className={`${isFull && "w-full"}`}
      variant={variant}
      disabled={pending}
      onClick={onClick}
      size={size}
    >
      {pending && (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Chargement...
        </>
      )}
      {!pending && children}
    </Button>
  );
}
