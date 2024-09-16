import UsersListSkeleton from "@/components/features/users/skeleton/UsersListSkeleton";
import UsersList from "@/components/features/users/UsersList";
import React, { Suspense } from "react";

const UsersPage = async () => {
  return (
    <Suspense fallback={<UsersListSkeleton />}>
      <UsersList />
    </Suspense>
  );
};

export default UsersPage;
