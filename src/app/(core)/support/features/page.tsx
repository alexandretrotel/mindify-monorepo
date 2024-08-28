import { getAllFeatures } from "@/actions/support";
import { columns } from "@/components/features/support/Columns";
import DataTable from "@/components/features/support/DataTable";
import React from "react";

const SupportFeatures = async () => {
  const allFeatures = await getAllFeatures();

  const data = [...allFeatures]?.sort(
    (a, b) => new Date(b?.created_at)?.getTime() - new Date(a?.created_at)?.getTime()
  );

  return <DataTable columns={columns} data={data} />;
};

export default SupportFeatures;
