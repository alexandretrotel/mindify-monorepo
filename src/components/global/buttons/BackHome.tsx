import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const BackHome = () => {
  return (
    <Button variant="ghost" asChild>
      <Link href="/">
        <ChevronLeft className="mr-2 h-5 w-5" /> Retourner à l&apos;accueil
      </Link>
    </Button>
  );
};

export default BackHome;
