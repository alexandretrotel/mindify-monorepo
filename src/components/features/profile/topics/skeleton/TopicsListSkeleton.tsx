import { Skeleton } from "@/components/ui/skeleton";

const TopicsListSkeleton = () => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {[...Array(12)].map((_, index) => (
        <div key={index}>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
};

export default TopicsListSkeleton;
