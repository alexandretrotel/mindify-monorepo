import React from "react";
import { SavoirLogo } from "@/components/SavoirLogo";
import { createClient } from "@/utils/supabase/server";

const NavbarLayout = async () => {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return <></>;
};

export default NavbarLayout;
