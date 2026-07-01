"use client";

import { FarmWorkspace } from "@/components/workspace/FarmWorkspace";
import { FARM_WORKSPACE_DATA } from "@/lib/farm-data";

export default function Page() {
  return <FarmWorkspace data={FARM_WORKSPACE_DATA} />;
}


