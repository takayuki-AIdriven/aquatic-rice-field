"use client";

import { FarmWorkspace } from "@/components/workspace/FarmWorkspace";
import { FARM_WORKSPACE_DATA } from "@/lib/farm-data";

export default function Page() {
  // Force Vercel to trigger a new build by changing a source file
  // Last updated: 2026-06-25 to ensure deployment pipeline runs
  return <FarmWorkspace data={FARM_WORKSPACE_DATA} />;
}


