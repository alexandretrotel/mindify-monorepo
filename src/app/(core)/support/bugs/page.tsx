import { getAllBugs } from "@/actions/support";
import { columns } from "@/components/features/support/Columns";
import DataTable from "@/components/features/support/DataTable";
import React from "react";

const SupportBugs = async () => {
  const allBugs = await getAllBugs();

  const data = [...allBugs]?.sort(
    (a, b) => new Date(b?.created_at)?.getTime() - new Date(a?.created_at)?.getTime()
  );

  return <DataTable columns={columns} data={data} />;
};

export default SupportBugs;
