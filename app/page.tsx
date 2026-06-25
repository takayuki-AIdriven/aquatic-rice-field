"use client";

import { FarmWorkspace } from "@/components/workspace/FarmWorkspace";
import { FARM_WORKSPACE_DATA } from "@/lib/farm-data";

export default function Page() {
  // Force Vercel to trigger a new build by changing a source file
  return <FarmWorkspace data={FARM_WORKSPACE_DATA} />;
}

