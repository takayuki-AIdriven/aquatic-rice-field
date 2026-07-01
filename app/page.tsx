"use client";

import { Workspace } from "@/components/workspace/Workspace";
import type { Candidate, Department } from "@/lib/schema";
import initialCandidates from "@/data/candidates.json";
import initialDepartments from "@/data/positions.json";
import workspaceData from "@/data/workspace.json";

export default function Page() {
  return (
    <Workspace
      initialCandidates={initialCandidates as unknown as Candidate[]}
      initialDepartments={initialDepartments as unknown as Department[]}
      workspace={workspaceData}
    />
  );
}


