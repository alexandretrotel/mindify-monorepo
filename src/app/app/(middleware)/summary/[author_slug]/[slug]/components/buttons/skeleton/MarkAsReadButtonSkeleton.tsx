import React from "react";
import { Button } from "@/components/ui/button";

const MarkAsReadButtonSkeleton = async () => {
  return (
    <Button variant="outline" className="flex items-center gap-2" disabled>
      Fini de lire ?
    </Button>
  );
};

export default MarkAsReadButtonSkeleton;
