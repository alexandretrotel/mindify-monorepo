import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { ChevronLeft } from "lucide-react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex h-screen items-center justify-center p-4">
      {children}

      <div className="absolute left-0 top-0 px-4 py-8 md:p-8">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ChevronLeft className="h-5 w-5 mr-2" /> Retouner à l&apos;accueil
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AuthLayout;
