"use client";
import "client-only";

import React, { useEffect, useState } from "react";
import { CookieIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CookieConsent() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hide, setHide] = useState<boolean>(false);

  const accept = () => {
    setIsOpen(false);
    localStorage.setItem("cookieConsent", "true");
    setTimeout(() => {
      setHide(true);
    }, 700);
  };

  const decline = () => {
    setIsOpen(false);
    localStorage.setItem("cookieConsent", "false");
    setTimeout(() => {
      setHide(true);
    }, 700);
  };

  useEffect(() => {
    try {
      setIsOpen(true);
      if (
        localStorage.getItem("cookieConsent") === "true" ||
        localStorage.getItem("cookieConsent") === "false"
      ) {
        setIsOpen(false);
        setTimeout(() => {
          setHide(true);
        }, 700);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[200] w-full duration-700 sm:bottom-4 sm:left-4 sm:max-w-md",
        !isOpen
          ? "translate-y-8 opacity-0 transition-[opacity,transform]"
          : "translate-y-0 opacity-100 transition-[opacity,transform]",
        hide && "hidden"
      )}
    >
      <div className="m-3 rounded-lg border border-border bg-background dark:bg-card">
        <div className="flex items-center justify-between p-3">
          <h1 className="text-lg font-medium">Nous utilisons les cookies.</h1>
          <CookieIcon className="h-[1.2rem] w-[1.2rem]" />
        </div>
        <div className="-mt-2 p-3">
          <p className="text-left text-sm text-muted-foreground">
            Nous utilisons les cookies pour vous offrir une meilleure expérience utilisateur. En
            continuant à utiliser ce site, vous consentez à l&apos;utilisation de cookies.
          </p>
        </div>
        <div className="mt-2 flex items-center gap-2 border-t p-3">
          <Button onClick={accept} className="h-9 w-full rounded-full">
            Accepter
          </Button>
          <Button onClick={decline} className="h-9 w-full rounded-full" variant="outline">
            Refuser
          </Button>
        </div>
      </div>
    </div>
  );
}
