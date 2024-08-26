import { createAdminClient } from "@/utils/supabase/admin";
import React from "react";
import UsersListClient from "@/components/features/users/client/UsersListClient";

const UsersList = async () => {
  const supabaseAdmin = createAdminClient();

  const { data: users } = await supabaseAdmin.auth.admin.listUsers();
  const usersArray = users?.users?.sort((a, b) =>
    a?.user_metadata?.name.localeCompare(b?.user_metadata?.name)
  );

  return <UsersListClient usersArray={usersArray} />;
};

export default UsersList;
