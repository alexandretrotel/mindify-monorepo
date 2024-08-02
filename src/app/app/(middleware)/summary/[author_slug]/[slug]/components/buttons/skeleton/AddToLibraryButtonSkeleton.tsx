import React from "react";
import { LibraryBigIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const AddToLibraryButtonSkeleton = async () => {
  return (
    <Button variant="outline" size="sm" className="flex items-center gap-2" disabled>
      <LibraryBigIcon className="h-4 w-4" />
      Ajouter à ma bibliothèque
    </Button>
  );
};

export default AddToLibraryButtonSkeleton;
