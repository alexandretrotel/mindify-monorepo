import { getAllBugs } from "@/actions/support.action";
import { columns } from "@/components/features/support/Columns";
import DataTable from "@/components/features/support/DataTable";
import H2 from "@/components/typography/h2";
import React from "react";

const SupportBugs = async () => {
  const allBugs = await getAllBugs();

  const data = [...allBugs]?.sort(
    (a, b) => new Date(b?.created_at)?.getTime() - new Date(a?.created_at)?.getTime()
  );

  return (
    <div className="flex flex-col gap-4">
      <H2>Bugs</H2>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default SupportBugs;
