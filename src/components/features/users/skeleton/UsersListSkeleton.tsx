import UserCardSkeleton from "@/components/global/skeleton/UserCardSkeleton";
import H3Span from "@/components/typography/h3AsSpan";
import React from "react";

const UsersListSkeleton = async () => {
  return (
    <div className="flex flex-col gap-4">
      <H3Span>Les membres de la communauté</H3Span>

      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(8)].map((_, index) => (
          <li key={index}>
            <UserCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersListSkeleton;
